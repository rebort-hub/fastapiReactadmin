"""
将 Vue Flow 画布（nodes/edges）转为 DAG，按拓扑顺序用 Prefect 编排执行。

画布节点 `type` 对应表 task_workflow_node_type.code（与定时任务 task_node 无关），
执行时加载该类型的 `func` 代码块，经 SchedulerUtil._task_wrapper 运行。
"""

from __future__ import annotations

import json
from collections import defaultdict, deque
from datetime import datetime, timezone
from typing import Any

from prefect import flow, task

from app.core.ap_scheduler import SchedulerUtil
from app.core.logger import log


def _parse_args(args_str: str | None) -> list[Any]:
    if not args_str or not str(args_str).strip():
        return []
    return [a.strip() for a in str(args_str).split(",") if a.strip()]


def _parse_kwargs(kwargs_str: str | None) -> dict[str, Any]:
    if not kwargs_str or not str(kwargs_str).strip():
        return {}
    try:
        return json.loads(kwargs_str)
    except json.JSONDecodeError:
        return {}


def validate_workflow_graph(nodes: list[dict], edges: list[dict]) -> None:
    """
    校验画布图有效且无环。

    参数:
    - nodes (list[dict]): 节点列表（须含 id）。
    - edges (list[dict]): 边列表（source/target）。

    返回:
    - None

    异常:
    - ValueError: 图为空、边引用非法或存在环。
    """
    if not nodes:
        raise ValueError("工作流至少需要一个节点")
    ids = {n["id"] for n in nodes}
    for e in edges:
        if e.get("source") not in ids or e.get("target") not in ids:
            raise ValueError("连线引用了不存在的节点")
    in_degree: dict[str, int] = dict.fromkeys(ids, 0)
    adj: dict[str, list[str]] = defaultdict(list)
    for e in edges:
        adj[e["source"]].append(e["target"])
        in_degree[e["target"]] += 1
    q: deque[str] = deque([nid for nid in ids if in_degree[nid] == 0])
    visited = 0
    while q:
        u = q.popleft()
        visited += 1
        for v in adj[u]:
            in_degree[v] -= 1
            if in_degree[v] == 0:
                q.append(v)
    if visited != len(ids):
        raise ValueError("工作流图存在环路，无法执行")


def topological_sort(nodes: list[dict], edges: list[dict]) -> list[dict]:
    """
    按拓扑顺序返回节点（调用方须先保证无环）。

    参数:
    - nodes (list[dict]): 节点列表。
    - edges (list[dict]): 边列表。

    返回:
    - list[dict]: 拓扑有序节点。
    """
    id_to_node = {n["id"]: n for n in nodes}
    in_degree: dict[str, int] = {n["id"]: 0 for n in nodes}
    adj: dict[str, list[str]] = defaultdict(list)
    for e in edges:
        adj[e["source"]].append(e["target"])
        in_degree[e["target"]] += 1
    q: deque[str] = deque([nid for nid in in_degree if in_degree[nid] == 0])
    out: list[dict] = []
    while q:
        u = q.popleft()
        out.append(id_to_node[u])
        for v in adj[u]:
            in_degree[v] -= 1
            if in_degree[v] == 0:
                q.append(v)
    return out


@task(name="workflow-node", retries=0)
def prefect_node_task(
    vue_node_id: str,
    node_type_code: str,
    code_block: str,
    args_str: str | None,
    kwargs_str: str | None,
    upstream: dict[str, Any],
    flow_variables: dict[str, Any],
) -> Any:
    """
    单个画布节点的 Prefect Task：通过 SchedulerUtil 执行用户代码块。

    参数:
    - vue_node_id (str): 画布节点 id。
    - node_type_code (str): 节点类型编码。
    - code_block (str): 可执行代码字符串。
    - args_str (str | None): 逗号分隔位置参数说明。
    - kwargs_str (str | None): JSON 关键字参数。
    - upstream (dict[str, Any]): 上游节点输出。
    - flow_variables (dict[str, Any]): 流程级变量。

    返回:
    - Any: 任务执行结果。
    """
    job_id = f"wfnode-{vue_node_id}"
    args = _parse_args(args_str)
    kw = _parse_kwargs(kwargs_str)
    kw.setdefault("upstream", upstream)
    kw.setdefault("variables", flow_variables)
    return SchedulerUtil._task_wrapper(job_id, code_block, *args, **kw)


@flow(name="workflow-run", log_prints=True)
def run_workflow_prefect_flow(
    ordered_nodes: list[dict],
    edges: list[dict],
    node_templates: dict[str, dict[str, Any]],
    flow_variables: dict[str, Any],
) -> dict[str, Any]:
    """
    Prefect Flow：按拓扑顺序提交并收集各节点结果。

    参数:
    - ordered_nodes (list[dict]): 已排序节点列表。
    - edges (list[dict]): 边列表。
    - node_templates (dict[str, dict[str, Any]]): 类型编码到 {func, args, kwargs}，来自 task_workflow_node_type。
    - flow_variables (dict[str, Any]): 流程变量。

    返回:
    - dict[str, Any]: 含 node_results、status 等。
    """
    results: dict[str, Any] = {}
    for node in ordered_nodes:
        nid = node["id"]
        ntype = node.get("type") or ""
        tpl = node_templates.get(ntype)
        if not tpl or not tpl.get("func"):
            raise ValueError(f"未知或未配置节点类型: {ntype}")
        data = node.get("data") or {}
        args_str = data.get("args") if data.get("args") is not None else tpl.get("args")
        kwargs_str = data.get("kwargs") if data.get("kwargs") is not None else tpl.get("kwargs")
        upstream: dict[str, Any] = {}
        for e in edges:
            if e.get("target") == nid and e.get("source") in results:
                upstream[e["source"]] = results[e["source"]]
        fut = prefect_node_task.submit(
            nid,
            ntype,
            tpl["func"],
            args_str,
            kwargs_str,
            upstream,
            flow_variables,
        )
        results[nid] = fut.result()
    log.info(
        "Prefect workflow 完成: nodes=%s",
        list(results.keys()),
    )
    return {
        "node_results": results,
        "status": "completed",
    }


def run_prefect_workflow_sync(
    nodes: list[dict],
    edges: list[dict],
    node_templates: dict[str, dict[str, Any]],
    flow_variables: dict[str, Any],
) -> dict[str, Any]:
    """
    同步入口：校验 DAG、拓扑排序后执行 Prefect Flow。

    参数:
    - nodes (list[dict]): 画布节点。
    - edges (list[dict]): 画布边。
    - node_templates (dict[str, dict[str, Any]]): 节点类型模板。
    - flow_variables (dict[str, Any]): 流程变量。

    返回:
    - dict[str, Any]: Flow 执行汇总结果。
    """
    validate_workflow_graph(nodes, edges)
    ordered = topological_sort(nodes, edges)
    return run_workflow_prefect_flow(
        ordered_nodes=ordered,
        edges=edges,
        node_templates=node_templates,
        flow_variables=flow_variables or {},
    )


def utc_now_iso() -> str:
    """
    当前 UTC 时间的 ISO 8601 字符串。

    返回:
    - str: ISO 格式时间戳。
    """
    return datetime.now(timezone.utc).isoformat()

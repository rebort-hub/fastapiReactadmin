from typing import Any

from fastapi import Query
from pydantic import BaseModel, ConfigDict, Field, model_validator

from app.common.enums import QueueEnum
from app.core.base_schema import UserBySchema
from app.core.validator import DateTimeStr


class WorkflowCreateSchema(BaseModel):
    """创建工作流"""

    name: str = Field(..., max_length=128, description="流程名称")
    code: str = Field(..., max_length=64, description="流程编码")
    description: str | None = Field(default=None, description="描述")
    nodes: list | None = Field(default=None, description="Vue Flow nodes")
    edges: list | None = Field(default=None, description="Vue Flow edges")


class WorkflowUpdateSchema(WorkflowCreateSchema):
    """更新工作流"""

    workflow_status: str | None = Field(default=None, description="draft/published/archived")


class WorkflowOutSchema(UserBySchema):
    """工作流输出（status 表示流程状态 draft/published/archived，与 ModelMixin.status 区分）"""

    model_config = ConfigDict(from_attributes=True)

    id: int | None = Field(default=None, description="主键ID")
    uuid: str | None = Field(default=None, description="UUID")
    description: str | None = Field(default=None, description="描述")
    created_time: DateTimeStr | None = Field(default=None, description="创建时间")
    updated_time: DateTimeStr | None = Field(default=None, description="更新时间")
    name: str = Field(description="流程名称")
    code: str = Field(description="流程编码")
    status: str = Field(description="流程状态 draft/published/archived")
    nodes: list | None = Field(default=None, description="节点")
    edges: list | None = Field(default=None, description="连线")

    @model_validator(mode="before")
    @classmethod
    def _map_workflow_status(cls, data: Any) -> Any:
        from .model import WorkflowModel

        if isinstance(data, WorkflowModel):
            return {
                "id": data.id,
                "uuid": data.uuid,
                "description": data.description,
                "created_time": data.created_time,
                "updated_time": data.updated_time,
                "created_id": data.created_id,
                "updated_id": data.updated_id,
                "name": data.name,
                "code": data.code,
                "status": data.workflow_status,
                "nodes": data.nodes,
                "edges": data.edges,
            }
        return data


class WorkflowQueryParam:
    """工作流查询"""

    def __init__(
        self,
        name: str | None = Query(None, description="流程名称"),
        code: str | None = Query(None, description="流程编码"),
        status: str | None = Query(None, description="draft/published/archived"),
        created_time: list[DateTimeStr] | None = Query(
            None,
            description="创建时间范围",
            examples=["2025-01-01 00:00:00", "2025-12-31 23:59:59"],
        ),
        updated_time: list[DateTimeStr] | None = Query(
            None,
            description="更新时间范围",
            examples=["2025-01-01 00:00:00", "2025-12-31 23:59:59"],
        ),
        created_id: int | None = Query(None, description="创建人"),
        updated_id: int | None = Query(None, description="更新人"),
    ) -> None:
        self.name = (QueueEnum.like.value, name)
        self.code = (QueueEnum.like.value, code)
        self.workflow_status = (QueueEnum.eq.value, status)
        self.created_id = (QueueEnum.eq.value, created_id)
        self.updated_id = (QueueEnum.eq.value, updated_id)
        if created_time and len(created_time) == 2:
            self.created_time = (QueueEnum.between.value, (created_time[0], created_time[1]))
        if updated_time and len(updated_time) == 2:
            self.updated_time = (QueueEnum.between.value, (updated_time[0], updated_time[1]))


class WorkflowPublishSchema(BaseModel):
    """发布工作流（可选备注）"""

    remark: str | None = Field(default=None, description="备注")


class WorkflowExecuteSchema(BaseModel):
    """执行工作流"""

    workflow_id: int = Field(..., description="工作流ID")
    variables: dict | None = Field(default=None, description="注入到各节点的 variables 上下文")
    business_key: str | None = Field(default=None, description="业务键")
    job_id: int | None = Field(default=None, description="关联任务ID")


class WorkflowExecuteResultSchema(BaseModel):
    """执行结果"""

    workflow_id: int
    workflow_name: str
    status: str = Field(description="completed/failed")
    start_time: str | None = None
    end_time: str | None = None
    variables: dict | None = None
    node_results: dict | None = None
    error: str | None = None

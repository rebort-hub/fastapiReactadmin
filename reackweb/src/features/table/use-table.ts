import { createElement } from 'react';

import { useBoolean, useHookTable } from '@sa/hooks';
import type { TablePaginationConfig, TableProps } from 'antd';
import { Form } from 'antd';

import { parseQuery } from '@/features/router/query';
import { getIsMobile } from '@/layouts/appStore';
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/pagination';

import { FormInstanceBinder } from './FormInstanceBinder';

type TableData = AntDesign.TableData;
type GetTableData<A extends AntDesign.TableApiFn> = AntDesign.GetTableData<A>;

type TableColumn<T> = AntDesign.TableColumn<T>;

type Config<A extends AntDesign.TableApiFn> = AntDesign.AntDesignTableConfig<A>;

type CustomTableProps<A extends AntDesign.TableApiFn> = Omit<
  TableProps<AntDesign.TableDataWithIndex<GetTableData<A>>>,
  'loading'
> & {
  loading: boolean;
};

export function useTable<A extends AntDesign.TableApiFn>(config: Config<A>) {
  const isMobile = useAppSelector(getIsMobile);

  const {
    apiFn,
    apiParams,
    columns: columnsFactory,
    immediate,
    isChangeURL = true,
    onChange: onChangeCallback,
    pagination: paginationConfig,
    rowKey = 'id',
    transformParams,
    ...rest
  } = config;

  const [form] = Form.useForm<AntDesign.AntDesignTableConfig<A>['apiParams']>();

  const { search } = useLocation();

  const query = parseQuery(search) as unknown as Parameters<A>[0];

  const {
    columnChecks,
    columns,
    data,
    empty,
    loading,
    pageNum,
    pageSize,
    resetSearchParams,
    searchParams,
    setColumnChecks,
    total,
    updateSearchParams
  } = useHookTable<A, GetTableData<A>, TableColumn<AntDesign.TableDataWithIndex<GetTableData<A>>>>({
    apiFn,
    apiParams: { ...apiParams, ...query },
    columns: columnsFactory,
    getColumnChecks: cols => {
      const checks: AntDesign.TableColumnCheck[] = [];

      cols.forEach(column => {
        if (column.key) {
          checks.push({
            checked: true,
            key: column.key as string,
            title: column.title as string
          });
        }
      });

      return checks;
    },
    getColumns: (cols, checks) => {
      const columnMap = new Map<string, TableColumn<AntDesign.TableDataWithIndex<GetTableData<A>>>>();

      cols.forEach(column => {
        if (column.key) {
          columnMap.set(column.key as string, column);
        }
      });

      const filteredColumns = checks.filter(item => item.checked).map(check => columnMap.get(check.key));

      return filteredColumns as TableColumn<AntDesign.TableDataWithIndex<GetTableData<A>>>[];
    },
    immediate,
    isChangeURL,
    transformer: res => {
      const { current = 1, records = [], size = DEFAULT_PAGE_SIZE, total: totalNum = 0 } = res || {};

      const recordsWithIndex = records.map((item, index) => {
        return {
          ...item,
          index: (current - 1) * size + index + 1
        };
      });

      return {
        data: recordsWithIndex,
        pageNum: current,
        pageSize: size,
        total: totalNum
      };
    },
    transformParams
  });

  // this is for mobile, if the system does not support mobile, you can use `pagination` directly
  const pagination: TablePaginationConfig = {
    current: pageNum,
    pageSize,
    pageSizeOptions: PAGE_SIZE_OPTIONS,
    showSizeChanger: true,
    simple: isMobile,
    total,
    ...paginationConfig
  };
  function reset() {
    form.setFieldsValue(apiParams as NonNullable<Parameters<A>[0]>);

    resetSearchParams();
  }

  async function run(isResetCurrent: boolean = true) {
    const res = await form.validateFields();

    if (res) {
      if (isResetCurrent) {
        const { current = 1, ...other } = res;
        updateSearchParams({ current, ...other });
      } else {
        updateSearchParams(res);
      }
    }
  }

  function handleChange(...args: AntDesign.TableOnChange) {
    const [paginationContext, ...otherParams] = args;

    let other: Parameters<A>[0] = {
      current: paginationContext.current,
      size: paginationContext.pageSize
    } as Parameters<A>[0];

    if (onChangeCallback) {
      const params = onChangeCallback(paginationContext, ...otherParams);
      if (params) {
        other = params;
      }
    }

    updateSearchParams(other);
  }

  return {
    columnChecks,
    data,
    empty,
    form,
    run,
    searchParams,
    searchProps: {
      form,
      reset,
      search: run,
      searchParams: searchParams as NonNullable<Parameters<A>[0]>
    },
    setColumnChecks,
    tableProps: {
      columns,
      dataSource: data,
      loading,
      onChange: handleChange,
      pagination,
      rowKey,
      ...rest
    } as CustomTableProps<A>
  };
}

export function useTableOperate<T extends TableData = TableData>(
  data: T[],
  getData: (isResetCurrent?: boolean) => Promise<void>,
  executeResActions: (res: T, operateType: AntDesign.TableOperateType) => void
) {
  const { bool: drawerVisible, setFalse: closeDrawer, setTrue: openDrawer } = useBoolean();

  const { t } = useTranslation();

  const [operateType, setOperateType] = useState<AntDesign.TableOperateType>('add');

  const [form] = Form.useForm<T>();

  function handleAdd() {
    setOperateType('add');
    openDrawer();
  }

  /** the editing row data */
  const [editingData, setEditingData] = useState<T>();

  function handleEdit(idOrData: T['id'] | T) {
    if (typeof idOrData === 'object') {
      form.setFieldsValue(idOrData);

      setEditingData(idOrData);
    } else {
      const findItem = data.find(item => item.id === idOrData);
      if (findItem) {
        form.setFieldsValue(findItem);

        setEditingData(findItem);
      }
    }

    setOperateType('edit');
    openDrawer();
  }

  /** the checked row keys of table */
  const [checkedRowKeys, setCheckedRowKeys] = useState<React.Key[]>([]);

  function onSelectChange(keys: React.Key[]) {
    setCheckedRowKeys(keys);
  }

  const rowSelection: TableProps<T>['rowSelection'] = {
    columnWidth: 48,
    fixed: true,
    onChange: onSelectChange,
    selectedRowKeys: checkedRowKeys,
    type: 'checkbox'
  };

  function onClose() {
    closeDrawer();

    form.resetFields();
  }

  /** the hook after the batch delete operation is completed */
  async function onBatchDeleted() {
    window.$message?.success(t('common.deleteSuccess'));
    setCheckedRowKeys([]);

    await getData(false);
  }

  /** the hook after the delete operation is completed */
  async function onDeleted() {
    window.$message?.success(t('common.deleteSuccess'));

    await getData(false);
  }

  async function handleSubmit() {
    const res = await form.validateFields();

    // request
    await executeResActions(res, operateType);

    window.$message?.success(t('common.updateSuccess'));

    onClose();
    getData();
  }

  function OperateFormBinder() {
    return createElement(FormInstanceBinder, { active: drawerVisible, form });
  }

  return {
    OperateFormBinder,
    checkedRowKeys,
    closeDrawer,
    drawerVisible,
    editingData,
    generalPopupOperation: {
      form,
      handleSubmit,
      onClose,
      open: drawerVisible,
      operateType
    },
    handleAdd,
    handleEdit,
    onBatchDeleted,
    onDeleted,
    onSelectChange,
    openDrawer,
    operateType,
    rowSelection
  };
}

export function useTableScroll(scrollX: number = 702) {
  const tableWrapperRef = useRef<HTMLDivElement>(null);

  const size = useSize(tableWrapperRef);

  function getTableScrollY() {
    const height = size?.height;

    if (!height) return undefined;

    return height - 160;
  }

  const scrollConfig = {
    x: scrollX,
    y: getTableScrollY()
  };

  return {
    scrollConfig,
    tableWrapperRef
  };
}

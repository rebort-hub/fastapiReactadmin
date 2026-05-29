import { Button, Popconfirm, Space } from 'antd';
import type { SpaceProps } from 'antd';
import classNames from 'classnames';
import React from 'react';
import type { FC } from 'react';

import { useAuth } from '@/features/auth';

import DragContent from './DragContent';

interface Props {
  add: () => void;
  /** 新增按钮对应的后端 permission */
  addPermission?: string;
  children?: React.ReactNode;
  columns: AntDesign.TableColumnCheck[];
  disabledDelete?: boolean;
  /** 批量删除按钮对应的后端 permission */
  deletePermission?: string;
  itemAlign?: SpaceProps['align'];
  loading?: boolean;
  onDelete: () => void;
  prefix?: React.ReactNode;
  refresh: () => void;
  setColumnChecks: (checks: AntDesign.TableColumnCheck[]) => void;
  suffix?: React.ReactNode;
}

const TableHeaderOperation: FC<Props> = ({
  add,
  addPermission,
  children,
  columns,
  deletePermission,
  disabledDelete,
  itemAlign,
  loading,
  onDelete,
  prefix,
  refresh,
  setColumnChecks,
  suffix
}) => {
  const { t } = useTranslation();
  const { hasAuth } = useAuth();

  const showAdd = !addPermission || hasAuth(addPermission);
  const showDelete = !deletePermission || hasAuth(deletePermission);

  return (
    <Space
      wrap
      align={itemAlign}
      className="lt-sm:w-200px"
    >
      {prefix}
      {children ||
        (showAdd || showDelete ? (
          <>
            {showAdd && (
              <Button
                ghost
                icon={<IconIcRoundPlus className="text-icon" />}
                size="small"
                type="primary"
                onClick={add}
              >
                {t('common.add')}
              </Button>
            )}
            {showDelete && (
              <Popconfirm
                title={t('common.confirmDelete')}
                onConfirm={onDelete}
              >
                <Button
                  danger
                  ghost
                  disabled={disabledDelete}
                  icon={<IconIcRoundDelete className="text-icon" />}
                  size="small"
                >
                  {t('common.batchDelete')}
                </Button>
              </Popconfirm>
            )}
          </>
        ) : null)}
      <Button
        icon={<IconMdiRefresh className={classNames('text-icon', { 'animate-spin': loading })} />}
        size="small"
        onClick={refresh}
      >
        {t('common.refresh')}
      </Button>

      <APopover
        placement="bottomRight"
        trigger="click"
        content={
          <DragContent
            columns={columns}
            setColumnChecks={setColumnChecks}
          />
        }
      >
        <Button
          icon={<IconAntDesignSettingOutlined />}
          size="small"
        >
          {t('common.columnSetting')}
        </Button>
      </APopover>

      {suffix}
    </Space>
  );
};

export default TableHeaderOperation;

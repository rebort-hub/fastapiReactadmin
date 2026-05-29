import { useCallback, useMemo, useRef, useState } from 'react';
import type { UploadFile } from 'antd';

import Auth from '@/components/Auth';
import { DEFAULT_PAGE_SIZE } from '@/constants/pagination';
import { Perm } from '@/constants/permissions';
import { useAuth } from '@/features/auth';
import { TableHeaderOperation, useTable, useTableScroll } from '@/features/table';
import {
  buildResourceTargetPath,
  fetchCopyResource,
  fetchCreateResourceDir,
  fetchDeleteResource,
  fetchDownloadResource,
  fetchExportResource,
  fetchGetResourceList,
  fetchMoveResource,
  fetchRenameResource,
  fetchUploadResource
} from '@/service/api';
import { downloadBlob } from '@/utils/download-blob';
import { formatFileSize } from '@/utils/format-file-size';

import ResourceSearch from './modules/resource-search';
import ResourceTransferModal from './modules/resource-transfer-modal';

type BreadcrumbItem = {
  name: string;
  path: string;
};

type TransferMode = 'copy' | 'move';

type TransferState = {
  mode: TransferMode;
  sourceNames: string[];
  sourcePaths: string[];
};

function buildBreadcrumbList(currentPath: string): BreadcrumbItem[] {
  if (!currentPath || currentPath === '/') {
    return [{ name: 'resourceRoot', path: '/' }];
  }

  const parts = currentPath.split('/').filter(Boolean);

  return [
    { name: 'resourceRoot', path: '/' },
    ...parts.map((part, index) => ({
      name: part,
      path: parts.slice(0, index + 1).join('/')
    }))
  ];
}

function resolvePreviewUrl(fileUrl: string) {
  if (fileUrl.startsWith('http')) {
    return fileUrl;
  }
  return `${window.location.origin}${fileUrl}`;
}

async function downloadResourceFile(path: string, fileName: string) {
  const blob = await fetchDownloadResource(path);
  downloadBlob(blob, fileName);
}

const ResourceManage = () => {
  const { t } = useTranslation();
  const { hasAuth } = useAuth();
  const isMobile = useMobile();
  const { scrollConfig, tableWrapperRef } = useTableScroll();

  const currentPathRef = useRef('');
  const showHiddenRef = useRef(false);

  const [currentPath, setCurrentPath] = useState('');
  const [showHidden, setShowHidden] = useState(false);
  const [checkedPaths, setCheckedPaths] = useState<string[]>([]);
  const [checkedRecords, setCheckedRecords] = useState<Api.SystemModule.Resource[]>([]);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [createDirOpen, setCreateDirOpen] = useState(false);
  const [createDirName, setCreateDirName] = useState('');
  const [renameOpen, setRenameOpen] = useState(false);
  const [renamePath, setRenamePath] = useState('');
  const [renameName, setRenameName] = useState('');
  const [transferOpen, setTransferOpen] = useState(false);
  const [transferLoading, setTransferLoading] = useState(false);
  const [transferState, setTransferState] = useState<TransferState>({
    mode: 'move',
    sourceNames: [],
    sourcePaths: []
  });

  const breadcrumbList = useMemo(() => buildBreadcrumbList(currentPath), [currentPath]);

  const listApi = useCallback(async (params?: Api.SystemModule.ResourceSearchParams) => {
    const path = currentPathRef.current;
    const page = await fetchGetResourceList({
      ...params,
      path: path || undefined
    });

    if (!showHiddenRef.current) {
      return {
        ...page,
        records: page.records.filter(item => !item.is_hidden)
      };
    }

    return page;
  }, []);

  const { columnChecks, run, searchParams, searchProps, setColumnChecks, tableProps } = useTable({
    apiFn: listApi,
    apiParams: {
      current: 1,
      name: null,
      size: DEFAULT_PAGE_SIZE
    },
    columns: () => [
      {
        align: 'center',
        dataIndex: 'index',
        key: 'index',
        title: t('common.index'),
        width: 64
      },
      {
        dataIndex: 'name',
        key: 'name',
        minWidth: 220,
        render: (_, record) => (
          <AButton
            className="h-auto p-0"
            type="link"
            onClick={() => handleNameClick(record)}
          >
            <span className="inline-flex items-center gap-6px">
              {record.is_dir ? <IconMdiFolderOutline /> : <IconMdiFileOutline />}
              {record.name}
            </span>
          </AButton>
        ),
        title: t('page.manage.resource.fileName')
      },
      {
        align: 'center',
        dataIndex: 'size',
        key: 'size',
        render: (_, record) => (record.is_dir ? '—' : formatFileSize(record.size)),
        title: t('page.manage.resource.fileSize'),
        width: 110
      },
      {
        align: 'center',
        dataIndex: 'created_time',
        key: 'created_time',
        minWidth: 160,
        title: t('page.manage.resource.createdTime')
      },
      {
        align: 'center',
        dataIndex: 'modified_time',
        key: 'modified_time',
        minWidth: 160,
        title: t('page.manage.resource.modifiedTime')
      },
      {
        align: 'center',
        fixed: 'right',
        key: 'operate',
        render: (_, record) => {
          const items = [
            !record.is_dir && hasAuth(Perm.Resource.download)
              ? {
                  key: 'download',
                  label: t('page.manage.resource.download'),
                  onClick: () => downloadResourceFile(record.file_url, record.name)
                }
              : null,
            hasAuth(Perm.Resource.rename)
              ? {
                  key: 'rename',
                  label: t('page.manage.resource.rename'),
                  onClick: () => openRename(record)
                }
              : null,
            hasAuth(Perm.Resource.move)
              ? {
                  key: 'move',
                  label: t('page.manage.resource.move'),
                  onClick: () => openTransfer('move', [record])
                }
              : null,
            hasAuth(Perm.Resource.copy)
              ? {
                  key: 'copy',
                  label: t('page.manage.resource.copy'),
                  onClick: () => openTransfer('copy', [record])
                }
              : null,
            hasAuth(Perm.Resource.delete)
              ? {
                  danger: true,
                  key: 'delete',
                  label: t('common.delete'),
                  onClick: () => {
                    AModal.confirm({
                      content: t('page.manage.resource.deleteConfirm', { name: record.name }),
                      onOk: () => handleDeleteOne(record.file_url),
                      title: t('common.confirmDelete')
                    });
                  }
                }
              : null
          ].filter((item): item is NonNullable<typeof item> => item !== null);

          if (!items.length) {
            return null;
          }

          return (
            <ADropdown menu={{ items }}>
              <AButton size="small">{t('common.operate')}</AButton>
            </ADropdown>
          );
        },
        title: t('common.operate'),
        width: 100
      }
    ],
    rowKey: 'file_url'
  });

  function navigateToPath(path: string) {
    const nextPath = path === '/' ? '' : path;
    currentPathRef.current = nextPath;
    setCurrentPath(nextPath);
    setCheckedPaths([]);
    setCheckedRecords([]);
    run(false);
  }

  function handleNameClick(record: Api.SystemModule.Resource) {
    if (record.is_dir) {
      const nextPath =
        !currentPathRef.current ? record.name : `${currentPathRef.current}/${record.name}`;
      navigateToPath(nextPath);
      return;
    }

    window.open(resolvePreviewUrl(record.file_url), '_blank', 'noopener,noreferrer');
  }

  function handleShowHiddenChange(checked: boolean) {
    showHiddenRef.current = checked;
    setShowHidden(checked);
    run(false);
  }

  function openTransfer(mode: TransferMode, records: Api.SystemModule.Resource[]) {
    setTransferState({
      mode,
      sourceNames: records.map(item => item.name),
      sourcePaths: records.map(item => item.file_url)
    });
    setTransferOpen(true);
  }

  async function handleTransferConfirm(targetDir: string, overwrite: boolean) {
    const { mode, sourcePaths } = transferState;

    try {
      setTransferLoading(true);

      for (const sourcePath of sourcePaths) {
        const targetPath = buildResourceTargetPath(sourcePath, targetDir);
        const payload = { overwrite, source_path: sourcePath, target_path: targetPath };

        if (mode === 'move') {
          await fetchMoveResource(payload);
        } else {
          await fetchCopyResource(payload);
        }
      }

      window.$message?.success(
        mode === 'move' ? t('page.manage.resource.moveSuccess') : t('page.manage.resource.copySuccess')
      );
      setTransferOpen(false);
      setCheckedPaths([]);
      setCheckedRecords([]);
      run(false);
    } finally {
      setTransferLoading(false);
    }
  }

  async function handleBatchDelete() {
    await fetchDeleteResource(checkedPaths);
    window.$message?.success(t('common.deleteSuccess'));
    setCheckedPaths([]);
    setCheckedRecords([]);
    run(false);
  }

  async function handleDeleteOne(path: string) {
    await fetchDeleteResource([path]);
    window.$message?.success(t('common.deleteSuccess'));
    run(false);
  }

  async function handleExport() {
    try {
      setExporting(true);
      const blob = await fetchExportResource({
        ...searchParams,
        path: currentPathRef.current || undefined
      });
      downloadBlob(blob, 'resource_list.xlsx');
      window.$message?.success(t('page.manage.resource.exportSuccess'));
    } finally {
      setExporting(false);
    }
  }

  function openRename(record: Api.SystemModule.Resource) {
    setRenamePath(record.file_url);
    setRenameName(record.name);
    setRenameOpen(true);
  }

  async function handleRenameConfirm() {
    if (!renameName.trim()) {
      return;
    }
    await fetchRenameResource({ new_name: renameName.trim(), old_path: renamePath });
    window.$message?.success(t('page.manage.resource.renameSuccess'));
    setRenameOpen(false);
    run(false);
  }

  async function handleCreateDirConfirm() {
    if (!createDirName.trim()) {
      return;
    }
    await fetchCreateResourceDir({
      dir_name: createDirName.trim(),
      parent_path: currentPathRef.current
    });
    window.$message?.success(t('page.manage.resource.createDirSuccess'));
    setCreateDirOpen(false);
    setCreateDirName('');
    run(false);
  }

  async function handleUploadConfirm() {
    const file = uploadFiles.at(-1)?.originFileObj;
    if (!file) {
      window.$message?.warning(t('page.manage.resource.selectFile'));
      return;
    }

    try {
      setUploading(true);
      await fetchUploadResource(file, currentPathRef.current || undefined);
      window.$message?.success(t('page.manage.resource.uploadSuccess'));
      setUploadOpen(false);
      setUploadFiles([]);
      run(false);
    } finally {
      setUploading(false);
    }
  }

  const rowSelection = {
    onChange: (keys: React.Key[], rows: Api.SystemModule.Resource[]) => {
      setCheckedPaths(keys as string[]);
      setCheckedRecords(rows);
    },
    selectedRowKeys: checkedPaths
  };

  const hasSelection = checkedPaths.length > 0;

  return (
    <div className="h-full min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
      <ACollapse
        bordered={false}
        className="card-wrapper"
        defaultActiveKey={isMobile ? undefined : '1'}
        items={[
          {
            children: <ResourceSearch {...searchProps} />,
            key: '1',
            label: t('common.search')
          }
        ]}
      />

      <ACard
        className="flex-col-stretch sm:flex-1-hidden card-wrapper"
        ref={tableWrapperRef}
        title={t('page.manage.resource.title')}
        variant="borderless"
        extra={
          <TableHeaderOperation
            add={() => undefined}
            columns={columnChecks}
            loading={tableProps.loading}
            refresh={run}
            setColumnChecks={setColumnChecks}
            children={
              <AFlex
                align="center"
                gap={8}
                wrap
              >
                <Auth perm={Perm.Resource.upload}>
                  <AButton
                    size="small"
                    type="primary"
                    onClick={() => setUploadOpen(true)}
                  >
                    {t('page.manage.resource.upload')}
                  </AButton>
                </Auth>
                <Auth perm={Perm.Resource.createDir}>
                  <AButton
                    size="small"
                    onClick={() => setCreateDirOpen(true)}
                  >
                    {t('page.manage.resource.createDir')}
                  </AButton>
                </Auth>
                <Auth perm={Perm.Resource.move}>
                  <AButton
                    disabled={!hasSelection}
                    size="small"
                    onClick={() => openTransfer('move', checkedRecords)}
                  >
                    {t('page.manage.resource.move')}
                  </AButton>
                </Auth>
                <Auth perm={Perm.Resource.copy}>
                  <AButton
                    disabled={!hasSelection}
                    size="small"
                    onClick={() => openTransfer('copy', checkedRecords)}
                  >
                    {t('page.manage.resource.copy')}
                  </AButton>
                </Auth>
                <Auth perm={Perm.Resource.export}>
                  <AButton
                    loading={exporting}
                    size="small"
                    onClick={handleExport}
                  >
                    {t('page.manage.resource.export')}
                  </AButton>
                </Auth>
                <Auth perm={Perm.Resource.delete}>
                  <APopconfirm
                    disabled={!hasSelection}
                    title={t('page.manage.resource.batchDeleteConfirm', { count: checkedPaths.length })}
                    onConfirm={handleBatchDelete}
                  >
                    <AButton
                      danger
                      disabled={!hasSelection}
                      size="small"
                    >
                      {t('common.batchDelete')}
                    </AButton>
                  </APopconfirm>
                </Auth>
                <ACheckbox
                  checked={showHidden}
                  onChange={e => handleShowHiddenChange(e.target.checked)}
                >
                  {t('page.manage.resource.showHidden')}
                </ACheckbox>
              </AFlex>
            }
            onDelete={() => undefined}
          />
        }
      >
        <div className="mb-12px flex flex-wrap items-center gap-8px border-b border-[var(--ant-color-border)] pb-12px">
          <ATooltip title={t('page.manage.resource.breadcrumbTip')}>
            <IconIcRoundHelpOutline className="cursor-help text-icon" />
          </ATooltip>
          <span className="text-sm text-gray-500">{t('page.manage.resource.currentPath')}:</span>
          <ABreadcrumb
            items={breadcrumbList.map((item, index) => ({
              key: item.path,
              title:
                index === breadcrumbList.length - 1 ? (
                  item.name === 'resourceRoot' ? t('page.manage.resource.root') : item.name
                ) : (
                  <AButton
                    className="h-auto p-0"
                    type="link"
                    onClick={() => navigateToPath(item.path)}
                  >
                    {item.name === 'resourceRoot' ? t('page.manage.resource.root') : item.name}
                  </AButton>
                )
            }))}
          />
        </div>

        <ATable
          rowSelection={rowSelection}
          scroll={scrollConfig}
          size="small"
          {...tableProps}
        />
      </ACard>

      <AModal
        confirmLoading={uploading}
        open={uploadOpen}
        title={t('page.manage.resource.upload')}
        onCancel={() => {
          setUploadOpen(false);
          setUploadFiles([]);
        }}
        onOk={handleUploadConfirm}
      >
        <AUpload.Dragger
          beforeUpload={() => false}
          fileList={uploadFiles}
          maxCount={1}
          onChange={({ fileList }) => setUploadFiles(fileList)}
        >
          <p className="ant-upload-drag-icon">
            <IconIcRoundUpload className="text-48px" />
          </p>
          <p className="ant-upload-text">{t('page.manage.resource.uploadHint')}</p>
        </AUpload.Dragger>
      </AModal>

      <AModal
        open={createDirOpen}
        title={t('page.manage.resource.createDir')}
        onCancel={() => setCreateDirOpen(false)}
        onOk={handleCreateDirConfirm}
      >
        <AInput
          placeholder={t('page.manage.resource.form.dirName')}
          value={createDirName}
          onChange={e => setCreateDirName(e.target.value)}
        />
      </AModal>

      <AModal
        open={renameOpen}
        title={t('page.manage.resource.rename')}
        onCancel={() => setRenameOpen(false)}
        onOk={handleRenameConfirm}
      >
        <AInput
          placeholder={t('page.manage.resource.form.newName')}
          value={renameName}
          onChange={e => setRenameName(e.target.value)}
        />
      </AModal>

      <ResourceTransferModal
        loading={transferLoading}
        mode={transferState.mode}
        open={transferOpen}
        sourceNames={transferState.sourceNames}
        onClose={() => setTransferOpen(false)}
        onConfirm={handleTransferConfirm}
      />
    </div>
  );
};

export default ResourceManage;

import { memo, useEffect, useState } from 'react';

type TransferMode = 'copy' | 'move';

type Props = {
  loading?: boolean;
  mode: TransferMode;
  onClose: () => void;
  onConfirm: (targetDir: string, overwrite: boolean) => Promise<void>;
  open: boolean;
  sourceNames: string[];
};

const ResourceTransferModal: FC<Props> = memo(({ loading, mode, onClose, onConfirm, open, sourceNames }) => {
  const { t } = useTranslation();
  const [targetDir, setTargetDir] = useState('');
  const [overwrite, setOverwrite] = useState(false);

  useEffect(() => {
    if (open) {
      setTargetDir('');
      setOverwrite(false);
    }
  }, [open]);

  const title =
    mode === 'move' ? t('page.manage.resource.move') : t('page.manage.resource.copy');

  async function handleOk() {
    await onConfirm(targetDir.trim(), overwrite);
  }

  return (
    <AModal
      confirmLoading={loading}
      open={open}
      title={title}
      onCancel={onClose}
      onOk={handleOk}
    >
      <div className="flex flex-col gap-16px">
        <div>
          <div className="mb-8px text-sm text-gray-500">{t('page.manage.resource.transferSources')}</div>
          <ul className="m-0 max-h-120px list-disc overflow-auto pl-20px">
            {sourceNames.map(name => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </div>

        <AForm layout="vertical">
          <AForm.Item label={t('page.manage.resource.targetDir')}>
            <AInput
              placeholder={t('page.manage.resource.form.targetDir')}
              value={targetDir}
              onChange={e => setTargetDir(e.target.value)}
            />
          </AForm.Item>
          <AForm.Item>
            <ACheckbox
              checked={overwrite}
              onChange={e => setOverwrite(e.target.checked)}
            >
              {t('page.manage.resource.overwrite')}
            </ACheckbox>
          </AForm.Item>
        </AForm>
      </div>
    </AModal>
  );
});

export default ResourceTransferModal;

import type { ModulesProps } from './type';
import ButtonAuthPanel from './button-auth-panel';

const ButtonAuthModal: FC<ModulesProps> = memo(({ onClose, open, roleId }) => {
  const { t } = useTranslation();

  const title = t('common.edit') + t('page.manage.role.buttonAuth');

  return (
    <AModal
      className="w-480px"
      destroyOnClose
      open={open}
      title={title}
      footer={null}
      onCancel={onClose}
    >
      {open && (
        <ButtonAuthPanel
          roleId={roleId}
          onSaved={onClose}
        />
      )}
    </AModal>
  );
});

export default ButtonAuthModal;

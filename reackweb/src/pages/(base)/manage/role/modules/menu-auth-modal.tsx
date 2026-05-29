import type { ModulesProps } from './type';
import MenuAuthPanel from './menu-auth-panel';

const MenuAuthModal: FC<ModulesProps> = memo(({ onClose, open, roleId }) => {
  const { t } = useTranslation();

  const title = t('common.edit') + t('page.manage.role.menuAuth');

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
        <MenuAuthPanel
          roleId={roleId}
          onSaved={onClose}
        />
      )}
    </AModal>
  );
});

export default MenuAuthModal;

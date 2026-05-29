import { backendUserStatusOptions } from '@/constants/backend-user';
import { REG_CODE, REG_EMAIL, REG_PHONE } from '@/constants/reg';
import { FORM_VALIDATE_TRIGGER, useFormRules } from '@/features/form';
import { collectDeptDescendantIds, mapDeptToTreeSelectData } from '@/utils/dept-tree';

type Props = {
  deptTree: Api.SystemModule.Dept[];
  editingId?: number;
  form: ReturnType<typeof AForm.useForm<Api.SystemModule.DeptForm>>[0];
  handleSubmit: () => void;
  onClose: () => void;
  open: boolean;
  operateType: 'add' | 'addChild' | 'edit';
};

const DeptOperateDrawer: FC<Props> = memo(
  ({ deptTree, editingId, form, handleSubmit, onClose, open, operateType }) => {
    const { t } = useTranslation();
    const { defaultRequiredRule } = useFormRules();

    const deptCodeRule: App.Global.FormRule = {
      message: t('page.manage.dept.form.deptCodeInvalid'),
      pattern: REG_CODE,
      validateTrigger: FORM_VALIDATE_TRIGGER
    };

    const optionalPhoneRule: App.Global.FormRule = {
      validateTrigger: FORM_VALIDATE_TRIGGER,
      validator: (_, value?: string) => {
        if (!value) {
          return Promise.resolve();
        }
        if (!REG_PHONE.test(value)) {
          return Promise.reject(new Error(t('form.phone.invalid')));
        }
        return Promise.resolve();
      }
    };

    const optionalEmailRule: App.Global.FormRule = {
      validateTrigger: FORM_VALIDATE_TRIGGER,
      validator: (_, value?: string) => {
        if (!value) {
          return Promise.resolve();
        }
        if (!REG_EMAIL.test(value)) {
          return Promise.reject(new Error(t('form.email.invalid')));
        }
        return Promise.resolve();
      }
    };

    const rules = {
      code: [defaultRequiredRule, deptCodeRule],
      name: defaultRequiredRule,
      status: defaultRequiredRule
    };

    const excludeIds = useMemo(() => {
      if (operateType !== 'edit' || !editingId) {
        return undefined;
      }
      return collectDeptDescendantIds(deptTree, editingId);
    }, [deptTree, editingId, operateType]);

    const parentTreeData = useMemo(
      () => mapDeptToTreeSelectData(deptTree, { excludeIds }),
      [deptTree, excludeIds]
    );

    const titleMap = {
      add: t('page.manage.dept.addDept'),
      addChild: t('page.manage.dept.addChildDept'),
      edit: t('page.manage.dept.editDept')
    };

    return (
      <ADrawer
        open={open}
        title={titleMap[operateType]}
        width={520}
        footer={
          <AFlex justify="space-between">
            <AButton onClick={onClose}>{t('common.cancel')}</AButton>
            <AButton
              type="primary"
              onClick={handleSubmit}
            >
              {t('common.confirm')}
            </AButton>
          </AFlex>
        }
        onClose={onClose}
      >
        <AForm
          form={form}
          initialValues={{ order: 1, status: '0' }}
          layout="vertical"
        >
          <AForm.Item
            label={t('page.manage.dept.deptName')}
            name="name"
            rules={[rules.name]}
          >
            <AInput placeholder={t('page.manage.dept.form.deptName')} />
          </AForm.Item>

          <AForm.Item
            label={t('page.manage.dept.deptCode')}
            name="code"
            rules={rules.code}
          >
            <AInput
              disabled={operateType === 'edit'}
              placeholder={t('page.manage.dept.form.deptCode')}
            />
          </AForm.Item>

          <AForm.Item
            label={t('page.manage.dept.parentDept')}
            name="parent_id"
          >
            <ATreeSelect
              allowClear
              disabled={operateType === 'addChild'}
              placeholder={t('page.manage.dept.form.parentDept')}
              treeData={parentTreeData}
              treeDefaultExpandAll
            />
          </AForm.Item>

          <AForm.Item
            label={t('page.manage.dept.order')}
            name="order"
          >
            <AInputNumber
              className="w-full"
              min={0}
              placeholder={t('page.manage.dept.form.order')}
            />
          </AForm.Item>

          <AForm.Item
            label={t('page.manage.dept.leader')}
            name="leader"
          >
            <AInput placeholder={t('page.manage.dept.form.leader')} />
          </AForm.Item>

          <AForm.Item
            label={t('page.manage.dept.phone')}
            name="phone"
            rules={[optionalPhoneRule]}
          >
            <AInput placeholder={t('page.manage.dept.form.phone')} />
          </AForm.Item>

          <AForm.Item
            label={t('page.manage.dept.email')}
            name="email"
            rules={[optionalEmailRule]}
          >
            <AInput placeholder={t('page.manage.dept.form.email')} />
          </AForm.Item>

          <AForm.Item
            label={t('page.manage.dept.deptStatus')}
            name="status"
            rules={[rules.status]}
          >
            <ARadio.Group>
              {backendUserStatusOptions.map(item => (
                <ARadio
                  key={item.value}
                  value={item.value}
                >
                  {t(item.label)}
                </ARadio>
              ))}
            </ARadio.Group>
          </AForm.Item>

          <AForm.Item
            label={t('page.manage.dept.deptDesc')}
            name="description"
          >
            <AInput.TextArea
              placeholder={t('page.manage.dept.form.deptDesc')}
              rows={3}
            />
          </AForm.Item>
        </AForm>
      </ADrawer>
    );
  }
);

export default DeptOperateDrawer;

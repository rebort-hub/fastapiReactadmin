import { backendUserStatusOptions } from '@/constants/backend-user';
import { translateOptions } from '@/utils/common';

type SearchModel = Api.SystemModule.DeptSearchParams;

type Props = {
  onReset: () => void;
  onSearch: (values: SearchModel) => void;
  searchParams: SearchModel;
};

const DeptSearch: FC<Props> = memo(({ onReset, onSearch, searchParams }) => {
  const { t } = useTranslation();
  const [form] = AForm.useForm<SearchModel>();

  function handleReset() {
    form.resetFields();
    onReset();
  }

  function handleSearch() {
    const values = form.getFieldsValue();
    onSearch(values);
  }

  return (
    <AForm
      autoComplete="off"
      form={form}
      initialValues={searchParams}
      labelCol={{ md: 7, span: 5 }}
    >
      <ARow
        wrap
        gutter={[16, 16]}
      >
        <ACol
          lg={6}
          md={12}
          span={24}
        >
          <AForm.Item
            className="m-0"
            label={t('page.manage.dept.deptName')}
            name="name"
          >
            <AInput
              autoComplete="off"
              placeholder={t('page.manage.dept.form.deptName')}
            />
          </AForm.Item>
        </ACol>

        <ACol
          lg={6}
          md={12}
          span={24}
        >
          <AForm.Item
            className="m-0"
            label={t('page.manage.dept.deptStatus')}
            name="status"
          >
            <ASelect
              allowClear
              options={translateOptions(backendUserStatusOptions)}
              placeholder={t('page.manage.dept.form.deptStatus')}
            />
          </AForm.Item>
        </ACol>

        <ACol
          lg={6}
          md={12}
          span={24}
        >
          <AForm.Item className="m-0">
            <AFlex
              align="center"
              gap={12}
              justify="end"
            >
              <AButton
                icon={<IconIcRoundRefresh />}
                onClick={handleReset}
              >
                {t('common.reset')}
              </AButton>
              <AButton
                ghost
                icon={<IconIcRoundSearch />}
                type="primary"
                onClick={handleSearch}
              >
                {t('common.search')}
              </AButton>
            </AFlex>
          </AForm.Item>
        </ACol>
      </ARow>
    </AForm>
  );
});

export default DeptSearch;

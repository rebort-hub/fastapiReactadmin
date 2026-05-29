import { LOG_TYPE_OPTIONS } from '@/constants/log';
import { translateOptions } from '@/utils/common';

const LogSearch: FC<Page.SearchProps> = memo(({ form, reset, search, searchParams }) => {
  const { t } = useTranslation();

  return (
    <AForm
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
            label={t('page.manage.log.requestPath')}
            name="request_path"
          >
            <AInput placeholder={t('page.manage.log.form.requestPath')} />
          </AForm.Item>
        </ACol>

        <ACol
          lg={6}
          md={12}
          span={24}
        >
          <AForm.Item
            className="m-0"
            label={t('page.manage.log.logType')}
            name="type"
          >
            <ASelect
              allowClear
              options={translateOptions(LOG_TYPE_OPTIONS)}
              placeholder={t('page.manage.log.form.logType')}
            />
          </AForm.Item>
        </ACol>

        <ACol
          lg={8}
          md={12}
          span={24}
        >
          <AForm.Item
            className="m-0"
            label={t('page.manage.log.createdTime')}
            name="created_time"
          >
            <ADatePicker.RangePicker
              className="w-full"
              showTime
              format="YYYY-MM-DD HH:mm:ss"
            />
          </AForm.Item>
        </ACol>

        <ACol
          lg={4}
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
                onClick={reset}
              >
                {t('common.reset')}
              </AButton>
              <AButton
                ghost
                icon={<IconIcRoundSearch />}
                type="primary"
                onClick={search}
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

export default LogSearch;

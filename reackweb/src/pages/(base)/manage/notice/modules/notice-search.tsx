import { backendUserStatusOptions } from '@/constants/backend-user';
import { NOTICE_TYPE_OPTIONS } from '@/constants/notice';
import { translateOptions } from '@/utils/common';

const NoticeSearch: FC<Page.SearchProps> = memo(({ form, reset, search, searchParams }) => {
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
            label={t('page.manage.notice.noticeTitle')}
            name="notice_title"
          >
            <AInput placeholder={t('page.manage.notice.form.noticeTitle')} />
          </AForm.Item>
        </ACol>

        <ACol
          lg={6}
          md={12}
          span={24}
        >
          <AForm.Item
            className="m-0"
            label={t('page.manage.notice.noticeType')}
            name="notice_type"
          >
            <ASelect
              allowClear
              options={translateOptions(NOTICE_TYPE_OPTIONS)}
              placeholder={t('page.manage.notice.form.noticeType')}
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
            label={t('page.manage.notice.noticeStatus')}
            name="status"
          >
            <ASelect
              allowClear
              options={translateOptions(backendUserStatusOptions)}
              placeholder={t('page.manage.notice.form.noticeStatus')}
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
            label={t('page.manage.notice.createdTime')}
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
          lg={24}
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

export default NoticeSearch;

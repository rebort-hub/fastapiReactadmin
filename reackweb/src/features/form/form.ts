import type { FormInstance } from 'antd';
import { useMemo } from 'react';

import { PASSWORD_MAX_LEN, PASSWORD_MIN_LEN, REG_CODE_SIX, REG_EMAIL, REG_PHONE, REG_USER_NAME } from '@/constants/reg';
import { $t } from '@/locales';

/** 表单校验触发时机：输入时 + 提交时 */
export const FORM_VALIDATE_TRIGGER = ['onChange', 'onSubmit'] as const;

export function useFormRules() {
  const { i18n } = useTranslation();

  return useMemo(() => {
    const patternRules = {
      code: {
        message: $t('form.code.invalid'),
        pattern: REG_CODE_SIX,
        validateTrigger: FORM_VALIDATE_TRIGGER
      },
      email: {
        message: $t('form.email.invalid'),
        pattern: REG_EMAIL,
        validateTrigger: FORM_VALIDATE_TRIGGER
      },
      phone: {
        message: $t('form.phone.invalid'),
        pattern: REG_PHONE,
        validateTrigger: FORM_VALIDATE_TRIGGER
      },
      userName: {
        message: $t('form.userName.invalid'),
        pattern: REG_USER_NAME,
        validateTrigger: FORM_VALIDATE_TRIGGER
      }
    } satisfies Record<string, App.Global.FormRule>;

    function createRequiredRule(message: string): App.Global.FormRule {
      return {
        message,
        required: true,
        validateTrigger: FORM_VALIDATE_TRIGGER
      };
    }

    function createPasswordLengthRule(): App.Global.FormRule {
      return {
        validateTrigger: FORM_VALIDATE_TRIGGER,
        validator: (_, value: string) => {
          if (!value) {
            return Promise.resolve();
          }

          if (value.length < PASSWORD_MIN_LEN) {
            return Promise.reject($t('form.pwd.tooShort'));
          }

          if (value.length > PASSWORD_MAX_LEN) {
            return Promise.reject($t('form.pwd.tooLong'));
          }

          return Promise.resolve();
        }
      };
    }

    const passwordRules: App.Global.FormRule[] = [
      createRequiredRule($t('form.pwd.required')),
      createPasswordLengthRule()
    ];

    const formRules = {
      /** 登录账号：仅校验必填，格式由后端登录接口处理 */
      account: [createRequiredRule($t('form.userName.required'))],
      code: [createRequiredRule($t('form.code.required')), patternRules.code],
      email: [createRequiredRule($t('form.email.required')), patternRules.email],
      loginPwd: [createRequiredRule($t('form.pwd.required'))],
      phone: [createRequiredRule($t('form.phone.required')), patternRules.phone],
      pwd: passwordRules,
      userName: [createRequiredRule($t('form.userName.required')), patternRules.userName]
    } satisfies Record<string, App.Global.FormRule[]>;

    /** the default required rule */
    const defaultRequiredRule = createRequiredRule($t('form.required'));

    /** required rule for InputNumber fields */
    const numberRequiredRule: App.Global.FormRule = {
      message: $t('form.required'),
      required: true,
      type: 'number',
      validateTrigger: FORM_VALIDATE_TRIGGER
    };

    /** create a rule for confirming the password */
    function createConfirmPwdRule(from: FormInstance, pwdFieldName = 'password') {
      const confirmPwdRule: App.Global.FormRule[] = [
        { message: $t('form.confirmPwd.required'), required: true, validateTrigger: FORM_VALIDATE_TRIGGER },
        {
          message: $t('form.confirmPwd.invalid'),
          validateTrigger: FORM_VALIDATE_TRIGGER,
          validator: (rule, value) => {
            const pwd = from.getFieldValue(pwdFieldName);

            if (value?.trim() && value !== pwd) {
              return Promise.reject(rule.message);
            }
            return Promise.resolve();
          }
        }
      ];
      return confirmPwdRule;
    }

    return {
      createConfirmPwdRule,
      createRequiredRule,
      defaultRequiredRule,
      formRules,
      numberRequiredRule,
      patternRules
    };
  }, [i18n.language]);
}

const form: App.I18n.Schema['translation']['form'] = {
  code: {
    invalid: '验证码格式不正确',
    required: '请输入验证码'
  },
  confirmPwd: {
    invalid: '两次输入密码不一致',
    required: '请输入确认密码'
  },
  email: {
    invalid: '邮箱格式不正确',
    required: '请输入邮箱'
  },
  phone: {
    invalid: '手机号格式不正确',
    required: '请输入手机号'
  },
  pwd: {
    invalid: '密码长度为6-128位',
    required: '请输入密码',
    tooLong: '密码长度不能超过128个字符',
    tooShort: '密码长度至少6位'
  },
  required: '不能为空',
  userName: {
    invalid: '账号需字母开头，3-32位，仅含字母/数字/_ . -',
    required: '请输入账号'
  }
};

export default form;

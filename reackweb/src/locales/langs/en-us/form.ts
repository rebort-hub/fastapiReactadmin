const form: App.I18n.Schema['translation']['form'] = {
  code: {
    invalid: 'Verification code format is incorrect',
    required: 'Please enter verification code'
  },
  confirmPwd: {
    invalid: 'The two passwords are inconsistent',
    required: 'Please enter password again'
  },
  email: {
    invalid: 'Email format is incorrect',
    required: 'Please enter email'
  },
  phone: {
    invalid: 'Phone number format is incorrect',
    required: 'Please enter phone number'
  },
  pwd: {
    invalid: 'Password must be 6-128 characters',
    required: 'Please enter password',
    tooLong: 'Password must be at most 128 characters',
    tooShort: 'Password must be at least 6 characters'
  },
  required: 'Cannot be empty',
  userName: {
    invalid: 'Username must start with a letter, 3-32 chars, letters/digits/_ . - only',
    required: 'Please enter account'
  }
};
export default form;

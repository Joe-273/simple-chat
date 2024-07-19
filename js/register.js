// 账号验证器
const validateLoginId = new Validator($("#txtLoginId"), async (value) => {
  if (!value) {
    return "账号不能为空";
  }
  const isExists = await API.exists(value);
  if (isExists.data) {
    return "账号已经存在";
  }
});
// 昵称验证器
const validateNickname = new Validator($("#txtNickname"), async (value) => {
  if (!value) {
    return "昵称不能为空";
  }
});
// 密码验证器件
const validateLoginPwd = new Validator($("#txtLoginPwd"), async (value) => {
  if (!value) {
    return "密码不能为空";
  }
  validateConfirmLoginPwd.validate();
});
// 确认密码验证器件
const validateConfirmLoginPwd = new Validator($("#txtLoginPwdConfirm"), async (value) => {
  if (!value) return "密码不能为空";
  if (value !== validateLoginPwd.form.value) return "两次密码不一致";
});

const bind = () => {
  const form = $(".userForm");

  // 提交表单事件
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    // 验证表单
    const result = await Validator.validateEvery(
      validateLoginId,
      validateNickname,
      validateLoginPwd,
      validateConfirmLoginPwd
    );
    if (!result) return;
    // 验证通过，向注册接口请求注册
    const formData = new FormData(form);
    const formDataObj = Object.fromEntries(formData.entries());
    const resp = await API.reg(formDataObj);
    // 成功注册后
    if (resp.code === 0) {
      // 保存账号到sessionStorage
      sessionStorage.setItem(SESSION_LOGINID, validateLoginId.form.value);
      openModal("注册成功");
    }
  });
};

bind();

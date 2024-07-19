// 账号验证器
const validateLoginId = new Validator($("#txtLoginId"), async (value) => {
  if (!value) {
    return "账号不能为空";
  }
});
// 密码验证器件
const validateLoginPwd = new Validator($("#txtLoginPwd"), async (value) => {
  if (!value) {
    return "密码不能为空";
  }
  const resp = await API.login(value);
  if (resp.code === 400) {
    return "账号或密码错误";
  }
});

// 如果有临时保存（注册后保存）的LoginId，自动填充到表单中
const sessionLoginId = sessionStorage.getItem(SESSION_LOGINID);
sessionLoginId && (validateLoginId.form.value = sessionLoginId);

const bind = () => {
  const form = $(".userForm");
  // 提交表单事件
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    // 验证表单
    const result = await Validator.validateEvery(validateLoginId, validateLoginPwd);
    if (!result) return;
    // 验证通过，向登录接口请求注册
    const formData = new FormData(form);
    const formDataObj = Object.fromEntries(formData.entries());
    const resp = await API.login(formDataObj);

    // 成功登录后
    if (resp.code === 0) {
      // 保存账号到sessionStorage
      sessionStorage.setItem(SESSION_LOGINID, validateLoginId.form.value);
      // 跳转到主页
      location.href = "./index.html";
    }
  });
};

bind();

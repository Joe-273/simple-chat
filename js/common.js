// 粒子
particlesJS.load("particles-js", "assets/particles.json", function () {
  console.log("Particles.min.js config loaded");
});

// 获取封装DOM相关函数
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);
const $$$ = (tagName) => document.createElement(tagName);

/* 验证类 */
class Validator {
  /**
   * 构造一个验证器, 对表单进行验证
   * @param {ELement} form 表单元素
   * @param {Function} ruleFunc 验证规则
   */
  constructor(form, ruleFunc) {
    this.form = form;
    this.errMessage = this.form.nextElementSibling;
    this.ruleFunc = ruleFunc;

    // 失去焦点的时候进行验证
    this.form.addEventListener("blur", () => {
      this.validate();
    });
    // 聚焦时初始化错误文本
    this.form.addEventListener("focus", () => {
      this.errMessage.className = "err";
      this.errMessage.innerText = "";
    });
  }
  // 验证函数
  async validate() {
    // 获取错误消息
    const err = await this.ruleFunc(this.form.value);

    if (!err) {
      this.errMessage.innerText = "✔";
      this.errMessage.className = "err right";
      return true;
    } else {
      this.errMessage.innerText = err;
      this.errMessage.className = "err fault";
      return false;
    }
  }
  /**
   * 验证传入的验证器是否全部验证成功
   * @param  {...validator} validators 验证器
   */
  static async validateEvery(...validators) {
    const resp = await validators.map((validator) => validator.validate());
    const result = await Promise.all(resp);
    return result.every((item) => item);
  }
}

/* 模态/观察器 */
const openModal = (
  modalMessage,
  deleteContainer = false,
  buttonFunction = () => {
    location.href = "./login.html";
  }
) => {
  // 删除主体内容
  deleteContainer && $("body").removeChild($(".container"));

  const createModal = () => {
    const divModal = $$$("div");
    divModal.id = "modal";
    const divDialog = $$$("div");
    divDialog.className = "dialog";
    const h2Message = $$$("h2");
    h2Message.innerText = modalMessage || ">_ 提示:";
    const button = $$$("button");
    button.innerText = "确认";

    divDialog.appendChild(h2Message);
    divDialog.appendChild(button);
    divModal.appendChild(divDialog);
    $("body").appendChild(divModal);

    // 默认按钮事件为返回登陆页面
    button.addEventListener("click", () => {
      buttonFunction();
      removeModal();
    });

    return divModal;
  };

  let modal = createModal();

  const removeModal = () => {
    // 停止观察
    observer.disconnect();
    // 删除模态框
    modal.remove();
  };

  // 配置观察选项：
  const observerConfig = {
    childList: true, // 观察目标子节点的变动
    subtree: true, // 观察后代节点的变动
    attributes: true, // 观察属性变动
  };

  // 创建一个 MutationObserver 实例
  const observer = new MutationObserver((mutationsList, observer) => {
    let modalExists = document.body.contains(modal);
    // 检查模态窗口是否被删除或隐藏
    if (!modalExists || modal.style.display === "none") {
      // 如果模态窗口被删除或隐藏了，重新创建
      modal.remove();
      modal = createModal();
    }
  });

  // 开始观察 body 的变化
  observer.observe(document.body, observerConfig);
};

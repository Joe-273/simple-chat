/**
 * 将时间戳转换为标准格式
 * @param {*} timeStamp 时间戳
 * @returns 标准格式日期
 */
const formatDate = (timeStamp) => {
  const time = new Date(+timeStamp);
  const year = time.getFullYear();
  const month = String(time.getMonth() + 1).padStart(2, "0");
  const date = String(time.getDate()).padStart(2, "0");
  const hour = String(time.getHours()).padStart(2, "0");
  const minute = String(time.getMinutes()).padStart(2, "0");
  const second = String(time.getSeconds()).padStart(2, "0");
  return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
};

// 创建一个chatItem
const createChatItem = (chatArea, chatObj) => {
  const divChatItem = $$$("div");
  divChatItem.classList.add("chatItem");
  const divChatParty = $$$("div");
  divChatParty.classList.add("chatParty");
  const divChatContent = $$$("div");
  divChatContent.classList.add("chatContent");

  divChatItem.appendChild(divChatParty);
  divChatItem.appendChild(divChatContent);

  if (chatObj.from) {
    // 消息发送者为用户
    divChatItem.classList.add("me");
    divChatParty.innerText = chatObj.from[0].toUpperCase();
    divChatContent.innerText = chatObj.content;
  } else {
    // 消息发送者为机器人
    divChatParty.classList.add("iconfont");
    divChatParty.innerHTML = "&#xe600;";
    divChatContent.innerHTML = chatObj.content.replace(/{br}/g, "<br>");
  }

  chatArea.appendChild(divChatItem);
};

const messageContent = $(".messageContent");
// 创建聊天时间戳
const createChatDate = (chatArea, date) => {
  const divDate = $$$("div");
  divDate.classList.add("chatDate");
  divDate.innerText = formatDate(date);

  chatArea.appendChild(divDate);
};

/**
 * 补全历史消息
 * @param {Array} historyData 向接口请求到的历史消息
 */
const createChatHistory = (historyData) => {
  let messageDate;
  for (const chatObj of historyData) {
    // 初始时刻
    if (!messageDate || chatObj.createdAt - messageDate > 300000) {
      createChatDate(messageContent, chatObj.createdAt);
    }
    createChatItem(messageContent, chatObj);
    messageDate = chatObj.createdAt;
    // 滚动到底部
    messageContent.scrollTo(0, messageContent.scrollHeight);
  }
};
//绑定事件
const bind = (userProfile) => {
  const form = $(".sendMessage");
  const allIconElements = $$("i.iconfont");
  // 所有图标点击事件
  allIconElements.forEach((element) => {
    element.addEventListener("click", () => {
      if (element.id === "logout") {
        openModal("再见！大人~", true, () => {
          API.logout();
          location.href = "./login.html";
        });
      } else {
        openModal(">_ 人家还没准备好这个功能哟!", false, () => {});
      }
    });
  });
  // 聚焦输入框事件
  form.querySelector("input").addEventListener("focus", () => {
    $(".chatArea").style.opacity = 1;
    form.querySelector("input").addEventListener("blur", () => {
      $(".chatArea").style = "";
    });
  });
  // 表单提交事件
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const formDataObj = Object.fromEntries(formData.entries());
    // 先将信息发送到页面上
    createChatItem(messageContent, {
      from: userProfile.loginId,
      ...formDataObj,
      createdAt: new Date().getTime(),
    });
    form.querySelector("input").value = "";
    // 滚动到底部
    messageContent.scrollTo(0, messageContent.scrollHeight);
    // 请求到响应后再把响应显示在页面上
    const resp = await API.chat(formDataObj);
    createChatItem(messageContent, resp.data);
    // 滚动到底部
    messageContent.scrollTo(0, messageContent.scrollHeight);
  });
};

// 初始化
const init = async () => {
  // 如果请求不到用户信息，则弹出模态，并且删除主体内容
  const userProfile = await API.profile();
  if (!userProfile || userProfile.code !== 0) {
    // 不要弹出模态了，影响体验
    // openModal("登录已过期", true);
    // 直接回到登陆页面
     location.href = "./login.html";
    return;
  }
  // 登录成功，获取历史聊天记录
  const history = await API.history();
  createChatHistory(history.data);

  // 绑定事件
  bind(userProfile.data);
};
init();

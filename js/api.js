const API = (() => {
  const headers = {};
  // 有些get请求需要携带请求头
  // 如果浏览器的sessionStorage中有authorization，则发送请求头时自动携带
  if (sessionStorage.getItem(TOKEN_KEY)) {
    headers.authorization = "Bearer " + sessionStorage.getItem(TOKEN_KEY);
  }

  /**
   * 发送GET请求
   * @param {string} path 接口路径
   * @returns 返回响应的响应头
   */
  const get = async (path) => {
    return fetch(SERVER_HOST + path, { headers });
  };

  /**
   * 发送POST请求
   * @param {string} path 接口路径
   * @param {Object} body 消息体
   * @returns 返回响应的响应头
   */
  const post = async (path, body) => {
    // POST请求头需要有Conten-type
    headers["Content-type"] = "application/json";
    return fetch(SERVER_HOST + path, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
    });
  };

  /**
   * 注册接口
   * @param {Object} body 请求体,参数：loginId nickname loginPwd;
   */
  const reg = async (body) => {
    const resp = await post("/api/user/reg", body);
    return await resp.json();
  };

  /**
   * 登录
   * @param {Object} body 请求体，参数：loginId loginPwd;
   */
  const login = async (body) => {
    const resp = await post("/api/user/login", body);
    const result = await resp.json();
    // 如果登录成功，则将响应头的authorization保存到sessionStorage中
    if (result.code === 0) {
      sessionStorage.setItem(TOKEN_KEY, resp.headers.get("authorization"));
    }
    return result;
  };

  /**
   * 验证账号是否存在
   * @param {string} body 请求参数: loginId;
   * @returns 返回携带结果的Promise
   */
  const exists = async (body) => {
    const resp = await get("/api/user/exists?loginId=" + body);
    return await resp.json();
  };

  /**
   * 如果请求头中有authorization
   * @returns 返回用户的信息
   */
  const profile = async () => {
    const resp = await get("/api/user/profile");
    return await resp.json();
  };

  const chat = async (body) => {
    const resp = await post("/api/chat", body);
    return await resp.json();
  };

  const history = async () => {
    const resp = await get("/api/chat/history");
    return resp.json();
  };

  const logout = () => {
    sessionStorage.removeItem(TOKEN_KEY);
  };
  return { reg, login, exists, profile, chat, history, logout };
})();

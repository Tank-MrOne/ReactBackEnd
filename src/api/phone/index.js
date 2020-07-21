//所有手机号登录相关的请求都写在这
import request from "@/utils/request";
const BASE_URL = "/oauth";

// 请求发送验证码
export function reqSendVerifyCode(mobile) {
  return request({
		url: `${BASE_URL}/sign_in/digits`,
		data:{mobile},
    method: "POST",
  });
}

// 根据手机号、验证码，请求登录
export function reqPhoneLogin(mobile,code) {
  return request({
		url: `${BASE_URL}/mobile`,
		data:{mobile,code},
    method: "POST",
  });
}

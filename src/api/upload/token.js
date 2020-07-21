import request from "@/utils/request";
const BASE_URL = "/uploadtoken";

//请求服务器计算一个新的七牛云token
export function reqQiniuToken() {
  return request({
		url: `${BASE_URL}`,
    method: "GET",
  });
}

import request from "@/untils/request";

export function userlogin(data) {
  return request({
    url: "login",
    method: "post",
    data,
  });
}

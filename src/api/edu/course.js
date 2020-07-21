//所有课程相关的请求都在此发出
import request from "@/utils/request";

const BASE_URL = "/admin/edu/course";

// 获取课程一级分类数据(分页)
export function reqAllCourse() {
  return request({
    url: `${BASE_URL}`,
    method: "GET",
  });
}
//查询课程
export function reqSearchCourse({page=1,limit=5,teacherId,subjectId,subjectParentId,title}) {
  return request({
		url: `${BASE_URL}/${page}/${limit}`,
		params:{teacherId,subjectId,subjectParentId,title},
    method: "GET",
  });
}

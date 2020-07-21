//所有课程分类相关的请求都在此发出

import request from "@/utils/request";

const BASE_URL = "/admin/edu/subject";

// 获取课程一级分类数据(分页)
export function reqNo1SubjectPagination(page,pageSize) {
  return request({
    url: `${BASE_URL}/${page}/${pageSize}`,
    method: "GET",
  });
}
// 获取所有课程一级分类数据
export function reqAllNo1Subject() {
  return request({
    url: `${BASE_URL}`,
    method: "GET",
  });
}

// 通过一级分类id，获取该一级分类下属的二级分类
export function reqAllNo2SubjectById(parentId) {
  return request({
    url: `${BASE_URL}/get/${parentId}`,
    method: "GET",
  });
}
// 添加课程分类
export function reqAddSubject(title,parentId) {
  return request({
		url: `${BASE_URL}/save`,
		data:{title,parentId},
    method: "POST",
  });
}
// 更新课程分类
export function reqUpdateSubject(id,title) {
  return request({
		url: `${BASE_URL}/update`,
		data:{id,title},
    method: "PUT",
  });
}
// 删除课程分类
export function reqDeleteSubject(id) {
  return request({
		url: `${BASE_URL}/remove/${id}`,
    method: "DELETE",
  });
}

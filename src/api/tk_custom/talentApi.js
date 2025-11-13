import request from "@/utils/request";

// 查询人才列表
export function getListApi(query) {
  return request({
    url: "/tk_custom/talent/getTalentList",
    method: "get",
    params: query,
  });
}

export function getTalentInfoApi(id) {
  return request({
    url: "/tk_custom/talent/getTalentInfo",
    method: "get",
    params: { id },
  });
}

// 添加人员信息
export function addTalentInfoApi(data) {
  return request({
    url: "/tk_custom/talent/addTalentInfo",
    method: "post",
    data,
  });
}


// 修改人员信息
export function editTalentInfoApi(data) {
  return request({
    url: "/tk_custom/talent/editTalentInfo",
    method: "post",
    data
  });

}


// 依据id删除人员
export function delByIdsApi(ids) {
  return request({
    url: "/tk_custom/talent/delTalentByIds",
    method: "delete",
    data: ids,
  });
}

// 上传人员信息
export function uploadFileApi(data) {
  return request({
    url: "/tk_custom/talent/talentPic",
    method: "post",
    headers: { "Content-Type": "multipart/form-data" },
    data,
  });
}

<template>
  <div class="table-container">
    <el-form
      :model="queryParams"
      ref="queryRef"
      :inline="true"
      v-show="showSearch"
      label-width="80px"
    >
      <el-form-item label="职位" prop="flowNo">
        <el-input
          v-model="queryParams.position"
          placeholder="请输入职位"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="学校" prop="flowNo">
        <el-input
          v-model="queryParams.schoolName"
          placeholder="请输入学校"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="姓名" prop="flowNo">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入姓名"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="文化程度" prop="process">
        <el-select
          style="width: 100px"
          v-model="queryParams.eduId"
          placeholder="请选择"
          clearable
        >
          <el-option
            v-for="dict in edus"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          :disabled="selectedIds.length !== 1"
          @click="handleEdit"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="selectedIds.length < 0"
          @click="handleDelete"
          >删除</el-button
        >
      </el-col>
      <right-toolbar
        v-model:showSearch="showSearch"
        @queryTable="handleQuery"
      ></right-toolbar>
    </el-row>
    <el-table
      v-loading="loading"
      :data="tableList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="姓名" width="100" align="center" prop="name" />
      <el-table-column
        label="籍贯"
        width="100"
        align="center"
        prop="nativePlace"
      />
      <el-table-column label="性别" width="55" align="center" prop="gender">
        <template #default="scope">
          <dict-tag :options="sys_user_sex" :value="scope.row.gender" />
        </template>
      </el-table-column>
      <el-table-column label="岗位" align="center" prop="position" />
      <el-table-column label="学历" width="60" align="center" prop="eduId">
        <template #default="scope">
          <dict-tag :options="edus" :value="scope.row.eduId" />
        </template>
      </el-table-column>
      <el-table-column label="学校" align="center" prop="schoolName" />
      <el-table-column label="电话" align="center" prop="phoneNumber" />
      <el-table-column label="出生日期" align="center" prop="birthDate">
        <template #default="scope">
          <span>{{ parseTime(scope.row.birthDate, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="婚否"
        width="58"
        align="center"
        prop="isMarriedId"
      >
        <template #default="scope">
          <el-tag :type="scope.row.isMarriedId === 'Y' ? 'primary' : 'danger'">
            {{ scope.row.isMarriedId == "Y" ? "男" : "女" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="图片" align="left" prop="attachments" width="350">
        <template #default="scope">
          <template v-if="scope.row.attachments.length">
            <el-image
              v-for="(item, index) in scope.row.attachments"
              :preview-teleported="true"
              :key="index"
              :src="item"
              :initial-index="index"
              style="width: 50px; height: 50px"
              class="imageClass"
              fit="contain"
              :preview-src-list="scope.row.attachments"
              :hide-on-click-modal="true"
              infinite
            />
          </template>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template #default="scope">
          <el-button
            link
            type="primary"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            >修改</el-button
          >
          <!--<el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" >删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="handleGetTableList"
    />
    <!-- 添加或修改盘点对话框 -->
    <el-dialog
      :title="dialogDialog"
      v-model="openDialog"
      width="450px"
      append-to-body
      draggable
      center
      @open="dialogOpen"
      @close="dialogClose"
    >
      <el-form
        ref="talentRef"
        :model="talentInfoForm"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="talentInfoForm.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="籍贯" prop="nativePlace">
          <el-input
            v-model="talentInfoForm.nativePlace"
            placeholder="请输入籍贯"
          />
        </el-form-item>
        <el-form-item label="职位" prop="position">
          <el-input
            v-model="talentInfoForm.position"
            placeholder="请输入职位"
          />
        </el-form-item>
        <el-form-item label="联系电话" prop="phoneNumber">
          <el-input
            v-model="talentInfoForm.phoneNumber"
            placeholder="请输入联系电话"
          />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select
            v-model="talentInfoForm.gender"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in sys_user_sex"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="婚否" prop="isMarriedId">
          <el-select v-model="talentInfoForm.isMarriedId">
            <el-option
              v-for="item in sys_yes_no"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="文化程度" prop="eduId">
          <el-select
            v-model="talentInfoForm.eduId"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="dict in edus"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="毕业学校" prop="schoolName">
          <el-input
            v-model="talentInfoForm.schoolName"
            placeholder="请输入毕业学校"
          />
        </el-form-item>
        <el-form-item label="出生日期" prop="birthDate">
          <el-date-picker
            style="width: 100%"
            v-model="talentInfoForm.birthDate"
            value-format="YYYY-MM-DD HH:mm:ss"
            type="date"
            placeholder="请选择出生日期"
          />
        </el-form-item>

        <el-form-item label="图片附件" prop="imgPaths">
          <el-input
            style="display: none"
            v-model="talentInfoForm.imgPaths"
            placeholder="选择"
            disable
          />
          <el-upload
            ref="uploadRef"
            class="uploader"
            :auto-upload="false"
            multiple
            :limit="8"
            :drag="false"
            accept=".png,.jpg,.bmp,.jpeg"
            list-type="picture-card"
            :http-request="uploadImg"
            :file-list="uploadFileList"
            :on-success="uploadSuccess"
            :on-error="uploadError"
            :on-preview="handlePictureCardPreview"
            :before-upload="beforeUpload"
            :on-exceed="handleMoreFiles"
            :on-change="uploadChange"
            :on-remove="handleRemove"
          >
            <i class="el-icon-plus">
              <img class="puls-icon" src="../../../assets/icons/svg/add1.svg" />
            </i>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="isSubLoading" type="primary" @click="submitForm">
            确 定
          </el-button>
          <el-button :loading="isSubLoading" @click="formCancel">
            取 消
          </el-button>
        </div>
      </template>
      <el-dialog v-model="dialogVisible" append-to-body>
        <img width="100%" :src="dialogImageUrl" />
      </el-dialog>
    </el-dialog>
  </div>
</template>
<script setup name="TalentOperation">
import { nextTick, reactive, ref } from "vue";
import {
  getListApi,
  delByIdsApi,
  addTalentInfoApi,
  uploadFileApi,
  getTalentInfoApi,
  editTalentInfoApi,
} from "@/api/tk_custom/talentApi";
import { useDict } from "@/utils/dict";
import modal from "@/plugins/modal";
import { status } from "nprogress";

const loading = ref(false);
const { edu: edus } = useDict("edu");
const { sys_yes_no } = useDict("sys_yes_no");
const { sys_user_sex } = useDict("sys_user_sex");
const queryRef = ref(null);
const proxyPath = ref([import.meta.env.VITE_APP_BASE_API]);
const showSearch = ref(true);

const isSubLoading = ref(false);
const total = ref(0);

const selectedIds = ref([]);

const single = ref(true);
const multiple = ref(true);

// 表单参数
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  name: undefined,
  position: undefined,
  eduId: undefined,
  schoolName: undefined,
});

const tableList = ref([]);

const openDialog = ref(false);
const dialogDialog = ref("添加人员信息");

const talentInfoForm = reactive({
  id: 0,
  name: "",
  gender: "",
  eduId: "",
  birthDate: "",
  isMarriedId: "",
  position: "",
  phoneNumber: "",
  schoolName: "",
  nativePlace: "",
  attachments: "",
});

// 执行查询
function handleQuery() {
  handleTalentList();
}

async function handleTalentList() {
  const res = await getListApi(queryParams);
  const { rows, total: t } = res;
  tableList.value = rows;
  tableList.value.forEach((item) => {
    item.attachments = item.attachments ? item.attachments.split(",") : [];
  });
  total.value = t;
}

// 重置查询
function resetQuery() {
  // this.queryRef.value.resetFields();
  resetQueryData();
  handleQuery();
}

function handleAdd() {
  openDialog.value = true;
  isEdit.value = false;
}

async function handleEdit() {
  const id = selectedIds.value[0];
  if (!id) return;
  talentInfoForm.id = id;
  const { data: talentInfo } = await getTalentInfoApi(id);
  isEdit.value = true;
  dialogDialog.value = "修改人员信息";
  setTalentInfoForm(talentInfo);
  openDialog.value = true;
}

async function handleUpdate(record) {
  if (!record) return;
  const { data: talentInfo } = await getTalentInfoApi(record.id);
  talentInfoForm.id = record.id;
  isEdit.value = true;
  dialogDialog.value = "修改人员信息";
  setTalentInfoForm(talentInfo);
  openDialog.value = true;
}

function setTalentInfoForm(talentInfo) {
  talentInfoForm.id = talentInfo.id;
  talentInfoForm.name = talentInfo.name;
  talentInfoForm.gender = talentInfo.gender + "";
  talentInfoForm.eduId = talentInfo.eduId;
  talentInfoForm.birthDate = talentInfo.birthDate;
  talentInfoForm.isMarriedId = talentInfo.isMarriedId;
  talentInfoForm.position = talentInfo.position;
  talentInfoForm.phoneNumber = talentInfo.phoneNumber;
  talentInfoForm.schoolName = talentInfo.schoolName;
  talentInfoForm.nativePlace = talentInfo.nativePlace;
  const imagesPaths = talentInfo.attachments
    ? talentInfo.attachments.split(",")
    : [];
  talentInfoForm.attachments = imagesPaths;
  // "/dev-api/profile/talentPic_zip/2025/11/12/MIUI02_20251112120254A001.jpg,/dev-api/profile/talentPic_zip/2025/11/12/MIUI03_20251112120257A002.jpg"
  uploadFileList.value = imagesPaths.map((item) => {
    return {
      name: item.split("/").pop(),
      url: item,
      uid: generateUUIDWithoutDash(),
      status: "success",
    };
  });
}

function handleDelete() {
  modal.confirm("你确定要删除吗？").then(function () {
    delByIdsApi(selectedIds.value);
  });
}
function handleGetTableList() {
  handleQuery();
}

function handleSelectionChange(records) {
  selectedIds.value = records.map((item) => item.id);
  single.value = selectedIds.value.length !== 1;
  multiple.value = selectedIds.value.length < 0;
}

function resetQueryData() {
  queryParams.name = undefined;
  queryParams.position = undefined;
  queryParams.schoolName = undefined;
  queryParams.eduId = undefined;
}

const talentRef = ref(null);
const rules = {
  name: [
    { required: true, message: "请输入姓名", trigger: ["change", "blur"] },
  ],
  position: [
    { required: true, message: "请输入职位", trigger: ["change", "blur"] },
  ],
  phoneNumber: [
    { required: true, message: "请输入联系电话", trigger: ["change", "blur"] },
  ],
  gender: [
    { required: true, message: "请选择性别", trigger: ["change", "blur"] },
  ],
  isMarriedId: [
    { required: true, message: "请选择婚否", trigger: ["change", "blur"] },
  ],
  eduId: [
    { required: true, message: "请选择文化程度", trigger: ["change", "blur"] },
  ],
  schoolName: [
    { required: true, message: "请输入毕业学校", trigger: ["change", "blur"] },
  ],
  birthDate: [
    { required: true, message: "请选择出生日期", trigger: ["change", "blur"] },
  ],
  nativePlace: [
    { required: true, message: "请输入籍贯", trigger: ["change", "blur"] },
  ],
};
const isEdit = ref(false);

function dialogOpen() {}

function dialogClose() {
  openDialog.value = false;
  talentRef.value.resetFields();
  uploadFileList.value = [];
  talentInfoForm.id = 0;
}

function formCancel() {
  dialogClose();
}

const uploadRef = ref(null);
const uploadArr = ref([]); // 要上传的图片数据
const uploadFileList = ref([]); // 修改时回显图片列表

function uploadChange(file, fileList) {
  uploadArr.value.push({
    name: `${Date.now()}-${file.name}`,
    file: file.raw,
    uid: file.uid,
    url: file.url,
    status: "ready",
  });
}

function handleRemove(file, fileList) {
  if (file.value?.status === "success") {
    uploadFileList.value = uploadFileList.value.filter(
      (item) => file.uid !== item.uid
    );
  }
  if (file.value?.status === "ready") {
    uploadArr.value = uploadArr.value.filter((item) => file.uid !== item.uid);
  }
}

const dialogVisible = ref(false);
const dialogImageUrl = ref("");
function handlePictureCardPreview(file) {
  dialogImageUrl.value = file.url;
  dialogVisible.value = true;
}

function beforeUpload(file) {
  isUploading.value = true;
}

function uploadSuccess(response, file, fileList) {
  isUploading.value = false;
  if (response.code != 200) return;
  const filename = response.msg;
  form.value.imgPaths.push(proxyPath.value + filename);
}

function uploadError(err, file, fileList) {
  isUploading.value = false;
}

function uploadImg(content) {
  const formData = new FormData();
  formData.append("file", content.file);
  const fileName = content.file.name;
}

function handleMoreFiles(files, fileList) {
  proxy.$modal.msgError("最大只允许6张图片！请重新选择！");
}

async function uploadImages() {
  if (!uploadArr.value.length) return [];
  const formData = new FormData();
  uploadArr.value.forEach((item) => {
    formData.append("imageFiles", item.file);
  });
  const res = await uploadFileApi(formData);
  const { data, code, msg } = res;
  let imagePath = [];
  if (code == 200) {
    imagePath = data.map((item) => proxyPath.value + item);
  }
  uploadArr.value = [];
  return imagePath;
}

async function submitForm() {
  talentRef.value.validate(async (valid) => {
    if (valid) {
      try {
        isSubLoading.value = true;
        const imagePathArr = await uploadImages();
        if (uploadFileList.value.length > 0) {
          uploadFileList.value.forEach((item) => {
            imagePathArr.push(item.url);
          });
        }
        talentInfoForm.attachments = imagePathArr.join(",");
        if (talentInfoForm.id && isEdit.value) {
          const res = await editTalentInfoApi(talentInfoForm);
          const { data, code } = res;
          if (code === 200) {
            modal.msgSuccess("修改成功！");
            dialogClose();
            queryParams.pageNum = 1;
            resetQuery();
          } else {
            modal.msgError("修改失败！");
          }
        } else {
          const res = await addTalentInfoApi(talentInfoForm);
          const { data, code } = res;
          if (code === 200 && data.id) {
            modal.msgSuccess("添加成功！");
            dialogClose();
            queryParams.pageNum = 1;
            resetQuery();
          } else {
            modal.msgError("添加失败！");
          }
        }
      } catch (error) {
        console.log(error.message);
      } finally {
        isSubLoading.value = false;
      }
    }
  });
}

function generateUUIDWithoutDash() {
  return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

onMounted(() => {
  nextTick(() => {
    handleQuery();
  });
});
</script>
<style lang="scss" scoped>
.uploader {
  :deep(.el-upload--picture-card) {
    width: 60px;
    height: 60px;
  }
  :deep(.el-upload-list__item) {
    width: 60px;
    height: 60px;
  }
  .el-icon-plus {
    width: 60px;
    height: 60px;
  }
}

.puls-icon {
  width: 60px;
  height: 60px;
}
.imageClass {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
.imageClass + .imageClass {
  margin-left: 2px;
}
</style>

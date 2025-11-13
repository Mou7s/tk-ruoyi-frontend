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

      <el-form-item label="姓名" prop="flowNo">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入姓名"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="学历" prop="process">
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
      <el-form-item label="学校" prop="flowNo">
        <el-input
          v-model="queryParams.schoolName"
          placeholder="请输入学校"
          clearable
          @keyup.enter="handleQuery"
        />
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
      <el-table-column label="性别" width="60" align="center" prop="gender">
        <template #default="scope">
          <el-tag :type="scope.row.gender === '0' ? 'primary' : 'danger'">
            {{ scope.row.gender == "0" ? "男" : "女" }}
          </el-tag>
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
            {{ scope.row.isMarriedId == "Y" ? "是" : "否" }}
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
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination
      v-show="total > 0"
      :page-sizes="[10, 20, 30, 50, 100, 200, 300]"
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
        <el-form-item label="学历" prop="eduId">
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
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="talentInfoForm.remark"
            style="width: 100%"
            :rows="2"
            type="textarea"
            placeholder="请输入备注"
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
import { nextTick, reactive, ref, onMounted } from "vue";
import {
  getListApi,        // 获取人才列表API
  delByIdsApi,       // 批量删除人才API
  addTalentInfoApi,  // 新增人才API
  uploadFileApi,     // 文件上传API
  getTalentInfoApi,  // 获取人才详情API
  editTalentInfoApi, // 修改人才API
} from "@/api/tk_custom/talentApi";
import { useDict } from "@/utils/dict"; // 字典工具
import modal from "@/plugins/modal";     // 模态框工具
import { status } from "nprogress";      // 进度条

// 加载状态
const loading = ref(false);
// 获取学历字典数据
const { edu: edus } = useDict("edu");
// 获取是否字典数据
const { sys_yes_no } = useDict("sys_yes_no");
// 获取性别字典数据
const { sys_user_sex } = useDict("sys_user_sex");
// 查询表单引用
const queryRef = ref(null);
// API代理路径
const proxyPath = ref([import.meta.env.VITE_APP_BASE_API]);
// 是否显示搜索表单
const showSearch = ref(true);
// 提交表单加载状态
const isSubLoading = ref(false);
// 总记录数
const total = ref(0);
// 选中的记录ID数组
const selectedIds = ref([]);
// 是否单选
const single = ref(true);
// 是否多选
const multiple = ref(true);

// 上传状态
const isUploading = ref(false);

// 表单参数
const queryParams = reactive({
  pageNum: 1,        // 当前页码
  pageSize: 10,      // 每页条数
  name: undefined,   // 姓名
  position: undefined, // 职位
  eduId: undefined,  // 学历ID
  schoolName: undefined, // 学校名称
});

// 表格数据列表
const tableList = ref([]);

// 对话框显示状态
const openDialog = ref(false);
// 对话框标题
const dialogDialog = ref("添加人员信息");

// 人才信息表单
const talentInfoForm = reactive({
  id: 0,              // 主键ID
  name: "",           // 姓名
  gender: "",         // 性别
  eduId: "",          // 学历ID
  birthDate: "",      // 出生日期
  isMarriedId: "",    // 婚否
  position: "",       // 职位
  phoneNumber: "",    // 联系电话
  schoolName: "",     // 毕业学校
  nativePlace: "",    // 籍贯
  attachments: "",    // 附件路径
  remark: "",         // 备注
  imgPaths: [],       // 图片路径数组
});

// 执行查询
function handleQuery() {
  handleTalentList();
}

/**
 * 获取人才列表数据
 */
async function handleTalentList() {
  const res = await getListApi(queryParams);
  const { rows, total: t } = res;
  tableList.value = rows;
  // 将附件路径字符串转换为数组
  tableList.value.forEach((item) => {
    item.attachments = item.attachments ? item.attachments.split(",") : [];
  });
  total.value = t;
}

// 重置查询
function resetQuery() {
  resetQueryData();
  handleQuery();
}

/**
 * 处理新增按钮点击事件
 */
function handleAdd() {
  openDialog.value = true;
  isEdit.value = false;
}

/**
 * 处理编辑按钮点击事件（批量操作）
 */
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

/**
 * 处理表格行编辑按钮点击事件
 * @param {Object} record - 当前行数据
 */
async function handleUpdate(record) {
  if (!record) return;
  const { data: talentInfo } = await getTalentInfoApi(record.id);
  talentInfoForm.id = record.id;
  isEdit.value = true;
  dialogDialog.value = "修改人员信息";
  setTalentInfoForm(talentInfo);
  openDialog.value = true;
}

/**
 * 设置人才信息表单数据
 * @param {Object} talentInfo - 人才信息数据
 */
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
  talentInfoForm.remark = talentInfo.remark;
  
  // 处理附件路径
  const imagesPaths = talentInfo.attachments
    ? talentInfo.attachments.split(",")
    : [];
  talentInfoForm.attachments = imagesPaths;
  
  // 设置上传文件列表
  uploadFileList.value = imagesPaths.map((item) => {
    return {
      name: item.split("/").pop(),
      url: item,
      uid: generateUUIDWithoutDash(),
      status: "success",
    };
  });
}

/**
 * 处理删除按钮点击事件
 */
function handleDelete() {
  modal.confirm("你确定要删除吗？").then(function () {
    delByIdsApi(selectedIds.value);
  });
}

/**
 * 处理分页变化事件
 */
function handleGetTableList() {
  handleQuery();
}

/**
 * 处理表格选择变化事件
 * @param {Array} records - 选中的记录数组
 */
function handleSelectionChange(records) {
  selectedIds.value = records.map((item) => item.id);
  single.value = selectedIds.value.length !== 1;
  multiple.value = selectedIds.value.length < 0;
}

/**
 * 重置查询参数
 */
function resetQueryData() {
  queryParams.name = undefined;
  queryParams.position = undefined;
  queryParams.schoolName = undefined;
  queryParams.eduId = undefined;
}

// 人才表单引用
const talentRef = ref(null);
// 表单验证规则
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
    { required: true, message: "请选择学历", trigger: ["change", "blur"] },
  ],
  birthDate: [
    { required: true, message: "请选择出生日期", trigger: ["change", "blur"] },
  ],
  nativePlace: [
    { required: true, message: "请输入籍贯", trigger: ["change", "blur"] },
  ],
};
// 是否为编辑模式
const isEdit = ref(false);

/**
 * 对话框打开事件
 */
function dialogOpen() {}

/**
 * 对话框关闭事件
 */
function dialogClose() {
  openDialog.value = false;
  talentRef.value.resetFields();
  uploadFileList.value = [];
  talentInfoForm.id = 0;
}

/**
 * 表单取消事件
 */
function formCancel() {
  dialogClose();
}

// 上传组件引用
const uploadRef = ref(null);
// 要上传的图片数据数组
const uploadArr = ref([]); 
// 修改时回显图片列表
const uploadFileList = ref([]); 

/**
 * 上传文件变化事件
 * @param {Object} file - 当前文件
 * @param {Array} fileList - 文件列表
 */
function uploadChange(file, fileList) {
  uploadArr.value.push({
    name: `${Date.now()}-${file.name}`,
    file: file.raw,
    uid: file.uid,
    url: file.url,
    status: "ready",
  });
}

/**
 * 移除文件事件
 * @param {Object} file - 要移除的文件
 * @param {Array} fileList - 文件列表
 */
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

// 预览对话框显示状态
const dialogVisible = ref(false);
// 预览图片路径
const dialogImageUrl = ref("");

/**
 * 预览图片事件
 * @param {Object} file - 要预览的文件
 */
function handlePictureCardPreview(file) {
  dialogImageUrl.value = file.url;
  dialogVisible.value = true;
}

/**
 * 上传前事件
 * @param {Object} file - 要上传的文件
 */
function beforeUpload(file) {
  isUploading.value = true;
}

/**
 * 上传成功事件
 * @param {Object} response - 上传响应
 * @param {Object} file - 上传文件
 * @param {Array} fileList - 文件列表
 */
function uploadSuccess(response, file, fileList) {
  isUploading.value = false;
  if (response.code != 200) return;
  const filename = response.msg;
  talentInfoForm.imgPaths.push(proxyPath.value + filename);
}

/**
 * 上传失败事件
 * @param {Object} err - 错误信息
 * @param {Object} file - 上传文件
 * @param {Array} fileList - 文件列表
 */
function uploadError(err, file, fileList) {
  isUploading.value = false;
}

/**
 * 自定义上传方法
 * @param {Object} content - 上传内容
 */
function uploadImg(content) {
  const formData = new FormData();
  formData.append("file", content.file);
  const fileName = content.file.name;
}

/**
 * 文件超出限制事件
 * @param {Array} files - 超出的文件数组
 * @param {Array} fileList - 文件列表
 */
function handleMoreFiles(files, fileList) {
  modal.msgError("最大只允许6张图片！请重新选择！");
}

/**
 * 上传图片
 * @returns {Array} - 上传后的图片路径数组
 */
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

/**
 * 提交表单
 */
async function submitForm() {
  talentRef.value.validate(async (valid) => {
    if (valid) {
      try {
        isSubLoading.value = true;
        
        // 上传图片
        const imagePathArr = await uploadImages();
        
        // 添加已存在的图片路径
        if (uploadFileList.value.length > 0) {
          uploadFileList.value.forEach((item) => {
            imagePathArr.push(item.url);
          });
        }
        
        // 设置附件路径
        talentInfoForm.attachments = imagePathArr.join(",");
        
        if (talentInfoForm.id && isEdit.value) {
          // 修改人才信息
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
          // 新增人才信息
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

/**
 * 生成UUID（无横线）
 * @returns {string} - UUID字符串
 */
function generateUUIDWithoutDash() {
  return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * 组件挂载后执行
 */
onMounted(() => {
  nextTick(() => {
    handleQuery(); // 加载数据
  });
});
</script>
<style lang="scss" scoped>
// 自定义上传组件样式
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

// 加号图标样式
.puls-icon {
  width: 60px;
  height: 60px;
}

// 图片样式
.imageClass {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

// 图片间距
.imageClass + .imageClass {
  margin-left: 2px;
}
</style>

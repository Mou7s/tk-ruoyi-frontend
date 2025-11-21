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
        <el-button
          v-hasPermi="['tk_custom:talent_pool:add']"
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['tk_custom:talent_pool:edit']"
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
          v-hasPermi="['tk_custom:talent_pool:del']"
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
      stripe
      v-loading="loading"
      :data="tableList"
      @selection-change="handleSelectionChange"
      style="width: 100%"
      :max-height="tableHeight"
    >
      <el-table-column fixed type="selection" width="55" align="center" />
      <el-table-column
        fixed
        label="面试日期"
        width="95"
        align="center"
        prop="interviewTime"
      >
        <template #default="scope">
          <span>{{ parseTime(scope.row.interviewTime, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed
        show-overflow-tooltip
        label="姓名"
        width="100"
        align="center"
        prop="name"
      />
      <el-table-column
        label="籍贯"
        show-overflow-tooltip
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
      <el-table-column
        label="岗位"
        align="center"
        prop="position"
        min-width="120"
        show-overflow-tooltip
      />
      <el-table-column
        label="学历"
        width="60"
        align="center"
        prop="eduId"
        show-overflow-tooltip
      >
        <template #default="scope">
          <dict-tag :options="edus" :value="scope.row.eduId" />
        </template>
      </el-table-column>
      <el-table-column
        min-width="150"
        label="学校"
        align="center"
        prop="schoolName"
        show-overflow-tooltip
      />
      <el-table-column
        label="电话"
        width="120"
        align="center"
        prop="phoneNumber"
      />
      <el-table-column
        label="出生日期"
        width="100"
        align="center"
        prop="birthDate"
      >
        <template #default="scope">
          <span>{{ parseTime(scope.row.birthDate, "{y}-{m}-{d} ") }}</span>
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
      <el-table-column
        label="备注"
        min-width="100"
        align="center"
        prop="remark"
        show-overflow-tooltip
      />
      <el-table-column
        label="创建人"
        width="100"
        align="center"
        prop="creator"
        show-overflow-tooltip
      />
      <el-table-column
        label="创建日期"
        width="180"
        align="center"
        prop="createTime"
        show-overflow-tooltip
      >
        <template #default="scope">
          <span>
            {{ parseTime(scope.row.createTime, "{y}-{m}-{d} {h}:{i}:{s}") }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="修改人"
        width="100"
        align="center"
        prop="modifier"
        show-overflow-tooltip
      />
      <el-table-column
        label="更新日期"
        width="180"
        align="center"
        prop="updateTime"
        show-overflow-tooltip
      >
        <template #default="scope">
          <span>
            {{ parseTime(scope.row.updateTime, "{y}-{m}-{d} {h}:{i}:{s}") }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template #default="scope">
          <el-button
            v-hasPermi="['tk_custom:talent_pool:edit']"
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
      style="margin-top: 0px"
      v-show="total > 0"
      :page-sizes="[30, 50, 100, 200, 300]"
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
        <el-form-item label="面试日期" prop="interviewTime">
          <el-date-picker
            style="width: 100%"
            v-model="talentInfoForm.interviewTime"
            value-format="YYYY-MM-DD HH:mm:ss"
            type="date"
            placeholder="请选择面试日期"
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
            :limit="10"
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
  getListApi, // 获取人才列表API
  delByIdsApi, // 批量删除人才API
  addTalentInfoApi, // 新增人才API
  uploadFileApi, // 文件上传API
  getTalentInfoApi, // 获取人才详情API
  editTalentInfoApi, // 修改人才API
} from "@/api/tk_custom/talentApi";
import { useDict } from "@/utils/dict"; // 字典工具
import modal from "@/plugins/modal"; // 模态框工具

// 加载状态 - 表格数据加载时显示
const loading = ref(false);
// 获取学历字典数据 - 用于学历下拉选择
const { edu: edus } = useDict("edu");
// 获取是否字典数据 - 用于婚否等是/否选择
const { sys_yes_no } = useDict("sys_yes_no");
// 获取性别字典数据 - 用于性别选择
const { sys_user_sex } = useDict("sys_user_sex");
// 查询表单引用 - 用于重置查询表单
const queryRef = ref(null);
// API代理路径 - 文件上传时使用的API基础路径
const proxyPath = ref([import.meta.env.VITE_APP_BASE_API]);
// 是否显示搜索表单 - 控制搜索表单的显示与隐藏
const showSearch = ref(true);
// 提交表单加载状态 - 表单提交时显示加载动画
const isSubLoading = ref(false);
// 总记录数 - 表格数据总条数
const total = ref(0);
// 选中的记录ID数组 - 用于批量操作
const selectedIds = ref([]);
// 是否单选 - 控制修改按钮的禁用状态
const single = ref(true);
// 是否多选 - 控制删除按钮的禁用状态
const multiple = ref(true);

// 上传状态 - 文件上传过程中显示加载动画
const isUploading = ref(false);

// 表单参数 - 查询人才列表的条件
const queryParams = reactive({
  pageNum: 1, // 当前页码
  pageSize: 30, // 每页条数
  name: undefined, // 姓名 - 模糊查询
  position: undefined, // 职位 - 模糊查询
  eduId: undefined, // 学历ID - 精确查询
  schoolName: undefined, // 学校名称 - 模糊查询
});

// 表格数据列表 - 存储人才信息数据
const tableList = ref([]);

// 对话框显示状态 - 控制新增/修改对话框的显示与隐藏
const openDialog = ref(false);
// 对话框标题 - 根据新增/修改模式动态显示
const dialogDialog = ref("添加人员信息");

// 人才信息表单 - 新增/修改人才信息的表单数据
const talentInfoForm = reactive({
  id: 0, // 主键ID - 0表示新增
  name: "", // 姓名 - 必填
  gender: "", // 性别 - 必填，0表示男，1表示女
  eduId: "", // 学历ID - 必填，关联字典表
  birthDate: "", // 出生日期 - 必填，日期格式
  interviewTime: "", // 面试日期
  isMarriedId: "", // 婚否 - 必填，Y表示是，N表示否
  position: "", // 职位 - 必填
  phoneNumber: "", // 联系电话 - 必填
  schoolName: "", // 毕业学校 - 必填
  nativePlace: "", // 籍贯 - 必填
  attachments: "", // 附件路径 - 存储图片路径，逗号分隔
  remark: "", // 备注 - 可选
  imgPaths: [], // 图片路径数组 - 上传过程中临时存储图片路径
});

/**
 * 执行查询
 * 触发人才列表数据加载
 */
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

/**
 * 重置查询
 * 重置查询参数并重新加载数据
 */
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
  // 设置基本信息
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
  talentInfoForm.interviewTime = talnetInfo.interviewTime;

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

// 人才表单引用 - 用于表单验证和重置
const talentRef = ref(null);
// 表单验证规则 - 定义各字段的验证规则
const rules = {
  name: [
    { required: true, message: "请输入姓名", trigger: ["change", "blur"] },
  ],
  position: [
    { required: true, message: "请输入职位", trigger: ["change", "blur"] },
  ],
  phoneNumber: [
    { required: true, message: "请输入联系电话", trigger: ["change", "blur"] },
    {
      pattern: /^1[3-9]\d{9}$|^\d{3,4}-\d{7,8}$/,
      message: "请输入正确的电话号码格式(手机:11位数字/固话:区号-号码)",
      trigger: ["change", "blur"],
    },
  ],
  gender: [
    { required: true, message: "请选择性别", trigger: ["change", "blur"] },
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
// 是否为编辑模式 - true表示修改，false表示新增
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

// 上传组件引用 - 用于操作上传组件
const uploadRef = ref(null);
// 要上传的图片数据数组 - 存储待上传的图片信息
const uploadArr = ref([]);
// 修改时回显图片列表 - 存储已上传成功的图片信息
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

// 预览对话框显示状态 - 控制图片预览对话框的显示与隐藏
const dialogVisible = ref(false);
// 预览图片路径 - 存储当前预览的图片URL
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
 * 自定义上传方法（未使用）
 * @param {Object} content - 上传内容
 * @description 该函数目前未被调用，可能是预留的自定义上传逻辑
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
  // 如果没有待上传图片，直接返回空数组
  if (!uploadArr.value.length) return [];

  // 创建FormData对象，用于上传文件
  const formData = new FormData();
  uploadArr.value.forEach((item) => {
    formData.append("imageFiles", item.file);
  });

  // 调用上传API
  const res = await uploadFileApi(formData);
  const { data, code, msg } = res;
  let imagePath = [];

  // 上传成功，处理返回的图片路径
  if (code == 200) {
    imagePath = data.map((item) => proxyPath.value + item);
  }

  // 清空待上传图片数组
  uploadArr.value = [];
  return imagePath;
}

/**
 * 提交表单
 */
async function submitForm() {
  // 表单验证
  talentRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // 设置提交加载状态
        isSubLoading.value = true;

        // 上传新选择的图片
        const imagePathArr = await uploadImages();

        // 添加已存在的图片路径（修改时使用）
        if (uploadFileList.value.length > 0) {
          uploadFileList.value.forEach((item) => {
            imagePathArr.push(item.url);
          });
        }

        // 将图片路径数组转换为逗号分隔的字符串
        talentInfoForm.attachments = imagePathArr.join(",");

        // 根据是否为编辑模式执行不同的操作
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
        // 重置提交加载状态
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

// 表格高度 - 动态计算表格最大高度
const tableHeight = ref(500);

/**
 * 计算表格高度
 * 确保表格在页面中有足够空间且不导致主页面滚动
 */
function calculateTableHeight(othHeight = 260) {
  // 获取视口高度
  const viewportHeight = window.innerHeight;
  // 减去页面其他元素占用的高度（导航栏、搜索栏、工具栏等）
  const otherElementsHeight = othHeight; // 根据实际情况调整
  tableHeight.value = viewportHeight - otherElementsHeight;
}

/**
 * 监听显示搜索栏变化
 */
watch(
  () => showSearch.value,
  (val) => {
    if (val) {
      calculateTableHeight();
    } else {
      calculateTableHeight(215);
    }
  }
);
/**
 * 组件挂载后执行
 */
onMounted(() => {
  calculateTableHeight();
  // 监听窗口大小变化，动态调整表格高度
  window.addEventListener("resize", calculateTableHeight);
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

// 表格容器样式
.table-container {
  height: 100%;
  overflow: hidden;
}

// 确保表格内容超出时只在表格内部显示滚动条
:deep(.el-table__body-wrapper) {
  overflow-y: auto;
}
</style>

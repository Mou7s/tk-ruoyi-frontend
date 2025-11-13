<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryRef"
      :inline="true"
      v-show="showSearch"
      label-width="90px"
    >
      <el-form-item label="流程单号" prop="flowno">
        <el-input
          v-model="queryParams.flowno"
          placeholder="请输入流程单号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="物料名称" prop="materialname">
        <el-input
          v-model="queryParams.materialname"
          placeholder="请输入物料名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="规格型号" prop="specification">
        <el-input
          v-model="queryParams.specification"
          placeholder="请输入规格型号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="机台号" prop="mechineName">
        <el-input
          v-model="queryParams.mechineName"
          placeholder="请输入机台号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="芯片代码" prop="xpdm">
        <el-input
          v-model="queryParams.xpdm"
          placeholder="请输入芯片代码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="芯片批号" prop="xpph">
        <el-input
          v-model="queryParams.xpph"
          placeholder="请输入芯片批号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="客户代码" prop="khdm">
        <el-input
          v-model="queryParams.khdm"
          placeholder="请输入客户代码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="操作/技术员" prop="handler">
        <el-input
          v-model="queryParams.handler"
          placeholder="请输入操作/技术员"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建人" prop="creator">
        <el-input
          v-model="queryParams.creator"
          placeholder="请输入创建人"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="最后修改人" prop="updater">
        <el-input
          v-model="queryParams.updater"
          placeholder="请输入最后修改人"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>

      <el-form-item label="创建时间" style="width: 308px">
        <el-date-picker
          v-model="daterangeCreatedate"
          value-format="YYYY-MM-DD"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="修改时间" style="width: 308px">
        <el-date-picker
          v-model="daterangeModifydate"
          value-format="YYYY-MM-DD"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="判定结果" prop="result">
        <el-select
          v-model="queryParams.result"
          placeholder="请选择"
          style="width: 100px"
        >
          <el-option
            v-for="dict in testResult"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="试验数量" prop="testNumber">
        <el-input
          v-model="queryParams.testNumber"
          placeholder="请输入试验数量"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="试验时机" prop="testCharge">
        <el-input
          v-model="queryParams.testCharge"
          placeholder="请输入试验时机"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
        <!--<el-col :span="1.5">-->
        <!--<el-button-->
        <!--type="danger"-->
        <!--plain-->
        <!--icon="Download"-->
        <!--@click="handleExport"-->
        <!--v-hasPermi="['tk_custom:pic:export']"-->
        <!--&gt;按搜索条件导出-->
        <!--</el-button>-->
        <!--</el-col>-->
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['tk_custom:pic:add']"
          >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['tk_custom:pic:edit']"
          >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['tk_custom:pic:remove']"
          >删除
        </el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          :disabled="multiple"
          @click="handleSelectExport"
          v-hasPermi="['tk_custom:pic:export']"
          >按选中导出
        </el-button>
      </el-col>
      <right-toolbar
        v-model:showSearch="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      id="mytable"
      ref="mytable"
      @row-click="clickRow"
      v-loading="loading"
      :data="picList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="26" align="center" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createdate"
        width="135"
      >
        <template #default="scope">
          <span>{{
            parseTime(scope.row.createdate, "{y}-{m}-{d} {h}:{i}")
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="流程单号"
        width="95"
        align="center"
        prop="flowno"
      />
      <el-table-column
        label="成品型号"
        width="150"
        align="center"
        prop="materialname"
      />
      <el-table-column
        label="封装"
        width="100"
        align="center"
        prop="specification"
      />
      <el-table-column
        label="WB机台号"
        width="100"
        align="center"
        prop="mechineName"
      />
      <el-table-column
        label="弹坑图片"
        width="350"
        class-name="my-cell"
        align="left"
        prop="imgPaths"
      >
        <template #default="scope">
          <div
            v-for="(item, index) in scope.row.imgPaths"
            style="border: 1px solid darkgrey"
          >
            <el-image
              preview-teleported="true"
              style="width: 50px; height: 50px"
              fit="contain"
              :initial-index="index"
              :src="item"
              :preview-src-list="scope.row.imgSrcPaths"
              hide-on-click-modal="true"
            >
            </el-image>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="试验数量"
        width="80"
        align="center"
        prop="testNumber"
      />
      <el-table-column
        label="试验时机"
        align="center"
        width="100"
        prop="testCharge"
      >
        <template #default="scope">
          <dict-tag :options="pinzhi_sj" :value="scope.row.testCharge" />
        </template>
      </el-table-column>
      <el-table-column label="判定结果" align="center" prop="result" />
      <el-table-column
        label="芯片代码"
        width="100"
        align="center"
        prop="xpdm"
      />
      <el-table-column
        label="芯片批号"
        width="100"
        align="center"
        prop="xpph"
      />
      <el-table-column
        label="客户代码"
        width="100"
        align="center"
        prop="khdm"
      />
      <el-table-column
        label="操作/技术员"
        width="100"
        align="center"
        prop="handler"
      />
      <el-table-column label="创建人" align="center" prop="creator" />
      <el-table-column label="修改人" align="center" prop="updater" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column
        label="修改时间"
        align="center"
        prop="modifydate"
        width="135"
      >
        <template #default="scope">
          <span>{{
            parseTime(scope.row.modifydate, "{y}-{m}-{d} {h}:{i}")
          }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改弹坑图片对话框 -->
    <el-dialog
      :title="title"
      v-model="open"
      @open="dialogOpen"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="900px"
      style="min-height: 350px; max-height: 80vh; overflow: scroll"
    >
      <el-form ref="picRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item>
          <el-form-item label="流程单号" prop="flowno">
            <el-input
              ref="dialog_flowno_input"
              v-model="form.flowno"
              @keyup="getFlowInfo"
              placeholder="请扫码/输入流程单号"
            />
          </el-form-item>
          <el-form-item label="机台号" prop="mechineName">
            <el-autocomplete
              class="inline-input"
              v-model="form.mechineName"
              :fetch-suggestions="handlerSearch1"
              placeholder="请输入内容"
            ></el-autocomplete>
          </el-form-item>
        </el-form-item>
        <el-form-item>
          <el-form-item label="操作/技术员" prop="handler">
            <el-autocomplete
              class="inline-input"
              v-model="form.handler"
              :fetch-suggestions="handlerSearch"
              placeholder="请输入内容"
            ></el-autocomplete>
          </el-form-item>
          <el-form-item label="判定结果" prop="result">
            <el-select
              v-model="form.result"
              placeholder="请选择"
              style="width: 100px"
            >
              <el-option
                v-for="dict in testResult"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-form-item>
        <el-form-item>
          <el-form-item label="试验数量" prop="testNumber">
            <el-input
              type="number"
              v-model="form.testNumber"
              placeholder="手动输入/自动赋值"
            />
          </el-form-item>
          <el-form-item label="试验时机" prop="testCharge">
            <el-select
              v-model="form.testCharge"
              placeholder="请选择"
              style="width: 150px"
            >
              <el-option
                v-for="dict in pinzhi_sj"
                :key="dict.label"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-form-item>
        <el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" placeholder="" type="textarea" />
          </el-form-item>
          <el-form-item label="客户代码" prop="khdm">
            <el-input
              v-model="form.khdm"
              placeholder="自动赋值"
              :disabled="true"
              readonly
            />
          </el-form-item>
        </el-form-item>
        <el-form-item>
          <el-form-item label="成品型号" prop="materialname">
            <el-input
              v-model="form.materialname"
              placeholder="自动赋值"
              :disabled="true"
              readonly
            />
          </el-form-item>
          <el-form-item label="封装" prop="specification">
            <el-input
              v-model="form.specification"
              placeholder="自动赋值"
              :disabled="true"
              readonly
            />
          </el-form-item>
        </el-form-item>
        <el-form-item>
          <el-form-item label="芯片代码" prop="xpdm">
            <el-input
              v-model="form.xpdm"
              placeholder="自动赋值"
              :disabled="true"
              readonly
            />
          </el-form-item>
          <el-form-item label="芯片批号" prop="xpph">
            <el-input
              v-model="form.xpph"
              placeholder="自动赋值"
              :disabled="true"
              readonly
            />
          </el-form-item>
        </el-form-item>

        <el-form-item label="图片" prop="imgPaths">
          <el-input
            style="display: none"
            v-model="form.imgPaths"
            placeholder="请输入图片"
            disable
          />
          <el-upload
            ref="upload"
            :auto-upload="false"
            multiple
            limit="6"
            drag="true"
            accept=".png,.jpg,.bmp,.jpeg"
            list-type="picture-card"
            :http-request="uploadImg"
            :on-success="uploadSuccess"
            :on-error="uploadError"
            :on-preview="handlePictureCardPreview"
            :file-list="uploadFileList"
            :before-upload="beforeUpload"
            :on-exceed="handleMoreFiles"
            :on-change="uploadChange"
            :on-remove="handleRemove"
          >
            <i class="el-icon-plus"
              ><img
                height="100%"
                width="100%"
                src="../../../assets/icons/svg/add1.svg"
            /></i>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <div class="dialog-footer">
            <div
              v-show="isUploading"
              style="font-size: 20px; font-weight: bold; color: yellowgreen"
            >
              正在上传图片，请稍后。。。
            </div>
            <div v-show="!isUploading">
              <el-button type="primary" @click="uploadImgToServer"
                >保 存</el-button
              >
              <el-button @click="cancel">取 消</el-button>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <el-dialog v-model="dialogVisible" append-to-body>
        <img width="100%" :src="dialogImageUrl" alt="" />
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script setup name="Pic">
import {
  delPicFile,
  uploadImages,
  getHandlerList,
  getMechineList,
  getFlowBillInfo,
  listPic,
  getPic,
  delPic,
  addPic,
  updatePic,
} from "@/api/tk_custom/pic";
import Cookies from "js-cookie";
const { proxy } = getCurrentInstance();
const { pinzhi_num } = proxy.useDict("pinzhi_num");
const { pinzhi_sj } = proxy.useDict("pinzhi_sj");
const picList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(false);
const ids = ref([]);
const testResult = ref([
  { label: "OK", value: "OK" },
  { label: "NG", value: "NG" },
]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const dialogImageUrl = ref("");
const dialogVisible = ref(false);
const isUploading = ref(false);
const uploadFileList = ref([]);
const uploadArr = ref([]);
const daterangeCreatedate = ref([]);
const daterangeModifydate = ref([]);
const restaurants = ref([]);
const restaurants1 = ref([]);
const proxyPath = ref([import.meta.env.VITE_APP_BASE_API]);
const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    flowno: null,
    materialno: null,
    materialname: null,
    specification: null,
    imgPaths: null,
    mechineName: null,
    createdate: null,
    modifydate: null,
    xpdm: null,
    xpph: null,
    khdm: null,
    handler: null,
    creator: null,
    updater: null,
    result: null,
    testNumber: null,
    testCharge: null,
  },
  rules: {
    flowno: [{ required: true, message: "流程单号不能为空", trigger: "blur" }],
    mechineName: [
      { required: true, message: "机台号不能为空", trigger: "blur" },
    ],
    materialno: [
      { required: true, message: "物料编码不能为空", trigger: "blur" },
    ],
    result: [{ required: true, message: "判定结果不能为空", trigger: "blur" }],
    handler: [
      { required: true, message: "操作/技术员不能为空", trigger: "blur" },
    ],
    testNumber: [
      { required: true, message: "试验数量不能为空", trigger: "blur" },
    ],
    testCharge: [
      { required: true, message: "试验时机不能为空", trigger: "blur" },
    ],
  },
});
const { queryParams, form, rules } = toRefs(data);
document.addEventListener("paste", (event) => {
  handlePaste(event);
});
function handlerSearch(queryString, cb) {
  var arr = restaurants.value;
  var newArr = [];
  if (queryString && queryString.toLowerCase() != "null") {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].value.toLowerCase().indexOf(queryString.toLowerCase()) != -1) {
        newArr.push({ value: arr[i].value });
      }
    }
  } else {
    newArr = arr;
  }

  // 调用 callback 返回建议列表的数据
  cb(newArr);
}
function getHandlerList_pic() {
  getHandlerList().then((response) => {
    restaurants.value = [];
    for (var i = 0; i < response.length; i++) {
      restaurants.value.push({ value: response[i] });
    }
  });
}
function handlerSearch1(queryString, cb) {
  var arr = restaurants1.value;
  var newArr = [];
  if (queryString && queryString.toLowerCase() != "null") {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].value.toLowerCase().indexOf(queryString.toLowerCase()) != -1) {
        newArr.push({ value: arr[i].value });
      }
    }
  } else {
    newArr = arr;
  }
  // 调用 callback 返回建议列表的数据
  cb(newArr);
}

function getMechineList_pic() {
  getMechineList().then((response) => {
    restaurants1.value = [];
    for (var i = 0; i < response.length; i++) {
      restaurants1.value.push({ value: response[i] });
    }
  });
}

function handleMoreFiles(files, fileList) {
  proxy.$modal.msgError("最大只允许6张图片！请重新选择！");
}

function uploadChange(file, fileList) {
  for (var i = 0; i < fileList.length; i++) {
    if (
      uploadArr.value.indexOf(fileList[i].name) == -1 &&
      fileList[i].status != "success"
    )
      uploadArr.value.push(fileList[i].name);
  }
}

function uploadImg(content) {
  const form1 = new FormData();
  form1.append("file", content.file);
  const fileName = content.file.name;
  uploadImages(form1).then((response) => {
    if (uploadArr.value.indexOf(fileName) != -1)
      uploadArr.value.splice(uploadArr.value.indexOf(fileName), 1);
    if (response.code == 200) {
      const filename = response.msg;
      form.value.imgPaths.push(proxyPath.value + filename);
    } else {
      proxy.$modal.msgWarning("上传失败，请检查后重试！");
    }
    if (uploadArr.value.length == 0) {
      isUploading.value = false;
      submitForm();
    }
  });
}

function getFlowInfo() {
  let flowno = form.value.flowno;
  if (!flowno || flowno.length < 8) return;
  getFlowBillInfo(flowno).then((response) => {
    var obj = response;
    form.value.materialno = obj.productId;
    form.value.materialname = obj.productName;
    form.value.specification = obj.specification.split("/")[0];
    form.value.xpdm = obj.xpxh;
    form.value.xpph = obj.xpph;
    form.value.khdm = obj.khdm;
  });
}
function clickRow(row) {
  proxy.$refs.mytable.clearSelection();
  proxy.$refs.mytable.toggleRowSelection(row);
}

function handlePaste(e) {
  let items = event.clipboardData.items[0];
  if (items.type.includes("image")) {
    let blob = items.getAsFile();
    let file = new File([blob], new Date().getTime() + ".png");
    proxy.$refs.upload.handleStart(file);
    // proxy.$refs.upload.submit();
  }
}

function handleRemove(file, fileList) {
  const str = file.url;
  form.value.imgPaths.splice(
    form.value.imgPaths.indexOf(str.replace("dkPic", "dkPic_zip")),
    1
  );
  // delPicFile({filename: str})
}

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
  // form.value.imgPaths.push("/dev-api" + filename);
  form.value.imgPaths.push(proxyPath.value + filename);
}

function uploadError(err, file, fileList) {
  isUploading.value = false;
}

/** 查询弹坑图片列表 */
function getList() {
  loading.value = true;
  queryParams.value.params = {};
  if (
    null != daterangeCreatedate &&
    "" != daterangeCreatedate &&
    daterangeCreatedate.value.length > 0
  ) {
    queryParams.value.params["beginCreatedate"] = daterangeCreatedate.value[0];
    queryParams.value.params["endCreatedate"] = daterangeCreatedate.value[1];
  }
  if (
    null != daterangeModifydate &&
    "" != daterangeModifydate &&
    daterangeModifydate.value.length > 0
  ) {
    queryParams.value.params["beginModifydate"] = daterangeModifydate.value[0];
    queryParams.value.params["endModifydate"] = daterangeModifydate.value[1];
  }
  listPic(queryParams.value).then((response) => {
    picList.value = response.rows;
    for (var i = 0; i < picList.value.length; i++) {
      const str = picList.value[i].imgPaths;
      const str1 = picList.value[i].imgSrcPaths;
      if (str) picList.value[i].imgPaths = str.split(",");
      else picList.value[i].imgPaths = [];
      if (str1) picList.value[i].imgSrcPaths = str1.split(",");
      else picList.value[i].imgSrcPaths = [];
    }
    total.value = response.total;
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    flowno: null,
    materialno: null,
    materialname: null,
    specification: null,
    content: null,
    imgPaths: [],
    mechineName: null,
    xpdm: null,
    xpph: null,
    khdm: null,
    handler: null,
    creator: null,
    updater: null,
    result: null,
    testNumber: null,
    testCharge: null,
  };
  uploadFileList.value = [];
  proxy.resetForm("picRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  daterangeCreatedate.value = [];
  daterangeModifydate.value = [];
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}
function dialogOpen() {
  getHandlerList_pic();
  getMechineList_pic();
  // form.value.mechineName= Cookies.get("pic_mechineName")
  if (title.value == "添加弹坑实验记录") {
    form.value.handler = Cookies.get("pic_handler");
  }

  proxy.$nextTick(function () {
    this.$refs.dialog_flowno_input.focus();
    this.$refs.dialog_flowno_input.select();
  });
}
/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加弹坑实验记录";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value;
  getPic(_id).then((response) => {
    form.value = response.data;
    const str = form.value.imgPaths;
    if (str) {
      form.value.imgPaths = str.split(",");
      for (var i = 0; i < form.value.imgPaths.length; i++) {
        uploadFileList.value.push({
          name: "",
          url: form.value.imgPaths[i].replace("/dkPic_zip", "/dkPic"),
        });
      }
    } else {
      form.value.imgPaths = [];
    }
    open.value = true;
    title.value = "修改弹坑实验记录";
  });
}
function uploadImgToServer() {
  if (uploadArr.value.length == 0) {
    submitForm();
  } else {
    proxy.$refs.upload.submit();
  }
}
/** 提交按钮 */
function submitForm() {
  proxy.$refs["picRef"].validate((valid) => {
    if (valid) {
      form.value.imgPaths = form.value.imgPaths.join(",");
      if (form.value.id != null) {
        updatePic(form.value).then((response) => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        Cookies.set("pic_handler", form.value.handler);
        // Cookies.set("pic_mechineName",form.value.mechineName)
        addPic(form.value).then((response) => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.id || ids.value;
  if (ids.value.length > 1) {
    proxy.$modal.msgWarning("为防止误操作，一次只能删除一条数据");
    return;
  }

  proxy.$modal
    .confirm('是否确认删除弹坑图片编号为"' + _ids + '"的数据项？')
    .then(function () {
      return delPic(_ids);
    })
    .then(() => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
    })
    .catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.$modal
    .confirm("是否按搜索条件导出，最大导出量为200条？", "警告", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      showclose: true, //是否显示右上角关闭按钮
      type: "warning", //提示类型
    })
    .then(function () {
      proxy.download(
        "tk_custom/pic/export",
        {
          ...queryParams.value,
        },
        `pic_${new Date().getTime()}.xlsx`
      );
    })
    .catch(function (e) {});
}
function handleSelectExport() {
  const arr = ids.value;
  var str = "";
  for (var i = 0; i < arr.length; i++) {
    if (str != "") str = str + ",";
    str = str + arr[i];
  }
  proxy.$modal
    .confirm("是否按选中导出？", "警告", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      showclose: true, //是否显示右上角关闭按钮
      type: "warning", //提示类型
    })
    .then(function () {
      proxy.download(
        "tk_custom/pic/exportSelect",
        { remark: str },
        `pic_${new Date().getTime()}.xlsx`
      );
    })
    .catch(function (e) {});
}
getList();
</script>
<style>
.el-upload-dragger {
  background-color: var(--el-fill-color-blank);
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  box-sizing: border-box;
  cursor: pointer;
  overflow: hidden;
  padding: var(--el-upload-dragger-padding-horizontal)
    var(--el-upload-dragger-padding-vertical);
  position: relative;
  text-align: center;
  height: 148px;
}

.my-cell .cell {
  display: flex;
  overflow: auto;
  box-sizing: border-box;
  line-height: 23px;
  overflow-wrap: break-word;
  padding: 0 12px;
  text-overflow: ellipsis;
  white-space: normal;
}
#mytable {
  height: calc(100vh - 230px);
}
</style>

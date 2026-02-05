<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryRef"
      v-show="showSearch"
      class="search-form"
      @keyup.enter="handleQuery"
    >
      <el-row :gutter="12" align="middle">
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item label="盘点时间" prop="pdDate">
            <el-date-picker
              v-model="queryParams.pdDate"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="请选择盘点时间"
              clearable
              style="width: 100%"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item label="盘点工序" prop="process">
            <el-select
              v-model="queryParams.process"
              placeholder="请选择盘点工序"
              clearable
              filterable
              style="width: 100%"
            >
              <el-option
                v-for="dict in tk_pd"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item label="流程单号" prop="flowNo">
            <el-input
              v-model="queryParams.flowNo"
              placeholder="请输入流程单号"
              clearable
            />
          </el-form-item>
        </el-col>
        <!-- 右侧按钮固定一列 -->
        <el-col :xs="24" :sm="12" :md="24" :lg="6" class="search-actions">
          <el-button type="primary" icon="Search" @click="handleQuery">
            搜索
          </el-button>
          <el-button icon="Refresh" @click="resetQuery"> 重置 </el-button>

          <!-- 展开/收起更多条件 -->
          <el-button link type="primary" @click="moreOpen = !moreOpen">
            {{ moreOpen ? "收起" : "更多条件" }}
          </el-button>
        </el-col>
      </el-row>
      <el-form-item label="产品编码" prop="productId">
        <el-input
          v-model="queryParams.productId"
          placeholder="请输入产品编码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="产品名称" prop="productName">
        <el-input
          v-model="queryParams.productName"
          placeholder="请输入产品名称"
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
      <!--<el-form-item label="批号" prop="lot">-->
      <!--<el-input-->
      <!--v-model="queryParams.lot"-->
      <!--placeholder="请输入批号"-->
      <!--clearable-->
      <!--@keyup.enter="handleQuery"-->
      <!--/>-->
      <!--</el-form-item>-->
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
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['tk_custom:pd:add']"
          >新增</el-button
        >
      </el-col>
      <!--<el-col :span="1.5">-->
      <!--<el-button-->
      <!--type="success"-->
      <!--plain-->
      <!--icon="Edit"-->
      <!--:disabled="single"-->
      <!--@click="handleUpdate"-->
      <!--v-hasPermi="['tk_custom:pd:edit']"-->
      <!--&gt;修改</el-button>-->
      <!--</el-col>-->
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['tk_custom:pd:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['tk_custom:pd:export']"
          >导出</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-form-item label="盘点工序" prop="t_process">
          <el-select
            style="width: 100px"
            v-model="t_process"
            placeholder="请选择盘点工序"
          >
            <el-option
              v-for="dict in tk_pd"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="1.5">
        <el-form-item label="流程单号" prop="t_flowNo">
          <el-input
            v-model="t_flowNo"
            placeholder="请扫描或输入流程单号"
            clearable
            ref="mainpageFlowNo"
            @keyup="queryByFlowNo"
          />
        </el-form-item>
      </el-col>
      <right-toolbar
        v-model:showSearch="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="pdList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />

      <el-table-column label="流程单号" align="center" prop="flowNo" />
      <el-table-column label="产品编码" align="center" prop="productId" />
      <el-table-column label="产品名称" align="center" prop="productName" />
      <el-table-column label="规格型号" align="center" prop="specification" />
      <el-table-column label="批号" align="center" prop="lot" />
      <el-table-column label="库存数量" align="center" prop="number" />
      <el-table-column label="盘点数量" align="center" prop="pdNumber" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column
        label="盘点时间"
        align="center"
        prop="pdDate"
        width="180"
      >
        <template #default="scope">
          <span>{{ parseTime(scope.row.pdDate, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="盘点工序" align="center" prop="process">
        <template #default="scope">
          <dict-tag :options="tk_pd" :value="scope.row.process" />
        </template>
      </el-table-column>
      <el-table-column label="工序状态" align="center" prop="processStatus">
        <template #default="scope">
          <el-tag v-if="String(scope.row.processStatus) === '1'" type="success">
            已完成
          </el-tag>
          <el-tag v-else type="warning">
            <span>进行中</span>
          </el-tag>
        </template>
      </el-table-column>

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
            v-hasPermi="['tk_custom:pd:edit']"
          >
            修改
          </el-button>
          <!--<el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['tk_custom:pd:remove']">删除</el-button>-->
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

    <!-- 添加或修改盘点对话框 -->
    <el-dialog
      :title="title"
      v-model="open"
      width="800px"
      append-to-body
      @open="dialogOpen"
      @close="dialogClose"
    >
      <el-form ref="pdRef" :model="form" :rules="rules" label-width="80px">
        <!--<el-form-item label="盘点时间" prop="pdDate">-->
        <!--<el-date-picker clearable-->
        <!--v-model="form.pdDate"-->
        <!--type="date"-->
        <!--value-format="YYYY-MM-DD"-->
        <!--placeholder="请选择盘点时间">-->
        <!--</el-date-picker>-->
        <!--</el-form-item>-->
        <el-form-item label="是分单?" prop="number">
          <el-select v-model="form.isSplitBill">
            <el-option key="1" label="是" value="1"></el-option>
            <el-option key="0" label="否" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="库存数量" prop="number">
          <el-input
            v-model="form.number"
            placeholder="请输入库存数量"
            v-bind:readonly="isEdit"
          />
        </el-form-item>
        <el-form-item label="盘点数量" prop="pdNumber">
          <el-input
            ref="pdNumberRef"
            v-model="form.pdNumber"
            @keyup.enter="submitForm"
            placeholder="请输入盘点数量"
          />
        </el-form-item>
        <el-form-item label="盘点工序" prop="process">
          <el-select
            v-model="form.process"
            placeholder="请选择盘点工序"
            v-bind:disabled="isEdit"
          >
            <el-option
              v-for="dict in tk_pd"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="流程单号" prop="flowNo">
          <el-input
            v-model="form.flowNo"
            placeholder="请输入流程单号"
            v-bind:readonly="isEdit"
          />
        </el-form-item>
        <el-form-item label="产品编码" prop="productId">
          <el-input
            v-model="form.productId"
            placeholder="请输入产品编码"
            v-bind:readonly="isEdit"
          />
        </el-form-item>
        <el-form-item label="产品名称" prop="productName">
          <el-input
            v-model="form.productName"
            placeholder="请输入产品名称"
            v-bind:readonly="isEdit"
          />
        </el-form-item>
        <el-form-item label="规格型号" prop="specification">
          <el-input
            v-model="form.specification"
            placeholder="请输入规格型号"
            v-bind:readonly="isEdit"
          />
        </el-form-item>
        <el-form-item label="批号" prop="lot">
          <el-input
            v-model="form.lot"
            placeholder="请输入批号"
            v-bind:readonly="isEdit"
          />
        </el-form-item>

        <el-form-item label="工序状态" prop="processStatus">
          <el-select v-model="form.processStatus">
            <el-option label="进行中" value="0" />
            <el-option label="已完成" value="1" />
          </el-select>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Pd">
import {
  listPd,
  getPdFromKingdee,
  getPd,
  delPd,
  addPd,
  updatePd,
} from "@/api/tk_custom/pd";

const { proxy } = getCurrentInstance();
const { tk_pd } = proxy.useDict("tk_pd");
const pdList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(false);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const t_process = ref("");
const t_flowNo = ref("");
const moreOpen = ref(false);
const isEdit = ref(false);
const lastProcessStatus = ref("0");
const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    pdDate: null,
    process: null,
    flowNo: null,
    productId: null,
    productName: null,
    specification: null,
    lot: null,
  },
  rules: {
    pdNumber: [
      { required: true, message: "盘点数量不能为空", trigger: "blur" },
    ],
  },
});

const { queryParams, form, rules } = toRefs(data);
// 对话框打开与关闭时的处理
function dialogOpen() {
  proxy.$nextTick(() => {
    proxy.$refs.pdNumberRef?.focus?.();
    proxy.$refs.pdNumberRef?.select?.();
  });
}
function dialogClose() {
  proxy.$nextTick(() => {
    proxy.$refs.mainpageFlowNo?.focus?.();
    proxy.$refs.mainpageFlowNo?.select?.();
  });
}

//根据流程单号查询
function queryByFlowNo() {
  if (!t_process.value)
    return proxy.$modal.msgWarning("请先选择盘点工序，再重扫描！");
  if (!t_flowNo.value || t_flowNo.value.length < 8) return;
  isEdit.value = false;
  getPdFromKingdee(t_flowNo.value).then((response) => {
    var data = response.data;
    if (!data) return proxy.$modal.msgError("找不到数据！");
    reset();
    form.value = data;
    if (data.isUpdatePdData) {
      isEdit.value = true;
      open.value = true;
      title.value = "修改盘点信息";
    } else {
      isEdit.value = false;
      open.value = true;
      form.value.pdNumber = form.value.number;
      if (form.value.processStatus == null) {
        form.value.processStatus = lastProcessStatus.value || "0";
      }
      title.value = "添加盘点信息";
    }
    form.value.process = t_process.value;
  });
}
/** 查询盘点列表 */
function getList() {
  loading.value = true;
  listPd(queryParams.value).then((response) => {
    pdList.value = response.rows;
    total.value = response.total;
    console.log("pdList:", pdList.value);
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
    pdDate: null,
    process: null,
    flowNo: null,
    productId: null,
    productName: null,
    specification: null,
    lot: null,
    number: null,
    pdNumber: null,
    remark: null,
    isSplitBill: "0",
    processStatus: lastProcessStatus.value || "0",
  };
  proxy.resetForm("pdRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  isEdit.value = false;
  open.value = true;
  title.value = "添加盘点信息";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  isEdit.value = true;
  // const _id = row.id || ids.value;
  const _id = row?.id ?? ids.value?.[0];

  getPd(_id)
    .then((response) => {
      form.value = response.data;
      open.value = true;
      title.value = "修改盘点信息";
    })
    .catch(() => {
      proxy.$modal.msgError("获取盘点信息失败");
    });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["pdRef"].validate((valid) => {
    if (valid) {
      if (form.value.id != null && form.value.isSplitBill != "1") {
        updatePd(form.value).then((response) => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addPd(form.value).then((response) => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

watch(
  () => form.value.processStatus,
  (value) => {
    if (value != null) {
      lastProcessStatus.value = value;
    }
  },
);

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.id || ids.value;
  proxy.$modal
    .confirm('是否确认删除盘点编号为"' + _ids + '"的数据项？')
    .then(function () {
      return delPd(_ids);
    })
    .then(() => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
    })
    .catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download(
    "tk_custom/pd/export",
    {
      ...queryParams.value,
    },
    `pd_${new Date().getTime()}.xlsx`,
  );
}

getList();
</script>

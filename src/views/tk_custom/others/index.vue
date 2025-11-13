<template>
  <div class="app-container" v-loading="loading">
      <div class="btnitem " >
          <el-input v-model="input_WF" style="width: 50vw" type="text" placeholder="多个单号，请用符号&分开。如xxx&yyy&zzz"/>
          <el-button  @click="handleExport">导出外发上锡</el-button>
      </div>
  </div>
</template>

<script setup name="others">
import { exportExcel} from "@/api/tk_custom/others";
const { proxy } = getCurrentInstance();
const input_WF=ref("");
const loading=ref(false);
/** 导出按钮操作 */
function handleExport() {
    proxy.download('kingdee/exportWFData/'+input_WF.value, {}, `外发上锡_${new Date().getTime()}.xlsx`)
    // {"FormId":"SFC_OperOutGroupSend","FieldKeys":"FSupplier.FShortName,FBillNo,FCreatorId.FName,FDate,FOplanInFo,FMaterialName,FMaterialSpec,FMOBaseUnitId.FName,F_UNW_Text_qtr,FOutSendQtyFake,FRateValQty,FRateOperQty,F_UNW_Base_re5","FilterString":[{"Left":"","FieldName":"FBillNo","Compare":"67","Value":"WWFC1302","Right":"","Logic":0},{"Left":"","FieldName":"FLineType","Compare":"29","Value":"A","Right":"","Logic":0}],"OrderString":"","TopRowCount":0,"StartRow":0,"Limit":10000,"SubSystemId":""}
}

</script>
<style>
  .btnitem{
    margin-top: 10px;
    background: gainsboro;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction:column;
  }
  .btnitem button{
   background: cornflowerblue;
    color: white;
    margin-top: 10px;
  }
</style>
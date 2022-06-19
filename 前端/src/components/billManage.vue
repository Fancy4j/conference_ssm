<template>
  <div>
    <el-form :inline="true" label-width="80px">
      <el-form-item>
        <el-input v-model="search"
                  placeholder="输入XX号查询"
                  clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          class="el-icon-search"
          @click="searchInfo">查询
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          class="el-icon-refresh"
          @click="flush">刷新
        </el-button>
      </el-form-item>
    </el-form>
    <el-main>
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="billNum"
          label="XX号"
          width="180">
        </el-table-column>
        <el-table-column
          prop="baoxiaoName"
          label="XX报销人"
          width="100">
        </el-table-column>
        <el-table-column
          prop="user.realName"
          label="XX录入人名称"
          width="120">
        </el-table-column>
        <el-table-column
          prop="amount"
          label="XX金额"
          width="150">
        </el-table-column>
        <el-table-column
          prop="saveTime"
          label="录入时间"
          width="200">
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="修改时间"
          width="200">
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="billUpdate(scope.$index, scope.row)">修改</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="billDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
<!--      更新发票信息表单-->
      <el-dialog title="修改XX信息" :visible.sync="dialogUpdate" append-to-body>
        <el-form :model="entityObj" ref="updateFormData" :rules="rules">
          <el-form-item label="XX号：" :label-width="formLabelWidth" prop="billNum">
            <el-input v-model="entityObj.billNum" placeholder="必须是纯数字" oninput="value=value.replace(/[^\d]/g,'')"></el-input>
          </el-form-item>
          <el-form-item label="XX人：" :label-width="formLabelWidth" prop="baoxiaoName">
            <el-input v-model="entityObj.baoxiaoName" ></el-input>
          </el-form-item>
          <el-form-item label="金额：" :label-width="formLabelWidth" prop="amount">
            <el-input v-model="entityObj.amount"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogUpdate = false">取 消</el-button>
          <el-button type="primary" @click="updateSure">确 定</el-button>
        </div>
      </el-dialog>
      <!--分页-->
      <br/>
      <el-pagination
        background
        layout="prev, pager, next"
        :page-size= pageSize
        :current-page="currentPage"
        :total= total
        @current-change="handleCurrentChange">
      </el-pagination>
    </el-main>
  </div>
</template>

<script>
export default {
  name: "billManage",
  data() {
    return {
      loginUserName: "",
      search: '',
      dialogUpdate:false,
      tableData: [],
      total: 1,
      pageSize: 5,
      currentPage:1,
      formLabelWidth: '120px',
      isUpdateEntityObj:{},
      entityObj:{
        billNum:'',
        baoxiaoName:'',
        realName:'',
        amount:'',
        saveTime:''
      },
      billNumOld:'',
      rules: {//必填，聚焦
        billNum: [{ required: true, message: '请输入发票号', trigger: 'blur' }],
        baoxiaoName: [{ required: true, message: '请输入报销人名称', trigger: 'blur' }],
        realName: [{ required: true, message: '请输入录入人真实姓名', trigger: 'blur' }],
        amount: [{ required: true, message: '请输入金额', trigger: 'blur' },
          {pattern: /^-?\d{1,16}(?:\.\d{1,4})?$/g,
           message: "请输入合法的金额数字，最多保留4位小数",
           trigger: "blur"
  }]
      },
    }
  },
  created() {
    this.loginUserName = sessionStorage.getItem("loginUserName")
    this.handleCurrentChange(this.currentPage)
  },

  methods: {
    searchInfo(){
      const _this = this
      _this.$http.post(_this.$globalInfo.httpPath+'billQuery?billNum=' + _this.search).then(function (resp) {
        //console.log(resp)
        if(resp.data.code == 200){
          // 封装数组
          let arr = []
          arr.push(resp.data.data)
          //_this.tableData=resp.data.data
          _this.tableData=arr
        }else{
          _this.$message.warning(resp.data.message)
          return false;
        }
      })
    },
    flush(){
      this.handleCurrentChange(1)
    },
    handleCurrentChange(currentPage){
      const _this = this
      _this.currentPage = currentPage
      _this.$http.post(_this.$globalInfo.httpPath+'billAllQuery?pageNum='+ _this.currentPage).then(function (resp) {
        //console.log(resp)
        if(resp.data.code == 200){
          _this.tableData=resp.data.data.list
          _this.total = resp.data.data.total
        }else{
          _this.$message.warning(resp.data.message);
          return false;
        }


      })

    },
    billUpdate(index, row){
      const _this = this
      _this.billNumOld=row.billNum
      //先把表单置空,清除校验提示信息残留
      if (_this.$refs['updateFormData'] != undefined) { //当窗口不可见时重置表单'addFormData'，所以第一次判”空“
        //由于vue组键渲染速度快于 dom元素，当dialog窗口未被加载就清空表单数据就会报找不到
        this.$refs['updateFormData'].resetFields()
      }
      //console.log(row)
      for (let propName in row) {
        _this.entityObj[propName] = row[propName]
        //_this.isUpdateEntityObj[propName] = row[propName]
      }
      _this.entityObj.realName=row.user.realName
      this.dialogUpdate = true

    },
    updateSure(){
      let _this = this
      let loginUserName = sessionStorage.getItem("loginUserName");
      this.$refs.updateFormData.validate(valid => {
        if (valid) {
         // console.log(_this.entityObj)
          _this.$http.post(_this.$globalInfo.httpPath+'billUpdate?billNumOld=' + _this.billNumOld
            + '&billNum='+_this.entityObj.billNum + '&baoxiaoName='+_this.entityObj.baoxiaoName
            + '&amount='+_this.entityObj.amount+ '&userName=' + loginUserName).then(function (resp) {
            console.log(resp)
            if(resp.data.code == 200){
              _this.$message.success(resp.data.message)
              _this.dialogUpdate=false
              _this.handleCurrentChange(1)
            }else{
              _this.$message.warning(resp.data.message);
              return false;
            }
          })
        }
      })
    },

    billDelete(index, row){
      const _this = this
      this.$confirm('删除发票, 是否继续?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        _this.$http.post(_this.$globalInfo.httpPath+'billDelete?billNum='+row.billNum).then(function (resp) {
          if(resp.data.code == 200){
            _this.$message.success(resp.data.message)
            // location.reload()
            _this.handleCurrentChange(_this.currentPage)
          }else {
            _this.$message.error(resp.data.message)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },

    exitAccount() {
      this.$confirm('退出登录, 是否继续?', '提示', {
        confirmButtonText: '退出',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        sessionStorage.clear()
        this.$router.push({path: "/caiwu/login/"})
        this.$message({
          type: 'success',
          message: '退出成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出'
        });
      });

    },
  }
}
</script>

<style scoped>

</style>

<template>
  <div>

    <el-container>
      <!--头区域-->

      <el-header class="el-header exit" >
        <el-dropdown trigger="click">
                        <span class="el-dropdown-link">
                            <i class="el-icon-user-solid el-icon--left"/>{{loginRealName}}<i class="el-icon-arrow-down el-icon--right"/>
                        </span>
          <el-dropdown-menu slot="dropdown" >
            <!--<el-dropdown-item @click.native="editAccount"><i class="el-icon-edit-outline" /> 修改密码</el-dropdown-item>-->

            <el-dropdown-item>
              <el-button type="text" @click="dialogVisible = true"><i class="el-icon-lock" /> 修改密码</el-button>
            </el-dropdown-item>
            <el-dropdown-item @click.native="exitAccount"><i class="el-icon-switch-button" /> 退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>

<el-main>
  <div class="login-wrap">

    <h1>查询XX</h1>
    <el-form :inline="true" label-width="80px">
      <el-form-item>
        <el-input v-model="search"
                  placeholder="输入XX查询"
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

    </el-form>
    <h1>录入XX信息</h1>
    <el-form ref="ruleFormRef" :model="ruleForm" label-width="80px" :rules="billrules">
      <el-form-item label="XX号:" prop="billNum">
        <el-input v-model="ruleForm.billNum" placeholder="必须是纯数字" oninput="value=value.replace(/[^\d]/g,'')"></el-input>
      </el-form-item>
      <el-form-item label="XX人:" prop="baoxiaoName">
        <el-input v-model="ruleForm.baoxiaoName"></el-input>
      </el-form-item>
      <el-form-item label="XX金额:" prop="amount">
        <el-input v-model="ruleForm.amount"></el-input>
      </el-form-item>
      <el-form-item size="large">
        <el-button type="primary" @click="toConfirm">提交</el-button>
        <el-button @click="resetForm('ruleFormRef')">重置</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="确认XX信息" :visible.sync="dialogSure" append-to-body>
      <el-form ref="ruleFormSure" :model="ruleForm" label-width="80px" :rules="billrules">
        <el-form-item label="XX号:" prop="billNum">
          <el-input v-model="ruleForm.billNum" placeholder="必须是纯数字" oninput="value=value.replace(/[^\d]/g,'')"></el-input>
        </el-form-item>
        <el-form-item label="XX人:" prop="baoxiaoName">
          <el-input v-model="ruleForm.baoxiaoName"></el-input>
        </el-form-item>
        <el-form-item label="XX金额:" prop="amount">
          <el-input v-model="ruleForm.amount"></el-input>
        </el-form-item>
        <el-form-item size="large">
          <el-button type="primary" @click="onSubmit">确定</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="XX信息" :visible.sync="dialogSearch" append-to-body>
      <el-form :model="infoForm">
        <el-form-item label="XX号：" :label-width="formLabelWidth">
          <el-input v-model="infoForm.billNum" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="XX人：" :label-width="formLabelWidth">
          <el-input v-model="infoForm.baoxiaoName" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="XX录入人名称：" :label-width="formLabelWidth">
          <el-input v-model="infoForm.luruName" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="XX金额：" :label-width="formLabelWidth">
          <el-input v-model="infoForm.amount" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="XX录入时间：" :label-width="formLabelWidth">
          <el-input v-model="infoForm.saveTime" autocomplete="off" disabled></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="修改密码"
               :visible.sync="dialogVisible"
               width="30%"
               @close="resetForm('loginForm')"
               append-to-body>
      <el-form ref="loginForm" :model="loginForm" :rules="rules">
        <el-form-item label="新密码" prop="password" :label-width="formLabelWidth">
          <el-input
            type="password"
            show-password
            auto-complete="off"
            placeholder="请设置新密码"
            v-model="loginForm.password"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="password2" :label-width="formLabelWidth">
          <el-input
            type="password"
            show-password
            auto-complete="off"
            placeholder="请确认新密码"
            v-model="loginForm.password2"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updatePwd">确 定</el-button>
      </div>
    </el-dialog>
  </div>
    </el-main>
      </el-container>
  </div>
</template>

<script>
    export default {
      created(){
        this.loginUserName = sessionStorage.getItem("loginUserName")
        this.loginRealName = sessionStorage.getItem("loginRealName")
      },
      data() {
        const validateNewPassword2 = (rule, value, callback) => {
          if (value !== this.loginForm.password) {
            callback(new Error("与新密码不一致!"));
          } else {
            callback();
          }
        }
        return {
          loginUserName: "",
          loginRealName:'',
          search: '',
          tableData: [],
          dialogSearch: false,
          dialogSubmit:false,
          dialogVisible: false,
          dialogSure:false,
          ruleForm: {
            billNum: '',
            baoxiaoName: '',
            amount: '',
          },
         infoForm:{
           billNum:'',
           baoxiaoName:'',
           luruName:'',
           amount:'',
           saveTime:''
        },
          loginForm: {
            password: "",
            password2: "",
          },
          formLabelWidth: '120px',
          rules: {
            password: [
              { required: true, message: "请设置新密码", trigger: "blur" },
            ],
            password2: [
              { required: true, message: "请确认新密码", trigger: "blur" },
              { validator: validateNewPassword2, trigger: "blur" },
            ],
          },
          billrules:{
            billNum: [{ required: true, message: '请输入XX号', trigger: 'blur' }],
            baoxiaoName: [{ required: true, message: '请输入XX报销人名称', trigger: 'blur' }],
            amount: [{ required: true, message: '请输入XX金额', trigger: 'blur' },
              {pattern: /^-?\d{1,16}(?:\.\d{1,4})?$/g,
                message: "请输入合法的金额数字，最多保留4位小数",
                trigger: "blur"
              }]
          },
        }
      },

      methods:{
        onSubmit() {
          let _this = this
          let loginUserName = sessionStorage.getItem("loginUserName");
          console.log(loginUserName)
          console.log(_this.infoForm)
          this.$refs.ruleFormRef.validate(valid => {
            if (valid) {
              _this.$http.post(_this.$globalInfo.httpPath + 'billAdd?billNum='
                + _this.ruleForm.billNum+ '&baoxiaoName='
                + _this.ruleForm.baoxiaoName+'&amount='
                + _this.ruleForm.amount +'&userName=' + loginUserName).then(function (resp) {
                console.log(resp)
                if(resp.data.code == 200){
                  //_this.infoForm=resp.data.data
                 // _this.infoForm.luruName=resp.data.data.user.realName
                  _this.$message.success(_this.ruleForm.billNum+resp.data.message)
                  _this.dialogSure=false
                  _this.resetForm('ruleFormRef')
                }else{
                  _this.$message.warning(resp.data.message);
                  return false;
                }

              })
            }}
          )

        },
        toConfirm(){
          let _this = this
          this.$refs.ruleFormRef.validate(valid => {
            if (valid) {
              _this.dialogSure=true
            }})
        },
        cancel(){
          this.dialogSure=false
        },
        searchInfo(){
          let _this = this
              _this.$http.post(_this.$globalInfo.httpPath + 'billQuery?billNum=' + _this.search).then(function (resp) {
                console.log(resp)
                if(resp.data.code == 200){
                  _this.infoForm=resp.data.data
                  _this.infoForm.luruName=resp.data.data.user.realName
                  _this.$message.success(resp.data.message)
                  _this.dialogSearch=true
                }else{
                  _this.$message.warning(resp.data.message);
                  return false;
                }
              })


        },

        updatePwd(){
          let _this = this
          let loginUserName = sessionStorage.getItem("loginUserName");
          this.$refs.loginForm.validate(valid => {
            if (valid) {
              _this.$http.post(_this.$globalInfo.httpPath + 'userUpdatePassword?userName=' + loginUserName+ '&newPwd='+_this.loginForm.password).then(function (resp) {
                console.log(resp)
                if(resp.data.code == 200){
                  _this.$message.success(resp.data.message)
                  _this.dialogVisible=false
                }else{
                  _this.$message.warning(resp.data.message);
                  return false;
                }

              })
            }
          })
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
        resetForm(formName) {
          this.$refs[formName].resetFields();
        }

      }
    }
</script>

<style scoped>
.el-header {
  text-align: right;
  cursor: pointer;
  line-height: 60px;
}
.login-wrap {
  z-index: 25;
  position:absolute;
  top: 100px;
  right:30%;
  width: 500px;
  height: 500px;
  background-color: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 24px 0px rgba(10, 20, 65, 0.08);
  padding: 0 25px 22px 0;
  justify-content: flex-end;
  align-items: flex-end;
}

.exit{
  margin-right: 5%;
}



</style>

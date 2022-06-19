<template>

  <div>
    <el-container>
    <!--头区域-->
    <el-header class="el-header" >

      <el-dropdown trigger="click">
                        <span class="el-dropdown-link">
                            <i class="el-icon-user-solid el-icon--left"/>{{loginRealName}}<i class="el-icon-arrow-down el-icon--right"/>
                        </span>

        <el-dropdown-menu slot="dropdown" >
          <el-dropdown-item>
            <el-button type="text" @click="dialogVisible = true"><i class="el-icon-lock" /> 修改密码</el-button>
          </el-dropdown-item>
          <el-dropdown-item @click.native="exitAccount"><i class="el-icon-switch-button" /> 退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-header>
    <el-container style="height: 600px; ">
      <!--侧边导航栏-->
      <el-aside width="260px" style="background-color: rgb(238, 241, 246);">
        <el-menu :default-active="this.$route.path"
                 class="el-menu-vertical-demo"
                 active-text-color="#1E90FF"
                 router>
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>投稿人</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/caiwu/management/userManage"><i class="el-icon-s-order" />会议信息</el-menu-item>
              <el-menu-item index="/caiwu/management/billManage"><i class="el-icon-coin" />投稿记录</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
          <router-view>
          </router-view>
        </el-main>
    </el-container>
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
      dialogVisible: false,
      loginForm: {
        password: "",
        password2: "",
      },
      rules: {
        password: [
          { required: true, message: "请设置新密码", trigger: "blur" },
        ],
        password2: [
          { required: true, message: "请确认新密码", trigger: "blur" },
          { validator: validateNewPassword2, trigger: "blur" },
        ],
      },
    }
  },
  methods: {
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
        confirmButtonText: '确定',
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
  background-color: #B3C0D1;
  line-height: 60px;
}
.el-header .el-dropdown-link{
  color: #fff;
  font-size: 18px;
}
.aside-header {
  display: block;
  height: 80px;
  background-color: #007CCC;
  text-align: left;
  font-size: 25px;
  font-family: 楷体;
  color: #fff;
}
/*这是通用样式,作用于表格字体*/
.el-table .cell{
  color: #444;
}
/*全局样式弹窗元素的宽度*/
.el-dialog__wrapper .el-dialog {
  width: 40%;
}


</style>



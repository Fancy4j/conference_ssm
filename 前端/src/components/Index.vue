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
            <el-button type="text" @click="infor()"><i class="el-icon-s-tools" /> 个人信息</el-button>
          </el-dropdown-item>
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
              <span>{{ role }}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item :index="menu1_index"><i class="el-icon-s-order" />{{ menu1 }}</el-menu-item>
              <el-menu-item :index="menu2_index"><i class="el-icon-coin" />{{ menu2 }}</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
          <router-view>
          </router-view>
        </el-main>
    </el-container>

      <el-dialog title="个人信息"
                 :visible.sync="dialogVisible2"
                 width="30%"
                 @close="dialogVisible2=false"
                 append-to-body>
        <el-form ref="form" :model="user">
          <el-form-item label="用户名" prop="" :label-width="formLabelWidth">
            <span>{{user.username}}</span>
          </el-form-item>
          <el-form-item label="真实姓名" prop="" :label-width="formLabelWidth">
            <span>{{user.name}}</span>
          </el-form-item>
          <el-form-item label="email" prop="" :label-width="formLabelWidth">
            <span>{{user.email}}</span>
          </el-form-item>
<!--&lt;!&ndash;          <el-form-item label="所在地" prop="" :label-width="formLabelWidth">&ndash;&gt;-->
<!--&lt;!&ndash;            <span>{{user.location}}</span>&ndash;&gt;-->
<!--          </el-form-item>-->
          <el-form-item label="所属机构" prop="" :label-width="formLabelWidth">
            <span>{{user.administration}}</span>
          </el-form-item>
          <el-form-item label="网址" prop="" :label-width="formLabelWidth">
            <span>{{user.webpage}}</span>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogVisible2 = false">返回</el-button>
        </div>
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
    </el-container>
  </div>
</template>
<script>
import axios from "axios";

export default {
  created(){
    this.loginUserName = sessionStorage.getItem("loginUserName");
    this.loginRealName = sessionStorage.getItem("loginRealName");
    this.role = sessionStorage.getItem("userRole");
    if (this.role == "投稿人"){

      this.menu1_index="/caiwu/management/userManage"
      this.menu2_index="/caiwu/management/billManage"
      this.menu1 = "查看会议";
      this.menu2 = "投稿记录";
    }else if(this.role == "审稿人"){
      this.menu1_index="/caiwu/management/reviewerManager"
      this.menu1 = "审稿记录";
      this.menu2 = "";
    }else{
      this.menu1_index="/caiwu/management/host_conf_list"
      this.menu2_index="/caiwu/management/host_submit"
      this.menu1 = "主持会议列表";
      this.menu2 = "举办新会议";
    }
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
      user:{
        username:'',
        name:'',
        location:'',
        email:'',
        administration:'',
        webpage: ''
      },
      dialogVisible2:false,
      menu1_index:'',
      menu2_index:'',
      menu1:"",
      menu2:"",
      role:"",
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
    infor(){
      let _this=this;
      _this.dialogVisible2=true;
      _this.$http.get(_this.$globalInfo.httpPath + '/userInfo/getUserInfo?userId=' + sessionStorage.getItem("userId")).then(function (resp) {
        console.log(resp)
        if(resp.data.code == 200){

          _this.user=resp.data.data
          console.log(_this.user)
        }else{
          _this.$message.warning(resp.data.message);
          return false;
        }
      })
    },
    updatePwd(){
      let _this = this
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          axios.post(_this.$globalInfo.httpPath+'/userUpdatePassword?userId='+sessionStorage.getItem("userId")+'&newPwd='+_this.loginForm.password,

          ).then(function (response){
            alert("yes!")
            console.log(response)
          })
            .catch(function (error){
              alert("NOOOOO")
              console.log(error)
            });


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



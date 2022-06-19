<template>
  <div class="page">
    <div class="login-wrap">
      <el-form class="section1" ref="registForm" :model="user" :rules="rules" status-icon>
        <span style="white-space: nowrap" class="login-title">注册用户</span>
        <br/>
        <br/>
        <el-form-item prop="userName">
          <el-input v-model="user.userName" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item prop="realName">
          <el-input v-model="user.realName" placeholder="真实姓名"></el-input>
        </el-form-item>
        <el-form-item id="password" prop="userPwd">
          <el-input v-model="user.userPwd" show-password placeholder="密码"></el-input>
        </el-form-item>
        <br/>
        <el-form-item id="confirmPwd" prop="confirmPwd">
          <el-input v-model="user.confirmPwd" show-password placeholder="确认密码"></el-input>
        </el-form-item>
        <br/>
        <el-form-item>
          <el-button type="primary" icon="el-icon-user" @click="doRegist()">注 册</el-button>
        </el-form-item>

      </el-form>
    </div>

  </div>
</template>

<script>
export default {
  name: "Regist",
 data() {

   const equalToPassword = (rule, value, callback) => {
     if (this.user.userPwd !== value) {
       callback(new Error("两次输入的密码不一致"));
     } else {
       callback();
     }
   };

  return {
    user: {
      userID: "",
      userName: "",
      userPwd: "",
      confirmPwd:"",
      status:"",
      realName:"",

    },
    rules: {
      userName: [
        //必填，聚焦
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, message: '不允许输入空格等特殊符号',trigger: 'blur'}
      ],
      realName: [
        //必填，聚焦
        { required: true, message: '请输入真实姓名', trigger: 'blur' },

      ],
      userPwd: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        //{ pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, message: '不允许输入空格等特殊符号',trigger: 'blur'}
      ],
      confirmPwd: [
        { required: true, message: '请再次输入密码', trigger: 'blur' },
        { required: true, validator: equalToPassword, trigger: "blur" }
      ]
    },

  }
},
  methods: {
    doRegist() {
      let _this = this;
      this.$refs.registForm.validate(valid => {
        if (valid) {
          _this.$http.post(_this.$globalInfo.httpPath + 'Register?userName=' + _this.user.userName
            + '&userPwd=' + encodeURIComponent(encodeURIComponent(_this.user.userPwd))
            + '&realName=' + _this.user.realName).then(function (resp) {
              console.log(resp)
           // _this.$router.push({path: "/"})
            if(resp.data.code == 200){
              _this.$router.push({path: "/"})
              _this.$message.success(resp.data.message)
            }else{
              _this.$message.warning(resp.data.message)
              return false;
            }
          })
        }})
    },

  }
}
</script>

<style scoped>

.login-wrap {
  z-index: 25;
  position:absolute;
  top: 120px;
  right:35%;
  width: 400px;
  height: 430px;
  background-color: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 24px 0px rgba(10, 20, 65, 0.08);
  padding: 0 25px 22px 0;
  justify-content: flex-end;
  align-items: flex-end;
}
.section1 {
  z-index: auto;
  padding-top: 50px;
  padding-left: 50px;
  width: 320px;
  height: 310px;
}
.login-title {
  width: 252px;
  height: 28px;
  font-size: 28px;
  font-family: SourceHanSansCN-Bold, SourceHanSansCN;
  font-weight: bold;
  color: #242429;
  line-height: 42px;
  display: block;
  text-align: center;
  margin-left: 10%;

}
#password {
  margin-bottom: 5px;
}
.page .el-button {
  width: 100%;
}


</style>

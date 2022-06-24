<template>
  <div class="page">
    <div class="login-wrap">
      <el-form class="section1" ref="registForm" :model="user" :rules="rules" status-icon>
        <span style="white-space: nowrap" class="login-title">注册用户</span>
        <br/>
        <br/>
        <el-form-item prop="userName">
          <el-input v-model="user.username" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="realName">
          <el-input v-model="user.name" placeholder="真实姓名"></el-input>
        </el-form-item>
        <el-form-item prop="email">
          <el-input v-model="user.email" placeholder="邮箱地址"></el-input>
        </el-form-item>
        <el-form-item prop="location">
          <el-input v-model="user.location" placeholder="所在地址"></el-input>
        </el-form-item>
        <el-form-item prop="administration">
          <el-input v-model="user.administration" placeholder="所属机构"></el-input>
        </el-form-item>
        <el-form-item prop="webpage">
          <el-input v-model="user.webpage" placeholder="网址"></el-input>
        </el-form-item>
        <el-form-item id="password" prop="password">
          <el-input v-model="user.password" show-password placeholder="密码"></el-input>
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
import axios from "axios";

export default {
  name: "Regist",
 data() {

   const equalToPassword = (rule, value, callback) => {
     if (this.user.password !== value) {
       callback(new Error("两次输入的密码不一致"));
     } else {
       callback();
     }
   };

  return {
    user: {
      username: "",
      name: "",
      password: "",
      confirmPwd:"",
      email:"",
      location:"",
      webpage:"",
      administration:""

    },
    rules: {
      username: [
        //必填，聚焦
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, message: '不允许输入空格等特殊符号',trigger: 'blur'}
      ],
      name: [
        //必填，聚焦
        { required: true, message: '请输入真实姓名', trigger: 'blur' },

      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        //{ pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, message: '不允许输入空格等特殊符号',trigger: 'blur'}
      ],
      confirmPwd: [
        { required: true, message: '请再次输入密码', trigger: 'blur' },
        { required: true, validator: equalToPassword, trigger: "blur" }
      ],

      email:[
        { required: true, message: '请再次输入密码', trigger: 'blur' },
        { pattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/, message: '请检查邮箱格式',trigger: 'blur'}
      ]
    },

  }
},
  methods: {
    doRegist() {
      let _this = this;
      this.$refs.registForm.validate(valid => {
        if (valid) {

          axios.post(_this.$globalInfo.httpPath+'/register',{
                username:_this.user.username,
                address:_this.user.location,
                administration:_this.user.administration,
                webpage:_this.user.webpage,
                name:_this.user.name,
                password:_this.user.password,
                email:_this.user.email,
                userRole:"1"
            }
          ).then(function (response){
            alert("注册成功!")
            console.log(response)
            _this.$router.push("/")
          })
            .catch(function (error){
              alert("NOOOOO")
              console.log(error)
            });
        //   _this.$http.post(_this.$globalInfo.httpPath + '/register' + _this.user.userName
        //     + '&userPwd=' + encodeURIComponent(encodeURIComponent(_this.user.userPwd))
        //     + '&realName=' + _this.user.realName).then(function (resp) {
        //       console.log(resp)
        //    // _this.$router.push({path: "/"})
        //     if(resp.data.code == 200){
        //       _this.$router.push({path: "/"})
        //       _this.$message.success(resp.data.message)
        //     }else{
        //       _this.$message.warning(resp.data.message)
        //       return false;
        //     }
        //   })
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
  height: 700px;
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

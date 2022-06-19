<template>
    <div class="page">
        <div class="login-wrap">
            <el-form class="section1" ref="loginForm" :model="user" :rules="rules" status-icon>
                <span style="white-space: nowrap" class="login-title">XX管理系统</span>
                <br/>
                <br/>
                <el-form-item prop="userName">
                    <el-input v-model="user.userName" placeholder="账号"></el-input>
                </el-form-item>
                <el-form-item id="password" prop="userPwd">
                    <el-input v-model="user.userPwd" show-password placeholder="密码"></el-input>
                </el-form-item>
                <el-form-item label="权限" prop="roles" size="medium">
                  <el-radio-group v-model="user.roles">
                    <el-radio label="投稿人"></el-radio>
                    <el-radio label="审稿人"></el-radio>
                    <el-radio label="主席"></el-radio>
                  </el-radio-group>
                </el-form-item>
                <br/>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-user" @click="doLogin()">登 录</el-button>
                </el-form-item>
              <el-form-item>
                <el-button type="warning" icon="el-icon-user" @click="toRegist()">去注册</el-button>
              </el-form-item>

            </el-form>
        </div>

    </div>
</template>

<script>

    export default {

        data() {

            return {
                user: {
                    userID: "",
                    userName: "",
                    userPwd: "",
                    status:"",
                    roles:""
                },
                rules: {
                    userName: [
                        //必填，聚焦
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    userPwd: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                    ],
                    roles: [
                      { required: true, message: '请选择权限进入', trigger: 'change' }
                    ]
                }

            }
        },
        methods: {
            doLogin() {
              let _this = this
              this.$refs.loginForm.validate(valid => {
                if (valid) {
              _this.$http.post(_this.$globalInfo.httpPath + 'Login?userName=' + _this.user.userName + '&userPwd=' + encodeURIComponent(encodeURIComponent(_this.user.userPwd))).then(function (resp) {
                //console.log(resp)
                if(resp.data.code == 200){
                  sessionStorage.setItem("loginUserName",_this.user.userName)
                  sessionStorage.setItem("loginRealName",resp.data.data.realName)
                  sessionStorage.setItem("UserIsLogin",1)
                  if (resp.data.data.role == 1001){
                    _this.$router.push({path: "/caiwu/Shouye"})
                  }else if(resp.data.data.role == 1002){
                    _this.$router.push({path: "/caiwu/management"})
                  }
              _this.$message.success(resp.data.data.realName+'欢迎您！')
                }else{
                  _this.$message.warning(resp.data.message)
                  return false;
                }

              })
                }})
            },
          toRegist(){
            this.$router.push({path: "/caiwu/Regist"})
          }

        }
    }
</script>

<style>



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
        padding-top: 100px;
        padding-left: 50px;
        width: 320px;
        height: 310px;
    }
    .login-title {
        text-align: center;
        width: 252px;
        height: 28px;
        font-size: 28px;
        font-family: SourceHanSansCN-Bold, SourceHanSansCN;
        font-weight: bold;
        color: #242429;
        line-height: 42px;
        display: block;
        margin-left: 5%;

    }
    #password {
        margin-bottom: 5px;
    }
    .page .el-button {
        width: 100%;
    }


</style>

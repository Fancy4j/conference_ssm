<template>
  <div>
    <el-main>
<!--      {{$route.query}}-->
      <el-container>
        <el-header
          boarder
          style="text-align: left;">
          <div>
                  <span>会议名称：{{$route.query.userID}}</span>
                  <span>开始时间：{{$route.query.starttime}}</span>
                  <span>结束时间：{{$route.query.endtime}}</span>
                  <span>地点：{{$route.query.location}}</span>
          </div>

        </el-header>
        <el-main>ICSE, the International Conference on Software Engineering,® is the premier software engineering conference, providing a forum for researchers, practitioners and educators to present and discuss the most recent innovations, trends, experiences and concerns in the field of software engineering. Note that ICSE: International Conference on Software Engineering® is a registered trademark.
        {{$route.query.introduction}}
          <div style="text-align: right">
            <el-button type="primary" @click="enterSubmit()">提交稿件</el-button>
          </div>

        </el-main>
        <el-footer>
          footer
        </el-footer>
      </el-container>
    </el-main>
  </div>


</template>

<script>
    export default {
        name: "conferenceDetail",
        data(){
            return{


            }
        },
        created() {
            alert(this.$router.query);
        },

        methods:{
          enterSubmit(){
            let _this = this;
            // // alert($router.query.userID);
            // let data = {userID:data.userID , userName:data.userName};
            _this.$router.push({path:'/caiwu/management/conf_submit'})
          }
        }
    }
</script>

<style scoped>
.el-header, .el-footer {
  background-color: #B3C0D1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #D3DCE6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: center;
  line-height: 160px;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
</style>

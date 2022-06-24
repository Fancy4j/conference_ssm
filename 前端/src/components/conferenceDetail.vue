<template>
  <div>
    <el-main>
<!--      {{$route.query}}-->
      <el-container>
        <el-header
          boarder
          height="auto"
          style="text-align: left;">
          <div>
                 <span style="font-size: 30px" >会议名称：{{$route.query.name}}</span><br>
            <span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp开始时间：{{$route.query.starttime}}</span><br>
                  <span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp结束时间：{{$route.query.endtime}}</span><br>
                  <span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp地点：{{$route.query.location}}</span>
          </div>

        </el-header>
        <el-main>
        {{$route.query.detail}}
          <div style="text-align: right">
            <el-button type="primary" @click="enterSubmit($router)">提交稿件</el-button>
          </div>

        </el-main>
<!--        <el-footer>-->
<!--          footer-->
<!--        </el-footer>-->
      </el-container>
    </el-main>
  </div>


</template>

<script>
    export default {
        name: "conferenceDetail",
        data(){
            return{
              meetingId:""


            }
        },
        created() {
          let _this=this
           _this.meetingId=_this.$route.query.meetingId
        //  sessionStorage.getItem("meetingId")
        //  console.log(sessionStorage)


        },

        methods:{
          enterSubmit(){
            let _this = this;
        //    console.log(this.$route.query);
            let data ={meetingId:_this.meetingId}
            _this.$router.push({path:'/caiwu/management/conf_submit',query:data})
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

<!-- 这是审稿人页面-->


<template>
  <div>
    <el-main>
      <el-table
        border
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="meetingName"
          label="会议名称"
          width="auto">
        </el-table-column>
        <el-table-column
          prop="title"
          label="文章名称"
          width="auto">
        </el-table-column>
        <el-table-column
          v-if="false"
          prop="articleId"
          label="articleId"
          width="auto">
        </el-table-column>
        <el-table-column
          prop="ctime"
          label="投稿时间"
          width="120">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          width="auto" >
        </el-table-column>
        <el-table-column
          v-if="false"
          prop="articleRef"
          label=""
          width="auto" >
        </el-table-column>
<!--        <el-table-column-->
<!--          prop="status"-->
<!--          label="稿件状态"-->
<!--          width="200">-->

<!--          <template slot-scope="scope">-->
<!--            <el-button-->
<!--              size="mini"-->
<!--              type="primary"-->
<!--              @click="seeStatus(scope.row)">点击查看-->
<!--            </el-button>-->
<!--          </template>-->
<!--        </el-table-column>-->
        <el-table-column label="" width="auto">
          <template slot-scope="scope">
            <el-button
              :disabled = "scope.row.status == '已审稿'"
              size="mini"
              type="primary"
              @click="reviewArticle(scope.$index, scope.row)" >审稿</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--审稿对话框-->
      <el-container >
        <el-dialog title="审稿中"
                   @closed=""
                   :visible.sync="dialogVisible"
                   width="30%"
                   append-to-body>
          <div style="padding-left: 50px;padding-bottom: 30px">
            <a :href="ref" >文章链接</a>
          </div>
          <br>
          <div style="padding-left: 40px">
            <el-form ref="form" :model="form" label-width="80px">
              <el-form-item label="回复评语">
                <el-input type="textarea" v-model="form.replay" ></el-input>
              </el-form-item >
              <el-form-item label="审稿人ID" v-if = "false">
                <el-input type="input" v-model="form.reviewerId" ></el-input>
              </el-form-item >
              <el-form-item label="文章ID" v-if = "false">
                <el-input type="input" v-model="form.articleId" ></el-input>
              </el-form-item >
              <el-form-item label = "评分">
                <el-rate style="padding-left: 15px;float: left ;padding-top: 12px"
                  v-model="value"
                  show-text>
                </el-rate>
                <el-input style="float: left" type="hidden" v-model="form.status"></el-input>
              </el-form-item>
              <el-form-item style="padding-top: 20px">
                <el-button type="primary" @click="onSubmit">审稿</el-button>
                <el-button>取消</el-button>
              </el-form-item>

            </el-form>

          </div>


        </el-dialog>
      </el-container>


    <br>
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

  import axios from "axios";
  import objectAssign from "element-ui/src/utils/merge";

    export default {
        name: "reviewerManager",
      data(){
          return {
            ref:'',
            tableData:[],
            reviewId:0,
            pageSize:5,
            currentPage:1,
            total: 1,
            dialogVisible: false,
            form: {
              reviewerId:0,
              articleId:0,
              replay: '',
              status:0
            },
            value: 0
          }


      },
      created() {


        this.loginUserName = sessionStorage.getItem("loginUserName");
        this.reviewId = sessionStorage.getItem("userId");
        this.handleCurrentChange();



      },
      methods:{
        validate(callback) {
          if (!this.model) {
            console.warn('[Element Warn][Form]model is required for validate to work!');
            return;
          }

          let promise;
          // if no callback, return promise
          if (typeof callback !== 'function' && window.Promise) {
            promise = new window.Promise((resolve, reject) => {
              callback = function(valid) {
                valid ? resolve(valid) : reject(valid);
              };
            });
          }

          let valid = true;
          let count = 0;
          // 如果需要验证的fields为空，调用验证时立刻返回callback
          if (this.fields.length === 0 && callback) {
            callback(true);
          }
          let invalidFields = {};
          this.fields.forEach(field => {
            field.validate('', (message, field) => {
              if (message) {
                valid = false;
              }
              invalidFields = objectAssign({}, invalidFields, field);
              if (typeof callback === 'function' && ++count === this.fields.length) {
                callback(valid, invalidFields);
              }
            });
          });

          if (promise) {
            return promise;
          }
        },

        handleCurrentChange(){
          const _this = this;

          _this.$http.get(_this.$globalInfo.httpPath+'reviewer/queryAllMessage?reviewerId='+_this.reviewId+'&pageNum='+_this.currentPage
          +'&pageSize='+_this.pageSize).then(function (resp) {
            //console.log(resp)
            if(resp.data.code == 200){

              _this.tableData=resp.data.data.list;
              _this.total = resp.data.data.total;
              for (let i = 0; i<_this.tableData.length;i++){
                if(_this.tableData[i].status > 2){
                  _this.tableData[i].status = "已审稿";
                }else{
                  _this.tableData[i].status = "待审稿";
                }
              }
            }else{
              _this.$message.warning(resp.data.message);
              return false;
            }

          })
        },
        reviewArticle(index , row){
          const _this = this;
          _this.dialogVisible = true;
          _this.form.articleId = row.articleId;
          _this.ref=row.articleRef
        },
        filterTime(time) {
          var date = new Date(time);
          var y = date.getFullYear();
          var m = date.getMonth() + 1;
          m = m < 10 ? "0" + m : m;
          var d = date.getDate();
          d = d < 10 ? "0" + d : d;
          var h = date.getHours();
          h = h < 10 ? "0" + h : h;
          var minute = date.getMinutes();
          minute = minute < 10 ? "0" + minute : minute;
          var s = date.getSeconds();
          s = s < 10 ? "0" + s : s;
          return y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + s;
        },
        getTTT(){
          let date= new Date();
          return this.filterTime(date);
        },
        onSubmit() {
          let _this = this;

          _this.form.reviewerId = parseInt(_this.reviewId);

          if (_this.value >=4 ){
            _this.form.status = 3;
          }else if(_this.value == 3 ){
            _this.form.status = 2;
          }else {
            _this.form.status = 4;
          }
          _this.$refs.form.validate(valid => {
            if (valid) {
              let data = {reviewerId : _this.form.reviewerId,
                          articleId : _this.form.articleId,
                          replay : _this.form.replay,
                          status : _this.form.status,
                          replayTime: _this.getTTT()
              };
              let config={
                headers:{'Content-Type':'multipart/form-data'}
              };
              axios.post(_this.$globalInfo.httpPath+'reviewer/addReviewerRecord',data).then(function (response) {
                  _this.$message.success(response.data.message);
                  _this.flush();
                  _this.dialogVisible = false;
              }).catch(function (error){
                console.log(error)
                _this.$message.error("输入有误，操作失败");
              });
              //alert(JSON.stringify(data));
              // _this.$http.post(_this.$globalInfo.httpPath + 'reviewer/addReviewerRecord?id=1&reviewerReplay=',data).then(function (resp) {
              //   console.log(resp)
              //   alert("???");
              //   // _this.$router.push({path: "/"})
              //   if(resp.data.code == 200){
              //     _this.$router.push({path: "/caiwu/management/reviewerManager"})
              //     _this.$message.success(resp.data.message)
              //   }else{
              //     alert("youwenti")
              //     _this.$message.warning(resp.data.message)
              //     return false;
              //   }
              //  })
            }})
        },
        flush(){
          this.handleCurrentChange(1)
        }
      }
    }
</script>

<style scoped>

</style>

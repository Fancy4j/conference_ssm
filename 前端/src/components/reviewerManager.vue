<!-- 这是审稿人页面-->


<template>
  <div>
    <el-main>
      <el-table
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
          prop="ctime"
          label="投稿时间"
          width="120">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
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
            <el-link href="https://www.baidu.com" target="_blank">文章链接</el-link>
          </div>
          <br>
          <div style="padding-left: 40px">
            <el-form ref="form" :model="form" label-width="80px">
              <el-form-item label="回复评语">
                <el-input type="textarea" v-model="form.desc" ></el-input>
              </el-form-item >
              <el-form-item label = "评分">
                <el-rate style="padding-left: 15px;float: left ;padding-top: 12px"
                  v-model="value"
                  show-text>
                </el-rate>
                <el-input style="float: left" type="hidden" v-model="form.value"></el-input>
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
    export default {
        name: "reviewerManager",
      data(){
          return {
            tableData:[],
            reviewId:0,
            pageSize:5,
            currentPage:1,
            total: 1,
            dialogVisible: false,
            form: {
              desc: '',
              value:0
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
        handleCurrentChange(){
          const _this = this;

          _this.$http.get(_this.$globalInfo.httpPath+'reviewer/queryAllMessage?reviewerId='+_this.reviewId+'&pageNum='+_this.currentPage
          +'&pageSize='+_this.pageSize).then(function (resp) {
            //console.log(resp)
            if(resp.data.code == 200){

              _this.tableData=resp.data.data.list;
              _this.total = resp.data.data.total;
              for (let i = 0; i<_this.tableData.length;i++){
                if(_this.tableData[i].status >= 2){
                  _this.tableData[i].status = "已审稿";
                }else{
                  _this.tableData[i].status = "未审稿";
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
        },
        onSubmit() {
          console.log('submit!');
        }
      }
    }
</script>

<style scoped>

</style>

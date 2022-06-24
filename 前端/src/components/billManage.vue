<template>
  <div>
    <el-form :inline="true" label-width="80px">
      <el-form-item>
        <el-input v-model="search"
                  placeholder="请输入文章名称"
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
      <el-form-item>
        <el-button
          class="el-icon-refresh"
          @click="flush">刷新
        </el-button>
      </el-form-item>
    </el-form>
    <el-main>
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="title"
          label="文章标题"
          width="180">
        </el-table-column>
        <el-table-column
          prop="authors"
          label="作者"
          width="100">
        </el-table-column>
        <el-table-column
          prop="name"
          label="会议名称"
          width="120">
        </el-table-column>
        <el-table-column
          prop="ctime"
          label="投稿时间"
          width="150">
        </el-table-column>
        <el-table-column
          prop="articleRef"
          label="文章链接"
          width="200">
        </el-table-column>
        <el-table-column
          prop="status"
          label="稿件状态"
          width="200">

          <template slot-scope="scope">
            <el-button
            size="mini"
            type="primary"
            @click="seeStatus(scope.row)">点击查看
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="auto">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="billUpdate(scope.$index, scope.row)">修改稿件</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="billDelete(scope.$index, scope.row)">撤回稿件</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 显示稿件状态-->
    <el-container >
      <el-dialog title="审稿进度"
                 @closed="clearActivities"
                 :visible.sync="dialogStatus"
                 width="30%"
                 append-to-body>
          <div class="block">
            <span STYLE="float: left">审稿人回复：</span>
            <div style="margin-left: 50px"> {{content}}</div><br><br><br>
            <el-timeline :reverse="reverse">

              <el-timeline-item
                v-for="(activity, index) in activities"
                :key="index"
                :timestamp="activity.timestamp">
                {{activity.content}}

              </el-timeline-item>
            </el-timeline>
          </div>
      </el-dialog>
      </el-container>

<!--      oninput="value=value.replace(/[^\d]/g,'')"-->
<!--      更新发票信息表单-->
      <el-dialog title="修改稿件" :visible.sync="dialogUpdate" append-to-body>
        <el-form :model="entityObj" ref="updateFormData" :rules="rules">
          <el-form-item label="文章标题：" :label-width="formLabelWidth" prop="title">
            <el-input v-model="entityObj.title" placeholder="请输入新的文章标题"></el-input>
          </el-form-item>
          <el-form-item label="作者：" :label-width="formLabelWidth" prop="authors">
            <el-input v-model="entityObj.authors" ></el-input>
          </el-form-item>
           <el-upload
              ref="upload"
              class="upload-demo"
              action="#"
              accept=".pdf"
              :auto-upload="false"
              :on-change="uploadFile"
              :show-file-list="false"
            >
          <el-button type="warning">上传文章</el-button>
        </el-upload>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogUpdate = false">取 消</el-button>
          <el-button type="primary" @click="updateSure">确 定</el-button>
        </div>
      </el-dialog>
      <!--分页-->
      <br/>
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

export default {
  name: "billManage",
  data() {
    return {
      content:'',
      fileList:[],
      reverse:true,
      activities: [],
      loginUserName: "",
      search: '',
      dialogUpdate:false,
      dialogStatus:false,
      tableData: [],
      total: 1,
      pageSize: 5,
      currentPage:1,
      formLabelWidth: '120px',
      isUpdateEntityObj:{},
      entityObj:{
        title:'',
        authors:'',
        name:'',
        ctime:'',
        status:''
      },
      statusOld:'',
      rules: {//必填，聚焦
        status: [{ required: true, message: '请输入文章标题', trigger: 'blur' }],
        baoxiaoName: [{ required: true, message: '请输入作者', trigger: 'blur' }],
        realName: [{ required: true, message: '请输入录入人真实姓名', trigger: 'blur' }],
        amount: [{ required: true, message: '请输入金额', trigger: 'blur' },
          {pattern: /^-?\d{1,16}(?:\.\d{1,4})?$/g,
           message: "请输入合法的金额数字，最多保留4位小数",
           trigger: "blur"
          }]
      },
    }
  },
  created() {
    this.loginUserName = sessionStorage.getItem("loginUserName");
    this.handleCurrentChange(this.currentPage);
  },

  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
      uploadFile (item) {
        let _this = this;
        let formData = new FormData();
        let file = item.raw;
        alert(file.length);
        formData.append('file', file);
        this.$http({
          url: _this.$globalInfo.httpPath+'/fileCommon/uploadV2', //后端提供的接口
          method: 'post',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(({data}) => {
          this.$alert(data.data)
        })
      },
    searchInfo(){
      const _this = this
      _this.$http.get(_this.$globalInfo.httpPath+'/contributor/queryArticlesByName?userId=' + sessionStorage.getItem("userId")+'&articleName='+_this.search+'&pageNum='+_this.currentPage+'&pageSize='+_this.pageSize).then(function (resp) {
        //console.log(resp)
        if(resp.data.code == 200){
          console.log(resp.data.data.list)
          // 封装数组

          _this.tableData=resp.data.data.list
          //_this.tableData=resp.data.data

          _this.total = resp.data.data.total
        }else{
          _this.$message.warning(resp.data.message)
          return false;
        }
      })
    },
    flush(){
      this.handleCurrentChange(1)
    },
    handleCurrentChange(currentPage){
      const _this = this
      _this.currentPage = currentPage
      _this.$http.get(_this.$globalInfo.httpPath+'contributor/queryArticles?userId='+sessionStorage.getItem("userId")+'&pageNum='+ _this.currentPage+'&pageSize='+_this.pageSize).then(function (resp) {
        //console.log(resp)
        if(resp.data.code == 200){

          _this.tableData=resp.data.data.list
          console.log(_this.tableData)

          _this.total = resp.data.data.total
        }else{
          _this.$message.warning(resp.data.message);
          return false;
        }


      })

    },
    billUpdate(index, row){
      const _this = this
      _this.dialogUpdate = true;
      _this.statusOld=row.status
      //先把表单置空,清除校验提示信息残留

      axios.post(_this.$globalInfo.httpPath+'/contributor/addContribution?meetingId='+_this.$route.query.meetingId+'&userArticle=',{
          authors: _this.dynamicValidateForm.author1+_this.compute(),
          email:_this.dynamicValidateForm.email,
          content: _this.dynamicValidateForm.content,
          title:_this.dynamicValidateForm.title,
          articleRef:_this.dynamicValidateForm.ref,
          ctime: _this.getTTT(),
          status:1,
          userId:_this.userId

        }
      ).then(function (response){
        alert("yes!")
        console.log(response)
      })
        .catch(function (error){
          alert("NOOOOO")
          console.log(error)
        });

      _this.entityObj.realName=row.user.realName
      this.dialogUpdate = true

    },
    updateSure(){
      let _this = this
      let loginUserName = sessionStorage.getItem("loginUserName");
      this.$refs.updateFormData.validate(valid => {
        if (valid) {
         // console.log(_this.entityObj)
          _this.$http.post(_this.$globalInfo.httpPath+'billUpdate?statusOld=' + _this.statusOld
            + '&status='+_this.entityObj.status + '&baoxiaoName='+_this.entityObj.baoxiaoName
            + '&amount='+_this.entityObj.amount+ '&userName=' + loginUserName).then(function (resp) {
            console.log(resp)
            if(resp.data.code == 200){
              _this.$message.success(resp.data.message)
              _this.dialogUpdate=false
              _this.handleCurrentChange(1)
            }else{
              _this.$message.warning(resp.data.message);
              return false;
            }
          })
        }
      })
    },
    seeStatus(row){
        let _this = this;
        _this.dialogStatus = true;

      _this.$http.get(_this.$globalInfo.httpPath+'/contributor/checkArticle?articleId='+row.articleId).then(function (resp) {
        if(resp.data.code == 200){
          _this.content=resp.data.data.replay

        }else {
          _this.content=''
        }
      })

        let item = [ {content: '待审核',
                  // timestamp: row.ctime
          timestamp:'2022-06-24'
              }, {
            content: '审核中',
              timestamp: '2022-06-24'
          }, {
            content: '已通过',
              timestamp: '2022-06-24'
        },
          {
            content: '拒绝',
            timestamp: '2022-06-24'
        },{
          content: "撤稿",
            timestamp: '2022-06-24'
          }];

        if(row.status==10){
          _this.activities.push(item[0]);
          _this.activities.push(item[1]);
          _this.activities.push(item[4]);
          return
        }
        if(row.status < 4){
            for(let i = 0; i < row.status; i++){
              _this.activities.push(item[i]);
            }
        }else{
            _this.activities.push(item[0]);
            _this.activities.push(item[1]);
            _this.activities.push(item[3]);
        }
    },
    clearActivities(){
      let _this = this;
      _this.activities.length = 0;
      _this.content=''
    },
    billDelete(index, row){
      const _this = this
      this.$confirm('撤销稿件, 是否继续?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        _this.$http.get(_this.$globalInfo.httpPath+'contributor/delContrubution?articleId='+row.articleId).then(function (resp) {
          if(resp.data.code == 200){
            _this.$message.success(resp.data.message)
            // location.reload()
            _this.handleCurrentChange(_this.currentPage)
          }else {
            _this.$message.error(resp.data.message)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
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
  }
}
</script>

<style scoped>

</style>

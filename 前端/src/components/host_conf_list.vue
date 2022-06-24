<!-- 这是会议列表的页面-->

<template >
  <div style="margin:0 auto">
    <el-main>
      <div style="margin-bottom: 20px;text-align: left">
        <span><b>会议列表</b></span>

      </div>
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        :row-class-name="tableRowClassName">
        <el-table-column
          prop="name"
          label="会议名称"
          width="auto">
        </el-table-column>
        <el-table-column
          sortable
          prop="abbreviation"
          label="会议简称"
          width="auto">
        </el-table-column>
        <el-table-column
          sortable
          prop="theme"
          label="会议主题"
          width="auto">
        </el-table-column>
        <el-table-column
          sortable
          prop="starttime"
          label="开始时间"
          width="auto">
        </el-table-column>
        <el-table-column
          prop="endtime"
          sortable
          label="截止时间"
          width="auto">
        </el-table-column>
        <el-table-column
          prop="meetingId"
          v-if="false"
          label=""
          width="auto">
        </el-table-column>




        <el-table-column
          prop="status"
          label="状态" width="auto"
          :filters="[{ text: '进行中', value: 1 }, { text: '已结束', value: 0 }]"
          :filter-method="filterStatus">
          <template slot-scope="scope">
            <span v-if="scope.row.status==1" style="color: #67C23A;">进行中</span>

            <span v-else style="color: #F56C6C;">已结束</span>

          </template>
        </el-table-column>


        <el-dialog title="指派审稿人"
                   :visible.sync="dialogVisible1"
                   width=""
                   @close="clearvalue()"
                   append-to-body>

          <el-transfer v-model="value" :data="data"
                       filterable
                       :titles="['未分配的审稿人', '已分配的审稿人']">

          </el-transfer>

          <div slot="footer" class="dialog-footer">

            <el-button @click="dialogVisible1 = false">取 消</el-button>
            <el-button type="primary" @click="queding()">确 定</el-button>
          </div>
        </el-dialog>


        <!---------------------------------------------修改的dialog-->
        <el-dialog title="修改会议信息"
                   :visible.sync="dialogVisible2"
                   width=""
                   @close=""
                   append-to-body>


          <el-form :model="form">
            <el-form-item label="会议名称" :label-width="formLabelWidth">
              <el-input v-model="form.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="会议简称" :label-width="formLabelWidth">
              <el-input v-model="form.abbreviation" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="会议简介" :label-width="formLabelWidth">
              <el-input type="textarea" v-model="form.detail"></el-input>
            </el-form-item>
          </el-form>


          <div slot="footer" class="dialog-footer">
            <!--              <template slot-scope="scope">-->
            <el-button @click="dialogVisible2 = false">取 消</el-button>
            <!--             </template>-->

            <el-button type="primary" @click="updateform()">确 定</el-button>

          </div>

        </el-dialog>
        <el-table-column
          prop=""
          label="指派审稿人"
          width="auto">
          <template slot-scope="scope">
            <el-button type="primary"  @click="click_appoint(scope.row)">指派</el-button>



        </template>
        </el-table-column>

          <el-table-column
            prop="modify"
            label="修改会议信息"
            width="auto">
            <template slot-scope="scope">
              <el-button type="primary"  @click="modify(scope.row)">修改</el-button>
            </template>
          </el-table-column>

        <el-table-column
          prop="paigao"
          label="一键派稿"
          width="auto">
          <template slot-scope="scope">
            <el-button type="primary"  @click="paigao(scope.row)">派稿</el-button>
          </template>
        </el-table-column>

      </el-table>
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
  name: "host_conf_list",
  data() {
    // const generateData = _ => {
    //   const data = [];
    //   for (let i = 1; i <= 15; i++) {
    //     data.push({
    //       key: i,
    //       label: `备选项 ${ i }`,
    //       disabled: i % 4 === 0
    //     });
    //   }
    //   return data;
    // };
    return {
      tmpdata:[],
      data: [],
      value: [],
      findIdByIndex:[],
      form: {
        name: '',
        abbreviation: '',
        detail: ''
      },
      formLabelWidth: '120px',
      meetingId:"",
      loginUserName: "",
      userId:"",
      tableData: [],
      total: 1,
      pageSize: 10,
      currentPage:1,
      dialogVisible1:false,
      dialogVisible2:false
    }
  },
  created() {
    this.loginUserName = sessionStorage.getItem("loginUserName")
    this.userId = sessionStorage.getItem("userId")
    this.handleCurrentChange(this.currentPage,this.pageSize,this.userId)
  },

  methods: {
    handleCurrentChange(currentPage,pageSize,userId){
      const _this = this
      _this.currentPage = currentPage
      _this.pageSize = pageSize
      _this.userId = userId
      _this.$http.get(_this.$globalInfo.httpPath+'/host/queryMeetingList?hostId='+_this.userId +'&pageNum='+ _this.currentPage+'&pageSize='+_this.pageSize).then(function (resp) {

        if(resp.data.code == 200){
          _this.tableData=resp.data.data.list
          _this.total = resp.data.data.total
        }else{
          _this.$message.warning(resp.data.message);
          return false;
        }
      })

    },
    filterStatus(value, row){
      return row.status === value;
    }
    ,


    handleEnable(index, row) {
      console.log(index, row);
      //row.status=0?1:0
      let title = ''
      // 启用传1 ，禁用传0
      if (row.status === 1) {
        title = '禁用'
      }else {
        title = '启用'
      }
      let _this = this
      this.$confirm(`是否确认${title}用户名称为"${row.userName}"的数据项?`, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        _this.$http.post(_this.$globalInfo.httpPath + 'userStatusUpdate?userName=' + row.userName).then(function (resp) {
          // console.log(resp)
          if(resp.data.code == 200){
            _this.handleCurrentChange(_this.currentPage)
            _this.$message({
              type: 'success',
              message: resp.data.message
            });
          }else{
            _this.$message.warning(resp.data.message);
            return false;
          }
        })
      }).catch(() => {
        _this.$message({
          type: 'info',
          message: `已取消${title}`
        });
      });

    },

    handleUpdate(index, row) {
      // console.log(index, row);
      let _this = this
      this.$confirm('用户重置, 是否继续?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        _this.$http.post(_this.$globalInfo.httpPath + 'userResetPassword?userName=' + row.userName).then(function (resp) {
          // console.log(resp)
          if(resp.data.code == 200){
            _this.$message({
              type: 'success',
              message: resp.data.message
            });
          }else{
            _this.$message.warning(resp.data.message);
            return false;
          }

        })
      }).catch(() => {
        _this.$message({
          type: 'info',
          message: '已取消重置'
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
    tableRowClassName({row, rowIndex}) {

      if (rowIndex === 1) {
        return 'warning-row';
      } else if (rowIndex === 3) {
        return 'success-row';
      }
      return '';
    },
    goBack() {
      console.log('go back');
    },
    clearvalue(){
      let _this=this
      _this.data.length=0
      _this.value.length=0
      this.$router.go(0)
    },
    click_appoint(row){
      let _this = this;
      _this.data=[]
      _this.value=[]
      _this.meetingId=row.meetingId;
      ///////////index必须赋初值
      let index =0
      let length1
     // alert("弹出指派窗口");
      _this.dialogVisible1 = true;
      /////////////得到未分配的审稿人 放左边
      axios.get(_this.$globalInfo.httpPath+'/host/reviewerAvailable?meetingId='+row.meetingId


      ).then(function (response){
       // alert("左边yes!")
        if(response.data.data==null){
          return
        }
        length1=response.data.data.length


        for(;index<response.data.data.length;index++){
          let tmp={
            key:index,
            label:response.data.data[index].name
          }
          let tmp2={
            _key:index,
            _value:response.data.data[index].userId
          }
          _this.findIdByIndex.push(tmp2)
          console.log(response.data.data[index].userId)
          _this.data.push(tmp)

        }

      })
        .catch(function (error){
          alert("左边NOOOOO")
          console.log(error)
        });
//////////////////////////////////得到已分配的审稿人 放右边
      axios.get(_this.$globalInfo.httpPath+'/host/reviewerAllocated?meetingId='+_this.meetingId
      ).then(function (response){
    //    console.log(response.data.data)
      //  alert("右边yes!")
        for(;index<response.data.data.length+length1;index++){
          let tmp={
            key:index,
            label:response.data.data[index-length1].name
          }
          let tmp2={
            _key:index,
            _value:response.data.data[index-length1].userId
          }
          _this.findIdByIndex.push(tmp2)
     //     console.log("userId   "+response.data.data[index-length1].userId)
          _this.data.push(tmp)
          _this.value.push(index)
       //   console.log(_this.data)
        }
       // console.log(response.data)
        //  _this.handleCurrentChange(_this.currentPage,_this.pageSize,_this.userId);
      })
        .catch(function (error){
          alert("右边NOOOOO")
          console.log(error)
        });


    },
    modify(row){
      let _this= this;
      _this.dialogVisible2 = true;
      _this.meetingId=row.meetingId;
    },
    paigao(row){
      let _this=this;
      axios.get(_this.$globalInfo.httpPath+'/host/dispatchArticle?meetingId='+row.meetingId
      ).then(function (response){
        alert("派稿成功!")
        console.log(response.data)
      })
        .catch(function (error){
          alert("NOOOOO")
          console.log(error)
        });

    },
    updateform(){
    //  alert("meetingId:"+row.meetingId)

      alert("console row")
      let _this=this;
      console.log(_this.meetingId)
      ///////////////////////////////////////////////////////////////////////////////////////////////
      axios.post(_this.$globalInfo.httpPath+'/host/updateMeeting?meetingInfo=',{

          //   meetingId:row.tableData.meetingId,
          abbreviation: _this.form.abbreviation,
          detail: _this.form.detail,
          meetingId: _this.meetingId,
          name: _this.form.name


          }


      ).then(function (response){
        //alert("yes!")
        console.log(response)
        _this.dialogVisible2=false
        _this.handleCurrentChange(_this.currentPage,_this.pageSize,_this.userId);
      })
        .catch(function (error){
        alert("NOOOOO")
          console.log(error)
        });

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
    queding(row){
      let _this=this;
      _this.dialogVisible1=false;
      let i=0
      let c=[]
      let a=''
      for(;i<_this.value.length;i++){
      //  alert(_this.findIdByIndex[_this.value[i]])
        c.push(_this.findIdByIndex[_this.value[i]]._value)

      }
      if(c.length==0){a=','}else {a=c.join(',')}
      console.log(a)
      // console.log("value:::::::::"+_this.value)
      // console.log("IDs:::::::::"+_this.findIdByIndex)

      console.log(_this.$globalInfo.httpPath+'/host/userStatusUpdate2?meetingId='+_this.meetingId+'&appointTime='+_this.getTTT()+'&userIds='+a)
      axios.post(_this.$globalInfo.httpPath+'/host/userStatusUpdate2?meetingId='+_this.meetingId+'&appointTime='+_this.getTTT()+'&userIds='+a,

      ).then(function (response){

     //   alert("yes!")
        console.log(response)
        _this.dialogVisible2=false
        _this.handleCurrentChange(_this.currentPage,_this.pageSize,_this.userId);
      })
        .catch(function (error){
          alert("NOOOOO")
          console.log(error)
        });

    },
    handleLeft(){
      alert("点击左三角")
    },
    handleRight(){
      alert("点击右三角")
    }
  }
}
</script>

<style scoped>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>

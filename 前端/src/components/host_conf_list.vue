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
                   @close=""
                   append-to-body>
          <el-transfer
            filterable
            :filter-method="filterMethod"
            filter-placeholder="请输入城市拼音"
            v-model="value"
            :data="data">
          </el-transfer>
          <!--          <el-form ref="loginForm" :model="loginForm" :rules="rules">-->
          <!--            <el-form-item label="新密码" prop="password" :label-width="formLabelWidth">-->
          <!--              <el-input-->
          <!--                type="password"-->
          <!--                show-password-->
          <!--                auto-complete="off"-->
          <!--                placeholder="请设置新密码"-->
          <!--                v-model="loginForm.password"-->
          <!--              ></el-input>-->
          <!--            </el-form-item>-->
          <!--            <el-form-item label="确认密码" prop="password2" :label-width="formLabelWidth">-->
          <!--              <el-input-->
          <!--                type="password"-->
          <!--                show-password-->
          <!--                auto-complete="off"-->
          <!--                placeholder="请确认新密码"-->
          <!--                v-model="loginForm.password2"-->
          <!--              ></el-input>-->
          <!--            </el-form-item>-->
          <!--          </el-form>-->
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible1 = false">取 消</el-button>
            <el-button type="primary" @click="updatePwd">确 定</el-button>
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

    const generateData = _ => {
      const data = [];
      const cities = ['上海', '北京', '广州', '深圳', '南京', '西安', '成都'];
      const pinyin = ['shanghai', 'beijing', 'guangzhou', 'shenzhen', 'nanjing', 'xian', 'chengdu'];
      cities.forEach((city, index) => {
        data.push({
          label: city,
          key: index,
          pinyin: pinyin[index]
        });
      });
      return data;
    };
    return {
      form: {
        name: '',
        abbreviation: '',
        detail: ''
      },
      formLabelWidth: '120px',
      data: generateData(),
      value: [],
      filterMethod(query, item) {
        return item.pinyin.indexOf(query) > -1;
      },
      meetingId:"",
      loginUserName: "",
      userID:"",
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
    this.userID = sessionStorage.getItem("userID")
    this.handleCurrentChange(this.currentPage,this.pageSize,this.userID)
  },

  methods: {
    handleCurrentChange(currentPage,pageSize,userID){
      const _this = this
      _this.currentPage = currentPage
      _this.pageSize = pageSize
      _this.userID = userID
      _this.$http.get(_this.$globalInfo.httpPath+'/host/queryMeetingList?hostId='+_this.userID +'&pageNum='+ _this.currentPage+'&pageSize='+_this.pageSize).then(function (resp) {

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
    click_appoint(row){
      let _this = this;
     // alert("弹出指派窗口");
      _this.dialogVisible1 = true;

      let data = {userID:row.userID , userName:row.userName , userPwd:row.userPwd , status:row.status , role:row.role , realName:row.realName,location:row.location,starttime:row.starttime,endtime:row.endtime,name:row.name};
    //  _this.$router.push({path:'/caiwu/management/conferenceDetail',query: data})
    },
    modify(row){
      let _this= this;
      _this.dialogVisible2 = true;
      _this.meetingId=row.meetingId;
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
        alert("yes!")
        console.log(response)
        _this.dialogVisible2=false
        _this.handleCurrentChange(_this.currentPage,_this.pageSize,_this.userID);
      })
        .catch(function (error){
        alert("NOOOOO")
          console.log(error)
        });


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

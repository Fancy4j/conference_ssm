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
        sortable
        prop="starttime"
        label="开始时间"
        width="257">
      </el-table-column>
      <el-table-column
        prop="endtime"
        sortable
        label="截止时间"
        width="257">
      </el-table-column>
      <el-table-column
        sortable
        prop="abbreviation"
        label="会议简称"
        width="259">
      </el-table-column>
      <el-table-column
        prop="name"
        label="会议名称"
        width="259">
      </el-table-column>
      <el-table-column
        v-if="false"
        prop="detail"
        label="detail"
        width="259">
      </el-table-column>
      <el-table-column
        v-if="false"
        prop="meetingId"
        label="meetingId"
        width="259">
      </el-table-column>


      <el-table-column
        prop="status"
        label="状态" width="256"
        :filters="[{ text: '进行中', value: 1 }, { text: '已结束', value: 0 }]"
        :filter-method="filterStatus">
        <template slot-scope="scope">
          <span v-if="scope.row.status==1" style="color: #67C23A;">进行中</span>

          <span v-else style="color: #F56C6C;">已结束</span>

        </template>
      </el-table-column>



      <el-table-column
        prop="ref"
        label="会议链接"
        width="258">
        <template slot-scope="scope">
          <el-button type="primary"  @click="enterDetail(scope.row)">点击进入</el-button>

        </template>
      </el-table-column>
<!--      <el-table-column label="操作" width="180">-->
<!--        <template slot-scope="scope">-->
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="text"-->
<!--            @click="handleEnable(scope.$index, scope.row)">-->
<!--            <span v-if="scope.row.status==0" style="color: #67C23A;">启用</span>-->
<!--            <span v-else style="color: #F56C6C;">禁用</span>-->
<!--          </el-button>-->
<!--          <el-button-->
<!--            size="mini"-->
<!--            @click="handleUpdate(scope.$index, scope.row)">重置</el-button>-->
<!--        </template>-->
<!--      </el-table-column>-->
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
export default {
  name: "userManage",
  data() {
    return {
      userId:"",
      meetingId: "",
      detail:"",
      loginUserName: "",
      tableData: [],
      total: 1,
      pageSize: 10,
      currentPage:1,
    }
  },
  created() {
    this.loginUserName = sessionStorage.getItem("loginUserName")
    this.handleCurrentChange(this.currentPage)

  },

  methods: {
    handleCurrentChange(currentPage){
      const _this = this
      _this.currentPage = currentPage
      _this.$http.get(_this.$globalInfo.httpPath+'meeting/getMeetingList?pageNum='+ _this.currentPage+"&pageSize="+_this.pageSize).then(function (resp) {
        //console.log(_this.currentPage)
       // console.log(resp)
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
          // let date = new Date();
          // if( value == 1 && row.endtime.getTime() - date.getTime() > 0){
          //     return true;
          // }else if(row.endtime.getTime() - date.getTime() < 0) {
          //       return true;
          // }
          // return false;
          return value === row.status;
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
    enterDetail(row){
      let _this = this;
      let data = {name:row.name , starttime:row.starttime , endtime:row.endtime , location:row.location , detail:row.detail,meetingId:row.meetingId};
      sessionStorage.setItem("meetingId",row.meetingId)
      _this.$router.push({path:'/caiwu/management/conferenceDetail',query: data})

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

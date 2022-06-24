<template>
  <el-form ref="form" :model="form" label-width="80px">
    <el-form-item label="会议名称">
      <el-input v-model="form.name"></el-input>
    </el-form-item>
    <el-form-item label="名称缩写">
      <el-input v-model="form.abbreviation"></el-input>
    </el-form-item>
    <el-form-item label="会议主题">
      <el-input v-model="form.theme"></el-input>
    </el-form-item>
    <el-form-item label="会议网址">
      <el-input v-model="form.ref"></el-input>
    </el-form-item>
    <el-form-item label="会议位置">
      <el-input v-model="form.location"></el-input>
    </el-form-item>
<!--    <el-form-item label="会议位置" >-->
<!--      <div id="app" style="text-align: left">-->
<!--        <el-cascader-->
<!--          size="large"-->
<!--          :options="options"-->

<!--          v-model="form.location"-->

<!--          @change="handleChange">-->
<!--          &lt;!&ndash;          ————————————————————————————————————————————————          &ndash;&gt;-->
<!--        </el-cascader>-->
<!--      </div>-->
<!--    </el-form-item>-->
    <el-form-item label="起止时间">
      <el-date-picker
        @click="getTime1()"
        end-placeholder="结束日期"
        range-separator="至"
        start-placeholder="开始日期"
        type="datetimerange"
        v-model="value1"
        :default-time="['00:00:00', '23:59:59']"
      >
      </el-date-picker>
    </el-form-item>

    <el-form-item label="会议介绍">
      <el-input type="textarea" v-model="form.detail"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">立即创建</el-button>
      <el-button>取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { regionData, CodeToText, TextToCode } from 'element-china-area-data'
import axios from "axios";
export default {
  name: "host_submit",
  data() {
    return {
      value1:[],
      options: regionData,
      selectedOptions: [],
      form: {
        name: '',
        location: '',
        startdate1: '',
        startdate2: '',
        enddate2: '',
        enddate1: '',
        abbreviation: '',
        detail: '',
        theme:'',
        ref:''
      }
    }
  },
  created() {
    this.loginUserName = sessionStorage.getItem("loginUserName")
    this.userID = sessionStorage.getItem("userId")
  },
  methods: {
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

    // 在获取详情信息接口中使用 TextToCode 将字符串转换成编码赋给 selectedOptions
    projectInfo () {
      var that = this;
      getProjectInfo({ token: getToken(), id: that.id }).then(res => {
        this.addForm = {
          id: res.id,
          // 基础信息
          p_name: res.p_name,   //项目名
          p_message: res.p_message,   //项目信息
          area: res.area,   //地区
          remark: res.remark,   //备注
        }
        this.selectedOptions = TextToCode[this.addForm.area.split('/')[0]][this.addForm.area.split('/')[1]][this.addForm.area.split('/')[2]].code;

      }).catch(err => {
        Message.error(err)
      })
    },
    handleChange (value) {
      console.log(value)
      this.getCodeToText(null, value)
    },
    getCodeToText (codeStr, codeArray) {
      if (null === codeStr && null === codeArray) {
        return null;
      } else if (null === codeArray) {
        codeArray = codeStr.split(",");
      }
      let area = "";
      switch (codeArray.length) {
        case 1:
          area += CodeToText[codeArray[0]];
          break;
        case 2:
          area += CodeToText[codeArray[0]] + "/" + CodeToText[codeArray[1]];
          break;
        case 3:
          area +=
            CodeToText[codeArray[0]] +
            "/" +
            CodeToText[codeArray[1]] +
            "/" +
            CodeToText[codeArray[2]];
          break;
        default:
          break;
      }
      console.log(area)
      this.addForm.area = area
      return area;
    },
    //////////////////////////
    onSubmit() {
      let _this=this;
      axios.post(_this.$globalInfo.httpPath+'/host/addMeeting?hostId='+_this.userID+'&meetingInfo=',{
          abbreviation: _this.form.abbreviation,
          detail: _this.form.detail,
          name: _this.form.name,
          theme:_this.form.theme,
          ref:_this.form.ref,
       //   location:_this.selectedOptions,
          location:_this.form.location,
        starttime:_this.filterTime(_this.value1[0]),
        endtime:_this.filterTime(_this.value1[1])
        }
      ).then(function (response){
        alert("yes!")
        console.log(response)
        console.log(_this.filterTime(_this.value1[0]))
        console.log(_this.filterTime(_this.value1[1]))
      })
        .catch(function (error){
          alert("NOOOOO")
          console.log(error)
          console.log(_this.filterTime(_this.value1[0]))
          console.log(_this.filterTime(_this.value1[1]))
        });
    }
  }
}
</script>

<style scoped>

</style>

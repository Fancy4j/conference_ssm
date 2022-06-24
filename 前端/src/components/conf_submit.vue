<template>
<!--  <el-form ref="form" :model="form" label-width="80px">-->

    <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="100px" class="demo-dynamic">
      <el-form-item label="文章题目" style="width: 400px">
        <el-input v-model="dynamicValidateForm.title"></el-input>
      </el-form-item>
      <el-form-item label="文章简介" style="width: 400px">
        <el-input type="textarea" v-model="dynamicValidateForm.content"></el-input>
      </el-form-item>
      <el-form-item label="电子邮箱" style="width: 400px">
        <el-input v-model="dynamicValidateForm.email"></el-input>
      </el-form-item>
      <el-form-item
        style="width: 500px"
        prop="author1"
        label="作者"
        :rules="[
      { required: false, message: '请输入作者', trigger: 'blur' },
      { type: 'author1', message: '请输入正确的作者', trigger: ['blur', 'change'] }
    ]"
      >
        <el-input v-model="dynamicValidateForm.author1"></el-input>
      </el-form-item>
      <el-form-item
        v-for="(domain, index) in dynamicValidateForm.domains"
        :label="'作者' + (index+2)"
        :key="domain.key"
        :prop="'domains.' + index + '.value'"
        :rules="{
      required:false, message: '作者不能为空', trigger: 'blur'
    }"
      >
        <div style="float: left"><el-input v-model="domain.value" style="width: 400px"></el-input><span>&nbsp&nbsp&nbsp&nbsp</span><el-button @click.prevent="removeDomain(domain)">删除</el-button>
        </div>
      </el-form-item>
      <el-form-item>
<!--        <el-button type="primary" @click="submitForm('dynamicValidateForm')">提交</el-button>-->
      <div style="float: left"> <el-button @click="addDomain">新增作者</el-button>
        <el-button @click="resetForm('dynamicValidateForm')">重置</el-button>
      </div>
      </el-form-item>

    <el-form-item>

      <div style="float: left">
            <el-upload
              class="upload-demo"
              accept=".pdf"
              action="http://localhost:8082/fileCommon/uploadV2?fileType=other"
              name="files"
              :on-preview="handlePreview"
              :on-success="onSuccess"
              multiple
              :limit="1"
              >
              <el-button  type="primary">上传pdf正文</el-button>
            </el-upload>
      </div>


    </el-form-item>
      <el-button>取消</el-button>
      <el-button  type="primary" @click="onSubmit">提交</el-button>
  </el-form>
</template>

<script>
import axios from "axios";

export default {
  name: "conf_submit",
  data() {
    return {
      ctime:"",
      userId:"",
      meetingId:"",
      dynamicValidateForm: {
        domains: [{
          value: ''
        }],
        author1: '',
        title: '',
        email: '',
        ref: '',
        content:''
      },

    }
  },
  created(){
    let _this=this;

    _this.userId=sessionStorage.getItem("userId")
    _this.meetingId=_this.$route.query.meetingId
  },
  methods: {
    onSuccess(response, file, fileList){
      let _this=this
      _this.dynamicValidateForm.ref=file.response.data.list[0].savePath
    //  alert(file.response.data.list[0].savePath)
    },
    handlePreview(file) {
      console.log(file.response.data.list[0].savePath);
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

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    removeDomain(item) {
      var index = this.dynamicValidateForm.domains.indexOf(item)
      if (index !== -1) {
        this.dynamicValidateForm.domains.splice(index, 1)
      }
    },
    addDomain() {
      this.dynamicValidateForm.domains.push({
        value: '',
        key: Date.now()
      });
    },
    compute(){
      let _this=this;
      let author='';
      let index;
      for(index=0;index<_this.dynamicValidateForm.domains.length;index++){
        author+=","+_this.dynamicValidateForm.domains[index].value;
      }
      // alert(_this.dynamicValidateForm)
      return author;
    }
    ,
    onSubmit() {
      let _this=this
     // console.log(_this.compute())
      console.log(_this.dynamicValidateForm)
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

    },
  }
}
</script>

<style scoped>

</style>

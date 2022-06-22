<template>
  <el-form ref="form" :model="form" label-width="80px">
    <el-form-item label="文章题目">
      <el-input v-model="form.name"></el-input>
    </el-form-item>
    <el-form-item label="作者">
      <el-input v-model="form.name"></el-input>
    </el-form-item>


    <el-form-item label="联系方式">
      <el-input v-model="form.desc"></el-input>
    </el-form-item>
    <el-form-item label="电子邮箱">
      <el-input v-model="form.desc"></el-input>
    </el-form-item>
    <el-form-item>


      <el-upload
        class="upload-demo"
        accept=".pdf"
        action=""


        multiple
        :limit="3"
        >
        <el-button size="small" type="primary">点击上传pdf正文</el-button>
      </el-upload>


      <el-button>取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "conf_submit",
  data() {
    return {
      form: {
        name: '',
        location: '',
        startdate1: '',
        startdate2: '',
        enddate1: '',
        enddate2: '',
        abbreviation: '',
        detail: '',
        resource: '',
        desc: ''
      }
    }
  },
  methods: {
    onSubmit() {
      console.log('submit!');
    },
  }
}
</script>

<style scoped>

</style>

<template>
  <div>
    <el-main>
      {{$route.query}}
      <el-container>
        <el-header style="text-align: left">Header</el-header>
        <el-main>Main</el-main>
        <el-footer>Footer</el-footer>
      </el-container>
    </el-main>
  </div>


</template>

<script>
    export default {
        name: "conferenceDetail",
        data(){
            return{


            }
        },
        created() {
            alert(this.$router.query);
        }
      }
</script>

<style scoped>

</style>

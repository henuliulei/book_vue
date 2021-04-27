<template>
<div>
  <div>
  <!--  导航栏    -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>书籍信息</el-breadcrumb-item>
    <el-breadcrumb-item>书籍列表</el-breadcrumb-item>
  </el-breadcrumb>
  <!--  用户列表区      -->
  <el-card>
    <el-table :data="booklist" border stripe width="180px">
      <el-table-column type="index" ></el-table-column>
      <el-table-column label="书名" prop="bookName"></el-table-column>
      <el-table-column label="价格" prop="price"></el-table-column>
      <el-table-column label="总数" prop="num"></el-table-column>
    </el-table>
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[1, 2, 3, 4]"
        :page-size="queryInfo.pagesize"
        :current-page="queryInfo.pagenum"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
    </el-pagination>
  </el-card>

</div>
</div>
</template>

<script>
export default {
  name: "Book",
  data(){
    return{
      booklist:[],

      queryInfo:{
        pagesize:2,
        pagenum:1,
      },
      total:0,
    }
  },
  created(){
    this.getBookList()
    this.getBookAllNum()
  },
  methods:{
    async getBookList(){
       const {data:res} = await this.$http.get(`getAllBook/${this.queryInfo.pagenum}/${this.queryInfo.pagesize}`)
      this.booklist = res
    },

    async getBookAllNum(){
      const {data:res} = await  this.$http.get(`getBookNum`)
      this.total = res
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.queryInfo.pagesize = val
      this.getBookList()
    },

    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      console.log(this.queryInfo.pagenum)
      this.getBookList()
      console.log(`当前页: ${val}`);
    },
  }
}
</script>

<style scoped>

</style>
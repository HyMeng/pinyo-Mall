<template>
  <div class="rights">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
  <!-- 插入表格 -->
   <el-table
      :data="rightData"
      style="width: 100%">
      <el-table-column
        align="center"
        type="index"
        :index="indexMethod"
        width="180">
      </el-table-column>
      <el-table-column
        align="center"
        label="权限名称"
        prop="authName"
        width="180">
      </el-table-column>
      <el-table-column
        align="center"
        label="路径"
        prop="path">
      </el-table-column>
      <el-table-column
        align="center"
        label="层级">
        <template slot-scope="scope">
          <p v-if="scope.row.level == 0">一级</p>
          <p v-else-if="scope.row.level == 1">二级</p>
          <p v-else>三级</p>
        </template>
      </el-table-column>
    </el-table>
    <!-- el-pagination:分页组件 -->
    <!-- background：带背景 -->
    <!-- layout：分页组件显示的内容 -->
    <!-- total：设置总条数 -->
    <!-- page-size:设置每页的条数 -->
    <!-- current-change：页数改变的时候，触发 -->
    <!-- :page-sizes: 可以选择条数数据 [2,3,4,5] -->
    <!-- size-change： 当每页的条数发生改变的时候，触发 -->
    <!-- :current-page:当前页 -->
    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      :page-size="pagesize"
      :current-page="currentPage"
      :page-sizes="[2, 4, 6, 8]"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange">
    </el-pagination>
  </div>
</template>

<script>
export default {
  data () {
    return {
      total: 0,
      pagesize: 6,
      currentPage: 1,
      rightData: []
    }
  },
  methods: {
    indexMethod (index) {
      const currentPage = this.currentPage
      const pagesize = this.pagesize
      return index + (currentPage - 1) * pagesize + 1
    },
    async getRightList (pagesize, currentPage) {
      const res = await this.axios.get(`rights/list`)
      console.log(res)
      const {meta: {status}, data} = res.data
      this.total = data.length
      const startPage = pagesize * (currentPage - 1)
      if (status === 200) {
        this.rightData = data.splice(startPage, pagesize)
      }
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getRightList(this.pagesize, this.currentPage)
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.currentPage = 1
      this.getRightList(this.pagesize, this.currentPage)
    }
  },
  created () {
    // let pagesize = this.pagesize
    // let currentPage = this.currentPage
    this.getRightList(this.pagesize, this.currentPage)
  }
}
</script>

<style lang="less" scoped>
.rights {
  .el-breadcrumb {
    background-color: #d4dae0;
    padding-left: 10px;
    font-size: 16px;
    line-height: 44px;
  }
}
</style>

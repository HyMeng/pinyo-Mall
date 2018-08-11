<template>
  <div class="users">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框和输入框 -->
    <el-input placeholder="请输入内容" v-model="query" @change="search" class="input-with-select">
      <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
    </el-input>
    <el-button type="success" plain>添加用户</el-button>
    <!-- 表格 -->
    <!-- el-table:表格组件 -->
    <!-- :data='tableData' 表格显示的数据 -->
    <!-- el-table-column：表格的一列 -->
    <!-- prop： 当前列要显示的数据 ，userList内的数据-->
    <!-- label：表头 -->
    <!-- width: 这一列的宽度 -->
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        align="center"
        prop="username"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        align="center"
        prop="email"
        label="邮箱"
        width="180">
      </el-table-column>
      <el-table-column
        align="center"
        prop="mobile"
        label="电话">
      </el-table-column>
      <el-table-column
        align="center"
        prop="mg_state"
        label="用户状态">
        <!-- 1. 表示表格的自定义列模板，意味着这一列显示的数据自己来定义了 -->
        <!-- 2. 通过scope.row可以获取到当前行的数据 -->
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" icon="el-icon-edit"></el-button>
          <el-button type="danger" size="small" icon="el-icon-delete"></el-button>
          <el-button type="success" plain size="small" icon="el-icon-check">分配角色</el-button>
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
import axios from 'axios'
export default {
  data () {
    return {
      query: '', // 关键字
      currentPage: 1, // 当前页
      pagesize: 2, // 显示页面的条数
      tableData: [], // 表格的数据
      total: 0 // 总条数
    }
  },
  methods: {
    getUserInfo () {
      axios.get('http://localhost:8888/api/private/v1/users', {
        params: {
          query: this.query,
          pagenum: this.currentPage,
          pagesize: this.pagesize
        },
        headers: {
          'Authorization': localStorage.getItem('userToken')
        }
      }).then(res => {
        // console.log(res.data)
        let data = res.data.data
        let meta = res.data.meta
        if (meta.status === 200) {
          this.total = data.total
          this.tableData = data.users
        }
      })
    },
    handleCurrentChange (val) {
      // console.log(val)
      this.currentPage = val
      this.getUserInfo()
    },
    handleSizeChange (val) {
      // console.log(val)
      this.pagesize = val
      this.currentPage = 1
      this.getUserInfo()
    },
    search () {
      this.currentPage = 1
      this.getUserInfo()
    }
  },
  created () {
    this.getUserInfo()
  }
}
</script>

<style lang="less" scoped>
.users {
  .el-breadcrumb {
    background-color: #d4dae0;
    padding-left: 10px;
    font-size: 16px;
    line-height: 44px;
  }
  .input-with-select {
    width: 300px;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .el-pagination {
    margin-top: 5px;
    margin-bottom: 5px;
  }
}
</style>

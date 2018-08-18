<template>
   <div class="goods">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="success" class="addGood" @click="$router.push('/goods-add')">添加商品</el-button>
  <!-- 插入表格 -->
   <el-table
      :data="goodsList"
      style="width: 100%">
      <el-table-column
        align="center"
        type="index"
        :index="indexMethod"
        width="180">
      </el-table-column>
      <el-table-column
        align="center"
        label="商品名称"
        prop="goods_name"
        width="180">
      </el-table-column>
      <el-table-column
        align="center"
        label="商品价格"
        prop="goods_price">
      </el-table-column>
      <el-table-column
        align="center"
        label="商品重量"
        prop="goods_weight">
      </el-table-column>
      <el-table-column
        align="center"
        label="创建时间"
        prop="add_time">
        <template slot-scope="scope">
          {{scope.row.add_time | dataFilter}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" plain icon="el-icon-edit" @click="showEditDialog(scope.row)"></el-button>
          <el-button type="danger" size="small" plain icon="el-icon-delete" @click="deleteGood(scope.row)"></el-button>
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
      :page-sizes="[10, 20, 30, 40]"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange">
    </el-pagination>
  </div>
</template>

<script>
export default {
  data () {
    return {
      query: '',
      total: 0,
      pagesize: 8,
      currentPage: 1,
      goodsList: []
    }
  },
  methods: {
    async getGoodList () {
      const res = await this.axios.get('goods', {
        params: {
          query: this.query,
          pagesize: this.pagesize,
          pagenum: this.currentPage
        }
      })
      const {meta: {status}, data: {goods, total}} = res.data
      console.log(res.data)
      if (status === 200) {
        this.goodsList = goods
        this.total = total
      } else {
        console.log('获取商品列表失败')
      }
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getGoodList()
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.currentPage = 1
      this.getGoodList()
    },
    indexMethod (index) {
      return (this.currentPage - 1) * this.pagesize + index + 1
    }
  },
  created () {
    this.getGoodList()
  }
}
</script>

<style lang="less" scoped>
.goods {
  .el-breadcrumb {
    background-color: #d4dae0;
    padding-left: 10px;
    font-size: 16px;
    line-height: 44px;
  }
  .addGood {
    margin: 5px 0;
  }
}
</style>

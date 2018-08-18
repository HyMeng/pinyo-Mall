<template>
  <div class="category">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="success" @click="showAddDialog">添加分类</el-button>
    <!-- @click="showAddDialog" -->
    <!-- 插入表格 element-tree-grid插件-->
    <!-- https://github.com/foolishchow/element-tree-grid -->

    <!-- treeKey: 指定节点嵌套的一个key,只有指定了tree-key,展开的节点才能找到对应的位置 -->
      <!-- level-key:指定节点层级，如果不指定，没有缩进效果 -->
      <!-- parent-key: 指定父节点的id，如果不指定，无法缩起来 -->
      <!-- child-key：用于指定数据中的子节点的属性名  默认children-->
    <el-table :data="cateList" style="width: 100%" v-loading="loading">
    <!-- 表格 -->
    <!--
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.)"
    -->
      <el-table-tree-column
        :expand-all="!!!1"
        prop="cat_name"
        label="分类名称"
        treeKey="cat_id"
        child-key="children"
        level-key="cat_level"
        parent-key="cat_pid"
        :indent-size="40">
      </el-table-tree-column>
      <el-table-column prop="cat_deleted" label="是否有效">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_deleted">无效</span>
          <span v-else>有效</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" prop="cat_level"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" plain icon="el-icon-edit" @click="showEditDialog(scope.row)"></el-button>
          <el-button type="danger" size="small" plain icon="el-icon-delete" @click="deleteCate(scope.row.cat_id)"></el-button>
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
      :page-size="pageSize"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange">
    </el-pagination>
    <!-- 添加分类 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addDialogVisible"
      width="40%"
      >
      <el-form ref="addForm" :rules="Rules" :model="addForm" label-width="80px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addForm.cat_name" placeholder="请输入分类名称"></el-input>
        </el-form-item>
        <el-form-item label="父级名称" prop="cat_pid">
          <el-cascader
            clearable
            :options="options"
            v-model="addForm.cat_pid"
            change-on-select
            :props="props"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCancle">取 消</el-button>
        <el-button type="primary" @click="addCategory">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改分类 -->
    <el-dialog
      title="增加分类"
      :visible.sync="editDialogVisible"
      width="40%">
      <el-form
        ref="editForm"
        :model="editForm"
        label-width="80px"
        :rules="Rules">
        <!-- 表单项 -->
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCancle">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 导入树形网格组件
import ElTreeGrid from 'element-tree-grid'

export default {
  data () {
    return {
      loading: true, // 加载状态
      cateList: [],
      options: [],
      // 级联组件的配置项
      props: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      Rules: {
        cat_name: [
          {required: true, message: '请输入分类的名称', trigger: 'blur'}
        ]
      },
      addDialogVisible: false,
      editDialogVisible: false,
      pageSize: 10,
      currentPage: 1,
      total: 0,
      addForm: {
        cat_name: '',
        cat_pid: [] // 级联选择器默认选中项
      },
      editForm: {
        cat_name: '',
        cat_id: ''
      }
    }
  },
  methods: {
    async getCateList () {
      const res = await this.axios.get('categories', {
        params: {
          type: 3,
          pagesize: this.pageSize,
          pagenum: this.currentPage
        }
      })
      const {meta: {status}, data: {result, total}} = res.data
      console.log(res, '这是catelist')
      if (status === 200) {
        setTimeout(() => {
          this.cateList = result
          this.total = total
          this.loading = false
        }, 500)
      }
    },
    handleCurrentChange (val) {
      this.loading = true
      this.currentPage = val
      this.getCateList()
    },
    handleSizeChange (val) {
      this.loading = true
      this.pageSize = val
      this.currentPage = 1
      this.getCateList()
    },
    addCancle () {
      this.addDialogVisible = false
      this.$refs.addForm.resetFields()
    },
    async showAddDialog () {
      this.addDialogVisible = true
      const res = await this.axios.get('categories?type=2')
      const {meta: {status}, data} = res.data
      console.log(res.data, 'this is categories type2')
      if (status === 200) {
        this.options = data
      } else {
        console.log('获取options失败')
      }
    },
    addCategory () {
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          const {cat_pid: catPid, cat_name: catName} = this.addForm
          const res = await this.axios.post('categories', {
            cat_pid: catPid[catPid.length - 1] || 0,
            cat_name: catName,
            cat_level: catPid.length
          })
          const {meta: {status, msg}} = res.data
          if (status === 201) {
            this.loading = true
            this.addDialogVisible = false
            this.$refs.addForm.resetFields()
            this.$message.success('恭喜你,添加分类成功')
            this.getCateList()
          } else {
            this.$message.success(msg)
          }
        } else {
          this.$message.error('请填写正确的表单格式')
          return false
        }
      })
    },
    async deleteCate (id) {
      try {
        await this.$confirm('此操作将删除对应分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const res = await this.axios.delete(`categories/${id}`)
        const {meta: {status, msg}} = res.data
        console.log(res.data, 'deleteCate')
        if (status === 200) {
          this.loading = true
          this.$message.success(msg)
          if (this.cateList.length === 1) {
            --this.currentPage
          }
          this.getCateList()
        }
      } catch (e) {
        this.$message.info('取消删除')
      }
    },
    showEditDialog (cate) {
      this.editDialogVisible = true
      this.editForm.cat_id = cate.cat_id
      this.editForm.cat_name = cate.cat_name
    },
    editCancle () {
      this.editDialogVisible = false
      this.$refs.editForm.resetFields()
    },
    editCate () {
      this.$refs.editForm.validate(async valid => {
        if (valid) {
          const res = await this.axios.put(`categories/${this.editForm.cat_id}`, this.editForm)
          const {meta: {status}} = res.data
          if (status === 200) {
            this.loading = true
            this.editDialogVisible = false
            this.$refs.editForm.resetFields()
            this.$message.success('分类信息更新成功')
            this.getCateList()
          }
        } else {
          return false
        }
      })
    }
  },
  components: {
    // es6的属性名表达式：  es6允许对象的属性名是一个表达式，使用[]括起来
    [ElTreeGrid.name]: ElTreeGrid
  },
  created () {
    this.getCateList()
  }
}
</script>

<style lang="less" scoped>
.category {
  .el-breadcrumb {
    background-color: #d4dae0;
    padding-left: 10px;
    font-size: 16px;
    line-height: 44px;
  }
}
</style>

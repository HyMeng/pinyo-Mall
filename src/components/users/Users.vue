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
    <el-button type="success" plain @click="showDialog">添加用户</el-button>
    <!-- 添加用户的模态框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addUserDialog"
      width="40%"
      >
      <el-form ref="addForm" :rules="addRules" :model="addForm" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCancle">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
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
            inactive-color="#ff4949"
            @change="changeState(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" icon="el-icon-edit"  @click="showEditDialog(scope.row)"></el-button>
          <el-button type="danger" size="small" icon="el-icon-delete" @click="deleteUser(scope.row)"></el-button>
          <el-button type="success" plain size="small" icon="el-icon-check" @click="showAssignDialog(scope.row)">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑用户信息 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editUserDialog"
      width="40%"
      >
      <el-form ref="editForm" :rules="addRules" :model="editForm" label-width="80px">
        <el-form-item label="用户名">
          <el-tag type="info">{{editForm.username}}</el-tag>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editUserDialog = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色信息 -->
    <el-dialog
      title="分配角色"
      :visible.sync="assignDialogVisible"
      width="40%"
      >
      <el-form ref="assignForm" :model="assignForm" label-width="80px">
        <el-form-item label="用户名">
          <el-tag type="info">{{assignForm.username}}</el-tag>
        </el-form-item>
        <el-form-item label="角色列表">
          <el-select v-model="assignForm.rid" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="assignRole">确 定</el-button>
      </span>
    </el-dialog>
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
      query: '', // 关键字
      currentPage: 1, // 当前页
      pagesize: 2, // 显示页面的条数
      tableData: [], // 表格的数据
      addUserDialog: false,
      editUserDialog: false,
      assignDialogVisible: false,
      total: 0, // 总条数
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {
        username: '',
        email: '',
        mobile: '',
        id: ''
      },
      assignForm: {
        username: '',
        id: '',
        rid: ''
      },
      options: [],
      addRules: {
        username: [
          {required: true, message: '请输入用户名称', trigger: 'blur'},
          {min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'change'}
        ],
        password: [
          {required: true, message: '请输入用户密码', trigger: 'blur'},
          {min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'change'}
        ],
        email: [
          {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']}
        ],
        mobile: [
          {pattern: /^1[0-9]{10}$/, message: '请输入正确的手机号', trigger: ['blur', 'change']}
        ]
      }
    }
  },
  methods: {
    async getUserInfo () {
      const res = await this.axios.get('users', {
        params: {
          query: this.query,
          pagenum: this.currentPage,
          pagesize: this.pagesize
        }
      })
      // console.log(res.data)
      const {meta: {status}, data: {total, users}} = res.data
      if (status === 200) {
        this.total = total
        this.tableData = users
      }
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
    },
    async changeState (user) {
      const res = await this.axios.put(`users/${user.id}/state/${user.mg_state}`)
      // console.log(res.data)
      const {meta: {status, msg}, data} = res.data
      if (status === 200) {
        this.$message.success(`${data.mg_state ? '用户启用' : '用户禁用'}成功`)
      } else {
        this.$message.error(msg)
      }
    },
    async deleteUser (user) {
      try {
        await this.$confirm('你确定要删除该用户吗?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const res = await this.axios.delete(`users/${user.id}`)
        const {meta: {status, msg}} = res.data
        if (status === 200) {
          if (this.tableData.length === 1) {
            --this.currentPage
          }
          this.getUserInfo()

          this.$message.success(msg)
        } else {
          this.$message.error(msg)
        }
      } catch (e) {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }
    },
    showDialog () {
      this.addUserDialog = true
    },
    addUser () {
      this.$refs.addForm.validate(async valide => {
        if (valide) {
          const res = await this.axios.post('users', this.addForm)
          console.log(res.data)
          const {meta: {msg, status}} = res.data
          if (status === 201) {
            // 关闭模态框
            this.addUserDialog = false
            // 重置表单
            this.$refs.addForm.resetFields()
            // 弹出消息框提示操作成功
            this.$message.success(msg)
            // 渲染时默认total是上次
            ++this.total
            this.currentPage = Math.ceil(this.total / this.pagesize)
            // 重新渲染页面
            this.getUserInfo()
          } else {
            this.$message.error(msg)
          }
        } else {
          return false
        }
      })
    },
    addCancle () {
      this.addUserDialog = false
      this.$refs.addForm.resetFields()
    },
    showEditDialog (user) {
      this.editUserDialog = true
      this.editForm.username = user.username
      this.editForm.email = user.email
      this.editForm.mobile = user.mobile
      this.editForm.id = user.id
    },
    // 修改用户信息
    editUser () {
      this.$refs.editForm.validate(valide => {
        if (valide) {
          this.axios.put(`users/${this.editForm.id}`, this.editForm)
            .then(res => {
              const {meta: {status, msg}} = res.data
              if (status === 200) {
                this.editUserDialog = false
                this.$refs.editForm.resetFields()
                this.getUserInfo()
                this.$message.success(`恭喜您,${msg}`)
              } else {
                this.$message.error('编辑用户信息失败')
              }
            })
        } else {
          return false
        }
      })
    },
    async showAssignDialog (user) {
      console.log(user, '这个用户的所有信息')
      this.assignDialogVisible = true
      this.assignForm.username = user.username
      this.assignForm.id = user.id
      // 需要根据用户id来查询角色rid
      const resRoleId = await this.axios.get(`users/${this.assignForm.id}`)
      const {meta: {status}, data} = resRoleId.data
      if (status === 200) {
        if (data.rid === -1) {
          this.assignForm.rid = ''
        } else {
          this.assignForm.rid = data.rid
        }
      }
      // 请求所有的角色列表
      const res = await this.axios.get('roles')
      if (res.data.meta.status === 200) {
        this.options = res.data.data
        console.log(this.options, '这是options')
      }
    },
    async assignRole () {
      if (!this.assignForm.rid) {
        this.$message.error('请选择一个用户角色')
        return
      }
      const res = await this.axios.put(`users/${this.assignForm.id}/role`, this.assignForm)
      console.log(res.data)
      const {meta: {status, msg}} = res.data
      if (status === 200) {
        this.assignDialogVisible = false
        this.getUserInfo()
        this.$message.success(msg)
      } else {
        this.$message.error(msg)
      }
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

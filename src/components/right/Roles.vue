<template>
  <div class="roles">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="success" @click="showAddDialog" class="addrole">添加角色</el-button>
    <!-- 插入表格 -->
    <el-table
    :data="roleList"
    style="width: 100%">
    <el-table-column type="expand">
      <template slot-scope="props">
        <el-row v-if="props.row.children.length === 0">
          <el-col :span="24" class="noright">暂无授予权限</el-col>
        </el-row>
        <el-row v-else v-for="level1 in props.row.children" :key="level1.id" class="levone">
          <!-- 一级权限 -->
          <el-col :span="4">
            <el-tag closable @close="deleRight(props.row, level1.id)">
              {{level1.authName}}
            </el-tag>
            <i class="el-icon-arrow-right"></i>
          </el-col>
          <!-- 二级权限 -->
          <el-col :span="20">
            <el-row v-for="level2 in level1.children" :key="level2.id" class="levtwo">
              <el-col :span="4">
                <el-tag type="success" closable @close="deleRight(props.row, level2.id)">
                  {{level2.authName}}
                </el-tag>
                <i class="el-icon-arrow-right"></i>
              </el-col>
              <el-col :span="20">
                <!-- 三级权限 -->
                <span v-for="level3 in level2.children" :key="level3.id" class="levthree">
                  <el-tag type="warning" closable @close="deleRight(props.row, level3.id)">
                    {{level3.authName}}
                  </el-tag>
                </span>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </template>
    </el-table-column>
    <el-table-column
      type="index">
    </el-table-column>
    <el-table-column
      label="角色名称"
      prop="roleName">
    </el-table-column>
    <el-table-column
      label="描述"
      prop="roleDesc">
    </el-table-column>
    <el-table-column
      label="操作">
      <template slot-scope="scope">
        <el-button type="primary" size="small" icon="el-icon-edit"  @click="showEditDialog(scope.row)"></el-button>
        <el-button type="danger" size="small" icon="el-icon-delete" @click="deleRole(scope.row)"></el-button>
        <el-button type="success" plain size="small" icon="el-icon-check" @click="showAssignDialog(scope.row)">分配角色</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 添加角色的模态框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addDialogVisible"
      width="40%"
      >
      <el-form ref="addForm" :rules="Rules" :model="addForm" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc" placeholder="请输入角色描述"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCancle">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色的模态框 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="editDialogVisible"
      width="40%">
      <el-form ref="editForm" :rules="Rules" :model="editForm" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc" placeholder="请输入角色描述"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCancle">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加分配角色权限模态框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="assignDialogVisible"
      width="40%"
      >
      <el-tree
        :data="rightList"
        show-checkbox
        default-expand-all
        node-key="id"
        ref="tree"
        highlight-current
        :props="defaultProps">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="assignRight">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      roleList: [],
      addDialogVisible: false,
      editDialogVisible: false,
      assignDialogVisible: false,
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      editForm: {
        roleName: '',
        roleDesc: '',
        id: ''
      },
      Rules: {
        roleName: [
          {required: true, message: '角色名称不能为空', trigger: 'blur'}
        ]
      },
      rightList: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      assignRoleId: ''
    }
  },
  methods: {
    async getRoleList () {
      const res = await this.axios.get('roles')
      console.log(res.data, '全部数据')
      const {meta: {status}, data} = res.data
      if (status === 200) {
        this.roleList = data
      }
    },
    async deleRole (role) {
      try {
        await this.$confirm('你确定要删除该角色吗?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const res = await this.axios.delete(`roles/${role.id}`)
        console.log(res)
        const {meta: {status}} = res.data
        if (status === 200) {
          this.getRoleList()
          this.$message.success('恭喜你,删除角色成功')
        } else {
          this.$message.error('删除失败')
        }
      } catch (e) {
        this.$message.info('已取消删除')
      }
    },
    showAddDialog () {
      this.addDialogVisible = true
    },
    addRole () {
      this.$refs.addForm.validate(async valide => {
        if (valide) {
          const res = await this.axios.post('roles', this.addForm)
          // console.log(res.data)
          const {meta: {status}} = res.data
          if (status === 201) {
            this.addDialogVisible = false
            // 重置表单
            this.$refs.addForm.resetFields()
            this.getRoleList()
            this.$message.success('添加角色成功!')
          } else {
            this.$message.error('添加角色失败!')
          }
        } else {
          return false
        }
      })
    },
    addCancle () {
      this.addDialogVisible = false
      this.$refs.addForm.resetFields()
    },
    showEditDialog (role) {
      this.editDialogVisible = true
      this.editForm.roleName = role.roleName
      this.editForm.roleDesc = role.roleDesc
      this.editForm.id = role.id
    },
    editCancle () {
      this.editDialogVisible = false
      this.$refs.editForm.resetFields()
    },
    editRole () {
      this.$refs.editForm.validate(async valide => {
        if (valide) {
          const res = await this.axios.put(`roles/${this.editForm.id}`, this.editForm)
          // console.log(res.data)
          const {meta: {status}} = res.data
          if (status === 200) {
            this.editDialogVisible = false
            // 重置表单
            this.$refs.editForm.resetFields()
            this.getRoleList()
            this.$message.success('修改角色成功!')
          } else {
            this.$message.error('修改角色失败!')
          }
        } else {
          return false
        }
      })
    },
    async deleRight (role, rightId) {
      const res = await this.axios.delete(`roles/${role.id}/rights/${rightId}`)
      console.log(res.data, '删除了指定权限')
      const {meta: {status}, data} = res.data
      if (status === 200) {
        // 重新渲染, 修改role的children
        // 把删除后的权限重新赋值给role,
        role.children = data
        this.$message.success('删除权限成功')
      } else {
        this.$message.success('删除权限失败')
      }
    },
    async showAssignDialog (role) {
      this.assignDialogVisible = true
      const res = await this.axios.get('rights/tree')
      console.log(res, '这是权限tree')
      console.log(role, '这是role的数据')
      const {meta: {status, msg}, data} = res.data
      this.assignRoleId = role.id
      // 回显时要把当前角色id获取了,保存起来,以便修改时使用
      if (status === 200) {
        this.rightList = data
        // 获取到当前角色下所有的三级权限
        const checkedKeys = []
        role.children.forEach(levone => {
          levone.children.forEach(levtwo => {
            levone.children.forEach(levthree => {
              checkedKeys.push(levthree.id)
            })
          })
        })
        this.$refs.tree.setCheckedKeys(checkedKeys)
      } else {
        this.$message.error(msg)
      }
    },
    async assignRight () {
      // 请求路径：roles/:roleId/rights
      let checkedKeys = this.$refs.tree.getCheckedKeys()
      let HalfCheckedKeys = this.$refs.tree.getHalfCheckedKeys()
      let roleId = this.assignRoleId
      const res = await this.axios.post(`roles/${roleId}/rights`, {
        rids: [...checkedKeys, ...HalfCheckedKeys].join()
      })
      const {meta: {status}} = res.data
      if (status === 200) {
        this.assignDialogVisible = false
        this.getRoleList()
        this.$message.success('权限授权成功')
      } else {
        this.$message.error('权限授权失败')
      }
    }
  },
  created () {
    this.getRoleList()
  }
}
</script>

<style lang="less" scoped>
.roles {
  .el-breadcrumb {
    background-color: #d4dae0;
    padding-left: 10px;
    font-size: 16px;
    line-height: 44px;
  }
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .el-tag {
    margin: 5px;
  }
  .levone {
    border-bottom: 1px dotted #ccc;
    padding-bottom: 5px;
  }
  .addrole {
    margin: 5px 0;
  }
  .noright {
    text-align: center;
    color: cornflowerblue;
    font-weight: 600;
  }
}
</style>

<template>
  <!-- el-form:组件名称 -->
  <!-- :model="form": 表单对象，用于获取值 -->
  <!-- label-width: label的宽度 -->
  <!-- el-form-item:表单项  -->
  <!-- 每一个组件，在生成对应的标签的时候，都会生成给一个类 -->
  <div class="login">
    <el-form ref="form" :rules="rules" :model="form" status-icon label-width="80px">
      <img src="../assets/avatar.jpg" alt="">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="form.password" placeholder="请输入用户密码" @keyup.enter.native="login"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login">登录</el-button>
        <el-button type="info" class="reset" @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
</div>
</template>

<script>
// 导入axios

export default {
  data () {
    return {
      // 表单数据
      form: {
        username: '',
        password: ''
      },
      // 表单验证
      rules: {
        username: [
          {required: true, message: '请输入用户名称', trigger: 'change'},
          {min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'change'}
        ],
        password: [
          {required: true, message: '请输入用户密码', trigger: 'change'},
          {min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'change'}
        ]
      }
    }
  },
  methods: {
    login () {
      this.$refs.form.validate(valide => {
        if (valide) {
          this.axios.post('login', this.form)
            .then(res => {
              console.log(res.data)
              // 对象的解构化
              const {meta: {status, msg}, data: {token}} = res.data
              if (status === 200) {
                this.$message({
                  message: '登陆成功',
                  type: 'success'
                })
                localStorage.setItem('userToken', token)
                // 跳转到首页
                this.$router.push('/home')
              } else {
                this.$message.error(msg)
              }
            })
        } else {
          return false
        }
      })
    },
    resetForm () {
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.login {
  width: 100%;
  height: 100%;
  background: cyan;
  overflow: hidden;
  .el-form {
    width: 400px;
    padding: 40px 50px;
    margin: 200px auto;
    position: relative;
    background-color: #fff;
    border-radius: 20px;
    box-shadow: 0 0 6px 6px #eee;
    img {
      position: absolute;
      top: -110px;
      left: 50%;
      transform: translateX(-50%);
      border-radius: 50%;
      border: 5px solid #ccc;
    }
  }
  .reset {
    float: right;
  }
}
</style>

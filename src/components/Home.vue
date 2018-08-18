<template>
    <div class="home">
      <el-container>
        <el-header>
          <div class="logo"></div>
          <div class="logout">
            <span>欢迎光临</span>
            <a href="javascript:;" @click="logout">退出</a>
          </div>
          <div class="title">
            <h3>电商后台登录管理系统</h3>
          </div>
        </el-header>
        <el-container>
          <!-- el-menu: 导航菜单的组件 -->
          <!-- default-active：默认高亮的菜单 -->
          <!-- open close 展开和关闭的事件 -->
          <!-- el-submenu: 子菜单 -->
          <!-- el-menu-item-group: 子菜单中分组 -->
          <!-- el-menu-item：子菜单中的每一项 -->
          <!-- unique-opened: 保证只能打开一个子菜单 -->
          <!-- router: 如果router为true，那么index就会作为路由的连接 -->
          <el-aside width="200px">
            <el-menu
              unique-opened
              router
              :default-active="$route.path.slice(1).split('-')[0]"
              class="el-menu-vertical-demo"
              @open="handleOpen"
              @close="handleClose"
              background-color="#545c64"
              text-color="#fff"
              active-text-color="#ffd04b">
              <el-submenu :index="lev1.path" v-for="lev1 in menuList" :key="lev1.id">
                <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>{{lev1.authName}}</span>
                </template>
                <!-- 二级子菜单 -->
                <el-menu-item :index="lev2.path" v-for="lev2 in lev1.children" :key="lev2.id">
                  <i class="el-icon-menu"></i>
                  <span slot="title">{{lev2.authName}}</span>
                </el-menu-item>
              </el-submenu>
            </el-menu>
          </el-aside>
          <el-main>
            <!-- 设置子路由出口 -->
            <router-view></router-view>
          </el-main>
        </el-container>
      </el-container>
    </div>
</template>
<script>
export default {
  data () {
    return {
      menuList: []
    }
  },
  methods: {
    async logout () {
      try {
        await this.$confirm('此操作将退出登录, 是否继续?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        localStorage.removeItem('userToken')
        this.$router.push('login')
        this.$message({
          type: 'success',
          message: '退出成功!'
        })
      } catch (e) {
        this.$message({
          type: 'info',
          message: '已取消退出'
        })
      }
    },
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    },
    async getMenuList () {
      const res = await this.axios.get('menus')
      const {meta: {status}, data} = res.data
      console.log(res, '这是menulist')
      if (status === 200) {
        this.menuList = data
      }
    }
  },
  created () {
    this.getMenuList()
  }
}
</script>
<style lang="less" scoped>
.home {
  height: 100%;
    >.el-container {
      height: 100%;
      .el-header {
        background-color: #b3c1cd;
        .logo {
          width: 180px;
          height: 60px;
          float: left;
          background: url(../assets/logo.png) no-repeat center center;
          background-size: contain;
        }
        .title {
          overflow: hidden;
          height: 60px;
          line-height: 60px;
          text-align: center;
          font-size: 20px;
          color: #fff;
        }
        .logout {
          width: 180px;
          height: 60px;
          float: right;
          line-height: 60px;
          font-weight: 700;
          a {
            color: darkorange;
          }
        }
      }
  }
    .el-aside {
      background-color: rgb(84, 92, 100);
    }
    .el-main {
     background-color: rgb(234, 238, 241);
    }
    .el-submenu {
      width: 200px;
    }
}
</style>

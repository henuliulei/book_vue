<template>

  <el-container class="home-container">
    <!--        头部-->
    <el-header>
      <div>
        <span>后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!--   侧边栏-->
      <el-aside width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollpse">点击折叠</div>
        <!--            一级标题-->
        <el-menu :unique-opened="true"
                 background-color="#333744"
                 text-color="#fff"
                 :collapse="isCollapse"
                 :collapse-transition="false"
                 :router="true"
                 :default-active="activePath"
                 active-text-color="#409EFF">
          <!--              二级标题-->
          <el-submenu :index="item.name+''" v-for="item in menulist" :key="item.name">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>{{ item.name }}</span>
            </template>

            <el-menu-item :index=" '/' + subItem.id + ''" v-for="subItem in item.children"
                          @click="saveNavState('/' + subItem.id)" :key="subItem.name">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.name }}</span>
              </template>
            </el-menu-item>
          </el-submenu>

        </el-menu>
      </el-aside>
    <!--  主页面      -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>

</template>

<script>
export default {
  name: "Home",

  data() {
    return {
      menulist: [{
        name: "书籍信息",
        children: [{name: "书籍列表", id: 1}]
      },
        {
          name: "用户信息",
          children: [{name: "用户列表", id: 2}]
        }],

      //是否折叠
      isCollapse: false,
      //被激活的地址
      activePath: ""
    }


  },

  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },

  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push("/login")
    },
    //获取所有菜单
    async getMenuList() {
      const {data: res} = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
      console.log(res)
    },
    //点击按钮，切换菜单的折叠与展开
    toggleCollpse() {
      this.isCollapse = !this.isCollapse
    },
    //保存链接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }

  }

}
</script>


<style scoped>
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: white;
  font-size: 20px;
}

div {
  display: flex;
  align-items: center;
}

span {
  margin-left: 15px;
}

.el-aside {
  background-color: #333744;
}

.el-main {
  background-color: #eaedf1;
}

.home-container {
  height: 100%;
}

.iconfont {
  margin-right: 10px;
}

.el-menu {
  border-right: none;
}

.toggle-button {
  background-color: #4A5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: right;
  letter-spacing: 0.2em;
  cursor: pointer;
}


</style>
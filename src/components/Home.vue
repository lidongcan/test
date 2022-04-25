<template>
  <div>
    <el-container>
      <el-header>
        <div class="logo">
          <img src="../assets/ke1.jpg" />
          <span>可可电商管理系统</span>
        </div>
        <el-button type="primary" @click="exit">退出</el-button>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <Nav />
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Nav from './Nav.vue'
export default {
  name: 'Home',
  components: {
    Nav,
  },
  methods: {
    exit() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
  },
}
</script>

<style scoped>
.el-container {
  height: 100vh;
}
.el-header {
  background-color: #615b5b;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  color: aliceblue;
  font-size: 25px;
}
.logo img {
  width: 50px;
  height: 50px;
}
.el-aside {
  background-color: #8e8b8b;
}
.el-main {
  background-color: #e8e2e2;
}
</style>

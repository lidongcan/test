<template>
  <el-menu
    background-color="#8a8282"
    text-color="#fff"
    active-text-color="#409EFF"
    unique-opened
    router
    :default-active="$route.path">
    <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
      <template slot="title">
        <i :class="iconList[item.id]"></i>
        <span>{{ item.authName }}</span>
      </template>
      <el-menu-item-group>
        <el-menu-item :index="'/' + i.path" v-for="i in item.children" :key="i.id">{{ i.authName }}</el-menu-item>
      </el-menu-item-group>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  name: 'Nav',
  created() {
    this.getMenuList()
  },
  data() {
    return {
      menuList: [],
      //   动态添加菜单图标
      iconList: {
        125: 'el-icon-s-custom',
        103: 'el-icon-s-check',
        101: 'el-icon-s-shop',
        102: 'el-icon-s-order',
        145: 'el-icon-s-marketing',
      },
    }
  },
  methods: {
    //   获取菜单列表
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
  },
}
</script>

<style>
.el-menu {
  /* 解决菜单展开突出一像素边框 */
  border-right: none;
}
.toggle {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 20px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>

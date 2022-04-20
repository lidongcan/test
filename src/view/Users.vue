<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 搜索框 -->
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <!-- 添加用户按钮 -->
        <el-col :span="6">
          <el-button type="primary" @click="dialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 列表区 -->
      <el-table :data="userList" style="width: 100%" stripe border>
        <el-table-column prop="username" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="mobile" label="手机" width="200">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="200">
        </el-table-column>
        <el-table-column prop="role_name" label="角色" width="200">
        </el-table-column>
        <el-table-column prop="mg_state" label="状态" width="100">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userstatechange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 编辑用户按钮 -->
            <el-tooltip content="编辑用户" placement="top" :enterable="false">
              <el-button
                type="primary"
                icon="el-icon-edit"
                @click="showChangeDialog(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <!-- 删除用户按钮 -->
            <el-tooltip content="删除用户" placement="top" :enterable="false">
              <el-button
                type="danger"
                icon="el-icon-delete"
                @click="removeUserInfo(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <!-- 设置用户角色按钮 -->
            <el-tooltip content="设置角色" placement="top" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-setting"
                @click="showSetRolerdialogVisible(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页管理 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户弹窗 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="40%"
      height="40%"
      @close="addUserformClose"
    >
      <el-form :model="addUserInfo" :rules="addUserrules" ref="addUserform">
        <el-form-item label="姓名" prop="username">
          <el-input
            v-model="addUserInfo.username"
            placeholder="请输入姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="addUserInfo.password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input
            v-model="addUserInfo.mobile"
            placeholder="请输入手机号"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="addUserInfo.email"
            placeholder="请输入邮箱"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addUser">确 定</el-button>
    </el-dialog>
    <!-- 修改用户信息弹窗 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="changedialogVisible"
      width="40%"
      height="40%"
      @close="changeUserformClose"
    >
      <el-form
        :model="changeUserInfo"
        :rules="changeUserrules"
        ref="changeUserform"
      >
        <el-form-item label="姓名">
          <el-input v-model="changeUserInfo.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input
            v-model="changeUserInfo.mobile"
            placeholder="请输入手机号"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="changeUserInfo.email"
            placeholder="请输入邮箱"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-button @click="changedialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="changeUser">确 定</el-button>
    </el-dialog>
    <!-- 设置用户角色弹窗 -->
    <el-dialog
      title="提示"
      :visible.sync="SetRolesdialogVisible"
      width="30%"
      @close="SetRolesdialogVisibleClose"
    >
      <el-form :model="setRolerInfo" ref="setRolerform">
        <el-form-item label="姓名">
          <el-input v-model="setRolerInfo.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-input v-model="setRolerInfo.role_name" disabled></el-input>
        </el-form-item>
        <el-select v-model="rolevalue" placeholder="请选择">
          <el-option
            v-for="item in roleList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form>
      <el-button @click="SetRolesdialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="SetRoles">确 定</el-button>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Users',
  data() {
    // 验证邮箱的校验规则
    let checkEmail = (rule, value, callback) => {
      // 验证邮箱的正则表达式
      const regEmail =
        /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/

      if (regEmail.test(value)) {
        // 合法的邮箱
        return callback()
      }
      // 不合法的邮箱
      callback(new Error('请输入合法的邮箱'))
    }
    // 验证手机号的校验规则
    let checkMobile = (rule, value, callback) => {
      // 验证手机号的正则表达式
      const regMobile = /^1(3|4|5|6|7|8|9)\d{9}$/

      if (regMobile.test(value)) {
        // 合法的手机号
        return callback()
      }
      // 不合法
      callback(new Error('请输入合法的手机号'))
    }
    return {
      // 添加用户弹窗显示状态
      dialogVisible: false,
      // 修改用户信息弹窗显示状态
      changedialogVisible: false,
      // 设置用户角色弹窗显示状态
      SetRolesdialogVisible: false,
      // 根据id查询到的要修改的用户信息
      changeUserInfo: {},
      //  获取用户列表的参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5,
      },
      // 添加用户数据
      addUserInfo: {
        username: '',
        password: '',
        mobile: '',
        email: '',
      },
      userList: [],
      total: 0, //总条数
      // 要修改角色的用户信息
      setRolerInfo: {},
      // 下拉菜单角色列表
      roleList: [],
      rolevalue: '',
      // 添加用户表单验证规则
      addUserrules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 5,
            max: 12,
            message: '长度在 5 到 12 个字符',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 5,
            max: 12,
            message: '长度在 5 到 12 个字符',
            trigger: 'blur',
          },
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' },
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
        ],
      },
      // 修改用户数据表单验证规则
      changeUserrules: {
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' },
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
        ],
      },
    }
  },
  // 初始化数据
  created() {
    this.getUserList()
  },
  methods: {
    // 获取用户列表
    getUserList() {
      this.$http
        .get('users', { params: this.queryInfo })
        .then(({ data: res }) => {
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
          this.userList = res.data.users
          this.total = res.data.total
        })
    },
    // 页面显示条数
    handleSizeChange(newpagesize) {
      this.queryInfo.pagesize = newpagesize
      this.getUserList()
    },
    // 切换页码
    handleCurrentChange(newpagenum) {
      this.queryInfo.pagenum = newpagenum
      this.getUserList()
    },
    // 用户状态改变
    userstatechange(row) {
      this.$http
        .put(`users/${row.id}/state/${row.mg_state}`)
        .then(({ data: res }) => {
          if (res.meta.status !== 200) {
            row.mg_state = !row.mg_state
            return this.$message.error(res.meta.msg)
          }
          this.$message.success('修改成功')
        })
    },
    // 弹窗关闭时清空数据
    addUserformClose() {
      this.$refs.addUserform.resetFields()
    },
    // 添加用户
    addUser() {
      this.$refs.addUserform.validate((valid) => {
        if (valid) {
          this.$http.post('users', this.addUserInfo).then(({ data: res }) => {
            if (res.meta.status !== 201) {
              return this.$message.error(res.meta.msg)
            }
            this.$message.success('添加成功')
            this.dialogVisible = false
            this.getUserList()
          })
        }
      })
    },
    // 修改弹窗关闭时清空数据状态
    changeUserformClose() {
      this.$refs.changeUserform.resetFields()
    },
    // 根据id获取用户信息展示在修改弹窗中
    showChangeDialog(id) {
      this.$http.get(`users/${id}`).then(({ data: res }) => {
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.changeUserInfo = res.data
        this.changedialogVisible = true
      })
    },
    // 修改用户
    changeUser() {
      this.$refs.changeUserform.validate((valid) => {
        if (valid) {
          this.$http
            .put(`users/${this.changeUserInfo.id}`, this.changeUserInfo)
            .then(({ data: res }) => {
              if (res.meta.status !== 200) {
                return this.$message.error(res.meta.msg)
              }
              this.$message.success('修改成功')
              this.changedialogVisible = false
              this.getUserList()
            })
        }
      })
    },
    // 根据id删除用户
    async removeUserInfo(id) {
      // 用户是否确认删除
      const confirmInfo = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      if (confirmInfo !== 'confirm') return this.$message.info('已取消删除')
      const { data: res } = await this.$http.delete(`users/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success('删除成功')
      this.getUserList()
    },
    // 设置用户角色弹窗
    showSetRolerdialogVisible(userinfo) {
      this.setRolerInfo = userinfo
      this.$http.get(`roles`).then(({ data: res }) => {
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.roleList = res.data
        this.SetRolesdialogVisible = true
      })
    },
    // 确定设置用户角色
    async SetRoles() {
      if (!this.rolevalue) {
        return this.$message.error('请选择角色')
      }
      const { data: res } = await this.$http.put(
        `users/${this.setRolerInfo.id}/role`,
        { rid: this.rolevalue }
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success('设置角色成功')
      this.SetRolesdialogVisible = false
      this.getUserList()
    },
    // 关闭设置用户角色弹窗
    SetRolesdialogVisibleClose() {
      this.setRolerInfo = {}
      this.rolevalue = ''
    },
  },
}
</script>

<style scoped>
.el-breadcrumb {
  margin-bottom: 20px;
}
.el-table {
  margin-top: 20px;
}
.el-select {
  margin-bottom: 20px;
}
</style>

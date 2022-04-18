<template>
  <div class="login_container">
    <div class="login_box">
      <div class="login_logo">
        <img src="../assets/logo.png" />
      </div>
      <div class="login_form">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleFormref"
          class="demo-ruleForm"
        >
          <el-form-item label="用户名" prop="username">
            <el-input
              prefix-icon="el-icon-user"
              v-model="ruleForm.username"
              placeholder="请输入用户名"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              prefix-icon="el-icon-lock"
              type="password"
              v-model="ruleForm.password"
              placeholder="请输入密码"
            ></el-input>
          </el-form-item>
          <el-form-item class="btns">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="clearfrom">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      ruleForm: {
        username: '',
        password: '',
      },
      rules: {
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
      },
    }
  },
  methods: {
    clearfrom() {
      this.$refs.ruleFormref.resetFields()
    },
    login() {
      this.$refs.ruleFormref.validate((valid) => {
        if (!valid) return this.$message.error('请检查表单')
        this.$http.post('login', this.ruleForm).then(({ data: res }) => {
          if (res.meta.status == 200) {
            window.sessionStorage.setItem('token', res.data.token)
            this.$router.push('/home')
            return this.$message.success('登录成功')
          } else {
            return this.$message.error('登录失败,用户名或密码错误')
          }
        })
      })
    },
  },
}
</script>

<style scope>
.login_container {
  height: 100%;
  background-color: #28667c;
}
.login_box {
  box-sizing: border-box;
  width: 400px;
  height: 400px;
  background-color: rgb(243, 219, 232);

  border-radius: 10px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}
.login_logo {
  width: 80px;
  height: 80px;
  padding: 10px;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgb(243, 219, 232);
}
img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}
</style>

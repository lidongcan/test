<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <el-row>
        <el-button type="primary" @click="dialogVisible = true"
          >添加角色</el-button
        >
      </el-row>
      <el-table :data="rolesList" style="width: 100%" stripe border>
        <!-- 箭头展开区域 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="(itme1, i1) in scope.row.children"
              :key="itme1.id"
              :class="[i1 === 0 ? '' : 'bdtop', 'vcenter']"
            >
              <el-col :span="3">
                <el-tag closable @close="delRoles(scope.row, itme1.id)">{{
                  itme1.authName
                }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row
                  v-for="(itme2, i2) in itme1.children"
                  :class="[i2 === 0 ? '' : 'bdtop']"
                  :key="itme2.id"
                >
                  <el-col :span="5">
                    <el-tag
                      type="success"
                      closable
                      @close="delRoles(scope.row, itme2.id)"
                      >{{ itme2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      v-for="itme3 in itme2.children"
                      :key="itme3.id"
                      type="warning"
                      closable
                      @close="delRoles(scope.row, itme3.id)"
                    >
                      {{ itme3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="showChangedialog(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="removeRoles(scope.row.id)"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-setting"
              @click="showSetrightdialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色弹窗 -->
    <el-dialog
      title="添加角色"
      :visible.sync="dialogVisible"
      width="40%"
      @close="addRolesClose"
    >
      <el-form :model="addRolesInfo" :rules="addRolesrules" ref="addRolesform">
        <el-form-item label="名称" prop="roleName">
          <el-input
            v-model="addRolesInfo.roleName"
            placeholder="请输入角色名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="roleDesc">
          <el-input
            v-model="addRolesInfo.roleDesc"
            placeholder="请输入角色描述"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="CreateRole">确 定</el-button>
    </el-dialog>
    <!-- 修改角色弹窗 -->
    <el-dialog
      title="添加角色"
      :visible.sync="changedialogVisible"
      width="40%"
      @close="changeRolesClose"
    >
      <el-form
        :model="changeRolesInfo"
        :rules="changeRolesrules"
        ref="changeRolesform"
      >
        <el-form-item label="名称" prop="roleName">
          <el-input
            v-model="changeRolesInfo.roleName"
            placeholder="请输入角色名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="roleDesc">
          <el-input
            v-model="changeRolesInfo.roleDesc"
            placeholder="请输入角色描述"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-button @click="changedialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="changeRoles">确 定</el-button>
    </el-dialog>
    <!-- 分配权限弹窗 -->
    <el-dialog
      title="提示"
      :visible.sync="SetRightdialogVisible"
      width="40%"
      @close="SetRightdialogClose"
    >
      <el-tree
        :data="RightsList"
        :props="RightsProps"
        show-checkbox
        default-expand-all
        node-key="id"
        :default-checked-keys="defkeys"
        ref="treeref"
      ></el-tree>
      <el-button @click="SetRightdialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="SetRight">确 定</el-button>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Roles',
  data() {
    return {
      //角色列表数据
      rolesList: [],
      // 弹窗初始状态
      dialogVisible: false,
      changedialogVisible: false,
      SetRightdialogVisible: false,
      // 根据id查询到的角色信息
      changeRolesInfo: {},
      // 所有权限数据
      RightsList: [],
      // 树形控件属性绑定对象
      RightsProps: {
        children: 'children',
        label: 'authName',
      },
      // 默认选中节点数据
      defkeys: [],
      // 添加角色弹窗数据
      addRolesInfo: {
        roleName: '',
        roleDesc: '',
      },
      roleid: '',
      // 添加角色弹窗验证规则
      addRolesrules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '长度在 2 到 10 个字符',
            trigger: 'blur',
          },
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '长度在 2 到 10 个字符',
            trigger: 'blur',
          },
        ],
      },
      // 修改角色弹窗验证规则
      changeRolesrules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '长度在 2 到 10 个字符',
            trigger: 'blur',
          },
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '长度在 2 到 10 个字符',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  mounted() {
    this.getRoles()
  },
  methods: {
    //获取角色列表
    getRoles() {
      this.$http.get('roles').then(({ data: res }) => {
        if (res.meta.status !== 200) {
          this.$message.error(res.data.meta.msg)
        }
        this.rolesList = res.data
      })
    },
    // 关闭添加角色弹窗清除数据
    addRolesClose() {
      this.$refs.addRolesform.resetFields()
    },
    // 添加角色
    CreateRole() {
      this.$refs.addRolesform.validate(async (valid) => {
        if (valid) {
          const { data: res } = await this.$http.post(
            'roles',
            this.addRolesInfo
          )
          if (res.meta.status !== 201) {
            this.$message.error(res.data.meta.msg)
          }
          this.$message.success('添加成功')
          this.dialogVisible = false
          this.getRoles()
        }
      })
    },
    // 关闭修改角色弹窗清除数据
    changeRolesClose() {
      this.$refs.changeRolesform.resetFields()
    },
    // 根据id查询角色信息
    showChangedialog(id) {
      this.$http.get('roles/' + id).then(({ data: res }) => {
        console.log(res)
        if (res.meta.status !== 200) {
          this.$message.error(res.data.meta.msg)
        }
        this.changeRolesInfo = res.data
        this.changedialogVisible = true
      })
    },
    // 修改角色
    changeRoles() {
      this.$refs.changeRolesform.validate((valid) => {
        if (valid) {
          this.$http
            .put(
              'roles/' + Number(this.changeRolesInfo.roleId),
              this.changeRolesInfo
            )
            .then(({ data: res }) => {
              if (res.meta.status !== 200) {
                this.$message.error(res.meta.msg)
              }
              this.$message.success('修改成功')
              this.changedialogVisible = false
              this.getRoles()
            })
        }
      })
    },
    // 根据id删除用户
    async removeRoles(id) {
      // 用户是否确认删除
      const confirmInfo = await this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      if (confirmInfo !== 'confirm') return this.$message.info('已取消删除')
      const { data: res } = await this.$http.delete(`roles/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success('删除成功')
      this.getRoles()
    },
    // 根据id删除角色权限
    async delRoles(role, rightId) {
      const confirmInfo = await this.$confirm(
        '此操作将删除用户该权限, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      if (confirmInfo !== 'confirm') return this.$message.info('已取消删除')
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success('删除角色权限成功')
      role.children = res.data //将返回的数据给到角色的children,防止页面刷新关闭下拉框
    },
    // 点击分配权限按钮
    async showSetrightdialog(role) {
      this.roleid = role.id
      const { data: res } = await this.$http.get(`rights/tree`)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.RightsList = res.data
      this.getLeafKeys(role, this.defkeys)
      this.SetRightdialogVisible = true
    },
    // 通过递归形式获取角色下所有三级权限的id,并将其保存到数组
    getLeafKeys(node, arr) {
      // 如果不包含children属性,说明是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      // 如果包含children属性,说明是二级节点,再次递归
      node.children.forEach((item) => {
        this.getLeafKeys(item, arr)
      })
    },
    // 关闭分配权限弹窗清除数据
    SetRightdialogClose() {
      this.defkeys = []
    },
    // 确定分配权限
    async SetRight() {
      const keys = [
        // 调用树状图的方法获取选中和半选中的节点的id
        ...this.$refs.treeref.getCheckedKeys(),
        ...this.$refs.treeref.getHalfCheckedKeys(),
      ]
      const idStry = keys.join(',')
      const { data: res } = await this.$http.post(
        `roles/${this.roleid}/rights`,
        { rids: idStry }
      )

      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success('分配权限成功')
      this.getRoles()
      this.SetRightdialogVisible = false
    },
  },
}
</script>

<style scoped>
.el-card {
  margin-top: 20px;
  margin-bottom: 50px;
}
.el-table {
  margin-top: 20px;
}
.bdtop {
  border-top: 1px solid #f4f1f1;
}
.el-tag {
  margin: 7px;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>

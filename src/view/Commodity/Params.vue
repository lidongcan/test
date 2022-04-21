<template>
  <div class="params-container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card class="global-card-margin">
      <!-- 首行警告信息 -->
      <el-alert
        title="注意:只允许为第三级分类设计相关参数"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 选择商品分类行 -->
      <el-row>
        <!-- 选择分类 -->
        <el-col>
          <span style="margin-right: 10px">选择商品分类:</span>
          <el-cascader
            v-model="cateSelected"
            :options="cateOptions"
            :props="cateProps"
            @change="handleCateChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tabs标签页 -->
      <el-tabs v-model="activeName" @tab-click="handleTabsClick">
        <el-tab-pane label="动态参数" name="many">
          <el-row>
            <el-col>
              <el-button
                type="primary"
                :disabled="btnStatus"
                @click="showAddParamsDialog"
                >添加参数</el-button
              >
            </el-col>
          </el-row>

          <!-- 动态参数表格区域 -->
          <el-table :data="manyParamsList" style="width: 100%" border>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  closable
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  @close="removeTag(index, scope.row)"
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.newTagVisible"
                  v-model="scope.row.newTagValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditParamsDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParamsById(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性标签页 -->
        <el-tab-pane label="静态属性" name="only">
          <el-row>
            <el-col>
              <el-button
                type="primary"
                :disabled="btnStatus"
                @click="showAddParamsDialog"
                >添加属性</el-button
              >
            </el-col>
          </el-row>
          <!-- 静态属性表格 -->
          <el-table :data="onlyParamsList" style="width: 100%" border>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  closable
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  @close="removeTag(index, scope.row)"
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.newTagVisible"
                  v-model="scope.row.newTagValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditParamsDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParamsById(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数对话框 :: 动态参数和静态属性都可以 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addParamsDialogVisible"
      width="50%"
      @close="addParamsClosed"
    >
      <span>
        <el-form
          :model="addForm"
          :rules="rules"
          ref="addParamsFormRef"
          label-width="120px"
        >
          <el-form-item :label="titleText + '名称'" prop="attr_name">
            <el-input v-model="addForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑参数对话框 :: 动态参数和静态属性都可以 -->
    <el-dialog
      :title="'编辑' + titleText"
      :visible.sync="editParamsDialogVisible"
      width="50%"
      @close="editParamsClosed"
    >
      <span>
        <el-form
          :model="editForm"
          :rules="rules"
          ref="editParamsFormRef"
          label-width="120px"
        >
          <el-form-item :label="titleText + '名称'" prop="attr_name">
            <el-input v-model="editForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'params',
  data() {
    return {
      // 选中的级联菜单项 数组
      cateSelected: [],
      // 级联菜单数据源 -> 同时也是商品分类信息
      cateOptions: [],
      // 级联菜单配置项
      cateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      // 默认激活的选项
      activeName: 'many',
      // 添加参数按钮状态的控制
      // 动态参数列表 -> 接收服务器返回的数据
      manyParamsList: [],
      // 静态属性列表 -> 接收服务器返回的数据
      onlyParamsList: [],
      // 控制添加动态参数和静态属性对话框的显示与隐藏
      addParamsDialogVisible: false,
      // 控制编辑动态参数和静态属性对话框的显示与隐藏
      editParamsDialogVisible: false,
      // 添加动态参数的表单数据源 -> 同时也是发送给服务器的参数
      addForm: {},
      // 编辑动态参数或静态属性表单的数据源 -> 同时也是发送给服务器的参数
      editForm: {},
      // 表单规则 -> 我觉得这里规则是通用的,所以定义一个就行
      rules: {
        attr_name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
        ],
      },
    }
  },
  methods: {
    // 获取商品分类数据列表 -> 为级联菜单提供数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories')

      if (res.meta.status !== 200) return

      this.cateOptions = res.data
    },
    // 监听级联菜单变化
    handleCateChange() {
      this.getParamsList()
      // 数组长度不等于三就证明选择的不是三级分类
      if (this.cateSelected.length !== 3) {
        this.cateSelected = []
      }
    },
    // 监听标签页切换事件
    handleTabsClick() {
      this.getParamsList()
      if (this.activeName === 'many') {
        console.log('动态参数', this.manyParamsList)
      } else {
        console.log('静态参数', this.onlyParamsList)
      }
    },
    // 获取分类参数列表 -> 为动态参数和静态属性提供数据源
    async getParamsList() {
      if (this.cateSelected.length !== 3) {
        this.cateSelected = []
        this.manyParamsList = []
        this.onlyParamsList = []
        return null
      }
      const { data: res } = await this.$http.get(
        `categories/${this.cateID}/attributes`,
        {
          params: { sel: this.activeName },
        }
      )

      if (res.meta.status !== 200) return

      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 默认new Tag的显示元素
        item.newTagVisible = false
        // new Tag的输入内容
        item.newTagValue = ''
      })
      this.activeName === 'many'
        ? (this.manyParamsList = res.data)
        : (this.onlyParamsList = res.data)
    },
    // 添加动态参数或静态属性按钮点击事件
    showAddParamsDialog() {
      this.addParamsDialogVisible = true
    },
    // 添加动态参数或静态属性对话框关闭事件
    addParamsClosed() {
      this.$refs.addParamsFormRef.resetFields()
    },
    // 编辑动态参数或静态属性按钮点击事件
    async showEditParamsDialog(id) {
      // 向服务器请求数据
      const { data: res } = await this.$http.get(
        `categories/${this.cateID}/attributes/${id}`,
        {
          attr_sel: this.activeName,
        }
      )

      if (res.meta.status !== 200)
        return this.$message.error('请求分类参数失败')

      console.log(res.data)
      this.editForm = res.data
      this.editParamsDialogVisible = true
    },
    // 添加动态参数或静态属性对话框关闭事件
    editParamsClosed() {
      this.$refs.editParamsFormRef.resetFields()
    },
    // 点击确定后发起添加动态参数或静态属性的方法
    addParams() {
      this.$refs.addParamsFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error('表单信息有误,请假查内容')

        const { data: res } = await this.$http.post(
          `categories/${this.cateID}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName,
          }
        )

        if (res.meta.status !== 201) return this.$message.error('添加失败')

        this.getParamsList()
        this.addParamsDialogVisible = false
        this.$message.success('添加成功')
      })
    },
    // 点击确定后发起编辑动态参数或静态属性的方法
    editParams() {
      this.$refs.editParamsFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error('请检查表单信息')

        const { data: res } = await this.$http.put(
          `categories/${this.cateID}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName,
          }
        )

        console.log(res)
        if (res.meta.status !== 200) return this.$message.error('更新失败')

        this.getParamsList()
        this.editParamsDialogVisible = false
        this.$message.success('更新成功')
      })
    },
    // 删除动态参数按钮点击事件
    async removeParamsById(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该参数, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)

      if (confirmResult !== 'confirm')
        return this.$message.info('您取消了删除操作')

      const { data: res } = await this.$http.delete(
        `categories/${this.cateID}/attributes/${id}`
      )

      if (res.meta.status !== 200) return this.$message.error('删除失败')

      this.getParamsList()
      this.$message.success('删除成功')
    },
    // 点击new Tag按钮后
    showInput(row) {
      row.newTagVisible = true
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // Input输入框失去焦点后
    async handleInputConfirm(row) {
      if (row.newTagValue.trim().length === 0) {
        row.newTagValue = ''
        row.newTagVisible = false
        return null
      }
      row.attr_vals.push(row.newTagValue.trim())
      row.newTagValue = ''
      row.newTagVisible = false

      const { data: res } = await this.$http.put(
        `categories/${this.cateID}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' '),
        }
      )

      if (res.meta.status !== 200) return this.$message.error('添加新标签失败')

      this.$message.success('添加新标签成功')
    },
    // 删除tag标签
    removeTag(index, row) {
      row.attr_vals.splice(index, 1)
      this.saveAttrValues(row)
    },
    //
    async saveAttrValues(row) {
      const { data: res } = await this.$http.put(
        `categories/${this.cateID}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: this.activeName,
          attr_vals: row.attr_vals.join(' '),
        }
      )

      if (res.meta.status !== 200) return this.$message.error('更新失败')

      this.editParamsDialogVisible = false
      this.$message.success('更新成功')
    },
  },
  computed: {
    btnStatus() {
      if (this.cateSelected.length !== 3) {
        return true
      }
      return false
    },

    cateID() {
      if (this.cateSelected.length === 3) {
        return this.cateSelected[2]
      }
      return null
    },
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    },
  },
  created() {
    this.getCateList()
  },
}
</script>

<style lang="less" scoped>
.el-row {
  margin-top: 20px;
}
.el-tabs {
  margin-top: 20px;
}
.el-table {
  margin-top: 20px;
}
.el-tag {
  margin-left: 5px;
}
.input-new-tag {
  width: 120px;
  margin-left: 10px;
  vertical-align: bottom;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.el-card {
  margin-top: 20px;
  margin-bottom: 50px;
}
</style>

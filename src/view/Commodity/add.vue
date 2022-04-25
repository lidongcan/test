<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 警告条 -->
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"> </el-alert>
      <!-- 步骤条 -->
      <el-steps :space="300" :active="activeindex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 标签页 -->
      <el-form :model="addFrom" :rules="addFromRules" ref="addFromref" label-position="top">
        <!--标签页-->
        <el-tabs v-model="activeindex" :tab-position="'left'" :before-leave="beforeTabLeave" @tab-click="tabClick">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addFrom.goods_name" placeholder="请输入商品名称"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addFrom.goods_number" placeholder="请输入商品数量" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addFrom.goods_weight" placeholder="请输入商品重量" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addFrom.goods_price" placeholder="请输入商品价格" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_price">
              <el-cascader
                v-model="addFrom.goods_cat"
                :options="cateList"
                :props="cateProps"
                @change="handleChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="(item, i) in manyTabData" :key="i">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="i" v-for="(i, index) in item.attr_vals" :key="index" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" prop="goods_attr" v-for="item in onlyTabData" :key="item.attr_id">
              <el-input v-model="item.attr_vals" placeholder="请输入商品名称"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              action="https://lianghj.top:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :headers="headersObj"
              :on-success="handleSuccess"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addFrom.goods_introduce"></quill-editor>
            <el-button type="primary" @click="add"> 添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览弹窗 -->
    <el-dialog title="图片预览" :visible.sync="dialogVisible" width="50%">
      <img :src="previewImage" width="100%" />
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash' // 引入lodash
import ParamsVue from './Params.vue'
export default {
  name: 'Add',
  data() {
    return {
      // 步骤条激活的索引
      activeindex: 0,
      // 添加商品信息表单
      addFrom: {
        // 名称
        goods_name: '',
        // 数量
        goods_number: 0,
        // 重量
        goods_weight: 0,
        // 价格
        goods_price: 0,
        // 分类
        goods_cat: [],
        // 图片临时路径
        pics: [],
        // 商品介绍
        goods_introduce: '',
        // 商品属性和参数
        attrs: [],
      },
      //   添加商品信息表单验证规则
      addFromRules: {
        // 名称
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        // 数量
        goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
        // 重量
        goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }],
        // 价格
        goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        // 分类
        goods_cat: [{ required: true, message: '请选择商品分类', trigger: 'change' }],
      },
      // 分类列表
      cateList: [],
      // 级联选择器参数
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      //动态参数列表数据
      manyTabData: [],
      //   静态属性列表数据
      onlyTabData: [],
      //   图片上传的请求头
      headersObj: {
        Authorization: window.sessionStorage.getItem('token'),
      },
      //   图片预览
      previewImage: '',
      dialogVisible: false,
    }
  },
  created() {
    //   获取分类数据
    this.getCateList()
  },
  methods: {
    //   获取分类数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error('获取分类数据失败')
      this.cateList = res.data
    },
    // 级联选择器选中变化
    handleChange() {
      if (this.addFrom.goods_cat.length !== 3) {
        this.$message.error('请选择三级分类')
        this.addFrom.goods_cat = []
      }
    },

    // 阻止标签页的切换
    beforeTabLeave(activenaem, oldactivename) {
      if (oldactivename === '0' && this.addFrom.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类')
        return false
      }
      return true
    },
    // 点击标签页切换时触发
    async tabClick() {
      //   根据id查询动态参数
      if (this.activeindex === '1') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'many' } })
        if (res.meta.status !== 200) return this.$message.error('获取商品参数失败')
        res.data.forEach((item) => {
          item.attr_vals = item.attr_vals.length === 3 ? [] : item.attr_vals.split(',')
        })
        this.manyTabData = res.data
      }
      //   根据id查询商品属性
      else if (this.activeindex === '2') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'only' } })
        if (res.meta.status !== 200) return this.$message.error('获取商品属性失败')
        console.log(res.data)
        this.onlyTabData = res.data
      }
    },
    // 点击图片预览效果
    handlePreview(file) {
      this.previewImage = file.response.data.url
      this.dialogVisible = true
    },
    // 点击图片删除按钮
    handleRemove(file) {
      // 获取图片的临时路径
      const filepath = file.response.data.tmp_path
      // 从pics数组中找到对应的临时路径
      const index = this.addFrom.pics.findIndex((item) => item.pic === filepath)
      //   删除数组中对应的临时路径
      this.addFrom.pics.splice(index, 1)
      this.$message.success('删除成功')
    },
    // 点击图片上传按钮
    handleSuccess(res) {
      const pic = { pic: res.data.tmp_path }
      this.addFrom.pics.push(pic)
    },
    //   添加商品
    add() {
      this.$refs.addFromref.validate(async (val) => {
        if (!val) {
          return this.$message.error('请填写完整信息')
        }
        // 深拷贝addFrom中的数据,防止与级联选择器中的数据冲突
        const from = _.cloneDeep(this.addFrom)
        from.goods_cat = from.goods_cat.join(',')
        this.manyTabData.forEach((item) => {
          const newinfo = { attr_id: item.attr_id, attr_value: item.attr_vals.join(',') }
          this.addFrom.attrs.push(newinfo)
        })
        this.onlyTabData.forEach((item) => {
          const newinfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
          this.addFrom.attrs.push(newinfo)
        })
        from.attrs = this.addFrom.attrs
        //  发送请求
        // 商品名称必须是唯一的
        const { data: res } = await this.$http.post('goods', from)
        console.log(res)
        if (res.meta.status !== 201) return this.$message.error('添加商品失败')
        this.$message.success('添加商品成功')
        this.$router.push('/goods')
      })
    },
  },
  computed: {
    //   获取三级分类的id
    cateId() {
      if (this.addFrom.goods_cat.length === 3) {
        return this.addFrom.goods_cat[2]
      }
      return null
    },
  },
}
</script>

<style lang="css" scoped>
.el-card {
  margin-top: 20px;
  margin-bottom: 50px;
}
.el-steps {
  margin: 12px 0;
  width: 100%;
}
.el-step__title {
  font-size: 13px;
}
.el-checkbox {
  margin: 0 5px 0 0 !important;
}
.el-button {
  margin-top: 20px;
}
</style>

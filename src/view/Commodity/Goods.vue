<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- 搜索框 -->
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodList"></el-button>
          </el-input>
        </el-col>
        <!-- 添加商品按钮 -->
        <el-col :span="6">
          <el-button type="primary" @click="addGoods">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格区 -->
      <el-table :data="goodList" style="width: 100%" stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="550"> </el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)"> </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量"> </el-table-column>
        <el-table-column prop="add_time" label="创建时间">
          <template slot-scope="scope">
            <span>{{ scope.row.add_time | dateFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="editGood(scope.row.goods_id)">编辑</el-button>
            <el-button type="text" @click="deleteGood(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 15, 20, 25]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!-- 编辑商品弹窗 -->
    <el-dialog title="编辑商品" :visible.sync="editGoodsdialogVisible" width="30%">
      <el-form :model="goodsInfo" :rules="addFormRules" label-width="100px" ref="goodsInfoRef">
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="goodsInfo.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input v-model.number="goodsInfo.goods_weight" :min="0" oninput="if(value<0)value=0"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
          <el-input v-model.number="goodsInfo.goods_number" :min="0" oninput="if(value<0)value=0"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input v-model.number="goodsInfo.goods_price" :min="0" oninput="if(value<0)value=0"></el-input>
        </el-form-item>
      </el-form>
      <el-button @click="editGoodsdialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="editGoods">确 定</el-button>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Goods',
  data() {
    return {
      // 查询参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      // 总条数
      total: 0,
      // 接收列表数据
      goodList: [],
      // 编辑商品弹窗默认状态
      editGoodsdialogVisible: false,
      // 编辑商品弹窗数据
      goodsInfo: {},
      addFormRules: {
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
      },
    }
  },
  created() {
    this.getGoodList()
  },
  methods: {
    // 获取商品列表
    async getGoodList() {
      const { data: res } = await this.$http.get('goods', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('获取商品列表失败')
      console.log(res)
      this.goodList = res.data.goods
      this.total = res.data.total
    },
    // 点击添加商品
    addGoods() {
      this.$router.push('/goods/add')
    },
    // 编辑商品
    async editGood(id) {
      const { data: res } = await this.$http.get(`goods/${id}`)
      if (res.meta.status !== 200) return this.$message.error('获取商品信息失败')
      this.goodsInfo = res.data
      this.editGoodsdialogVisible = true
    },
    // 编辑商品弹窗确定
    editGoods() {
      this.$refs.goodsInfoRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.put(`goods/${this.goodsInfo.goods_id}`, this.goodsInfo)
        if (res.meta.status !== 200) return this.$message.error('编辑商品失败')
        this.$message.success('编辑商品成功')
        this.editGoodsdialogVisible = false
        this.getGoodList()
      })
    },
    // 删除商品
    deleteGood(row) {
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`goods/${row.goods_id}`)
          if (res.meta.status !== 200) return this.$message.error('删除商品失败')
          this.$message.success('删除商品成功')
          this.getGoodList()
        })
        .catch(() => {
          this.$message.info('已取消删除商品')
        })
    },
    // 页面数量变化
    handleSizeChange(newpagesize) {
      this.queryInfo.pagesize = newpagesize
      this.getGoodList()
    },
    // 页码变化
    handleCurrentChange(newpagenum) {
      this.queryInfo.pagenum = newpagenum
      this.getGoodList()
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
  margin-bottom: 20px;
}
</style>

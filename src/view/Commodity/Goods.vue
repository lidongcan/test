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
            <el-button type="text" @click="editGood(scope.row)">编辑</el-button>
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
      <span>这是一段信息</span>
      <el-button @click="editGoodsdialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="editGoodsdialogVisible = false">确 定</el-button>
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
    editGood(row) {
      this.editGoodsdialogVisible = true
    },
    // 删除商品
    async deleteGood(row) {
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

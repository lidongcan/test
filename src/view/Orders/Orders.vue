<template>
  <div class="order-container">
    <!-- 面包屑导肮 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card class="global-card-margin">
      <!-- 搜索框 -->
      <el-row>
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="searchValue" clearable @clear="searchOrderClear">
            <el-button slot="append" icon="el-icon-search" @click="searchOrder"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- table表格区域::订单列表 -->
      <el-table :data="orderList" border stripe style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="120"> </el-table-column>
        <el-table-column prop="order_pay" label="是否付款">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.order_pay === '0'">未付款</el-tag>
            <el-tag type="success" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"> </el-table-column>
        <el-table-column prop="create_time" label="下单时间">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <el-tooltip class="item" effect="dark" content="修改订单" placement="top" :enterable="false">
            <el-button type="primary" icon="el-icon-edit" circle @click="showEditDialog"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="物流状态" placement="top" :enterable="false">
            <el-button type="success" icon="el-icon-location" circle @click="showInfo"></el-button>
          </el-tooltip>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <!-- 修改订单的对话框 -->
    <el-dialog title="修改订单" :visible.sync="editDialogVisible" width="50%" @close="resetForm">
      <span>
        <el-form :model="editForm" :rules="rules" ref="editFormRef" label-width="100px" class="demo-ruleForm">
          <el-form-item label="省市区/县" prop="address1">
            <el-cascader :options="cityData" v-model="editForm.address1"> </el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="address2">
            <el-input v-model="editForm.address2"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editOrder">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 物流状态对话框 -->
    <!--    显示物流进度的对话框-->
    <el-dialog title="物流进度" :visible.sync="progressDialogVisible" width="50%">
      <el-timeline :reverse="false">
        <el-timeline-item v-for="(activity, index) in progressInfo" :key="index" :timestamp="activity.ftime">
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from './citydata.js'
export default {
  name: 'order',
  data() {
    return {
      // 搜索框数据绑定
      searchValue: '',
      // 订单列表 :: 表格的数据源
      orderList: [],
      // 查询参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5,
      },
      total: 0,
      // 控制编辑对话框的显示与隐藏
      editDialogVisible: false,
      // 控制物流信息对话框的显示与隐藏
      progressDialogVisible: false,
      // 编辑表单的表单信息
      editForm: {
        address1: [],
        address2: '',
      },
      // 表单规则
      rules: {
        address1: [{ required: true, message: '请选择省市区/县', trigger: 'blur' }],
        address2: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
      },
      cityData,
      progressInfo: [],
    }
  },
  methods: {
    // 获取订单列表的数据
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', { params: this.queryInfo })

      if (res.meta.status !== 200) return this.$message.error('获取订单列表失败')

      this.orderList = res.data.goods
      this.total = res.data.total
    },
    // 监听页面显示条数变化
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    // 监听页面变化
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    // 搜索订单
    searchOrder() {
      this.queryInfo.query = this.searchValue
      this.getOrderList()
    },
    // 当input输入框清空时 :: 这里只针对点了那个小XX,因为有bug
    searchOrderClear() {
      this.queryInfo.query = ''
      this.getOrderList()
    },
    // 显示编辑订单对话框
    showEditDialog() {
      this.editDialogVisible = true
    },
    // 当用户点击了确定[修改]按钮后
    editOrder() {
      this.editDialogVisible = false
    },
    // 重置编辑表单
    resetForm() {
      this.$refs.editFormRef.resetFields()
    },
    // 获取物流信息
    async showInfo() {
      const { data: res } = await this.$http.get('/kuaidi/1106975712662')
      if (res.meta.status !== 200) {
        return this.$message.error('获取物流进度失败！')
      }
      this.progressInfo = res.data
      this.progressDialogVisible = true
    },
  },
  created() {
    this.getOrderList()
  },
}
</script>

<style scoped>
.el-table {
  margin-top: 20px;
}
.el-pagination {
  margin-top: 20px;
}
.el-card {
  margin-top: 20px;
  margin-bottom: 50px;
}
</style>

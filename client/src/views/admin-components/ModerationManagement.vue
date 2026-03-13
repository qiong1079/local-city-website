<template>
  <div class="admin-section">
    <h2>审核管理</h2>
    <div class="admin-toolbar">
      <button @click="fetchPendingItems" class="refresh-btn">刷新待审核列表</button>
      <div class="search-bar">
        <input 
          type="text" 
          v-model="searchContactPhone" 
          placeholder="按电话搜索..."
          @keyup.enter="fetchPendingItems"
        >
        <button @click="fetchPendingItems" class="search-btn">搜索</button>
      </div>
    </div>
    
    <div v-if="loading" class="loading">加载中...</div>
    
    <div v-else>
      <!-- 房屋审核 -->
      <div v-if="pendingItems.houses && pendingItems.houses.length > 0" class="moderation-section">
        <h3>房屋租售</h3>
        <table class="data-table">
          <thead>
            <tr>
              <th>标题</th>
              <th>价格</th>
              <th>联系电话</th>
              <th>提交时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in pendingItems.houses" :key="item.id">
              <td>{{ item.title }}</td>
              <td>{{ item.price }}</td>
              <td>{{ item.contactPhone }}</td>
              <td>{{ formatDate(item.createdAt) }}</td>
              <td>
                <button @click="approveItem('house', item.id)" class="approve-btn">通过</button>
                <button @click="rejectItem('house', item.id)" class="reject-btn">拒绝</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- 二手物品审核 -->
      <div v-if="pendingItems.secondhand && pendingItems.secondhand.length > 0" class="moderation-section">
        <h3>二手物品</h3>
        <table class="data-table">
          <thead>
            <tr>
              <th>标题</th>
              <th>价格</th>
              <th>联系电话</th>
              <th>提交时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in pendingItems.secondhand" :key="item.id">
              <td>{{ item.title }}</td>
              <td>{{ item.price }}</td>
              <td>{{ item.contactPhone }}</td>
              <td>{{ formatDate(item.createdAt) }}</td>
              <td>
                <button @click="approveItem('secondhand', item.id)" class="approve-btn">通过</button>
                <button @click="rejectItem('secondhand', item.id)" class="reject-btn">拒绝</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- 车辆审核 -->
      <div v-if="pendingItems.vehicles && pendingItems.vehicles.length > 0" class="moderation-section">
        <h3>车辆买卖</h3>
        <table class="data-table">
          <thead>
            <tr>
              <th>标题</th>
              <th>价格</th>
              <th>联系电话</th>
              <th>提交时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in pendingItems.vehicles" :key="item.id">
              <td>{{ item.title }}</td>
              <td>{{ item.price }}</td>
              <td>{{ item.contactPhone }}</td>
              <td>{{ formatDate(item.createdAt) }}</td>
              <td>
                <button @click="approveItem('vehicle', item.id)" class="approve-btn">通过</button>
                <button @click="rejectItem('vehicle', item.id)" class="reject-btn">拒绝</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- 生活服务审核 -->
      <div v-if="pendingItems.services && pendingItems.services.length > 0" class="moderation-section">
        <h3>生活服务</h3>
        <table class="data-table">
          <thead>
            <tr>
              <th>标题</th>
              <th>价格</th>
              <th>联系电话</th>
              <th>提交时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in pendingItems.services" :key="item.id">
              <td>{{ item.title }}</td>
              <td>{{ item.price }}</td>
              <td>{{ item.contactPhone }}</td>
              <td>{{ formatDate(item.createdAt) }}</td>
              <td>
                <button @click="approveItem('service', item.id)" class="approve-btn">通过</button>
                <button @click="rejectItem('service', item.id)" class="reject-btn">拒绝</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- 无待审核内容 -->
      <div v-if="!hasPendingItems" class="no-items">
        <p>暂无待审核内容</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ModerationManagement',
  data() {
    return {
      pendingItems: {
        houses: [],
        secondhand: [],
        vehicles: [],
        services: []
      },
      loading: false,
      searchContactPhone: ''
    }
  },
  computed: {
    hasPendingItems() {
      return this.pendingItems.houses.length > 0 || 
             this.pendingItems.secondhand.length > 0 || 
             this.pendingItems.vehicles.length > 0 || 
             this.pendingItems.services.length > 0
    }
  },
  mounted() {
    this.fetchPendingItems()
  },
  methods: {
    async fetchPendingItems() {
      this.loading = true
      try {
        const response = await axios.get('/api/moderation/pending', {
          params: {
            contactPhone: this.searchContactPhone
          }
        })
        this.pendingItems = response.data
      } catch (error) {
        console.error('获取待审核内容失败:', error)
      } finally {
        this.loading = false
      }
    },
    
    async approveItem(type, id) {
      try {
        await axios.put(`/api/moderation/approve/${type}/${id}`)
        alert('审核通过')
        this.fetchPendingItems()
      } catch (error) {
        console.error('审核通过失败:', error)
        alert('操作失败，请重试')
      }
    },
    
    async rejectItem(type, id) {
      try {
        await axios.put(`/api/moderation/reject/${type}/${id}`)
        alert('审核拒绝')
        this.fetchPendingItems()
      } catch (error) {
        console.error('审核拒绝失败:', error)
        alert('操作失败，请重试')
      }
    },
    
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleString()
    }
  }
}
</script>

<style scoped>
.admin-section {
  margin-top: 30px;
}

.admin-section h2 {
  margin-bottom: 20px;
  color: #333;
  font-size: 24px;
  font-weight: bold;
}

.refresh-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 20px;
}

.refresh-btn:hover {
  background-color: #0069d9;
}

.loading {
  text-align: center;
  padding: 20px;
  color: #666;
}

.moderation-section {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #f9f9fa;
}

.moderation-section h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #333;
  font-size: 18px;
}

.no-items {
  text-align: center;
  padding: 40px;
  color: #666;
  background-color: #f9f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.data-table th,
.data-table td {
  border: 1px solid #dee2e6;
  padding: 10px;
  text-align: left;
}

.data-table th {
  background-color: #f8f9fa;
  font-weight: bold;
}

.data-table tr {
  border-bottom: 1px solid #dee2e6;
}

.data-table tr:hover {
  background-color: #f8f9fa;
}

.approve-btn {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 5px;
  font-size: 12px;
}

.approve-btn:hover {
  background-color: #218838;
}

.reject-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.reject-btn:hover {
  background-color: #c82333;
}

/* 工具栏样式 */
.admin-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-bar {
  display: flex;
  gap: 10px;
}

.search-bar input {
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  width: 200px;
}

.search-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.search-btn:hover {
  background-color: #0069d9;
}
</style>
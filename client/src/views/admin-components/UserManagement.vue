<template>
  <div class="admin-section">
    <h2>用户管理</h2>
    <div class="admin-toolbar">
      <div class="search-bar">
        <input 
          type="text" 
          v-model="pagination.user.search" 
          placeholder="按电话搜索..."
          @keyup.enter="fetchUsers"
        >
        <button @click="fetchUsers" class="search-btn">搜索</button>
      </div>
    </div>
    
    <div v-if="showEditForm" class="card">
      <h3>{{ editUserId ? '编辑用户' : '添加用户' }}</h3>
      <div class="form-grid">
        <div>
          <div class="form-item">
            <label>用户名</label>
            <input type="text" v-model="userForm.username">
          </div>
          <div class="form-item">
            <label>邮箱</label>
            <input type="email" v-model="userForm.email">
          </div>
          <div class="form-item">
            <label>密码</label>
            <input type="password" v-model="userForm.password" placeholder="留空则不修改">
          </div>
          <div class="form-item">
            <label>用户类型</label>
            <select v-model="userForm.userType">
              <option value="personal">个人用户</option>
              <option value="organization">机构用户</option>
            </select>
          </div>
          <div class="form-item">
            <label>金币</label>
            <input type="number" v-model="userForm.coins">
          </div>
        </div>
        <div>
          <div class="form-item">
            <label>姓名/机构名称</label>
            <input type="text" v-model="userForm.name" v-if="userForm.userType === 'personal'">
            <input type="text" v-model="userForm.organizationName" v-else>
          </div>
          <div class="form-item">
            <label>联系电话</label>
            <input type="text" v-model="userForm.phone">
          </div>
          <div class="form-item" v-if="userForm.userType === 'organization'">
            <label>所属地区</label>
            <input type="text" v-model="userForm.region">
          </div>
          <div class="form-item" v-if="userForm.userType === 'organization'">
            <label>行业</label>
            <input type="text" v-model="userForm.industry">
          </div>
          <div class="form-item" v-if="userForm.userType === 'organization'">
            <label>机构描述</label>
            <textarea v-model="userForm.organizationDesc" rows="3"></textarea>
          </div>
          <div class="form-item" v-if="userForm.userType === 'organization'">
            <label>联系人</label>
            <input type="text" v-model="userForm.contactPerson">
          </div>
          <div class="form-item" v-if="userForm.userType === 'organization'">
            <label>QQ</label>
            <input type="text" v-model="userForm.qq">
          </div>
          <div class="form-item" v-if="userForm.userType === 'organization'">
            <label>地址</label>
            <input type="text" v-model="userForm.address">
          </div>
        </div>
      </div>
      <div class="form-actions">
        <button @click="saveUser" class="save-btn">保存</button>
        <button @click="showEditForm = false" class="cancel-btn">取消</button>
      </div>
    </div>
    
    <table class="data-table">
      <thead>
        <tr>
          <th>用户名</th>
          <th>用户类型</th>
          <th>联系电话</th>
          <th>金币</th>
          <th>注册时间</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.username }}</td>
          <td>{{ user.userType === 'personal' ? '个人' : '机构' }}</td>
          <td>{{ user.phone }}</td>
          <td>{{ user.coins }}</td>
          <td>{{ formatDate(user.createdAt) }}</td>
          <td>
            <button @click="editUser(user)" class="edit-btn">编辑</button>
            <button @click="showRechargeDialog(user)" class="recharge-btn">充值</button>
            <button @click="deleteUser(user.id)" class="delete-btn">删除</button>
          </td>
        </tr>
      </tbody>
    </table>
    
    <!-- 分页 -->
    <div class="pagination">
      <button 
        @click="changePage('user', 1)" 
        :disabled="pagination.user.page === 1"
      >
        首页
      </button>
      <button 
        @click="changePage('user', pagination.user.page - 1)" 
        :disabled="pagination.user.page === 1"
      >
        上一页
      </button>
      <span>第 {{ pagination.user.page }} 页，共 {{ Math.ceil(pagination.user.total / pagination.user.pageSize) }} 页</span>
      <button 
        @click="changePage('user', pagination.user.page + 1)" 
        :disabled="pagination.user.page >= Math.ceil(pagination.user.total / pagination.user.pageSize)"
      >
        下一页
      </button>
      <button 
        @click="changePage('user', Math.ceil(pagination.user.total / pagination.user.pageSize))" 
        :disabled="pagination.user.page >= Math.ceil(pagination.user.total / pagination.user.pageSize)"
      >
        末页
      </button>
    </div>
    
    <!-- 充值对话框 -->
    <div v-if="showRechargeForm" class="recharge-dialog">
      <div class="recharge-dialog-content">
        <h3>充值金币</h3>
        <div class="form-item">
          <label>用户：{{ selectedUser.username }}</label>
        </div>
        <div class="form-item">
          <label>当前金币：{{ selectedUser.coins }}</label>
        </div>
        <div class="form-item">
          <label>充值数量</label>
          <input type="number" v-model="rechargeAmount" min="1" placeholder="请输入充值数量">
        </div>
        <div class="form-actions">
          <button @click="rechargeCoins" class="save-btn">确认充值</button>
          <button @click="showRechargeForm = false" class="cancel-btn">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'UserManagement',
  data() {
    return {
      // 分页和搜索相关
      pagination: {
        user: {
          page: 1,
          pageSize: 10,
          total: 0,
          search: ''
        }
      },
      
      // 用户管理
      users: [],
      showEditForm: false,
      editUserId: null,
      userForm: {
        username: '',
        email: '',
        password: '',
        userType: 'personal',
        name: '',
        phone: '',
        organizationName: '',
        region: '',
        industry: '',
        organizationDesc: '',
        contactPerson: '',
        qq: '',
        address: '',
        coins: 100
      },
      // 充值相关
      showRechargeForm: false,
      selectedUser: {},
      rechargeAmount: 0
    }
  },
  mounted() {
    this.fetchUsers()
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await axios.get('/api/users', {
          params: {
            page: this.pagination.user.page,
            pageSize: this.pagination.user.pageSize,
            phone: this.pagination.user.search
          }
        })
        this.users = response.data.items || response.data
        this.pagination.user.total = response.data.total || this.users.length
      } catch (error) {
        console.error('获取用户信息失败:', error)
      }
    },
    
    async saveUser() {
      try {
        if (this.editUserId) {
          await axios.put(`/api/users/${this.editUserId}`, this.userForm)
          alert('更新成功')
        } else {
          // 这里可以添加用户创建逻辑，如果需要的话
          alert('用户创建功能暂未实现')
        }
        this.showEditForm = false
        this.resetUserForm()
        this.fetchUsers()
      } catch (error) {
        console.error('操作失败:', error)
        alert('操作失败，请重试')
      }
    },
    
    resetUserForm() {
      this.editUserId = null
      this.userForm = {
        username: '',
        email: '',
        password: '',
        userType: 'personal',
        name: '',
        phone: '',
        organizationName: '',
        region: '',
        industry: '',
        organizationDesc: '',
        contactPerson: '',
        qq: '',
        address: '',
        coins: 100
      }
    },
    
    editUser(user) {
      this.editUserId = user.id
      this.userForm = { ...user }
      this.showEditForm = true
    },
    
    async deleteUser(id) {
      if (confirm('确定要删除吗？')) {
        try {
          await axios.delete(`/api/users/${id}`)
          this.fetchUsers()
        } catch (error) {
          console.error('删除用户失败:', error)
        }
      }
    },
    
    // 分页相关方法
    changePage(type, page) {
      this.pagination[type].page = page
      if (type === 'user') {
        this.fetchUsers()
      }
    },
    
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleString()
    },
    
    // 充值相关方法
    showRechargeDialog(user) {
      this.selectedUser = user
      this.rechargeAmount = 0
      this.showRechargeForm = true
    },
    
    async rechargeCoins() {
      if (!this.rechargeAmount || this.rechargeAmount <= 0) {
        alert('请输入有效的充值数量')
        return
      }
      
      try {
        const newCoins = this.selectedUser.coins + parseInt(this.rechargeAmount)
        await axios.put(`/api/users/${this.selectedUser.id}`, {
          coins: newCoins
        })
        alert('充值成功')
        this.showRechargeForm = false
        this.fetchUsers()
      } catch (error) {
        console.error('充值失败:', error)
        alert('充值失败，请重试')
      }
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

.add-btn {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 20px;
}

.add-btn:hover {
  background-color: #218838;
}

.card {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #f9f9fa;
}

.card h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-item {
  margin-bottom: 15px;
}

.form-item label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-item input,
.form-item textarea,
.form-item select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  box-sizing: border-box;
}

.form-item textarea {
  resize: vertical;
}

.form-actions {
  margin-top: 20px;
  display: flex;
  justify-content: flex-start;
}

.save-btn {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
}

.save-btn:hover {
  background-color: #218838;
}

.cancel-btn {
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-btn:hover {
  background-color: #5a6268;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
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

.edit-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 5px;
  font-size: 12px;
}

.edit-btn:hover {
  background-color: #0069d9;
}

.delete-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.delete-btn:hover {
  background-color: #c82333;
}

.recharge-btn {
  background-color: #ffc107;
  color: #212529;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 5px;
  font-size: 12px;
}

.recharge-btn:hover {
  background-color: #e0a800;
}

/* 充值对话框样式 */
.recharge-dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.recharge-dialog-content {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.recharge-dialog-content h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
  text-align: center;
}

/* 工具栏样式 */
.admin-toolbar {
  display: flex;
  justify-content: flex-end;
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

/* 分页样式 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 10px;
}

.pagination button {
  padding: 5px 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination button:hover:not(:disabled) {
  background-color: #f8f9fa;
  border-color: #007bff;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination span {
  margin: 0 10px;
  color: #666;
}
</style>
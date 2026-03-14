<template>
  <div class="admin-section">
    <h2>二手物品管理</h2>
    <div class="admin-toolbar">
      <button @click="showAddForm = true" class="add-btn">添加二手物品</button>
      <div class="search-bar">
        <input 
          type="text" 
          v-model="pagination.secondhand.search" 
          placeholder="按电话搜索..."
          @keyup.enter="fetchSecondhand"
        >
        <button @click="fetchSecondhand" class="search-btn">搜索</button>
      </div>
    </div>
    
    <div v-if="showAddForm" class="card">
      <h3>{{ editSecondhandId ? '编辑二手物品' : '添加二手物品' }}</h3>
      <div class="form-grid">
        <div>
          <div class="form-item">
            <label>标题</label>
            <input type="text" v-model="secondhandForm.title">
          </div>
          <div class="form-item">
            <label>价格</label>
            <input type="number" v-model="secondhandForm.price">
          </div>
          <div class="form-item">
            <label>分类</label>
            <input type="text" v-model="secondhandForm.category">
          </div>
          <div class="form-item">
            <label>品牌</label>
            <input type="text" v-model="secondhandForm.brand">
          </div>
          <div class="form-item">
            <label>新旧程度</label>
            <input type="text" v-model="secondhandForm.condition">
          </div>
          <div class="form-item">
            <label>来源</label>
            <input type="text" v-model="secondhandForm.source">
          </div>
        </div>
        <div>
          <div class="form-item">
            <label>地址</label>
            <input type="text" v-model="secondhandForm.address">
          </div>
          <div class="form-item">
            <label>联系人</label>
            <input type="text" v-model="secondhandForm.contactPerson">
          </div>
          <div class="form-item">
            <label>联系电话</label>
            <input type="text" v-model="secondhandForm.contactPhone">
          </div>
          <div class="form-item">
            <label>描述</label>
            <textarea v-model="secondhandForm.description" rows="4"></textarea>
          </div>
          <div class="form-item">
            <label>发布时间</label>
            <input type="datetime-local" v-model="secondhandForm.createdAt">
          </div>
          <div class="form-item">
            <label>图片</label>
            <div class="image-upload">
              <div 
                v-for="(image, index) in secondhandForm.images" 
                :key="index"
                class="image-item"
              >
                <img :src="image" alt="上传图片" class="uploaded-image">
                <button type="button" @click="removeSecondhandImage(index)" class="remove-image-btn">×</button>
              </div>
              <div 
                v-if="secondhandForm.images.length < 4"
                class="upload-btn"
                @click="triggerSecondhandFileInput"
              >
                <input 
                  type="file" 
                  ref="secondhandFileInput"
                  multiple
                  accept="image/*"
                  @change="handleFileUpload"
                  style="display: none;"
                >
                <div class="upload-icon">+</div>
                <div class="upload-text">上传图片</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="form-actions">
        <button @click="addSecondhand" class="save-btn">保存</button>
        <button @click="showAddForm = false" class="cancel-btn">取消</button>
      </div>
    </div>
    
    <table class="data-table">
      <thead>
        <tr>
          <th>标题</th>
          <th>价格</th>
          <th>分类</th>
          <th>品牌</th>
          <th>新旧程度</th>
          <th>联系电话</th>
          <th>发布时间</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in secondhandItems" :key="item.id">
          <td>{{ item.title }}</td>
          <td>{{ item.price }}</td>
          <td>{{ item.category }}</td>
          <td>{{ item.brand }}</td>
          <td>{{ item.condition }}</td>
          <td>{{ item.contactPhone }}</td>
          <td>{{ item.createdAt ? new Date(item.createdAt).toLocaleString() : '' }}</td>
          <td>
            <button @click="editSecondhand(item)" class="edit-btn">编辑</button>
            <button @click="deleteSecondhand(item.id)" class="delete-btn">删除</button>
          </td>
        </tr>
      </tbody>
    </table>
    
    <!-- 分页 -->
    <div class="pagination">
      <button 
        @click="changePage('secondhand', 1)" 
        :disabled="pagination.secondhand.page === 1"
      >
        首页
      </button>
      <button 
        @click="changePage('secondhand', pagination.secondhand.page - 1)" 
        :disabled="pagination.secondhand.page === 1"
      >
        上一页
      </button>
      <span>第 {{ pagination.secondhand.page }} 页，共 {{ Math.ceil(pagination.secondhand.total / pagination.secondhand.pageSize) }} 页</span>
      <button 
        @click="changePage('secondhand', pagination.secondhand.page + 1)" 
        :disabled="pagination.secondhand.page >= Math.ceil(pagination.secondhand.total / pagination.secondhand.pageSize)"
      >
        下一页
      </button>
      <button 
        @click="changePage('secondhand', Math.ceil(pagination.secondhand.total / pagination.secondhand.pageSize))" 
        :disabled="pagination.secondhand.page >= Math.ceil(pagination.secondhand.total / pagination.secondhand.pageSize)"
      >
        末页
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'SecondhandManagement',
  data() {
    return {
      // 分页和搜索相关
      pagination: {
        secondhand: {
          page: 1,
          pageSize: 10,
          total: 0,
          search: ''
        }
      },
      
      // 二手物品管理
      secondhandItems: [],
      showAddForm: false,
      editSecondhandId: null,
      secondhandForm: {
        title: '',
        price: '',
        category: '',
        brand: '',
        condition: '',
        source: '',
        address: '',
        contactPerson: '',
        contactPhone: '',
        description: '',
        images: []
      }
    }
  },
  mounted() {
    this.fetchSecondhand()
  },
  methods: {
    async fetchSecondhand() {
      try {
        const response = await axios.get('/api/secondhand', {
          params: {
            page: this.pagination.secondhand.page,
            pageSize: this.pagination.secondhand.pageSize,
            search: this.pagination.secondhand.search,
            contactPhone: this.pagination.secondhand.search
          }
        })
        this.secondhandItems = response.data.items || response.data
        this.pagination.secondhand.total = response.data.total || this.secondhandItems.length
      } catch (error) {
        console.error('获取二手物品信息失败:', error)
      }
    },
    
    triggerSecondhandFileInput() {
      this.$refs.secondhandFileInput.click();
    },
    
    removeSecondhandImage(index) {
      this.secondhandForm.images.splice(index, 1);
    },
    
    handleFileUpload(e) {
      const files = e.target.files;
      if (files.length > 0) {
        const remainingSlots = 4 - this.secondhandForm.images.length;
        const filesToProcess = Array.from(files).slice(0, remainingSlots);
        filesToProcess.forEach(file => {
          if (file.size > 5 * 1024 * 1024) {
            alert('图片大小不能超过5MB');
            return;
          }
          const reader = new FileReader();
          reader.onload = (event) => {
            this.secondhandForm.images.push(event.target.result);
          };
          reader.readAsDataURL(file);
        });
      }
    },
    
    async addSecondhand() {
      const formData = new FormData()
      formData.append('title', this.secondhandForm.title)
      formData.append('price', this.secondhandForm.price)
      formData.append('category', this.secondhandForm.category)
      formData.append('brand', this.secondhandForm.brand)
      formData.append('condition', this.secondhandForm.condition)
      formData.append('source', this.secondhandForm.source)
      formData.append('address', this.secondhandForm.address)
      formData.append('contactPerson', this.secondhandForm.contactPerson)
      formData.append('contactPhone', this.secondhandForm.contactPhone)
      formData.append('description', this.secondhandForm.description)
      formData.append('images', JSON.stringify(this.secondhandForm.images))
      formData.append('createdAt', this.secondhandForm.createdAt)
      formData.append('admin', 'true')
      formData.append('userId', '1')
      
      try {
        if (this.editSecondhandId) {
          await axios.put(`/api/secondhand/${this.editSecondhandId}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          alert('更新成功')
        } else {
          await axios.post('/api/secondhand', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          alert('添加成功')
        }
        this.showAddForm = false
        this.resetSecondhandForm()
        this.fetchSecondhand()
      } catch (error) {
        console.error('操作失败:', error)
        alert('操作失败，请重试')
      }
    },
    
    resetSecondhandForm() {
      this.editSecondhandId = null
      this.secondhandForm = {
        title: '',
        price: '',
        category: '',
        brand: '',
        condition: '',
        source: '',
        address: '',
        contactPerson: '',
        contactPhone: '',
        description: '',
        images: []
      }
    },
    
    editSecondhand(item) {
      this.editSecondhandId = item.id
      this.secondhandForm = { ...item }
      if (item.images) {
        this.secondhandForm.images = typeof item.images === 'string' ? JSON.parse(item.images) : item.images
      } else {
        this.secondhandForm.images = []
      }
      // 处理日期时间格式，转换为datetime-local格式
      if (item.createdAt) {
        const date = new Date(item.createdAt)
        this.secondhandForm.createdAt = date.toISOString().slice(0, 16)
      }
      this.showAddForm = true
    },
    
    async deleteSecondhand(id) {
      if (confirm('确定要删除吗？')) {
        try {
          await axios.delete(`/api/secondhand/${id}`)
          this.fetchSecondhand()
        } catch (error) {
          console.error('删除二手物品失败:', error)
        }
      }
    },
    
    // 分页相关方法
    changePage(type, page) {
      this.pagination[type].page = page
      if (type === 'secondhand') {
        this.fetchSecondhand()
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

/* 图片上传样式 */
.image-upload {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.image-item {
  position: relative;
  width: 100px;
  height: 100px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.uploaded-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-image-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 20px;
  height: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
}

.remove-image-btn:hover {
  background-color: rgba(0, 0, 0, 0.8);
}

.upload-btn {
  width: 100px;
  height: 100px;
  border: 2px dashed #ced4da;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #f8f9fa;
}

.upload-btn:hover {
  border-color: #007bff;
  background-color: #e3f2fd;
}

.upload-icon {
  font-size: 32px;
  color: #666;
  margin-bottom: 5px;
}

.upload-text {
  font-size: 14px;
  color: #666;
}

input[type="file"] {
  width: 100%;
  padding: 8px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  box-sizing: border-box;
}
</style>
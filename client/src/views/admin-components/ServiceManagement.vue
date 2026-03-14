<template>
  <div class="admin-section">
    <h2>生活服务管理</h2>
    <div class="admin-toolbar">
      <button @click="showAddForm = true" class="add-btn">添加生活服务</button>
      <div class="search-bar">
        <input 
          type="text" 
          v-model="pagination.service.search" 
          placeholder="按电话搜索..."
          @keyup.enter="fetchServices"
        >
        <button @click="fetchServices" class="search-btn">搜索</button>
      </div>
    </div>
    
    <div v-if="showAddForm" class="card">
      <h3>{{ editServiceId ? '编辑生活服务' : '添加生活服务' }}</h3>
      <div class="form-grid">
        <div>
          <div class="form-item">
            <label>标题</label>
            <input type="text" v-model="serviceForm.title">
          </div>
          <div class="form-item">
            <label>分类</label>
            <input type="text" v-model="serviceForm.category">
          </div>
          <div class="form-item">
            <label>价格</label>
            <input type="number" v-model="serviceForm.price">
          </div>
          <div class="form-item">
            <label>联系人</label>
            <input type="text" v-model="serviceForm.contactPerson">
          </div>
          <div class="form-item">
            <label>联系电话</label>
            <input type="text" v-model="serviceForm.contactPhone">
          </div>
          <div class="form-item">
            <label>联系QQ</label>
            <input type="text" v-model="serviceForm.contactQQ">
          </div>
        </div>
        <div>
          <div class="form-item">
            <label>所属地区</label>
            <input type="text" v-model="serviceForm.region">
          </div>
          <div class="form-item">
            <label>有效期</label>
            <input type="text" v-model="serviceForm.validity">
          </div>
          <div class="form-item">
            <label>位置</label>
            <input type="text" v-model="serviceForm.location">
          </div>
          <div class="form-item">
            <label>联系信息</label>
            <input type="text" v-model="serviceForm.contact">
          </div>
          <div class="form-item">
            <label>描述</label>
            <textarea v-model="serviceForm.description" rows="4"></textarea>
          </div>
          <div class="form-item">
            <label>发布时间</label>
            <input type="datetime-local" v-model="serviceForm.createdAt">
          </div>
          <div class="form-item">
            <label>图片</label>
            <div class="image-upload">
              <div 
                v-for="(image, index) in serviceForm.images" 
                :key="index"
                class="image-item"
              >
                <img :src="image" alt="上传图片" class="uploaded-image">
                <button type="button" @click="removeServiceImage(index)" class="remove-image-btn">×</button>
              </div>
              <div 
                v-if="serviceForm.images.length < 4"
                class="upload-btn"
                @click="triggerServiceFileInput"
              >
                <input 
                  type="file" 
                  ref="serviceFileInput"
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
        <button @click="addService" class="save-btn">保存</button>
        <button @click="showAddForm = false" class="cancel-btn">取消</button>
      </div>
    </div>
    
    <table class="data-table">
      <thead>
        <tr>
          <th>标题</th>
          <th>分类</th>
          <th>价格</th>
          <th>所属地区</th>
          <th>联系电话</th>
          <th>发布时间</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="service in services" :key="service.id">
          <td>{{ service.title }}</td>
          <td>{{ service.category }}</td>
          <td>{{ service.price }}</td>
          <td>{{ service.region }}</td>
          <td>{{ service.contactPhone }}</td>
          <td>{{ service.createdAt ? new Date(service.createdAt).toLocaleString() : '' }}</td>
          <td>
            <button @click="editService(service)" class="edit-btn">编辑</button>
            <button @click="deleteService(service.id)" class="delete-btn">删除</button>
          </td>
        </tr>
      </tbody>
    </table>
    
    <!-- 分页 -->
    <div class="pagination">
      <button 
        @click="changePage('service', 1)" 
        :disabled="pagination.service.page === 1"
      >
        首页
      </button>
      <button 
        @click="changePage('service', pagination.service.page - 1)" 
        :disabled="pagination.service.page === 1"
      >
        上一页
      </button>
      <span>第 {{ pagination.service.page }} 页，共 {{ Math.ceil(pagination.service.total / pagination.service.pageSize) }} 页</span>
      <button 
        @click="changePage('service', pagination.service.page + 1)" 
        :disabled="pagination.service.page >= Math.ceil(pagination.service.total / pagination.service.pageSize)"
      >
        下一页
      </button>
      <button 
        @click="changePage('service', Math.ceil(pagination.service.total / pagination.service.pageSize))" 
        :disabled="pagination.service.page >= Math.ceil(pagination.service.total / pagination.service.pageSize)"
      >
        末页
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ServiceManagement',
  data() {
    return {
      // 分页和搜索相关
      pagination: {
        service: {
          page: 1,
          pageSize: 10,
          total: 0,
          search: ''
        }
      },
      
      // 生活服务管理
      services: [],
      showAddForm: false,
      editServiceId: null,
      serviceForm: {
        title: '',
        category: '',
        price: '',
        description: '',
        contact: '',
        contactPerson: '',
        contactPhone: '',
        contactQQ: '',
        region: '',
        validity: '',
        location: '',
        images: []
      }
    }
  },
  mounted() {
    this.fetchServices()
  },
  methods: {
    async fetchServices() {
      try {
        const response = await axios.get('/api/services', {
          params: {
            page: this.pagination.service.page,
            pageSize: this.pagination.service.pageSize,
            search: this.pagination.service.search,
            contactPhone: this.pagination.service.search
          }
        })
        this.services = response.data.items || response.data
        this.pagination.service.total = response.data.total || this.services.length
      } catch (error) {
        console.error('获取生活服务信息失败:', error)
      }
    },
    
    triggerServiceFileInput() {
      this.$refs.serviceFileInput.click();
    },
    
    removeServiceImage(index) {
      this.serviceForm.images.splice(index, 1);
    },
    
    handleFileUpload(e) {
      const files = e.target.files;
      if (files.length > 0) {
        const remainingSlots = 4 - this.serviceForm.images.length;
        const filesToProcess = Array.from(files).slice(0, remainingSlots);
        filesToProcess.forEach(file => {
          if (file.size > 5 * 1024 * 1024) {
            alert('图片大小不能超过5MB');
            return;
          }
          const reader = new FileReader();
          reader.onload = (event) => {
            this.serviceForm.images.push(event.target.result);
          };
          reader.readAsDataURL(file);
        });
      }
    },
    
    async addService() {
      const formData = new FormData()
      formData.append('title', this.serviceForm.title)
      formData.append('category', this.serviceForm.category)
      formData.append('price', this.serviceForm.price)
      formData.append('description', this.serviceForm.description)
      formData.append('contact', this.serviceForm.contact)
      formData.append('contactPerson', this.serviceForm.contactPerson)
      formData.append('contactPhone', this.serviceForm.contactPhone)
      formData.append('contactQQ', this.serviceForm.contactQQ)
      formData.append('region', this.serviceForm.region)
      formData.append('validity', this.serviceForm.validity)
      formData.append('location', this.serviceForm.location)
      formData.append('images', JSON.stringify(this.serviceForm.images))
      formData.append('createdAt', this.serviceForm.createdAt)
      formData.append('admin', 'true')
      formData.append('userId', '1')
      
      try {
        if (this.editServiceId) {
          await axios.put(`/api/services/${this.editServiceId}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          alert('更新成功')
        } else {
          await axios.post('/api/services', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          alert('添加成功')
        }
        this.showAddForm = false
        this.resetServiceForm()
        this.fetchServices()
      } catch (error) {
        console.error('操作失败:', error)
        alert('操作失败，请重试')
      }
    },
    
    resetServiceForm() {
      this.editServiceId = null
      this.serviceForm = {
        title: '',
        category: '',
        price: '',
        description: '',
        contact: '',
        contactPerson: '',
        contactPhone: '',
        contactQQ: '',
        region: '',
        validity: '',
        location: '',
        images: []
      }
    },
    
    editService(service) {
      this.editServiceId = service.id
      this.serviceForm = { ...service }
      if (service.images) {
        this.serviceForm.images = typeof service.images === 'string' ? JSON.parse(service.images) : service.images
      } else {
        this.serviceForm.images = []
      }
      // 处理日期时间格式，转换为datetime-local格式
      if (service.createdAt) {
        const date = new Date(service.createdAt)
        this.serviceForm.createdAt = date.toISOString().slice(0, 16)
      }
      this.showAddForm = true
    },
    
    async deleteService(id) {
      if (confirm('确定要删除吗？')) {
        try {
          await axios.delete(`/api/services/${id}`)
          this.fetchServices()
        } catch (error) {
          console.error('删除生活服务失败:', error)
        }
      }
    },
    
    // 分页相关方法
    changePage(type, page) {
      this.pagination[type].page = page
      if (type === 'service') {
        this.fetchServices()
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
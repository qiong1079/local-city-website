<template>
  <div class="admin-section">
    <h2>车辆管理</h2>
    <div class="admin-toolbar">
      <button @click="showAddForm = true" class="add-btn">添加车辆</button>
      <div class="search-bar">
        <input 
          type="text" 
          v-model="pagination.vehicle.search" 
          placeholder="按电话搜索..."
          @keyup.enter="fetchVehicles"
        >
        <button @click="fetchVehicles" class="search-btn">搜索</button>
      </div>
    </div>
    
    <div v-if="showAddForm" class="card">
      <h3>{{ editVehicleId ? '编辑车辆' : '添加车辆' }}</h3>
      <div class="form-grid">
        <div>
          <div class="form-item">
            <label>标题</label>
            <input type="text" v-model="vehicleForm.title">
          </div>
          <div class="form-item">
            <label>价格</label>
            <input type="number" v-model="vehicleForm.price">
          </div>
          <div class="form-item">
            <label>品牌</label>
            <input type="text" v-model="vehicleForm.brand">
          </div>
          <div class="form-item">
            <label>型号</label>
            <input type="text" v-model="vehicleForm.model">
          </div>
          <div class="form-item">
            <label>年份</label>
            <input type="number" v-model="vehicleForm.year">
          </div>
          <div class="form-item">
            <label>行驶里程（万公里）</label>
            <input type="number" v-model="vehicleForm.mileage">
          </div>
        </div>
        <div>
          <div class="form-item">
            <label>所属地区</label>
            <input type="text" v-model="vehicleForm.region">
          </div>
          <div class="form-item">
            <label>有效期</label>
            <input type="text" v-model="vehicleForm.validity">
          </div>
          <div class="form-item">
            <label>新旧程度</label>
            <input type="text" v-model="vehicleForm.condition">
          </div>
          <div class="form-item">
            <label>来源</label>
            <input type="text" v-model="vehicleForm.source">
          </div>
          <div class="form-item">
            <label>联系人</label>
            <input type="text" v-model="vehicleForm.contactPerson">
          </div>
          <div class="form-item">
            <label>联系电话</label>
            <input type="text" v-model="vehicleForm.contactPhone">
          </div>
          <div class="form-item">
            <label>联系QQ</label>
            <input type="text" v-model="vehicleForm.contactQQ">
          </div>
          <div class="form-item">
            <label>描述</label>
            <textarea v-model="vehicleForm.description" rows="4"></textarea>
          </div>
          <div class="form-item">
            <label>发布时间</label>
            <input type="datetime-local" v-model="vehicleForm.createdAt">
          </div>
          <div class="form-item">
            <label>图片</label>
            <div class="image-upload">
              <div 
                v-for="(image, index) in vehicleForm.images" 
                :key="index"
                class="image-item"
              >
                <img :src="image" alt="上传图片" class="uploaded-image">
                <button type="button" @click="removeVehicleImage(index)" class="remove-image-btn">×</button>
              </div>
              <div 
                v-if="vehicleForm.images.length < 4"
                class="upload-btn"
                @click="triggerVehicleFileInput"
              >
                <input 
                  type="file" 
                  ref="vehicleFileInput"
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
        <button @click="addVehicle" class="save-btn">保存</button>
        <button @click="showAddForm = false" class="cancel-btn">取消</button>
      </div>
    </div>
    
    <table class="data-table">
      <thead>
        <tr>
          <th>标题</th>
          <th>价格</th>
          <th>品牌</th>
          <th>型号</th>
          <th>年份</th>
          <th>行驶里程</th>
          <th>联系电话</th>
          <th>发布时间</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="vehicle in vehicles" :key="vehicle.id">
          <td>{{ vehicle.title }}</td>
          <td>{{ vehicle.price }}</td>
          <td>{{ vehicle.brand }}</td>
          <td>{{ vehicle.model }}</td>
          <td>{{ vehicle.year }}</td>
          <td>{{ vehicle.mileage }}</td>
          <td>{{ vehicle.contactPhone }}</td>
          <td>{{ vehicle.createdAt ? new Date(vehicle.createdAt).toLocaleString() : '' }}</td>
          <td>
            <button @click="editVehicle(vehicle)" class="edit-btn">编辑</button>
            <button @click="deleteVehicle(vehicle.id)" class="delete-btn">删除</button>
          </td>
        </tr>
      </tbody>
    </table>
    
    <!-- 分页 -->
    <div class="pagination">
      <button 
        @click="changePage('vehicle', 1)" 
        :disabled="pagination.vehicle.page === 1"
      >
        首页
      </button>
      <button 
        @click="changePage('vehicle', pagination.vehicle.page - 1)" 
        :disabled="pagination.vehicle.page === 1"
      >
        上一页
      </button>
      <span>第 {{ pagination.vehicle.page }} 页，共 {{ Math.ceil(pagination.vehicle.total / pagination.vehicle.pageSize) }} 页</span>
      <button 
        @click="changePage('vehicle', pagination.vehicle.page + 1)" 
        :disabled="pagination.vehicle.page >= Math.ceil(pagination.vehicle.total / pagination.vehicle.pageSize)"
      >
        下一页
      </button>
      <button 
        @click="changePage('vehicle', Math.ceil(pagination.vehicle.total / pagination.vehicle.pageSize))" 
        :disabled="pagination.vehicle.page >= Math.ceil(pagination.vehicle.total / pagination.vehicle.pageSize)"
      >
        末页
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'VehicleManagement',
  data() {
    return {
      // 分页和搜索相关
      pagination: {
        vehicle: {
          page: 1,
          pageSize: 10,
          total: 0,
          search: ''
        }
      },
      
      // 车辆管理
      vehicles: [],
      showAddForm: false,
      editVehicleId: null,
      vehicleForm: {
        title: '',
        price: '',
        brand: '',
        model: '',
        year: '',
        mileage: '',
        region: '',
        validity: '',
        condition: '',
        source: '',
        description: '',
        contactPerson: '',
        contactPhone: '',
        contactQQ: '',
        images: []
      }
    }
  },
  mounted() {
    this.fetchVehicles()
  },
  methods: {
    async fetchVehicles() {
      try {
        const response = await axios.get('/api/vehicles', {
          params: {
            page: this.pagination.vehicle.page,
            pageSize: this.pagination.vehicle.pageSize,
            search: this.pagination.vehicle.search,
            contactPhone: this.pagination.vehicle.search
          }
        })
        this.vehicles = response.data.items || response.data
        this.pagination.vehicle.total = response.data.total || this.vehicles.length
      } catch (error) {
        console.error('获取车辆信息失败:', error)
      }
    },
    
    triggerVehicleFileInput() {
      this.$refs.vehicleFileInput.click();
    },
    
    removeVehicleImage(index) {
      this.vehicleForm.images.splice(index, 1);
    },
    
    handleFileUpload(e) {
      const files = e.target.files;
      if (files.length > 0) {
        const remainingSlots = 4 - this.vehicleForm.images.length;
        const filesToProcess = Array.from(files).slice(0, remainingSlots);
        filesToProcess.forEach(file => {
          if (file.size > 5 * 1024 * 1024) {
            alert('图片大小不能超过5MB');
            return;
          }
          const reader = new FileReader();
          reader.onload = (event) => {
            this.vehicleForm.images.push(event.target.result);
          };
          reader.readAsDataURL(file);
        });
      }
    },
    
    async addVehicle() {
      const formData = new FormData()
      formData.append('title', this.vehicleForm.title)
      formData.append('price', this.vehicleForm.price)
      formData.append('brand', this.vehicleForm.brand)
      formData.append('model', this.vehicleForm.model)
      formData.append('year', this.vehicleForm.year)
      formData.append('mileage', this.vehicleForm.mileage)
      formData.append('region', this.vehicleForm.region)
      formData.append('validity', this.vehicleForm.validity)
      formData.append('condition', this.vehicleForm.condition)
      formData.append('source', this.vehicleForm.source)
      formData.append('description', this.vehicleForm.description)
      formData.append('contactPerson', this.vehicleForm.contactPerson)
      formData.append('contactPhone', this.vehicleForm.contactPhone)
      formData.append('contactQQ', this.vehicleForm.contactQQ)
      formData.append('images', JSON.stringify(this.vehicleForm.images))
      formData.append('createdAt', this.vehicleForm.createdAt)
      formData.append('admin', 'true')
      formData.append('userId', '1')
      
      try {
        if (this.editVehicleId) {
          await axios.put(`/api/vehicles/${this.editVehicleId}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          alert('更新成功')
        } else {
          await axios.post('/api/vehicles', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          alert('添加成功')
        }
        this.showAddForm = false
        this.resetVehicleForm()
        this.fetchVehicles()
      } catch (error) {
        console.error('操作失败:', error)
        alert('操作失败，请重试')
      }
    },
    
    resetVehicleForm() {
      this.editVehicleId = null
      this.vehicleForm = {
        title: '',
        price: '',
        brand: '',
        model: '',
        year: '',
        mileage: '',
        region: '',
        validity: '',
        condition: '',
        source: '',
        description: '',
        contactPerson: '',
        contactPhone: '',
        contactQQ: '',
        images: []
      }
    },
    
    editVehicle(vehicle) {
      this.editVehicleId = vehicle.id
      this.vehicleForm = { ...vehicle }
      if (vehicle.images) {
        this.vehicleForm.images = typeof vehicle.images === 'string' ? JSON.parse(vehicle.images) : vehicle.images
      } else {
        this.vehicleForm.images = []
      }
      // 处理日期时间格式，转换为datetime-local格式
      if (vehicle.createdAt) {
        const date = new Date(vehicle.createdAt)
        this.vehicleForm.createdAt = date.toISOString().slice(0, 16)
      }
      this.showAddForm = true
    },
    
    async deleteVehicle(id) {
      if (confirm('确定要删除吗？')) {
        try {
          await axios.delete(`/api/vehicles/${id}`)
          this.fetchVehicles()
        } catch (error) {
          console.error('删除车辆失败:', error)
        }
      }
    },
    
    // 分页相关方法
    changePage(type, page) {
      this.pagination[type].page = page
      if (type === 'vehicle') {
        this.fetchVehicles()
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
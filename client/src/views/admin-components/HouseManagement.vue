<template>
  <div class="admin-section">
    <h2>房屋管理</h2>
    <div class="admin-toolbar">
      <button @click="showAddForm = true" class="add-btn">添加房屋</button>
      <div class="search-bar">
        <input 
          type="text" 
          v-model="pagination.house.search" 
          placeholder="按电话搜索..."
          @keyup.enter="fetchHouses"
        >
        <button @click="fetchHouses" class="search-btn">搜索</button>
      </div>
    </div>
    
    <div v-if="showAddForm" class="card">
      <h3>{{ editHouseId ? '编辑房屋' : '添加房屋' }}</h3>
      <div class="form-grid">
        <div>
          <div class="form-item">
            <label>标题</label>
            <input type="text" v-model="houseForm.title">
          </div>
          <div class="form-item">
            <label>价格</label>
            <input type="number" v-model="houseForm.price">
          </div>
          <div class="form-item">
            <label>面积</label>
            <input type="number" v-model="houseForm.area">
          </div>
          <div class="form-item">
            <label>类型</label>
            <select v-model="houseForm.type">
              <option value="">请选择</option>
              <option value="出租">出租</option>
              <option value="出售">出售</option>
            </select>
          </div>
          <div class="form-item">
            <label>户型</label>
            <input type="text" v-model="houseForm.layout">
          </div>
          <div class="form-item">
            <label>楼层</label>
            <input type="text" v-model="houseForm.floor">
          </div>
          <div class="form-item">
            <label>装修情况</label>
            <select v-model="houseForm.decoration">
              <option value="">请选择</option>
              <option value="毛坯">毛坯</option>
              <option value="简装">简装</option>
              <option value="中装">中装</option>
              <option value="精装">精装</option>
            </select>
          </div>
          <div class="form-item">
            <label>朝向</label>
            <select v-model="houseForm.orientation">
              <option value="">请选择</option>
              <option value="东">东</option>
              <option value="南">南</option>
              <option value="西">西</option>
              <option value="北">北</option>
              <option value="东南">东南</option>
              <option value="西南">西南</option>
              <option value="东北">东北</option>
              <option value="西北">西北</option>
            </select>
          </div>
        </div>
        <div>
          <div class="form-item">
            <label>位置</label>
            <input type="text" v-model="houseForm.location">
          </div>
          <div class="form-item">
            <label>配套设施</label>
            <textarea v-model="houseForm.facilities" rows="3"></textarea>
          </div>
          <div class="form-item">
            <label>联系人</label>
            <input type="text" v-model="houseForm.contactPerson">
          </div>
          <div class="form-item">
            <label>联系电话</label>
            <input type="text" v-model="houseForm.contactPhone">
          </div>
          <div class="form-item">
            <label>描述</label>
            <textarea v-model="houseForm.description" rows="4"></textarea>
          </div>
          <div class="form-item">
            <label>图片</label>
            <div class="image-upload">
              <div 
                v-for="(image, index) in houseForm.images" 
                :key="index"
                class="image-item"
              >
                <img :src="image" alt="上传图片" class="uploaded-image">
                <button type="button" @click="removeHouseImage(index)" class="remove-image-btn">×</button>
              </div>
              <div 
                v-if="houseForm.images.length < 4"
                class="upload-btn"
                @click="triggerHouseFileInput"
              >
                <input 
                  type="file" 
                  ref="houseFileInput"
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
        <button @click="addHouse" class="save-btn">保存</button>
        <button @click="showAddForm = false" class="cancel-btn">取消</button>
      </div>
    </div>
    
    <table class="data-table">
      <thead>
        <tr>
          <th>标题</th>
          <th>价格</th>
          <th>面积</th>
          <th>类型</th>
          <th>位置</th>
          <th>联系电话</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="house in houses" :key="house.id">
          <td>{{ house.title }}</td>
          <td>{{ house.price }}</td>
          <td>{{ house.area }}</td>
          <td>{{ house.type }}</td>
          <td>{{ house.location }}</td>
          <td>{{ house.contactPhone }}</td>
          <td>
            <button @click="editHouse(house)" class="edit-btn">编辑</button>
            <button @click="deleteHouse(house.id)" class="delete-btn">删除</button>
          </td>
        </tr>
      </tbody>
    </table>
    
    <!-- 分页 -->
    <div class="pagination">
      <button 
        @click="changePage('house', 1)" 
        :disabled="pagination.house.page === 1"
      >
        首页
      </button>
      <button 
        @click="changePage('house', pagination.house.page - 1)" 
        :disabled="pagination.house.page === 1"
      >
        上一页
      </button>
      <span>第 {{ pagination.house.page }} 页，共 {{ Math.ceil(pagination.house.total / pagination.house.pageSize) }} 页</span>
      <button 
        @click="changePage('house', pagination.house.page + 1)" 
        :disabled="pagination.house.page >= Math.ceil(pagination.house.total / pagination.house.pageSize)"
      >
        下一页
      </button>
      <button 
        @click="changePage('house', Math.ceil(pagination.house.total / pagination.house.pageSize))" 
        :disabled="pagination.house.page >= Math.ceil(pagination.house.total / pagination.house.pageSize)"
      >
        末页
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'HouseManagement',
  data() {
    return {
      // 分页和搜索相关
      pagination: {
        house: {
          page: 1,
          pageSize: 10,
          total: 0,
          search: ''
        }
      },
      
      // 房屋管理
      houses: [],
      showAddForm: false,
      editHouseId: null,
      houseForm: {
        title: '',
        price: '',
        area: '',
        type: '',
        layout: '',
        floor: '',
        decoration: '',
        orientation: '',
        location: '',
        facilities: '',
        contactPerson: '',
        contactPhone: '',
        description: '',
        images: []
      }
    }
  },
  mounted() {
    this.fetchHouses()
  },
  methods: {
    async fetchHouses() {
      try {
        const response = await axios.get('/api/houses', {
          params: {
            page: this.pagination.house.page,
            pageSize: this.pagination.house.pageSize,
            search: this.pagination.house.search,
            contactPhone: this.pagination.house.search
          }
        })
        this.houses = response.data.items || response.data
        this.pagination.house.total = response.data.total || this.houses.length
      } catch (error) {
        console.error('获取房屋信息失败:', error)
      }
    },
    
    triggerHouseFileInput() {
      this.$refs.houseFileInput.click();
    },
    
    removeHouseImage(index) {
      this.houseForm.images.splice(index, 1);
    },
    
    handleFileUpload(e) {
      const files = e.target.files;
      if (files.length > 0) {
        const remainingSlots = 4 - this.houseForm.images.length;
        const filesToProcess = Array.from(files).slice(0, remainingSlots);
        filesToProcess.forEach(file => {
          if (file.size > 5 * 1024 * 1024) {
            alert('图片大小不能超过5MB');
            return;
          }
          const reader = new FileReader();
          reader.onload = (event) => {
            this.houseForm.images.push(event.target.result);
          };
          reader.readAsDataURL(file);
        });
      }
    },
    
    async addHouse() {
      const formData = new FormData()
      formData.append('title', this.houseForm.title)
      formData.append('price', this.houseForm.price)
      formData.append('area', this.houseForm.area)
      formData.append('type', this.houseForm.type)
      formData.append('layout', this.houseForm.layout)
      formData.append('floor', this.houseForm.floor)
      formData.append('decoration', this.houseForm.decoration)
      formData.append('orientation', this.houseForm.orientation)
      formData.append('location', this.houseForm.location)
      formData.append('facilities', this.houseForm.facilities)
      formData.append('contactPerson', this.houseForm.contactPerson)
      formData.append('contactPhone', this.houseForm.contactPhone)
      formData.append('description', this.houseForm.description)
      formData.append('images', JSON.stringify(this.houseForm.images))
      formData.append('admin', 'true')
      formData.append('userId', '1')
      
      try {
        if (this.editHouseId) {
          await axios.put(`/api/houses/${this.editHouseId}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          alert('更新成功')
        } else {
          await axios.post('/api/houses', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          alert('添加成功')
        }
        this.showAddForm = false
        this.resetHouseForm()
        this.fetchHouses()
      } catch (error) {
        console.error('操作失败:', error)
        alert('操作失败，请重试')
      }
    },
    
    resetHouseForm() {
      this.editHouseId = null
      this.houseForm = {
        title: '',
        price: '',
        area: '',
        type: '',
        layout: '',
        floor: '',
        decoration: '',
        orientation: '',
        location: '',
        facilities: '',
        contactPerson: '',
        contactPhone: '',
        description: '',
        images: []
      }
    },
    
    editHouse(house) {
      this.editHouseId = house.id
      this.houseForm = { ...house }
      if (house.images) {
        this.houseForm.images = typeof house.images === 'string' ? JSON.parse(house.images) : house.images
      } else {
        this.houseForm.images = []
      }
      this.showAddForm = true
    },
    
    async deleteHouse(id) {
      if (confirm('确定要删除吗？')) {
        try {
          await axios.delete(`/api/houses/${id}`)
          this.fetchHouses()
        } catch (error) {
          console.error('删除房屋失败:', error)
        }
      }
    },
    
    // 分页相关方法
    changePage(type, page) {
      this.pagination[type].page = page
      if (type === 'house') {
        this.fetchHouses()
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
<template>
  <div class="admin-container">
    <div v-if="!isLoggedIn">
      <h1>管理后台登录</h1>
      <div class="login-form">
        <div class="form-group">
          <label for="username">用户名</label>
          <input type="text" id="username" v-model="loginForm.username" placeholder="请输入用户名">
        </div>
        <div class="form-group">
          <label for="password">密码</label>
          <input type="password" id="password" v-model="loginForm.password" placeholder="请输入密码">
        </div>
        <div class="form-group">
          <button @click="login">登录</button>
        </div>
        <p v-if="loginError" style="color: red;">{{ loginError }}</p>
      </div>
    </div>
    
    <div v-else class="admin-layout">
      <!-- 左侧菜单栏 -->
      <div class="admin-sidebar">
        <h2>管理后台</h2>
        <ul class="sidebar-menu">
          <li @click="activeTab = 'house'" :class="{ active: activeTab === 'house' }">
            <span class="menu-icon">🏠</span>
            <span>房屋管理</span>
          </li>
          <li @click="activeTab = 'secondhand'" :class="{ active: activeTab === 'secondhand' }">
            <span class="menu-icon">📦</span>
            <span>二手物品管理</span>
          </li>
          <li @click="activeTab = 'vehicle'" :class="{ active: activeTab === 'vehicle' }">
            <span class="menu-icon">🚗</span>
            <span>车辆管理</span>
          </li>
          <li @click="activeTab = 'service'" :class="{ active: activeTab === 'service' }">
            <span class="menu-icon">🛠️</span>
            <span>生活服务管理</span>
          </li>
          <li @click="activeTab = 'moderation'" :class="{ active: activeTab === 'moderation' }">
            <span class="menu-icon">✅</span>
            <span>审核管理</span>
          </li>
          <li @click="activeTab = 'user'" :class="{ active: activeTab === 'user' }">
            <span class="menu-icon">👤</span>
            <span>用户管理</span>
          </li>
          <li @click="activeTab = 'contact'" :class="{ active: activeTab === 'contact' }">
            <span class="menu-icon">📞</span>
            <span>联系我们管理</span>
          </li>
          <li @click="activeTab = 'member'" :class="{ active: activeTab === 'member' }">
            <span class="menu-icon">👥</span>
            <span>会员与广告服务</span>
          </li>
          <li @click="activeTab = 'about'" :class="{ active: activeTab === 'about' }">
            <span class="menu-icon">ℹ️</span>
            <span>网站简介管理</span>
          </li>
          <li @click="logout" class="logout-link">
            <span class="menu-icon">🚪</span>
            <span>退出登录</span>
          </li>
        </ul>
      </div>
      
      <!-- 右侧内容区 -->
      <div class="admin-content">
        
        <!-- 房屋管理 -->
        <div v-if="activeTab === 'house'" class="admin-section">
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
        
        <!-- 联系我们管理 -->
        <div v-if="activeTab === 'contact'" class="admin-section">
          <h2>联系我们管理</h2>
          <div class="card">
            <h3>联系信息</h3>
            <div class="form-item">
              <label>公司名称</label>
              <input type="text" v-model="contact.companyName">
            </div>
            <div class="form-item">
              <label>联系电话</label>
              <input type="text" v-model="contact.phone">
            </div>
            <div class="form-item">
              <label>电子邮箱</label>
              <input type="email" v-model="contact.email">
            </div>
            <div class="form-item">
              <label>公司地址</label>
              <input type="text" v-model="contact.address">
            </div>
            <div class="form-item">
              <label>公司Logo</label>
              <input type="file" @change="handleLogoUpload" accept="image/*">
              <input type="text" v-model="contact.logoUrl" placeholder="输入Logo图片URL" style="margin-top: 10px;">
            </div>
            <div class="form-item">
              <label>ICP备案号</label>
              <input type="text" v-model="contact.icpNumber" placeholder="例如：鲁ICP备2026000376号">
            </div>
            <div class="form-item">
              <label>ICP备案号链接</label>
              <input type="text" v-model="contact.icpUrl" placeholder="例如：https://beian.miit.gov.cn/#/Integrated/index">
            </div>
            <div class="form-item">
              <label>付款二维码图片</label>
              <input type="file" @change="handlePaymentQrUpload" accept="image/*">
              <input type="text" v-model="contact.paymentQrCode" placeholder="输入付款二维码图片URL" style="margin-top: 10px;">
            </div>
            <div class="form-item">
              <label>联系内容</label>
              <textarea v-model="contact.content" rows="10"></textarea>
            </div>
            <div class="form-actions">
              <button @click="saveContact" class="save-btn">保存</button>
            </div>
          </div>
        </div>
        
        <!-- 会员与广告服务管理 -->
        <div v-if="activeTab === 'member'" class="admin-section">
          <h2>会员与广告服务管理</h2>
          <div class="card">
            <h3>会员服务内容</h3>
            <div class="form-item">
              <label>会员服务标题</label>
              <input type="text" v-model="member.title">
            </div>
            <div class="form-item">
              <label>会员服务内容</label>
              <textarea v-model="member.content" rows="10"></textarea>
            </div>
            <div class="form-actions">
              <button @click="saveMember" class="save-btn">保存</button>
            </div>
          </div>
          
          <div class="card" style="margin-top: 20px;">
            <h3>广告服务内容</h3>
            <div class="form-item">
              <label>广告服务标题</label>
              <input type="text" v-model="ad.title">
            </div>
            <div class="form-item">
              <label>广告服务内容</label>
              <textarea v-model="ad.content" rows="10"></textarea>
            </div>
            <div class="form-actions">
              <button @click="saveAd" class="save-btn">保存</button>
            </div>
          </div>
        </div>
        
        <!-- 网站简介管理 -->
        <div v-if="activeTab === 'about'" class="admin-section">
          <h2>网站简介管理</h2>
          <div class="card">
            <h3>网站简介内容</h3>
            <div class="form-item">
              <label>简介标题</label>
              <input type="text" v-model="about.title">
            </div>
            <div class="form-item">
              <label>简介内容</label>
              <textarea v-model="about.content" rows="10"></textarea>
            </div>
            <div class="form-actions">
              <button @click="saveAbout" class="save-btn">保存</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-container {
  width: 100%;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.admin-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.admin-sidebar {
  width: 250px;
  background-color: #2c3e50;
  color: white;
  padding: 20px 0;
  overflow-y: auto;
}

.admin-sidebar h2 {
  text-align: center;
  margin-bottom: 30px;
  font-size: 18px;
  color: #ecf0f1;
}

.sidebar-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-menu li {
  padding: 15px 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
}

.sidebar-menu li:hover {
  background-color: #34495e;
}

.sidebar-menu li.active {
  background-color: #3498db;
  border-left: 4px solid #2980b9;
}

.menu-icon {
  margin-right: 10px;
  font-size: 18px;
}

.logout-link {
  margin-top: 40px;
  border-top: 1px solid #34495e;
  padding-top: 20px !important;
}

.logout-link:hover {
  background-color: #e74c3c !important;
}

.admin-content {
  flex: 1;
  padding: 20px;
  background-color: #f5f5f5;
}

.login-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 30px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #f9f9fa;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  box-sizing: border-box;
}

.form-group button {
  width: 100%;
  background-color: #28a745;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.admin-section {
  margin-top: 30px;
}

.admin-section h2 {
  margin-bottom: 20px;
  color: #333;
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
.form-item textarea {
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

input[type="file"] {
  width: 100%;
  padding: 8px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  box-sizing: border-box;
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
</style>

<script>
import axios from 'axios'

export default {
  name: 'Admin',
  data() {
    return {
      isLoggedIn: false,
      loginForm: {
        username: '',
        password: ''
      },
      loginError: '',
      activeTab: 'house',
      
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
      },
      
      // 联系我们管理
      contact: {
        companyName: '',
        phone: '',
        email: '',
        address: '',
        logoUrl: '',
        icpNumber: '',
        icpUrl: '',
        content: '',
        paymentQrCode: ''
      },
      member: {
        title: '',
        content: ''
      },
      ad: {
        title: '',
        content: ''
      },
      about: {
        title: '',
        content: ''
      }
    }
  },
  mounted() {
    this.checkLogin()
  },
  methods: {
    async checkLogin() {
      const token = localStorage.getItem('token')
      if (token) {
        this.isLoggedIn = true
        this.fetchData()
      }
    },
    
    async login() {
      try {
        const response = await axios.post('/api/login', this.loginForm)
        if (response.data.message === '登录成功') {
          this.isLoggedIn = true
          localStorage.setItem('token', 'admin')
          this.fetchData()
        }
      } catch (error) {
        this.loginError = '用户名或密码错误'
      }
    },
    
    logout() {
      localStorage.removeItem('token')
      this.isLoggedIn = false
    },
    
    async fetchData() {
      await this.fetchHouses()
      await this.fetchWebsiteSettings()
    },
    
    // 网站设置相关方法
    async fetchWebsiteSettings() {
      try {
        const response = await axios.get('/api/website-settings')
        const settings = response.data
        
        // 初始化默认值
        this.contact = {
          companyName: '日开智能技术有限公司',
          content: '如果您有任何问题或建议，欢迎随时联系我们。我们将竭诚为您服务。',
          phone: '',
          email: '',
          address: '',
          logoUrl: '',
          icpNumber: '',
          icpUrl: '',
          paymentQrCode: ''
        }
        
        this.member = {
          title: '会员服务',
          content: '成为我们的会员，您可以享受更多特权，包括优先发布信息、信息置顶、免费推广等服务。'
        }
        
        this.ad = {
          title: '广告服务',
          content: '我们提供多种广告投放方案，帮助您的企业或产品获得更多曝光。如有需要，请联系我们的客服团队。'
        }
        
        this.about = {
          title: '网站简介',
          content: '本网站成立于2026年，是一个专注于同城服务的平台。我们致力于为用户提供便捷、高效的信息发布和获取服务，连接本地社区，促进资源共享。'
        }
        
        // 检查settings是否为null或undefined
        if (settings && Array.isArray(settings)) {
          settings.forEach(setting => {
            // 检查setting是否为null或undefined
            if (setting && typeof setting === 'object') {
              const type = setting.type
              if (type === 'contact') {
                this.contact = {
                  companyName: setting.title || '',
                  content: setting.content || '',
                  phone: setting.phone || '',
                  email: setting.email || '',
                  address: setting.address || '',
                  logoUrl: setting.logoUrl || '',
                  icpNumber: setting.icpNumber || '',
                  icpUrl: setting.icpUrl || '',
                  paymentQrCode: setting.paymentQrCode || ''
                }
              } else if (type === 'member') {
                this.member = {
                  title: setting.title || '',
                  content: setting.content || ''
                }
              } else if (type === 'ad') {
                this.ad = {
                  title: setting.title || '',
                  content: setting.content || ''
                }
              } else if (type === 'about') {
                this.about = {
                  title: setting.title || '',
                  content: setting.content || ''
                }
              }
            }
          })
        }
      } catch (error) {
        console.error('获取网站设置失败:', error)
      }
    },
    
    async saveContact() {
      try {
        await axios.post('/api/website-settings', {
          type: 'contact',
          title: this.contact.companyName,
          content: this.contact.content,
          phone: this.contact.phone,
          email: this.contact.email,
          address: this.contact.address,
          logoUrl: this.contact.logoUrl,
          icpNumber: this.contact.icpNumber,
          icpUrl: this.contact.icpUrl,
          paymentQrCode: this.contact.paymentQrCode
        })
        alert('联系我们信息保存成功')
      } catch (error) {
        console.error('保存失败:', error)
        alert('保存失败，请重试')
      }
    },
    
    async saveMember() {
      try {
        await axios.post('/api/website-settings', {
          type: 'member',
          title: this.member.title,
          content: this.member.content
        })
        alert('会员服务信息保存成功')
      } catch (error) {
        console.error('保存失败:', error)
        alert('保存失败，请重试')
      }
    },
    
    async saveAd() {
      try {
        await axios.post('/api/website-settings', {
          type: 'ad',
          title: this.ad.title,
          content: this.ad.content
        })
        alert('广告服务信息保存成功')
      } catch (error) {
        console.error('保存失败:', error)
        alert('保存失败，请重试')
      }
    },
    
    async saveAbout() {
      try {
        await axios.post('/api/website-settings', {
          type: 'about',
          title: this.about.title,
          content: this.about.content
        })
        alert('网站简介保存成功')
      } catch (error) {
        console.error('保存失败:', error)
        alert('保存失败，请重试')
      }
    },
    
    // 房屋相关方法
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
    },
    
    // 文件上传相关方法
    handleLogoUpload(e) {
      const file = e.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          this.contact.logoUrl = event.target.result
        }
        reader.readAsDataURL(file)
      }
    },
    
    handlePaymentQrUpload(e) {
      const file = e.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          this.contact.paymentQrCode = event.target.result
        }
        reader.readAsDataURL(file)
      }
    }
  }
}
</script>
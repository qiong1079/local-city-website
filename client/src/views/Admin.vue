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
        <HouseManagement v-if="activeTab === 'house'" />
        <SecondhandManagement v-if="activeTab === 'secondhand'" />
        <VehicleManagement v-if="activeTab === 'vehicle'" />
        <ServiceManagement v-if="activeTab === 'service'" />
        <ModerationManagement v-if="activeTab === 'moderation'" />
        <UserManagement v-if="activeTab === 'user'" />
        <ContactManagement v-if="activeTab === 'contact'" />
        <MemberAdManagement v-if="activeTab === 'member'" />
        <AboutManagement v-if="activeTab === 'about'" />
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import HouseManagement from './admin-components/HouseManagement.vue'
import SecondhandManagement from './admin-components/SecondhandManagement.vue'
import VehicleManagement from './admin-components/VehicleManagement.vue'
import ServiceManagement from './admin-components/ServiceManagement.vue'
import ModerationManagement from './admin-components/ModerationManagement.vue'
import UserManagement from './admin-components/UserManagement.vue'
import ContactManagement from './admin-components/ContactManagement.vue'
import MemberAdManagement from './admin-components/MemberAdManagement.vue'
import AboutManagement from './admin-components/AboutManagement.vue'

export default {
  name: 'Admin',
  components: {
    HouseManagement,
    SecondhandManagement,
    VehicleManagement,
    ServiceManagement,
    ModerationManagement,
    UserManagement,
    ContactManagement,
    MemberAdManagement,
    AboutManagement
  },
  data() {
    return {
      isLoggedIn: false,
      loginForm: {
        username: '',
        password: ''
      },
      loginError: '',
      activeTab: 'house'
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
      }
    },
    
    async login() {
      try {
        const response = await axios.post('/api/login', this.loginForm)
        if (response.data.message === '登录成功') {
          this.isLoggedIn = true
          localStorage.setItem('token', 'admin')
        }
      } catch (error) {
        this.loginError = '用户名或密码错误'
      }
    },
    
    logout() {
      localStorage.removeItem('token')
      this.isLoggedIn = false
    }
  }
}
</script>

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
</style>
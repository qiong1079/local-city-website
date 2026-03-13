<template>
  <section class="user-center-section">
    <div class="container">
      <h1 class="page-title">个人中心</h1>
      
      <!-- 移动端导航 -->
      <div class="mobile-nav" v-if="isMobile">
        <div class="mobile-nav-header">
          <span>会员中心</span>
          <button class="mobile-menu-toggle" @click="toggleMobileMenu">
            <span class="menu-icon"></span>
          </button>
        </div>
        <ul class="mobile-nav-links" :class="{ 'active': mobileMenuActive }">
          <li><a href="#" @click.prevent="activeTab = 'info'">个人信息</a></li>
          <li><a href="#" @click.prevent="activeTab = 'post'">发布信息</a></li>
          <li><a href="#" @click.prevent="activeTab = 'my-posts'">我的信息</a></li>
          <li><router-link to="/coin-recharge">金币充值</router-link></li>
          <li><a href="#" @click.prevent="activeTab = 'settings'">账号设置</a></li>
          <li><a href="#" @click.prevent="logout">退出登录</a></li>
        </ul>
      </div>
      
      <div class="user-center-content">
        <!-- 左侧导航（PC端） -->
        <div class="sidebar" v-if="!isMobile">
          <div class="sidebar-header">
            会员中心
          </div>
          <ul class="sidebar-links">
            <li><a href="#" @click.prevent="activeTab = 'info'" :class="{ active: activeTab === 'info' }">个人信息</a></li>
            <li><a href="#" @click.prevent="activeTab = 'post'" :class="{ active: activeTab === 'post' }">发布信息</a></li>
            <li><a href="#" @click.prevent="activeTab = 'my-posts'" :class="{ active: activeTab === 'my-posts' }">我的信息</a></li>
            <li><router-link to="/coin-recharge">金币充值</router-link></li>
            <li><a href="#" @click.prevent="activeTab = 'settings'" :class="{ active: activeTab === 'settings' }">账号设置</a></li>
            <li><a href="#" @click.prevent="logout" class="logout">退出登录</a></li>
          </ul>
        </div>
        
        <!-- 右侧内容 -->
        <div class="main-content">

          
          <!-- 个人信息 -->
          <div class="info-section" v-if="user && activeTab === 'info'">
            <h2 class="section-title">个人信息</h2>
            
            <!-- 金币/统计 -->
            <div class="user-stats">
              <div class="stat-item">
                <div class="stat-icon">💰</div>
                <div class="stat-info">
                  <div class="stat-value">{{ user.coins || 0 }}</div>
                  <div class="stat-label">金币</div>
                </div>
              </div>
              <div class="stat-item">
                <div class="stat-icon">📊</div>
                <div class="stat-info">
                  <div class="stat-value">{{ user.posts || 0 }}</div>
                  <div class="stat-label">发布信息</div>
                </div>
              </div>
            </div>
            
            <div class="info-item">
              <label class="info-label">用户名：</label>
              <span class="info-value">{{ user.username }}</span>
            </div>
            <div class="info-item">
              <label class="info-label">邮箱：</label>
              <span class="info-value">{{ user.email }}</span>
            </div>
            <div class="info-item">
              <label class="info-label">用户类型：</label>
              <span class="info-value">{{ user.userType === 'personal' ? '个人会员' : '机构会员' }}</span>
            </div>
            
            <div v-if="user.userType === 'organization'" class="info-item">
              <label class="info-label">机构名称：</label>
              <span class="info-value">{{ user.organizationName }}</span>
            </div>
            <div v-if="user.userType === 'organization'" class="info-item">
              <label class="info-label">所属地区：</label>
              <span class="info-value">{{ user.region }}</span>
            </div>
            <div v-if="user.userType === 'organization'" class="info-item">
              <label class="info-label">所属行业：</label>
              <span class="info-value">{{ user.industry }}</span>
            </div>
          </div>
          
          <!-- 发布信息 -->
          <div class="info-section" v-if="user && activeTab === 'post'">
            <h2 class="section-title">发布信息</h2>
            <div class="post-options">
              <router-link to="/post?type=house" class="post-option">
                <div class="post-icon">🏠</div>
                <div class="post-label">房屋租售</div>
              </router-link>
              <router-link to="/post?type=secondhand" class="post-option">
                <div class="post-icon">📦</div>
                <div class="post-label">二手物品</div>
              </router-link>
              <router-link to="/post?type=vehicle" class="post-option">
                <div class="post-icon">🚗</div>
                <div class="post-label">车辆买卖</div>
              </router-link>
              <router-link to="/post?type=service" class="post-option">
                <div class="post-icon">🛠️</div>
                <div class="post-label">生活服务</div>
              </router-link>
            </div>
          </div>
          
          <!-- 我的信息 -->
          <div class="info-section" v-if="user && activeTab === 'my-posts'">
            <h2 class="section-title">我的信息</h2>
            
            <div class="post-tabs">
              <button @click="activePostTab = 'house'" :class="{ active: activePostTab === 'house' }">房屋租售</button>
              <button @click="activePostTab = 'secondhand'" :class="{ active: activePostTab === 'secondhand' }">二手物品</button>
              <button @click="activePostTab = 'vehicle'" :class="{ active: activePostTab === 'vehicle' }">车辆买卖</button>
              <button @click="activePostTab = 'service'" :class="{ active: activePostTab === 'service' }">生活服务</button>
            </div>
            
            <div class="posts-list">
              <div v-if="userPosts[activePostTab].length === 0" class="no-posts">
                暂无发布信息
              </div>
              <div v-else class="post-item" v-for="post in userPosts[activePostTab]" :key="post.id">
                <div class="post-info">
                  <h3 class="post-title">{{ post.title }}</h3>
                  <div class="post-meta">
                    <span class="post-price">{{ post.price }} 元</span>
                    <span class="post-status" :class="post.status">
                      {{ post.status === 'pending' ? '待审核' : post.status === 'approved' ? '已通过' : '已拒绝' }}
                    </span>
                  </div>
                  <p class="post-description">{{ post.description.substring(0, 100) }}...</p>
                </div>
                <div class="post-actions">
                  <button @click="editPost(activePostTab, post)" class="action-btn edit-btn">编辑</button>
                  <button @click="deletePost(activePostTab, post.id)" class="action-btn delete-btn">删除</button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 账号设置 -->
          <div class="info-section" v-if="user && activeTab === 'settings'">
            <h2 class="section-title">账号设置</h2>
            <div class="form-item">
              <label>用户名</label>
              <input type="text" v-model="userSettings.username">
            </div>
            <div class="form-item">
              <label>邮箱</label>
              <input type="email" v-model="userSettings.email">
            </div>
            <div class="form-item">
              <label>密码</label>
              <input type="password" v-model="userSettings.password" placeholder="留空表示不修改">
            </div>
            <div class="form-item">
              <label>电话</label>
              <input type="text" v-model="userSettings.phone">
            </div>
            <button @click="saveSettings" class="save-btn">保存设置</button>
          </div>
          
          <!-- 未登录状态 -->
          <div v-else-if="!user" class="login-prompt">
            <p>请先登录</p>
            <router-link to="/login" class="login-link">去登录</router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'UserCenter',
  data() {
    return {
      user: null,
      isMobile: false,
      mobileMenuActive: false,
      activeTab: 'info',
      activePostTab: 'house',
      userSettings: {
        username: '',
        email: '',
        password: '',
        phone: ''
      },
      userPosts: {
        house: [],
        secondhand: [],
        vehicle: [],
        service: []
      }
    }
  },
  mounted() {
    // 检查URL参数
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    if (tab) {
      this.activeTab = tab;
    }
    
    // 检查localStorage是否有用户信息
    const userInfo = localStorage.getItem('user');
    if (userInfo) {
      this.user = JSON.parse(userInfo);
      
      // 初始化用户设置
      this.userSettings = {
        username: this.user.username,
        email: this.user.email,
        password: '',
        phone: this.user.phone || ''
      };
      
      // 获取用户发布的信息
      this.fetchUserPosts();
      
      // 获取用户真实金币数量
      this.fetchUserCoins();
    }
    
    // 检测屏幕尺寸
    this.checkScreenSize();
    window.addEventListener('resize', this.checkScreenSize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkScreenSize);
  },
  methods: {
    checkScreenSize() {
      this.isMobile = window.innerWidth <= 768;
    },
    toggleMobileMenu() {
      this.mobileMenuActive = !this.mobileMenuActive;
    },
    logout() {
      // 清除localStorage中的用户信息
      localStorage.removeItem('user');
      // 跳转到登录页
      this.$router.push('/login');
    },
    async fetchUserPosts() {
      try {
        const userInfo = localStorage.getItem('user');
        if (!userInfo) return;
        
        const user = JSON.parse(userInfo);
        const userId = user.id;
        
        // 同时获取所有类型的用户发布信息
        const [houses, secondhand, vehicles, services] = await Promise.all([
          this.fetchPosts('houses', userId),
          this.fetchPosts('secondhand', userId),
          this.fetchPosts('vehicles', userId),
          this.fetchPosts('services', userId)
        ]);
        
        this.userPosts.house = houses;
        this.userPosts.secondhand = secondhand;
        this.userPosts.vehicle = vehicles;
        this.userPosts.service = services;
        
        // 计算发布信息总数
        const totalPosts = houses.length + secondhand.length + vehicles.length + services.length;
        // 更新用户对象中的posts属性
        if (this.user) {
          this.user.posts = totalPosts;
          // 更新localStorage
          const userInfo = localStorage.getItem('user');
          if (userInfo) {
            const userData = JSON.parse(userInfo);
            userData.posts = totalPosts;
            localStorage.setItem('user', JSON.stringify(userData));
          }
        }
        console.log('Total posts:', totalPosts);
      } catch (error) {
        console.error('获取用户发布信息失败:', error);
      }
    },
    async fetchPosts(type, userId) {
      try {
        const response = await fetch(`/api/${type}?userId=${userId}`);
        if (response.ok) {
          const data = await response.json();
          // 检查返回数据格式，如果是对象且包含items属性，则返回items数组
          if (data && data.items && Array.isArray(data.items)) {
            return data.items;
          }
          // 否则尝试直接返回（兼容旧格式）
          return Array.isArray(data) ? data : [];
        }
        return [];
      } catch (error) {
        console.error(`获取${type}失败:`, error);
        return [];
      }
    },
    editPost(type, post) {
      // 跳转到发布页面进行编辑
      this.$router.push(`/post?type=${type}&id=${post.id}`);
    },
    async deletePost(type, id) {
      if (confirm('确定要删除吗？')) {
        try {
          const response = await fetch(`/api/${type}/${id}`, {
            method: 'DELETE'
          });
          if (response.ok) {
            // 重新获取用户发布信息
            this.fetchUserPosts();
            alert('删除成功');
          }
        } catch (error) {
          console.error('删除失败:', error);
          alert('删除失败，请重试');
        }
      }
    },
    async saveSettings() {
      try {
        const userInfo = localStorage.getItem('user');
        if (!userInfo) return;
        
        const user = JSON.parse(userInfo);
        const userId = user.id;
        
        const response = await fetch(`/api/users/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.userSettings)
        });
        
        if (response.ok) {
          // 更新localStorage中的用户信息
          const updatedUser = await response.json();
          localStorage.setItem('user', JSON.stringify(updatedUser));
          this.user = updatedUser;
          alert('设置保存成功');
        }
      } catch (error) {
        console.error('保存设置失败:', error);
        alert('保存失败，请重试');
      }
    },
    async fetchUserCoins() {
      try {
        const userInfo = localStorage.getItem('user');
        if (!userInfo) {
          console.log('No user info in localStorage');
          return;
        }
        
        const user = JSON.parse(userInfo);
        const userId = user.id;
        
        console.log('Fetching user coins for userId:', userId);
        try {
          const response = await fetch(`/api/users/${userId}`);
          console.log('Response status:', response.status);
          if (response.ok) {
            const userData = await response.json();
            console.log('User data received:', userData);
            // 更新用户信息，包括金币数量
            this.user = userData;
            // 更新localStorage
            localStorage.setItem('user', JSON.stringify(userData));
            console.log('User coins updated:', userData.coins);
          } else {
            console.error('Failed to fetch user data:', response.statusText);
            // 如果API调用失败，使用localStorage中的数据
            console.log('Using local user data:', user);
            this.user = user;
          }
        } catch (fetchError) {
          console.error('Network error when fetching user data:', fetchError);
          // 网络错误时使用localStorage中的数据
          console.log('Using local user data due to network error:', user);
          this.user = user;
        }
      } catch (error) {
        console.error('获取金币数量失败:', error);
      }
    }
  }
}
</script>

<style scoped>
/* 用户中心页面 */
.user-center-section {
  padding: 40px 0;
  background-color: #f8f9fa;
}

/* 页面标题 */
.page-title {
  margin: 0 0 30px 0;
  color: #333;
  font-size: 24px;
  text-align: center;
}

/* 移动端导航 */
.mobile-nav {
  margin-bottom: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.mobile-nav-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #e0e0e0;
  background-color: #f8f9fa;
}

.mobile-nav-header span {
  font-weight: bold;
  color: #333;
}

.mobile-menu-toggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
}

.menu-icon {
  display: block;
  width: 24px;
  height: 2px;
  background-color: #333;
  position: relative;
}

.menu-icon::before,
.menu-icon::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 2px;
  background-color: #333;
  transition: all 0.3s ease;
}

.menu-icon::before {
  top: -8px;
}

.menu-icon::after {
  top: 8px;
}

.mobile-nav-links {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.mobile-nav-links.active {
  max-height: 300px;
}

.mobile-nav-links li {
  border-bottom: 1px solid #e0e0e0;
}

.mobile-nav-links a {
  display: block;
  padding: 12px 20px;
  color: #333;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.mobile-nav-links a:hover {
  background-color: #f8f9fa;
  color: #007bff;
  text-decoration: none;
}

.mobile-nav-links a.logout {
  color: #dc3545;
}

/* 用户中心内容 */
.user-center-content {
  display: flex;
  gap: 30px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 30px;
}

/* 左侧导航（PC端） */
.sidebar {
  flex: 0 0 200px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background-color: #f8f9fa;
}

.sidebar-header {
  background-color: #343a40;
  color: white;
  padding: 15px;
  font-weight: bold;
  border-bottom: 1px solid #e0e0e0;
}

.sidebar-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-links li {
  border-bottom: 1px solid #e0e0e0;
}

.sidebar-links a {
  display: block;
  padding: 12px 15px;
  color: #333;
  text-decoration: none;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.sidebar-links a:hover {
  background-color: #e9ecef;
  color: #007bff;
  text-decoration: none;
}

.sidebar-links a.active {
  background-color: #007bff;
  color: white;
  font-weight: bold;
}

.sidebar-links a.logout {
  color: #dc3545;
}

.sidebar-links a.logout:hover {
  background-color: #f8d7da;
  color: #721c24;
}

/* 右侧内容 */
.main-content {
  flex: 1;
}

/* 金币/积分/统计 */
.user-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 30px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  font-size: 32px;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

/* 信息部分 */
.info-section {
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.section-title {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 20px;
  border-bottom: 2px solid #007bff;
  padding-bottom: 10px;
}

.info-item {
  display: flex;
  margin-bottom: 15px;
  padding: 10px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.info-label {
  width: 120px;
  font-weight: bold;
  color: #333;
}

.info-value {
  flex: 1;
  color: #666;
}

/* 发布信息选项 */
.post-options {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-top: 20px;
}

.post-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  text-decoration: none;
  color: #333;
  transition: all 0.3s ease;
}

.post-option:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  text-decoration: none;
  color: #007bff;
}

.post-icon {
  font-size: 32px;
  margin-bottom: 10px;
}

.post-label {
  font-size: 14px;
  font-weight: bold;
}

/* 发布信息标签页 */
.post-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 10px;
}

.post-tabs button {
  padding: 8px 15px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.post-tabs button:hover {
  background-color: #f8f9fa;
}

.post-tabs button.active {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

/* 帖子列表 */
.posts-list {
  margin-top: 20px;
}

.no-posts {
  text-align: center;
  padding: 40px 20px;
  background-color: #f8f9fa;
  border-radius: 4px;
  color: #666;
}

.post-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px;
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 15px;
  transition: all 0.3s ease;
}

.post-item:hover {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.post-info {
  flex: 1;
  margin-right: 20px;
}

.post-title {
  margin: 0 0 10px 0;
  font-size: 18px;
  color: #333;
}

.post-meta {
  display: flex;
  gap: 15px;
  margin-bottom: 10px;
  font-size: 14px;
}

.post-price {
  font-weight: bold;
  color: #dc3545;
}

.post-status {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}

.post-status.pending {
  background-color: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
}

.post-status.approved {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.post-status.rejected {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.post-description {
  margin: 0;
  color: #666;
  font-size: 14px;
  line-height: 1.4;
}

.post-actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s ease;
}

.edit-btn {
  background-color: #007bff;
  color: white;
}

.edit-btn:hover {
  background-color: #0069d9;
}

.delete-btn {
  background-color: #dc3545;
  color: white;
}

.delete-btn:hover {
  background-color: #c82333;
}

/* 账号设置 */
.form-item {
  margin-bottom: 15px;
}

.form-item label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
}

.form-item input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  box-sizing: border-box;
}

.save-btn {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.save-btn:hover {
  background-color: #218838;
}

/* 未登录状态 */
.login-prompt {
  text-align: center;
  padding: 60px 20px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.login-prompt p {
  margin: 0 0 20px 0;
  font-size: 18px;
  color: #666;
}

.login-link {
  display: inline-block;
  padding: 10px 30px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.login-link:hover {
  background-color: #0069d9;
  text-decoration: none;
  color: white;
}

/* 响应式设计 */
@media (max-width: 768px) {
  /* 用户中心页面 */
  .user-center-section {
    padding: 20px 0;
  }
  
  /* 页面标题 */
  .page-title {
    font-size: 20px;
    margin-bottom: 20px;
  }
  
  /* 用户中心内容 */
  .user-center-content {
    flex-direction: column;
    padding: 20px;
  }
  
  /* 金币/积分/统计 */
  .user-stats {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    padding: 15px;
  }
  
  .stat-item {
    padding: 10px;
  }
  
  .stat-icon {
    font-size: 24px;
  }
  
  .stat-value {
    font-size: 20px;
  }
  
  /* 发布信息选项 */
  .post-options {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
  
  .post-option {
    padding: 15px;
  }
  
  .post-icon {
    font-size: 24px;
  }
  
  /* 帖子列表 */
  .post-item {
    flex-direction: column;
    gap: 15px;
  }
  
  .post-actions {
    align-self: flex-start;
  }
  
  /* 信息部分 */
  .info-section {
    padding: 15px;
  }
  
  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  .info-label {
    width: 100%;
  }
  
  /* 未登录状态 */
  .login-prompt {
    padding: 40px 15px;
  }
}

@media (max-width: 360px) {
  /* 金币/积分/统计 */
  .user-stats {
    grid-template-columns: 1fr;
  }
  
  /* 发布信息选项 */
  .post-options {
    grid-template-columns: 1fr;
  }
  
  /* 发布信息标签页 */
  .post-tabs {
    flex-wrap: wrap;
  }
  
  .post-tabs button {
    flex: 1;
    min-width: 80px;
  }
  
  /* 用户中心内容 */
  .user-center-content {
    padding: 15px;
  }
}
</style>
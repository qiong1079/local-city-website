<template>
  <div class="app">
    <!-- 非管理页面显示顶部导航栏 -->
    <header v-if="!isAdminPage">
      <!-- 顶部导航栏 -->
      <div class="top-bar">
        <div class="container">
          <div class="top-bar-content">
            <div class="logo">
              <img :src="siteInfo.logoUrl" :alt="siteInfo.companyName">
              <span>{{ siteInfo.companyName }}</span>
            </div>
            <div class="user-info">
              <template v-if="user">
                <span>hi，欢迎 {{ user.username }}！</span>
                <router-link to="/usercenter">个人中心</router-link>
                <a href="#" @click.prevent="logout">退出</a>
              </template>
              <template v-else>
                <span>hi，欢迎来到烟台{{ siteInfo.companyName }}有限公司！</span>
                <router-link to="/register">注册</router-link>
                <router-link to="/login">登录</router-link>
              </template>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 主导航菜单 -->
      <div class="main-nav">
        <div class="container">
          <!-- 移动端汉堡菜单 -->
          <div class="mobile-menu-toggle" @click="toggleMobileMenu">
            <div class="menu-icon"></div>
          </div>
          
          <!-- 桌面端导航 -->
          <ul class="nav-links" :class="{ 'mobile-active': mobileMenuActive }">
            <li><router-link to="/" :class="{ active: $route.path === '/' }">首页</router-link></li>
            <li><router-link to="/house" :class="{ active: $route.path === '/house' }">房屋租售服务</router-link></li>
            <li><router-link to="/secondhand" :class="{ active: $route.path === '/secondhand' }">二手物品转让</router-link></li>
            <li><router-link to="/vehicle" :class="{ active: $route.path === '/vehicle' }">车辆买卖服务</router-link></li>
            <li><router-link to="/service" :class="{ active: $route.path === '/service' }">生活服务</router-link></li>

            <li><router-link to="/contact" :class="{ active: $route.path === '/contact' }">联系我们</router-link></li>
            <li><router-link to="/member-ad" :class="{ active: $route.path === '/member-ad' }">会员与广告服务</router-link></li>
            <li><router-link to="/about" :class="{ active: $route.path === '/about' }">网站简介</router-link></li>
            <li><router-link to="/post" style="color: yellow;">信息发布请点这里</router-link></li>
          </ul>
        </div>
      </div>
    </header>
    
    <main>
      <router-view />
    </main>
    
    <!-- 非管理页面显示底部 -->
    <footer v-if="!isAdminPage" class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h3>关于我们</h3>
            <p>本网站是一个专注于同城服务的平台，为用户提供房屋租售、二手物品转让、车辆买卖和生活服务等信息。</p>
          </div>
          <div class="footer-section">
            <h3>快速链接</h3>
            <ul>
              <li><router-link to="/site-mechanism">网站机制</router-link></li>
              <li><router-link to="/contact">联系我们</router-link></li>
              <li><router-link to="/member-ad">会员与广告服务</router-link></li>
              <li><router-link to="/about">网站简介</router-link></li>
            </ul>
          </div>
          <div class="footer-section">
            <h3>联系方式</h3>
            <p>电话：{{ contactInfo.phone }}</p>
            <p>邮箱：{{ contactInfo.email }}</p>
            <p>地址：{{ contactInfo.address }}</p>
          </div>
        </div>
        <div class="footer-bottom">
          <p>© 2026 {{ siteInfo.companyName }} 版权所有</p>
          <p v-if="siteInfo.icpNumber">
            <a :href="siteInfo.icpUrl" target="_blank">{{ siteInfo.icpNumber }}</a>
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { useUserStore } from './stores/userStore'

export default {
  name: 'App',
  data() {
    return {
      mobileMenuActive: false,
      contactInfo: {
        phone: '1234567890',
        email: 'contact@example.com',
        address: '山东省烟台市'
      },
      siteInfo: {
        companyName: '日开智能技术',
        logoUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=logo%20for%20local%20city%20website%2C%20modern%2C%20simple%2C%20green%20color&image_size=square',
        icpNumber: '鲁ICP备2026000376号',
        icpUrl: 'https://beian.miit.gov.cn/#/Integrated/index'
      }
    }
  },
  computed: {
    isAdminPage() {
      // 检查当前是否为管理页面
      return this.$route.path.startsWith('/admin');
    },
    user() {
      return this.userStore.user
    }
  },
  setup() {
    const userStore = useUserStore()
    return { userStore }
  },
  mounted() {
    // 检查登录状态
    this.userStore.checkLogin();
    
    // 获取联系方式
    this.fetchContactInfo();
    // 获取网站信息
    this.fetchSiteInfo();
    
    // 监听路由变化，确保在登录成功后更新用户信息
    this.$router.beforeEach((to, from, next) => {
      this.userStore.checkLogin();
      // 设置页面标题
      this.setPageTitle(to);
      // 每次路由变化时重新获取联系方式和网站信息，确保数据最新
      this.fetchContactInfo();
      this.fetchSiteInfo();
      next();
    });
  },
  methods: {
    logout() {
      // 使用userStore登出
      this.userStore.logout();
      // 跳转到首页
      this.$router.push('/');
    },
    toggleMobileMenu() {
      this.mobileMenuActive = !this.mobileMenuActive;
    },
    setPageTitle(to) {
      // 根据路由设置页面标题
      const titleMap = {
        '/': '首页',
        '/house': '房屋租售服务',
        '/secondhand': '二手物品转让',
        '/vehicle': '车辆买卖服务',
        '/service': '生活服务',
        '/admin': '后台管理',
        '/register': '注册',
        '/register/personal': '个人注册',
        '/register/organization': '机构注册',
        '/login': '登录',
        '/usercenter': '个人中心',
        '/site-mechanism': '网站机制',
        '/contact': '联系我们',
        '/member-ad': '会员与广告服务',
        '/about': '网站简介',
        '/website-mechanism': '网站机制',
        '/operation-prompt': '操作提示',
        '/coin-recharge': '金币充值',
        '/post': '发布信息'
      };
      
      // 处理详情页路由
      if (to.path.includes('/detail/')) {
        // 提取分类
        const category = to.params.category;
        const categoryMap = {
          house: '房屋租售',
          secondhand: '二手物品',
          vehicle: '车辆买卖',
          service: '生活服务'
        };
        const categoryName = categoryMap[category] || '信息详情';
        document.title = `${categoryName}详情`;
      } else {
        // 使用标题映射
        document.title = titleMap[to.path] || '首页';
      }
    },
    async fetchContactInfo() {
      try {
        const response = await fetch('/api/website-settings/contact');
        console.log('Response status:', response.status);
        if (response.ok) {
          const data = await response.json();
          console.log('Contact data:', data);
          if (data) {
            this.contactInfo = {
              phone: data.phone || '1234567890',
              email: data.email || 'contact@example.com',
              address: data.address || '山东省烟台市'
            };
            console.log('Updated contactInfo:', this.contactInfo);
          }
        }
      } catch (error) {
        console.error('获取联系方式失败:', error);
        // 使用默认值
        this.contactInfo = {
          phone: '1234567890',
          email: 'contact@example.com',
          address: '山东省烟台市'
        };
      }
    },
    async fetchSiteInfo() {
      try {
        const response = await fetch('/api/website-settings/contact');
        console.log('Site info response status:', response.status);
        if (response.ok) {
          const data = await response.json();
          console.log('Site info data:', data);
          if (data) {
            this.siteInfo = {
              companyName: data.title || '日开智能技术',
              logoUrl: data.logoUrl || 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=logo%20for%20local%20city%20website%2C%20modern%2C%20simple%2C%20green%20color&image_size=square',
              icpNumber: data.icpNumber || '鲁ICP备2026000376号',
              icpUrl: data.icpUrl || 'https://beian.miit.gov.cn/#/Integrated/index'
            };
            console.log('Updated siteInfo:', this.siteInfo);
          }
        }
      } catch (error) {
        console.error('获取网站信息失败:', error);
        // 使用默认值
        this.siteInfo = {
          companyName: '日开智能技术',
          logoUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=logo%20for%20local%20city%20website%2C%20modern%2C%20simple%2C%20green%20color&image_size=square',
          icpNumber: '鲁ICP备2026000376号',
          icpUrl: 'https://beian.miit.gov.cn/#/Integrated/index'
        };
      }
    }
  }
}
</script>

<style scoped>
/* 全局样式 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 顶部栏 */
.top-bar {
  background-color: #f0f8ff;
  padding: 5px 0;
  border-bottom: 1px solid #e0e0e0;
}

.top-bar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
}

.logo img {
  height: 30px;
  margin-right: 10px;
}

.logo span {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.user-info {
  color: #666;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-info span {
  white-space: nowrap;
}

.user-info a,
.user-info router-link {
  color: #dc3545;
  text-decoration: none;
}

.user-info router-link[to="/usercenter"] {
  color: #007bff;
}

/* 主导航 */
.main-nav {
  background-color: #dc3545;
  padding: 8px 0;
  position: relative;
}

/* 移动端菜单切换 */
.mobile-menu-toggle {
  display: none;
  cursor: pointer;
}

.menu-icon {
  width: 30px;
  height: 20px;
  position: relative;
}

.menu-icon::before,
.menu-icon::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 2px;
  background-color: white;
  transition: all 0.3s ease;
}

.menu-icon::before {
  top: 0;
}

.menu-icon::after {
  bottom: 0;
}

.menu-icon::before {
  transform: translateY(9px);
}

/* 导航链接 */
.nav-links {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  justify-content: center;
}

.nav-links li {
  margin: 0 10px;
}

.nav-links a {
  color: white;
  text-decoration: none;
  font-size: 14px;
  padding: 5px 10px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.nav-links a:hover {
  background-color: rgba(255, 255, 255, 0.2);
  text-decoration: none;
}

.active {
  font-weight: bold;
  background-color: rgba(255, 255, 255, 0.3);
}

/* 响应式设计 */
@media (max-width: 768px) {
  /* 顶部栏 */
  .top-bar-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    padding: 10px 0;
  }
  
  .user-info {
    width: 100%;
    justify-content: space-between;
  }
  
  /* 移动端菜单切换 */
  .mobile-menu-toggle {
    display: block;
    position: absolute;
    top: 50%;
    right: 20px;
    transform: translateY(-50%);
  }
  
  /* 导航链接 */
  .nav-links {
    flex-direction: column;
    align-items: center;
    gap: 5px;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
  }
  
  .nav-links.mobile-active {
    max-height: 400px;
    padding: 10px 0;
  }
  
  .nav-links li {
    margin: 0;
    width: 100%;
    text-align: center;
  }
  
  .nav-links a {
    display: block;
    width: 100%;
    padding: 10px;
  }
}

@media (max-width: 360px) {
  /* 容器 */
  .container {
    padding: 0 10px;
  }
  
  /* 顶部栏 */
  .logo span {
    font-size: 14px;
  }
  
  .user-info {
    font-size: 12px;
  }
}

/* 页脚样式 */
.footer {
  background-color: #343a40;
  color: white;
  padding: 30px 0;
  margin-top: 40px;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-bottom: 20px;
}

.footer-section h3 {
  margin-bottom: 15px;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
}

.footer-section p {
  color: #ced4da;
  line-height: 1.5;
  margin-bottom: 10px;
  font-size: 14px;
}

.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-section ul li {
  margin-bottom: 10px;
}

.footer-section ul li a,
.footer-section ul li router-link {
  color: #ced4da;
  text-decoration: none;
  transition: color 0.3s ease;
  font-size: 14px;
}

.footer-section ul li a:hover,
.footer-section ul li router-link:hover {
  color: #fff;
  text-decoration: underline;
}

.footer-bottom {
  border-top: 1px solid #495057;
  padding-top: 20px;
  text-align: center;
  color: #ced4da;
  font-size: 14px;
}

/* 响应式页脚 */
@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .footer-section {
    text-align: center;
  }
}

@media (max-width: 360px) {
  .footer {
    padding: 20px 0 10px;
    margin-top: 20px;
  }
  
  .footer-section h3 {
    font-size: 14px;
  }
  
  .footer-section p,
  .footer-section ul li a,
  .footer-bottom {
    font-size: 12px;
  }
}
</style>
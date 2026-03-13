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
          <li><a href="/usercenter" @click.prevent>个人信息</a></li>
          <li><a href="/usercenter?tab=post" @click.prevent>发布信息</a></li>
          <li><a href="/usercenter?tab=my-posts" @click.prevent>我的信息</a></li>
          <li><a href="/coin-recharge" class="active">金币充值</a></li>
          <li><a href="/usercenter?tab=settings" @click.prevent>账号设置</a></li>
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
            <li><a href="/usercenter" :class="{ active: false }">个人信息</a></li>
            <li><a href="/usercenter?tab=post" :class="{ active: false }">发布信息</a></li>
            <li><a href="/usercenter?tab=my-posts" :class="{ active: false }">我的信息</a></li>
            <li><a href="/coin-recharge" class="active">金币充值</a></li>
            <li><a href="/usercenter?tab=settings" :class="{ active: false }">账号设置</a></li>
            <li><a href="#" @click.prevent="logout" class="logout">退出登录</a></li>
          </ul>
        </div>
        
        <!-- 右侧内容 -->
        <div class="main-content">

          
          <!-- 充值内容 -->
          <div class="info-section" v-if="user">
            <h2 class="section-title">金币充值</h2>
            
            <!-- 充值规则 -->
            <div class="recharge-rules">
              <h3>充值规则</h3>
              <ul class="rules-list">
                <li>1. 充值金币为虚拟货币，仅用于网站内发布信息等服务</li>
                <li>2. 充值后金币不支持退款，请谨慎操作</li>
                <li>3. 充值过程中直接联系客服：15806447377</li>
                <li>4. 充值比例：1元 = 10金币</li>
              </ul>
              <p class="warm-tip">温馨提示：充值完成后24小时内显示，请耐心等待。</p>
            </div>
            
            <!-- 充值选项 -->
            <div class="recharge-options">
              <h3>选择充值金额</h3>
              <div class="options-grid">
                <div 
                  v-for="option in rechargeOptions" 
                  :key="option.id"
                  class="option-item"
                  :class="{ active: selectedOption === option.id }"
                  @click="selectOption(option.id)"
                >
                  <div class="option-amount">{{ option.amount }}元</div>
                  <div class="option-coins">{{ option.coins }}金币</div>
                </div>
              </div>
              
              <!-- 自定义金额 -->
              <div class="custom-amount">
                <label for="customAmount">自定义金额：</label>
                <input 
                  type="number" 
                  id="customAmount"
                  v-model.number="customAmount"
                  placeholder="请输入金额"
                  min="1"
                  max="10000"
                  @input="updateCustomCoins"
                >
                <span class="custom-coins">{{ customCoins }}金币</span>
              </div>
            </div>
            
            <!-- 支付二维码 -->
            <div class="payment-qr">
              <h3>扫码支付</h3>
              <div class="qr-container">
                <img 
                  :src="qrCodeUrl" 
                  alt="支付二维码"
                  class="qr-code"
                >
                <div class="qr-info">
                  <p>请使用微信或支付宝扫码支付</p>
                  <p class="payment-amount">支付金额：{{ finalAmount }}元</p>
                  <p class="payment-time">请在5分钟内完成支付</p>
                </div>
              </div>
            </div>
            

          </div>
          
          <!-- 未登录状态 -->
          <div v-else class="login-prompt">
            <p>请先登录</p>
            <router-link to="/login" class="login-link">去登录</router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { useUserStore } from '../stores/userStore'

export default {
  name: 'CoinRecharge',
  data() {
    return {
      isMobile: false,
      mobileMenuActive: false,
      selectedOption: 1,
      rechargeOptions: [
        { id: 1, amount: 10, coins: 100 },
        { id: 2, amount: 50, coins: 500 },
        { id: 3, amount: 100, coins: 1000 },
        { id: 4, amount: 500, coins: 5000 },
        { id: 5, amount: 1000, coins: 10000 }
      ],
      customAmount: '',
      customCoins: 0,
      paymentQrCode: ''
    }
  },
  computed: {
    user() {
      return this.userStore.user
    },
    finalAmount() {
      if (this.customAmount) {
        return this.customAmount;
      }
      const option = this.rechargeOptions.find(opt => opt.id === this.selectedOption);
      return option ? option.amount : 0;
    },
    qrCodeUrl() {
      // 从后端获取付款二维码图片，如果没有则使用默认图片
      if (this.paymentQrCode) {
        return this.paymentQrCode;
      }
      // 生成模拟二维码作为默认值
      return `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=payment%20QR%20code%2C%20for%20coin%20recharge%2C%20${this.finalAmount}%20yuan&image_size=square`;
    }
  },
  setup() {
    const userStore = useUserStore()
    return { userStore }
  },
  mounted() {
    // 检查登录状态
    this.userStore.checkLogin()
    // 获取用户真实金币数量
    if (this.user) {
      this.userStore.fetchUserCoins()
    }
    
    // 获取付款二维码
    this.fetchPaymentQrCode();
    
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
      this.userStore.logout()
      this.$router.push('/login')
    },
    selectOption(id) {
      this.selectedOption = id;
      this.customAmount = '';
      this.customCoins = 0;
    },
    updateCustomCoins() {
      if (this.customAmount) {
        this.customCoins = this.customAmount * 10;
        this.selectedOption = null;
      } else {
        this.customCoins = 0;
        this.selectedOption = 1;
      }
    },
    async fetchPaymentQrCode() {
      try {
        const response = await fetch('/api/website-settings/contact');
        if (response.ok) {
          const setting = await response.json();
          if (setting && setting.paymentQrCode) {
            this.paymentQrCode = setting.paymentQrCode;
          }
        }
      } catch (error) {
        console.error('获取付款二维码失败:', error);
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

/* 充值规则 */
.recharge-rules {
  margin-bottom: 20px;
  padding: 15px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.recharge-rules h3 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 16px;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 8px;
}

.rules-list {
  margin: 0;
  padding-left: 20px;
}

.rules-list li {
  margin-bottom: 8px;
  color: #666;
  line-height: 1.4;
}

.warm-tip {
  margin-top: 15px;
  padding: 10px;
  background-color: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 4px;
  color: #856404;
  font-size: 14px;
  line-height: 1.4;
}

/* 充值选项 */
.recharge-options {
  margin-bottom: 20px;
  padding: 15px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.recharge-options h3 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 16px;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 8px;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  margin-bottom: 15px;
}

.option-item {
  padding: 15px;
  background-color: white;
  border: 2px solid #e0e0e0;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.option-item:hover {
  border-color: #007bff;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.2);
}

.option-item.active {
  border-color: #007bff;
  background-color: #e3f2fd;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.2);
}

.option-amount {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.option-coins {
  font-size: 14px;
  color: #666;
}

/* 自定义金额 */
.custom-amount {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 15px;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.custom-amount label {
  font-weight: bold;
  color: #333;
  min-width: 100px;
}

.custom-amount input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
  max-width: 200px;
}

.custom-amount input:focus {
  outline: none;
  border-color: #80bdff;
  box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
}

.custom-coins {
  font-weight: bold;
  color: #007bff;
}

/* 支付二维码 */
.payment-qr {
  margin-bottom: 20px;
  padding: 15px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.payment-qr h3 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 16px;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 8px;
}

.qr-container {
  display: flex;
  align-items: center;
  gap: 20px;
  justify-content: center;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.qr-code {
  width: 180px;
  height: 180px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 10px;
  background-color: white;
}

.qr-info {
  text-align: center;
}

.qr-info p {
  margin: 8px 0;
  color: #666;
}

.payment-amount {
  font-size: 18px;
  font-weight: bold;
  color: #dc3545;
}

.payment-time {
  font-size: 14px;
  color: #ffc107;
}

/* 支付说明 */
.payment-instructions {
  margin-bottom: 20px;
  padding: 15px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.payment-instructions h3 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 16px;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 8px;
}

.instructions-content h4 {
  margin: 12px 0 8px 0;
  color: #333;
  font-size: 14px;
  font-weight: bold;
}

.instructions-content ol {
  margin: 0 0 12px 0;
  padding-left: 20px;
}

.instructions-content li {
  margin-bottom: 5px;
  color: #666;
  font-size: 14px;
}

.instructions-content p {
  margin: 5px 0;
  color: #666;
  font-size: 14px;
}

/* 客服联系 */
.customer-service {
  padding: 15px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.customer-service h3 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 16px;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 8px;
}

.customer-service p {
  margin: 8px 0;
  color: #666;
  font-size: 14px;
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
  
  /* 充值选项 */
  .options-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
  
  .option-item {
    padding: 12px;
  }
  
  /* 自定义金额 */
  .custom-amount {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  .custom-amount input {
    width: 100%;
    max-width: none;
  }
  
  /* 支付二维码 */
  .qr-container {
    flex-direction: column;
    gap: 15px;
    padding: 15px;
  }
  
  .qr-code {
    width: 150px;
    height: 150px;
  }
  
  /* 信息部分 */
  .info-section {
    padding: 15px;
  }
  
  .section-title {
    font-size: 18px;
  }
}

@media (max-width: 360px) {
  /* 金币/积分/统计 */
  .user-stats {
    grid-template-columns: 1fr;
  }
  
  /* 充值选项 */
  .options-grid {
    grid-template-columns: 1fr;
  }
  
  /* 支付二维码 */
  .qr-code {
    width: 120px;
    height: 120px;
  }
  
  /* 用户中心内容 */
  .user-center-content {
    padding: 15px;
  }
}
</style>
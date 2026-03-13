<template>
  <div class="admin-container">
    <div class="admin-layout">
      <!-- 左侧菜单栏 -->
      <div class="admin-sidebar">
        <h2>管理后台</h2>
        <ul class="sidebar-menu">
          <li @click="navigateToMainAdmin">
            <span class="menu-icon">📋</span>
            <span>服务管理</span>
          </li>
          <li class="active">
            <span class="menu-icon">⚙️</span>
            <span>网站管理</span>
          </li>
          <li @click="activeTab = 'siteMechanism'" :class="{ active: activeTab === 'siteMechanism' }" style="padding-left: 40px;">
            <span>网站机制</span>
          </li>
          <li @click="activeTab = 'contact'" :class="{ active: activeTab === 'contact' }" style="padding-left: 40px;">
            <span>联系我们</span>
          </li>
          <li @click="activeTab = 'member'" :class="{ active: activeTab === 'member' }" style="padding-left: 40px;">
            <span>会员与广告服务</span>
          </li>
          <li @click="activeTab = 'about'" :class="{ active: activeTab === 'about' }" style="padding-left: 40px;">
            <span>网站简介</span>
          </li>
          <li @click="logout" class="logout-link">
            <span class="menu-icon">🚪</span>
            <span>退出登录</span>
          </li>
        </ul>
      </div>
      
      <!-- 右侧内容区 -->
      <div class="admin-content">
        <h1>网站管理</h1>
        
        <!-- 网站机制管理 -->
        <div v-if="activeTab === 'siteMechanism'" class="admin-section">
          <h2>网站机制管理</h2>
          <div class="card">
            <h3>网站机制内容</h3>
            <div class="form-item">
              <label>机制标题</label>
              <input type="text" v-model="siteMechanism.title">
            </div>
            <div class="form-item">
              <label>机制内容</label>
              <textarea v-model="siteMechanism.content" rows="10"></textarea>
            </div>
            <div class="form-actions">
              <button @click="saveSiteMechanism" class="save-btn">保存</button>
            </div>
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

<script>
import axios from 'axios'

export default {
  name: 'AdminSite',
  data() {
    return {
      activeTab: 'siteMechanism',
      siteMechanism: {
        title: '',
        content: ''
      },
      contact: {
        companyName: '',
        phone: '',
        email: '',
        address: '',
        content: ''
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
    this.fetchData()
  },
  methods: {
    async fetchData() {
      try {
        // 从后端API获取数据
        const response = await axios.get('/api/website-settings')
        const settings = response.data
        
        // 处理获取到的设置数据
        settings.forEach(setting => {
          switch (setting.type) {
            case 'siteMechanism':
              this.siteMechanism = {
                title: setting.title,
                content: setting.content
              }
              break
            case 'contact':
              this.contact = {
                companyName: setting.title,
                content: setting.content
              }
              break
            case 'member':
              this.member = {
                title: setting.title,
                content: setting.content
              }
              break
            case 'ad':
              this.ad = {
                title: setting.title,
                content: setting.content
              }
              break
            case 'about':
              this.about = {
                title: setting.title,
                content: setting.content
              }
              break
          }
        })
      } catch (error) {
        console.error('获取数据失败:', error)
        // 如果获取失败，使用默认数据
        this.siteMechanism = {
          title: '网站机制',
          content: '本网站是一个同城服务平台，为用户提供房屋租售、二手物品转让、车辆买卖和生活服务等信息。用户可以在平台上发布信息、浏览信息，管理员负责审核和管理内容。'
        }
        
        this.contact = {
          companyName: '日开智能技术有限公司',
          content: '如果您有任何问题或建议，欢迎随时联系我们。我们将竭诚为您服务。'
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
      }
    },
    
    async saveSiteMechanism() {
      try {
        await axios.post('/api/website-settings', {
          type: 'siteMechanism',
          title: this.siteMechanism.title,
          content: this.siteMechanism.content
        })
        alert('网站机制保存成功')
      } catch (error) {
        console.error('保存失败:', error)
        alert('保存失败，请重试')
      }
    },
    
    async saveContact() {
      try {
        await axios.post('/api/website-settings', {
          type: 'contact',
          title: this.contact.companyName,
          content: this.contact.content
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
    
    navigateToMainAdmin() {
      this.$router.push('/admin')
    },
    
    logout() {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      this.$router.push('/login')
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

.tab-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e0e0e0;
}

.tab-buttons button {
  padding: 8px 15px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
  margin-right: 10px;
}

.tab-buttons button:hover {
  background-color: #f8f9fa;
}

.tab-buttons button.active {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

.admin-section {
  margin-top: 30px;
}

.admin-section h2 {
  margin-bottom: 20px;
  color: #333;
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
}

.save-btn:hover {
  background-color: #218838;
}
</style>
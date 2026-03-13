<template>
  <div class="admin-section">
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
</template>

<script>
import axios from 'axios'

export default {
  name: 'MemberAdManagement',
  data() {
    return {
      member: {
        title: '会员服务',
        content: '成为我们的会员，您可以享受更多特权，包括优先发布信息、信息置顶、免费推广等服务。'
      },
      ad: {
        title: '广告服务',
        content: '我们提供多种广告投放方案，帮助您的企业或产品获得更多曝光。如有需要，请联系我们的客服团队。'
      }
    }
  },
  mounted() {
    this.fetchWebsiteSettings()
  },
  methods: {
    async fetchWebsiteSettings() {
      try {
        const response = await axios.get('/api/website-settings')
        const settings = response.data
        
        // 检查settings是否为null或undefined
        if (settings && Array.isArray(settings)) {
          settings.forEach(setting => {
            // 检查setting是否为null或undefined
            if (setting && typeof setting === 'object') {
              const type = setting.type
              if (type === 'member') {
                this.member = {
                  title: setting.title || '',
                  content: setting.content || ''
                }
              } else if (type === 'ad') {
                this.ad = {
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
  margin-right: 10px;
}

.save-btn:hover {
  background-color: #218838;
}
</style>
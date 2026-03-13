<template>
  <div class="admin-section">
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
</template>

<script>
import axios from 'axios'

export default {
  name: 'AboutManagement',
  data() {
    return {
      about: {
        title: '网站简介',
        content: '本网站成立于2026年，是一个专注于同城服务的平台。我们致力于为用户提供便捷、高效的信息发布和获取服务，连接本地社区，促进资源共享。'
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
              if (type === 'about') {
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
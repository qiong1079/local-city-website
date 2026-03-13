<template>
  <section>
    <div class="container">
      <h1>联系我们</h1>
      <div class="content">
        <div class="contact-item">
          <strong>公司名称：</strong>{{ contact.companyName }}
        </div>
        <div class="contact-item">
          <strong>联系内容：</strong>{{ contact.content }}
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Contact',
  data() {
    return {
      contact: {
        companyName: '日开智能技术有限公司',
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
        const response = await axios.get('/api/website-settings/contact')
        if (response.data) {
          this.contact = {
            companyName: response.data.title,
            content: response.data.content
          }
        }
      } catch (error) {
        console.error('获取数据失败:', error)
      }
    }
  }
}
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e0e0e0;
}

.content {
  line-height: 1.6;
  color: #666;
}

.contact-item {
  margin-bottom: 15px;
}
</style>
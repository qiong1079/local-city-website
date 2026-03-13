<template>
  <section>
    <div class="container">
      <h1>会员与广告服务</h1>
      
      <div class="service-section">
        <h2>{{ member.title }}</h2>
        <div class="content">
          {{ member.content }}
        </div>
      </div>
      
      <div class="service-section">
        <h2>{{ ad.title }}</h2>
        <div class="content">
          {{ ad.content }}
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios'

export default {
  name: 'MemberAd',
  data() {
    return {
      member: {
        title: '会员服务',
        content: ''
      },
      ad: {
        title: '广告服务',
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
        // 获取会员服务信息
        const memberResponse = await axios.get('/api/website-settings/member')
        if (memberResponse.data) {
          this.member = {
            title: memberResponse.data.title,
            content: memberResponse.data.content
          }
        }
        
        // 获取广告服务信息
        const adResponse = await axios.get('/api/website-settings/ad')
        if (adResponse.data) {
          this.ad = {
            title: adResponse.data.title,
            content: adResponse.data.content
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
  margin-bottom: 30px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e0e0e0;
}

h2 {
  color: #333;
  margin-bottom: 15px;
  margin-top: 30px;
}

.service-section {
  margin-bottom: 40px;
}

.content {
  line-height: 1.6;
  color: #666;
}
</style>
<template>
  <section>
    <div class="container">
      <h1>{{ siteMechanism.title }}</h1>
      <div class="content">
        {{ siteMechanism.content }}
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios'

export default {
  name: 'SiteMechanism',
  data() {
    return {
      siteMechanism: {
        title: '网站机制',
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
        const response = await axios.get('/api/website-settings/siteMechanism')
        if (response.data) {
          this.siteMechanism = {
            title: response.data.title,
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
</style>
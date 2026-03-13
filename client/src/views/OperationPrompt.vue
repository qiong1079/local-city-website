<template>
  <section class="operation-prompt-section">
    <div class="container">
      <div class="prompt-card">
        <!-- 提示图标 -->
        <div class="prompt-icon" :class="iconClass">{{ icon }}</div>
        
        <!-- 提示标题 -->
        <h1 class="prompt-title">{{ title }}</h1>
        
        <!-- 提示内容 -->
        <p class="prompt-message">{{ message }}</p>
        
        <!-- 运行时间 -->
        <p class="prompt-time">{{ currentTime }}</p>
        
        <!-- 跳转链接 -->
        <div class="prompt-actions">
          <router-link :to="redirectUrl" class="btn btn-primary">{{ redirectText }}</router-link>
          <button v-if="showBack" @click="goBack" class="btn btn-secondary">返回上一页</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'OperationPrompt',
  data() {
    return {
      currentTime: new Date().toLocaleString('zh-CN'),
      title: '操作成功',
      message: '您的操作已成功完成',
      icon: '✓',
      iconClass: 'success',
      redirectUrl: '/',
      redirectText: '返回首页',
      showBack: true
    }
  },
  mounted() {
    // 从路由参数中获取提示信息
    if (this.$route.query.type) {
      this.setPromptType(this.$route.query.type)
    }
    if (this.$route.query.message) {
      this.message = this.$route.query.message
    }
    if (this.$route.query.redirect) {
      this.redirectUrl = this.$route.query.redirect
    }
    if (this.$route.query.redirectText) {
      this.redirectText = this.$route.query.redirectText
    }
    
    // 自动更新时间
    setInterval(() => {
      this.currentTime = new Date().toLocaleString('zh-CN')
    }, 1000)
  },
  methods: {
    setPromptType(type) {
      switch (type) {
        case 'success':
          this.title = '操作成功'
          this.icon = '✓'
          this.iconClass = 'success'
          break
        case 'error':
          this.title = '操作失败'
          this.icon = '×'
          this.iconClass = 'error'
          break
        case 'warning':
          this.title = '警告'
          this.icon = '!'
          this.iconClass = 'warning'
          break
        case 'info':
          this.title = '提示'
          this.icon = 'i'
          this.iconClass = 'info'
          break
        default:
          this.title = '操作成功'
          this.icon = '✓'
          this.iconClass = 'success'
      }
    },
    goBack() {
      this.$router.back()
    }
  }
}
</script>

<style scoped>
/* 操作提示页面 */
.operation-prompt-section {
  padding: 80px 0;
  background-color: #f8f9fa;
  min-height: 70vh;
  display: flex;
  align-items: center;
}

/* 提示卡片 */
.prompt-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 40px;
  text-align: center;
  max-width: 500px;
  margin: 0 auto;
}

/* 提示图标 */
.prompt-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  font-weight: bold;
  margin: 0 auto 20px;
}

.prompt-icon.success {
  background-color: #d4edda;
  color: #155724;
}

.prompt-icon.error {
  background-color: #f8d7da;
  color: #721c24;
}

.prompt-icon.warning {
  background-color: #fff3cd;
  color: #856404;
}

.prompt-icon.info {
  background-color: #d1ecf1;
  color: #0c5460;
}

/* 提示标题 */
.prompt-title {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 24px;
}

/* 提示内容 */
.prompt-message {
  margin: 0 0 30px 0;
  color: #666;
  font-size: 16px;
  line-height: 1.5;
}

/* 运行时间 */
.prompt-time {
  margin: 0 0 30px 0;
  color: #999;
  font-size: 14px;
}

/* 操作按钮 */
.prompt-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.btn {
  padding: 10px 30px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  text-decoration: none;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0069d9;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #5a6268;
}

/* 响应式设计 */
@media (max-width: 768px) {
  /* 操作提示页面 */
  .operation-prompt-section {
    padding: 40px 0;
  }
  
  /* 提示卡片 */
  .prompt-card {
    padding: 30px 20px;
  }
  
  /* 提示图标 */
  .prompt-icon {
    width: 60px;
    height: 60px;
    font-size: 30px;
  }
  
  /* 提示标题 */
  .prompt-title {
    font-size: 20px;
  }
  
  /* 操作按钮 */
  .prompt-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .btn {
    width: 100%;
    max-width: 200px;
  }
}

@media (max-width: 360px) {
  /* 提示卡片 */
  .prompt-card {
    padding: 20px 15px;
  }
  
  /* 提示图标 */
  .prompt-icon {
    width: 50px;
    height: 50px;
    font-size: 24px;
  }
  
  /* 提示标题 */
  .prompt-title {
    font-size: 18px;
  }
  
  /* 提示内容 */
  .prompt-message {
    font-size: 14px;
  }
}
</style>
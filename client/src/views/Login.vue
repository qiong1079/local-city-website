<template>
  <section class="login-section">
    <div class="container">
      <!-- 主要内容 -->
      <div class="login-content">
        <!-- 左侧图片 -->
        <div class="login-image">
          <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cartoon%20characters%20for%20local%20city%20website%2C%20friendly%2C%20colorful%2C%20showing%20various%20services%20like%20housing%2C%20shopping%2C%20jobs&image_size=landscape_16_9" alt="服务展示">
        </div>
        
        <!-- 右侧登录表单 -->
        <div class="login-form">
          <h2 class="form-title">用户登录</h2>
          
          <form @submit.prevent="login">
            <div class="form-group">
              <label class="form-label">账号</label>
              <input type="text" v-model="form.username" placeholder="账号/邮箱/手机" class="form-input">
            </div>
            
            <div class="form-group">
              <label class="form-label">密码</label>
              <input type="password" v-model="form.password" placeholder="密码" class="form-input">
            </div>
            
            <div class="remember-me">
              <input type="checkbox" v-model="form.remember" id="remember">
              <label for="remember">下次自动登录</label>
            </div>
            
            <div class="form-actions">
              <button type="submit" class="login-btn">立即登录</button>
            </div>
            
            <div class="form-links">
              <router-link to="/register">免费注册</router-link>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Login',
  data() {
    return {
      form: {
        username: '',
        password: '',
        remember: false
      }
    }
  },
  methods: {
    async login() {
      // 表单验证
      if (!this.form.username) {
        alert('请输入账号');
        return;
      }
      if (!this.form.password) {
        alert('请输入密码');
        return;
      }
      
      try {
        // 发送登录请求到后端API
        const response = await axios.post('/api/login/user', {
          username: this.form.username,
          password: this.form.password
        });
        
        // 保存用户信息到localStorage
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // 触发storage事件，通知App组件更新用户信息
        window.dispatchEvent(new Event('storage'));
        
        alert(response.data.message);
        this.$router.push('/');
      } catch (error) {
        alert(error.response?.data?.message || '登录失败，请重试');
      }
    }
  }
}
</script>

<style scoped>
/* 登录页面 */
.login-section {
  padding: 60px 0;
  background-color: #f8f9fa;
}

/* 登录内容 */
.login-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 40px;
}

/* 左侧图片 */
.login-image {
  flex: 1;
  text-align: center;
  margin-right: 40px;
}

.login-image img {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
}

/* 右侧登录表单 */
.login-form {
  flex: 0 0 300px;
}

.form-title {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  font-size: 24px;
}

/* 表单组 */
.form-group {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.form-label {
  width: 60px;
  text-align: right;
  margin-right: 10px;
  font-size: 14px;
  color: #666;
  white-space: nowrap;
}

.form-input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #80bdff;
  box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
}

/* 记住我 */
.remember-me {
  margin-bottom: 20px;
  margin-left: 70px;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  color: #666;
}

/* 表单操作 */
.form-actions {
  text-align: center;
  margin-bottom: 15px;
}

.login-btn {
  width: 200px;
  background-color: #007bff;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.login-btn:hover {
  background-color: #0069d9;
}

/* 表单链接 */
.form-links {
  display: flex;
  justify-content: flex-end;
  font-size: 14px;
  margin-left: 70px;
}

.form-links a,
.form-links router-link {
  color: #007bff;
  text-decoration: none;
}

.form-links a:hover,
.form-links router-link:hover {
  text-decoration: underline;
}

/* 响应式设计 */
@media (max-width: 768px) {
  /* 登录页面 */
  .login-section {
    padding: 40px 0;
  }
  
  /* 登录内容 */
  .login-content {
    flex-direction: column;
    padding: 20px;
  }
  
  /* 左侧图片 */
  .login-image {
    margin-right: 0;
    margin-bottom: 30px;
  }
  
  .login-image img {
    max-width: 200px;
  }
  
  /* 右侧登录表单 */
  .login-form {
    flex: 1;
    width: 100%;
    max-width: 300px;
  }
  
  /* 表单组 */
  .form-group {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  .form-label {
    width: 100%;
    text-align: left;
    margin-right: 0;
  }
  
  .form-input {
    width: 100%;
    box-sizing: border-box;
  }
  
  /* 记住我 */
  .remember-me {
    margin-left: 0;
  }
  
  /* 登录按钮 */
  .login-btn {
    width: 100%;
    padding: 15px;
    font-size: 18px;
  }
  
  /* 表单链接 */
  .form-links {
    margin-left: 0;
    justify-content: space-between;
  }
}

@media (max-width: 360px) {
  /* 登录内容 */
  .login-content {
    padding: 15px;
  }
  
  /* 左侧图片 */
  .login-image img {
    max-width: 150px;
  }
  
  /* 表单组 */
  .form-group {
    margin-bottom: 15px;
  }
  
  .form-input {
    padding: 8px;
  }
  
  /* 登录按钮 */
  .login-btn {
    padding: 12px;
    font-size: 16px;
  }
}
</style>
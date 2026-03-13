<template>
  <section>
    <div class="container">
      <!-- 注册步骤指示器 -->
      <div style="margin: 30px 0;">
        <div style="display: flex; align-items: center;">
          <div style="background-color: #dc3545; color: white; padding: 10px 20px; border-radius: 4px 0 0 4px;">
            1. 选择注册类型
          </div>
          <div style="flex: 1; height: 2px; background-color: #e0e0e0;"></div>
          <div style="background-color: #f8f9fa; color: #666; padding: 10px 20px;">
            2. 填写注册信息
          </div>
          <div style="flex: 1; height: 2px; background-color: #e0e0e0;"></div>
          <div style="background-color: #f8f9fa; color: #666; padding: 10px 20px; border-radius: 0 4px 4px 0;">
            3. 登录会员中心
          </div>
        </div>
      </div>
      
      <!-- 注册类型选择 -->
      <div style="display: flex; justify-content: center; gap: 40px; margin: 50px 0;">
        <!-- 个人会员 -->
        <div style="border: 1px solid #e0e0e0; padding: 30px; width: 300px; text-align: center; cursor: pointer; transition: all 0.3s ease; border-radius: 8px;">
          <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=user%20icon%2C%20person%20avatar%2C%20simple%2C%20orange%20color&image_size=square" alt="个人会员" style="width: 80px; height: 80px; margin-bottom: 20px;">
          <h3 style="margin-bottom: 10px;">注册个人会员</h3>
          <router-link to="/register/personal" style="color: #dc3545;">>></router-link>
        </div>
        
        <!-- 机构会员 -->
        <div style="border: 1px solid #e0e0e0; padding: 30px; width: 300px; text-align: center; cursor: pointer; transition: all 0.3s ease; border-radius: 8px;">
          <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=building%20icon%2C%20house%20icon%2C%20simple%2C%20blue%20color&image_size=square" alt="机构会员" style="width: 80px; height: 80px; margin-bottom: 20px;">
          <h3 style="margin-bottom: 10px;">注册机构会员</h3>
          <router-link to="/register/organization" style="color: #dc3545;">>></router-link>
        </div>
      </div>
      
      <!-- 登录链接 -->
      <div style="text-align: center; margin: 30px 0;">
        <router-link to="/login" style="color: #666;">已有账号？去登录</router-link>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Register'
}
</script>

<style scoped>
div:hover {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  transform: translateY(-5px);
}

a {
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>
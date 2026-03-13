<template>
  <section class="register-section">
    <div class="container">
      <!-- 注册步骤指示器 -->
      <div class="step-indicator">
        <div class="step">
          <div class="step-number">1</div>
          <div class="step-text">选择注册类型</div>
        </div>
        <div class="step-line active"></div>
        <div class="step active">
          <div class="step-number">2</div>
          <div class="step-text">注册机构会员</div>
        </div>
        <div class="step-line"></div>
        <div class="step">
          <div class="step-number">3</div>
          <div class="step-text">登录会员中心</div>
        </div>
      </div>
      
      <!-- 注册表单 -->
      <div class="register-form">
        <h2 class="form-title">账号注册</h2>
        
        <form @submit.prevent="register">
          <!-- 账号注册部分 -->
          <div class="form-section">
            <div class="section-title">
              <h3>账号注册</h3>
            </div>
            
            <div class="form-group">
              <label class="form-label">* 用户名:</label>
              <input type="text" v-model="form.username" placeholder="请输入用户名" class="form-input">
            </div>
            
            <div class="form-group">
              <label class="form-label">* 电子邮箱:</label>
              <input type="email" v-model="form.email" placeholder="请输入电子邮箱" class="form-input">
            </div>
            
            <div class="form-group">
              <label class="form-label">* 登录密码:</label>
              <input type="password" v-model="form.password" @input="checkPasswordStrength" placeholder="请输入登录密码" class="form-input">
            </div>
            
            <!-- 密码强度指示器 -->
            <div class="password-strength">
              <span>弱</span>
              <div class="strength-bar">
                <div :style="{ width: passwordStrength, backgroundColor: passwordColor }" class="strength-fill"></div>
              </div>
              <span>强</span>
            </div>
            
            <div class="form-group">
              <label class="form-label">* 确认密码:</label>
              <input type="password" v-model="form.confirmPassword" placeholder="请确认密码" class="form-input">
            </div>
            
            <!-- 验证码 -->
            <div class="form-group">
              <label class="form-label">* 验证码:</label>
              <div class="captcha-container">
                <input type="text" v-model="form.captcha" placeholder="请输入验证码" class="form-input captcha-input">
                <div class="captcha-image" @click="refreshCaptcha">
                  {{ captchaCode }}
                </div>
              </div>
            </div>
          </div>
          
          <!-- 机构资料部分 -->
          <div class="form-section">
            <div class="section-title">
              <h3>机构资料</h3>
            </div>
            
            <div class="form-group">
              <label class="form-label">* 机构名称:</label>
              <input type="text" v-model="form.organizationName" placeholder="请输入机构名称" class="form-input">
            </div>
            
            <div class="form-group">
              <label class="form-label">* 所属地区:</label>
              <select v-model="form.region" class="form-input">
                <option value="烟台市">烟台市</option>
                <option value="芝罘区">芝罘区</option>
                <option value="福山区">福山区</option>
                <option value="莱山区">莱山区</option>
                <option value="牟平区">牟平区</option>
                <option value="开发区">开发区</option>
                <option value="高新区">高新区</option>
                <option value="蓬莱区">蓬莱区</option>
                <option value="龙口市">龙口市</option>
                <option value="莱阳市">莱阳市</option>
                <option value="莱州市">莱州市</option>
                <option value="招远市">招远市</option>
                <option value="栖霞市">栖霞市</option>
                <option value="海阳市">海阳市</option>
                <option value="长岛县">长岛县</option>
              </select>
            </div>
            
            <div class="form-group">
              <label class="form-label">* 所属行业:</label>
              <select v-model="form.industry" class="form-input">
                <option value="">请选择所属分类</option>
                <option value="信息技术">信息技术</option>
                <option value="金融服务">金融服务</option>
                <option value="房地产">房地产</option>
                <option value="教育培训">教育培训</option>
                <option value="医疗健康">医疗健康</option>
                <option value="餐饮娱乐">餐饮娱乐</option>
                <option value="零售批发">零售批发</option>
                <option value="制造加工">制造加工</option>
                <option value="物流运输">物流运输</option>
                <option value="其他行业">其他行业</option>
              </select>
            </div>
            
            <div class="form-group">
              <label class="form-label">* 机构简介:</label>
              <textarea v-model="form.organizationDesc" placeholder="请输入机构简介" class="form-textarea"></textarea>
            </div>
          </div>
          
          <!-- 联系人信息部分 -->
          <div class="form-section">
            <div class="section-title">
              <h3>联系人信息</h3>
            </div>
            
            <div class="form-group">
              <label class="form-label">* 联系人:</label>
              <input type="text" v-model="form.contactPerson" placeholder="请输入联系人" class="form-input">
            </div>
            
            <div class="form-group">
              <label class="form-label">QQ号:</label>
              <input type="text" v-model="form.qq" placeholder="请输入QQ号" class="form-input">
            </div>
            
            <div class="form-group">
              <label class="form-label">* 固定电话:</label>
              <input type="text" v-model="form.phone" placeholder="请输入固定电话" class="form-input">
            </div>
            
            <div class="form-group">
              <label class="form-label">* 联系地址:</label>
              <input type="text" v-model="form.address" placeholder="请输入联系地址" class="form-input">
            </div>
          </div>
          
          <!-- 同意协议 -->
          <div class="agreement">
            <input type="checkbox" v-model="form.agreed" id="agreement">
            <label for="agreement">我已阅读并同意 <a href="#">《用户服务协议》</a></label>
          </div>
          
          <!-- 提交按钮 -->
          <div class="form-actions">
            <button type="submit" class="submit-btn">同意协议，完成注册</button>
          </div>
        </form>
        
        <!-- 协议内容 -->
        <div class="agreement-content">
          <p>2. 用户应当在适当的栏目或地区发布信息，所发布信息内容必须真实可靠，不得违反烟台日开智能技术有限公司对发布信息的禁止规定。用户对其自行发表、上传或传送的内容负全部责任。</p>
          <p>3. 用户不得发布含有下列内容之一的信息：</p>
          <p>（1）反对宪法所确定的基本原则的；</p>
          <p>（2）危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的；</p>
          <p>（3）损害国家荣誉和利益的；</p>
          <p>（4）煽动民族仇恨、民族歧视，破坏民族团结的；</p>
          <p>（5）破坏国家宗教政策，宣扬邪教和封建迷信的；</p>
          <p>（6）散布谣言，扰乱社会秩序，破坏社会稳定的；</p>
          <p>（7）散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的；</p>
          <p>（8）侮辱或者诽谤他人，侵害他人合法权益的；</p>
          <p>（9）含有法律、行政法规禁止的其他内容的。</p>
          <p>3. 遵守中华人民共和国相关法律法规，包括但不限于《中华人民共和国计算机信息系统安全保护条例》、《计算机软件保护条例》、《最高人民法院关于审理利用信息网络侵害人身权益民事纠纷案件适用法律若干问题的规定》等。</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios';

export default {
  name: 'RegisterOrganization',
  data() {
    return {
      form: {
        // 账号注册
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        captcha: '',
        agreed: false,
        // 机构资料
        organizationName: '',
        region: '烟台市', // 默认选择烟台市
        industry: '',
        organizationDesc: '',
        // 联系人信息
        contactPerson: '',
        qq: '',
        phone: '',
        address: ''
      },
      passwordStrength: '0%',
      passwordColor: '#dc3545',
      captchaCode: ''
    }
  },
  mounted() {
    this.refreshCaptcha();
  },
  methods: {
    checkPasswordStrength() {
      const password = this.form.password;
      let strength = 0;
      
      if (password.length >= 6) strength += 25;
      if (password.length >= 10) strength += 25;
      if (/[A-Z]/.test(password)) strength += 25;
      if (/[0-9]/.test(password)) strength += 25;
      if (/[^A-Za-z0-9]/.test(password)) strength += 25;
      
      this.passwordStrength = Math.min(strength, 100) + '%';
      
      if (strength < 50) {
        this.passwordColor = '#dc3545';
      } else if (strength < 75) {
        this.passwordColor = '#ffc107';
      } else {
        this.passwordColor = '#28a745';
      }
    },
    refreshCaptcha() {
      // 生成4位随机验证码
      const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      let code = '';
      for (let i = 0; i < 4; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      this.captchaCode = code;
    },
    async register() {
      // 表单验证
      // 账号注册部分
      if (!this.form.username) {
        alert('请输入用户名');
        return;
      }
      if (!this.form.email) {
        alert('请输入电子邮箱');
        return;
      }
      if (!this.form.password) {
        alert('请输入登录密码');
        return;
      }
      if (this.form.password !== this.form.confirmPassword) {
        alert('两次输入的密码不一致');
        return;
      }
      if (!this.form.captcha) {
        alert('请输入验证码');
        return;
      }
      if (this.form.captcha.toLowerCase() !== this.captchaCode.toLowerCase()) {
        alert('验证码错误');
        return;
      }
      if (!this.form.agreed) {
        alert('请阅读并同意用户服务协议');
        return;
      }
      
      // 机构资料部分
      if (!this.form.organizationName) {
        alert('请输入机构名称');
        return;
      }
      if (!this.form.region) {
        alert('请选择所属地区');
        return;
      }
      if (!this.form.industry) {
        alert('请选择所属行业');
        return;
      }
      if (!this.form.organizationDesc) {
        alert('请输入机构简介');
        return;
      }
      
      // 联系人信息部分
      if (!this.form.contactPerson) {
        alert('请输入联系人');
        return;
      }
      if (!this.form.phone) {
        alert('请输入固定电话');
        return;
      }
      if (!this.form.address) {
        alert('请输入联系地址');
        return;
      }
      
      try {
        // 发送注册请求到后端API
        const response = await axios.post('/api/register/organization', {
          username: this.form.username,
          email: this.form.email,
          password: this.form.password,
          organizationName: this.form.organizationName,
          region: this.form.region,
          industry: this.form.industry,
          organizationDesc: this.form.organizationDesc,
          contactPerson: this.form.contactPerson,
          qq: this.form.qq,
          phone: this.form.phone,
          address: this.form.address
        });
        
        alert(response.data.message);
        this.$router.push('/login');
      } catch (error) {
        alert(error.response?.data?.message || '注册失败，请重试');
      }
    }
  }
}
</script>

<style scoped>
/* 注册页面 */
.register-section {
  padding: 40px 0;
}

/* 步骤指示器 */
.step-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.step-number {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #f8f9fa;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-bottom: 5px;
  transition: all 0.3s ease;
}

.step.active .step-number {
  background-color: #dc3545;
  color: white;
}

.step-text {
  font-size: 14px;
  color: #666;
}

.step.active .step-text {
  color: #dc3545;
  font-weight: bold;
}

.step-line {
  flex: 1;
  height: 2px;
  background-color: #e0e0e0;
  margin: 0 20px;
  transition: all 0.3s ease;
}

.step-line.active {
  background-color: #dc3545;
}

/* 注册表单 */
.register-form {
  max-width: 600px;
  margin: 0 auto;
  background-color: #f9f9f9;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-title {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

/* 表单部分 */
.form-section {
  margin-bottom: 30px;
}

.section-title {
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.section-title h3 {
  margin: 0;
  color: #333;
  font-size: 16px;
}

/* 表单组 */
.form-group {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.form-label {
  width: 120px;
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

.form-textarea {
  flex: 1;
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
  resize: vertical;
  min-height: 100px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-input:focus,
.form-textarea:focus,
select:focus {
  outline: none;
  border-color: #80bdff;
  box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
}

/* 密码强度 */
.password-strength {
  margin-left: 130px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.password-strength span {
  font-size: 12px;
  color: #666;
}

.strength-bar {
  flex: 1;
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  max-width: 150px;
}

.strength-fill {
  height: 100%;
  transition: width 0.3s ease, background-color 0.3s ease;
}

/* 验证码 */
.captcha-container {
  flex: 1;
  display: flex;
  gap: 10px;
}

.captcha-input {
  flex: 1;
}

.captcha-image {
  width: 100px;
  height: 40px;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  color: #333;
  cursor: pointer;
  transition: background-color 0.3s ease;
  letter-spacing: 2px;
}

.captcha-image:hover {
  background-color: #e0e0e0;
}

/* 同意协议 */
.agreement {
  margin: 20px 0;
  margin-left: 130px;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
}

.agreement a {
  color: #007bff;
  text-decoration: none;
}

.agreement a:hover {
  text-decoration: underline;
}

/* 表单操作 */
.form-actions {
  text-align: center;
  margin: 30px 0;
}

.submit-btn {
  background-color: #28a745;
  color: white;
  padding: 12px 40px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.submit-btn:hover {
  background-color: #218838;
}

/* 协议内容 */
.agreement-content {
  border: 1px solid #e0e0e0;
  padding: 15px;
  margin-top: 30px;
  max-height: 200px;
  overflow-y: auto;
  font-size: 12px;
  line-height: 1.5;
  background-color: #fff;
  border-radius: 4px;
}

.agreement-content p {
  margin: 0 0 10px 0;
  color: #666;
}

/* 响应式设计 */
@media (max-width: 768px) {
  /* 注册页面 */
  .register-section {
    padding: 20px 0;
  }
  
  /* 步骤指示器 */
  .step-indicator {
    flex-wrap: wrap;
    gap: 20px;
  }
  
  .step-line {
    display: none;
  }
  
  /* 注册表单 */
  .register-form {
    padding: 20px;
    margin: 0 10px;
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
  
  .form-input,
  .form-textarea {
    width: 100%;
    box-sizing: border-box;
  }
  
  /* 密码强度 */
  .password-strength {
    margin-left: 0;
    width: 100%;
  }
  
  /* 验证码 */
  .captcha-container {
    width: 100%;
  }
  
  .captcha-input {
    flex: 2;
  }
  
  .captcha-image {
    flex: 1;
  }
  
  /* 同意协议 */
  .agreement {
    margin-left: 0;
  }
  
  /* 提交按钮 */
  .submit-btn {
    width: 100%;
    padding: 15px;
    font-size: 18px;
  }
}

@media (max-width: 360px) {
  /* 注册表单 */
  .register-form {
    padding: 15px;
  }
  
  /* 表单组 */
  .form-group {
    margin-bottom: 15px;
  }
  
  .form-input,
  .form-textarea {
    padding: 8px;
  }
  
  /* 提交按钮 */
  .submit-btn {
    padding: 12px;
    font-size: 16px;
  }
}
</style>
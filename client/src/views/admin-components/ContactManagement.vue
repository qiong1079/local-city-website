<template>
  <div class="admin-section">
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
        <label>公司Logo</label>
        <input type="file" @change="handleLogoUpload" accept="image/*">
        <input type="text" v-model="contact.logoUrl" placeholder="输入Logo图片URL" style="margin-top: 10px;">
      </div>
      <div class="form-item">
        <label>ICP备案号</label>
        <input type="text" v-model="contact.icpNumber" placeholder="例如：鲁ICP备2026000376号">
      </div>
      <div class="form-item">
        <label>ICP备案号链接</label>
        <input type="text" v-model="contact.icpUrl" placeholder="例如：https://beian.miit.gov.cn/#/Integrated/index">
      </div>
      <div class="form-item">
        <label>付款二维码图片</label>
        <input type="file" @change="handlePaymentQrUpload" accept="image/*">
        <input type="text" v-model="contact.paymentQrCode" placeholder="输入付款二维码图片URL" style="margin-top: 10px;">
      </div>
      <div class="form-item">
        <label>联系内容</label>
        <textarea v-model="contact.content" rows="10"></textarea>
      </div>
      
      <div class="card" style="margin-top: 30px;">
        <h3>用户服务协议</h3>
        <div class="form-item">
          <label>协议标题</label>
          <input type="text" v-model="agreement.title">
        </div>
        <div class="form-item">
          <label>协议内容</label>
          <textarea v-model="agreement.content" rows="15"></textarea>
          <small style="color: #666; display: block; margin-top: 5px;">提示：可以使用HTML标签格式化协议内容，如 &lt;p&gt; 段落，&lt;br&gt; 换行等。</small>
        </div>
        <div class="form-actions">
          <button @click="saveAgreement" class="save-btn">保存用户协议</button>
        </div>
      </div>
      
      <div class="form-actions">
        <button @click="saveContact" class="save-btn">保存联系信息</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ContactManagement',
  data() {
    return {
      contact: {
        companyName: '日开智能技术有限公司',
        content: '如果您有任何问题或建议，欢迎随时联系我们。我们将竭诚为您服务。',
        phone: '',
        email: '',
        address: '',
        logoUrl: '',
        icpNumber: '',
        icpUrl: '',
        paymentQrCode: ''
      },
      agreement: {
        title: '会员服务协议',
        content: '<p>1. 欢迎您注册成为本网站会员，使用本网站提供的各项服务。</p><p>2. 用户应当在适当的栏目或地区发布信息，所发布信息内容必须真实可靠，不得违反烟台日开智能技术有限公司对发布信息的禁止规定。用户对其自行发表、上传或传送的内容负全部责任。</p><p>3. 用户不得发布含有下列内容之一的信息：</p><p>（1）反对宪法所确定的基本原则的；</p><p>（2）危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的；</p><p>（3）损害国家荣誉和利益的；</p><p>（4）煽动民族仇恨、民族歧视，破坏民族团结的；</p><p>（5）破坏国家宗教政策，宣扬邪教和封建迷信的；</p><p>（6）散布谣言，扰乱社会秩序，破坏社会稳定的；</p><p>（7）散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的；</p><p>（8）侮辱或者诽谤他人，侵害他人合法权益的；</p><p>（9）含有法律、行政法规禁止的其他内容的。</p><p>4. 遵守中华人民共和国相关法律法规，包括但不限于《中华人民共和国计算机信息系统安全保护条例》、《计算机软件保护条例》、《最高人民法院关于审理利用信息网络侵害人身权益民事纠纷案件适用法律若干问题的规定》等。</p>'
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
              if (type === 'contact') {
                this.contact = {
                  companyName: setting.title || '',
                  content: setting.content || '',
                  phone: setting.phone || '',
                  email: setting.email || '',
                  address: setting.address || '',
                  logoUrl: setting.logoUrl || '',
                  icpNumber: setting.icpNumber || '',
                  icpUrl: setting.icpUrl || '',
                  paymentQrCode: setting.paymentQrCode || ''
                }
              } else if (type === 'siteInfo') {
                this.agreement = {
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
    
    async saveContact() {
      try {
        await axios.post('/api/website-settings', {
          type: 'contact',
          title: this.contact.companyName,
          content: this.contact.content,
          phone: this.contact.phone,
          email: this.contact.email,
          address: this.contact.address,
          logoUrl: this.contact.logoUrl,
          icpNumber: this.contact.icpNumber,
          icpUrl: this.contact.icpUrl,
          paymentQrCode: this.contact.paymentQrCode
        })
        alert('联系我们信息保存成功')
      } catch (error) {
        console.error('保存失败:', error)
        alert('保存失败，请重试')
      }
    },
    
    async saveAgreement() {
      try {
        await axios.post('/api/website-settings', {
          type: 'siteInfo',
          title: this.agreement.title,
          content: this.agreement.content,
          companyName: '烟台日开智能技术有限公司', // 保持公司名不变
          phone: '13800138000',
          email: 'contact@example.com',
          address: '山东省烟台市',
          icpNumber: '鲁ICP备12345678号'
        })
        alert('用户服务协议保存成功')
      } catch (error) {
        console.error('保存失败:', error)
        alert('保存失败，请重试')
      }
    },
    
    // 文件上传相关方法
    handleLogoUpload(e) {
      const file = e.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          this.contact.logoUrl = event.target.result
        }
        reader.readAsDataURL(file)
      }
    },
    
    handlePaymentQrUpload(e) {
      const file = e.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          this.contact.paymentQrCode = event.target.result
        }
        reader.readAsDataURL(file)
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

input[type="file"] {
  width: 100%;
  padding: 8px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  box-sizing: border-box;
}
</style>
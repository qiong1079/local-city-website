<template>
  <section class="website-mechanism-section">
    <div class="container">
      <!-- 页面标题 -->
      <h1 class="page-title">网站机制与服务</h1>
      
      <!-- 会员套餐 -->
      <div class="section">
        <h2 class="section-title">会员套餐</h2>
        <div class="membership-grid">
          <div class="membership-card">
            <div class="card-header">
              <h3>普通会员</h3>
              <p class="price">免费</p>
            </div>
            <div class="card-body">
              <ul class="feature-list">
                <li>可发布普通信息</li>
                <li>每日限发3条信息</li>
                <li>信息展示7天</li>
                <li>基础客服支持</li>
              </ul>
              <button class="btn btn-primary">立即升级</button>
            </div>
          </div>
          
          <div class="membership-card featured">
            <div class="card-header">
              <h3>高级会员</h3>
              <p class="price">¥99/月</p>
            </div>
            <div class="card-body">
              <ul class="feature-list">
                <li>可发布置顶信息</li>
                <li>每日限发10条信息</li>
                <li>信息展示15天</li>
                <li>优先客服支持</li>
                <li>信息优先展示</li>
              </ul>
              <button class="btn btn-primary">立即升级</button>
            </div>
          </div>
          
          <div class="membership-card">
            <div class="card-header">
              <h3>企业会员</h3>
              <p class="price">¥199/月</p>
            </div>
            <div class="card-body">
              <ul class="feature-list">
                <li>可发布企业认证信息</li>
                <li>每日限发20条信息</li>
                <li>信息展示30天</li>
                <li>专属客服支持</li>
                <li>信息置顶展示</li>
                <li>企业认证标识</li>
              </ul>
              <button class="btn btn-primary">立即升级</button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 网站介绍 -->
      <div class="section">
        <h2 class="section-title">网站介绍</h2>
        <div class="website-intro">
          <p>本地同城网站是一个专注于本地生活服务的信息平台，致力于为用户提供房屋租售、二手物品转让、车辆买卖、生活服务等各类信息。</p>
          <p>我们的目标是打造一个安全、便捷、高效的本地信息交流平台，帮助用户快速找到所需信息，同时为商家提供展示和推广的机会。</p>
          <p>平台特点：</p>
          <ul>
            <li>信息真实可靠：所有信息经过严格审核</li>
            <li>操作简单便捷：发布信息只需几步即可完成</li>
            <li>服务贴心周到：专业客服团队随时为您解答疑问</li>
            <li>覆盖范围广泛：涵盖本地各类生活服务信息</li>
          </ul>
        </div>
      </div>
      
      <!-- 广告说明 -->
      <div class="section">
        <h2 class="section-title">广告说明</h2>
        <div class="advertisement-info">
          <p>为了更好地服务用户和商家，我们提供多种广告投放方式，帮助商家提高品牌知名度和产品曝光率。</p>
          
          <h3>广告投放类型：</h3>
          <div class="ad-types">
            <div class="ad-type">
              <h4>首页顶部横幅广告</h4>
              <p>位置：首页顶部，展示效果显著</p>
              <p>价格：¥500/周</p>
            </div>
            <div class="ad-type">
              <h4>分类页置顶广告</h4>
              <p>位置：各分类页面顶部</p>
              <p>价格：¥300/周</p>
            </div>
            <div class="ad-type">
              <h4>信息详情页侧边广告</h4>
              <p>位置：信息详情页右侧</p>
              <p>价格：¥200/周</p>
            </div>
          </div>
          
          <h3>广告投放流程：</h3>
          <ol>
            <li>联系客服，确定广告位置和投放时间</li>
            <li>提供广告素材（图片、文字等）</li>
            <li>支付广告费用</li>
            <li>广告上线</li>
            <li>广告效果监测</li>
          </ol>
          
          <p class="contact-ad">如有广告投放需求，请联系客服：<strong>400-123-4567</strong></p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'WebsiteMechanism'
}
</script>

<style scoped>
/* 网站机制页面 */
.website-mechanism-section {
  padding: 40px 0;
  background-color: #f8f9fa;
}

/* 页面标题 */
.page-title {
  margin: 0 0 40px 0;
  color: #333;
  font-size: 28px;
  text-align: center;
}

/* 通用章节样式 */
.section {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 30px;
  margin-bottom: 30px;
}

/* 章节标题 */
.section-title {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 20px;
  border-bottom: 2px solid #007bff;
  padding-bottom: 10px;
}

/* 会员套餐 */
.membership-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.membership-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.membership-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.membership-card.featured {
  border-color: #007bff;
  box-shadow: 0 0 20px rgba(0, 123, 255, 0.1);
}

.card-header {
  background-color: #f8f9fa;
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid #e0e0e0;
}

.membership-card.featured .card-header {
  background-color: #007bff;
  color: white;
}

.card-header h3 {
  margin: 0 0 10px 0;
  font-size: 18px;
}

.price {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
}

.card-body {
  padding: 20px;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0 0 20px 0;
}

.feature-list li {
  margin-bottom: 10px;
  padding-left: 20px;
  position: relative;
  color: #666;
}

.feature-list li:before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #28a745;
  font-weight: bold;
}

.btn {
  display: block;
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0069d9;
}

/* 网站介绍 */
.website-intro {
  color: #666;
  line-height: 1.6;
}

.website-intro p {
  margin-bottom: 15px;
}

.website-intro ul {
  margin: 15px 0;
  padding-left: 20px;
}

.website-intro li {
  margin-bottom: 10px;
}

/* 广告说明 */
.advertisement-info {
  color: #666;
  line-height: 1.6;
}

.advertisement-info p {
  margin-bottom: 15px;
}

.advertisement-info h3 {
  margin: 20px 0 15px 0;
  color: #333;
  font-size: 18px;
}

.ad-types {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin: 20px 0;
}

.ad-type {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 4px;
}

.ad-type h4 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 16px;
}

.advertisement-info ol {
  margin: 15px 0;
  padding-left: 20px;
}

.advertisement-info li {
  margin-bottom: 10px;
}

.contact-ad {
  margin-top: 20px;
  padding: 15px;
  background-color: #e3f2fd;
  border-radius: 4px;
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  /* 网站机制页面 */
  .website-mechanism-section {
    padding: 20px 0;
  }
  
  /* 页面标题 */
  .page-title {
    font-size: 24px;
    margin-bottom: 30px;
  }
  
  /* 通用章节样式 */
  .section {
    padding: 20px;
  }
  
  /* 会员套餐 */
  .membership-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  /* 广告类型 */
  .ad-types {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  /* 章节标题 */
  .section-title {
    font-size: 18px;
  }
}

@media (max-width: 360px) {
  /* 通用章节样式 */
  .section {
    padding: 15px;
  }
  
  /* 页面标题 */
  .page-title {
    font-size: 20px;
  }
}
</style>
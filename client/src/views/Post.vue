<template>
  <section class="post-section">
    <div class="container">
      <h1 class="page-title">发布信息</h1>
      
      <!-- 发布步骤指示器 -->
      <div class="step-indicator">
        <div class="step" :class="{ active: currentStep === 1 }">
          <div class="step-number">{{ currentStep === 1 ? '✓' : '1' }}</div>
          <div class="step-text">选择分类</div>
        </div>
        <div class="step-line" :class="{ active: currentStep >= 2 }"></div>
        <div class="step" :class="{ active: currentStep === 2 }">
          <div class="step-number">{{ currentStep === 2 ? '✓' : '2' }}</div>
          <div class="step-text">填写内容</div>
        </div>
        <div class="step-line" :class="{ active: currentStep >= 3 }"></div>
        <div class="step" :class="{ active: currentStep === 3 }">
          <div class="step-number">{{ currentStep === 3 ? '✓' : '3' }}</div>
          <div class="step-text">提交发布</div>
        </div>
        <div class="step-line" :class="{ active: currentStep >= 4 }"></div>
        <div class="step" :class="{ active: currentStep === 4 }">
          <div class="step-number">{{ currentStep === 4 ? '✓' : '4' }}</div>
          <div class="step-text">发布成功</div>
        </div>
      </div>
      
      <!-- 步骤内容 -->
      <div class="post-content">
        <!-- 步骤1：选择分类 -->
        <div v-if="currentStep === 1" class="step-content">
          <h2 class="section-title">选择分类</h2>
          <div class="category-grid">
            <div 
              v-for="category in categories" 
              :key="category.id"
              class="category-card"
              @click="selectCategory(category.id)"
            >
              <div class="category-icon">{{ category.icon }}</div>
              <div class="category-name">{{ category.name }}</div>
              <div class="category-desc">{{ category.description }}</div>
            </div>
          </div>
        </div>
        
        <!-- 步骤2：填写内容 -->
        <div v-if="currentStep === 2" class="step-content">
          <h2 class="section-title">填写内容</h2>
          <form @submit.prevent="nextStep">
            <!-- 标题 -->
            <div class="form-group">
              <label for="title">* 标题：</label>
              <input 
                type="text" 
                id="title" 
                v-model="form.title"
                placeholder="请输入标题"
                class="form-input"
              >
            </div>
            
            <!-- 价格 -->
            <div class="form-group">
              <label for="price">* 价格：</label>
              <input 
                type="number" 
                id="price" 
                v-model.number="form.price"
                placeholder="请输入价格"
                min="0"
                class="form-input"
              >
              <span class="price-unit">元</span>
            </div>
            
            <!-- 生活服务分类 -->
            <div class="form-group" v-if="selectedCategoryId === 4">
              <label for="category">* 服务分类：</label>
              <select 
                id="category" 
                v-model="form.category"
                class="form-input"
              >
                <option value="">请选择服务分类</option>
                <option value="陪驾/代驾">陪驾/代驾</option>
                <option value="婚庆/化妆">婚庆/化妆</option>
                <option value="摄影摄像">摄影摄像</option>
              </select>
            </div>
            
            <!-- 房屋类型 -->
            <div class="form-group" v-if="selectedCategoryId === 1">
              <label for="type">* 房屋类型：</label>
              <select 
                id="type" 
                v-model="form.type"
                class="form-input"
              >
                <option value="">请选择</option>
                <option value="出租">出租</option>
                <option value="出售">出售</option>
              </select>
            </div>
            
            <!-- 二手物品分类 -->
            <div class="form-group" v-if="selectedCategoryId === 2">
              <label for="category">* 物品分类：</label>
              <select 
                id="category" 
                v-model="form.category"
                class="form-input"
              >
                <option value="">请选择</option>
                <option value="二手手机">二手手机</option>
                <option value="台式/笔记本">台式/笔记本</option>
              </select>
            </div>
            
            <!-- 品牌 -->
            <div class="form-group" v-if="selectedCategoryId === 2">
              <label for="brand">* 品牌：</label>
              <input 
                type="text" 
                id="brand" 
                v-model="form.brand"
                placeholder="请输入品牌，如：苹果、华为、神舟等"
                class="form-input"
              >
            </div>
            
            <!-- 新旧程度 -->
            <div class="form-group" v-if="selectedCategoryId === 2">
              <label for="condition">* 新旧程度：</label>
              <select 
                id="condition" 
                v-model="form.condition"
                class="form-input"
              >
                <option value="">请选择</option>
                <option value="9成新">9成新</option>
                <option value="8成新">8成新</option>
                <option value="7成新">7成新</option>
                <option value="6成新">6成新</option>
                <option value="5成新以下">5成新以下</option>
              </select>
            </div>
            
            <!-- 来源 -->
            <div class="form-group" v-if="selectedCategoryId === 2">
              <label for="source">* 来源：</label>
              <select 
                id="source" 
                v-model="form.source"
                class="form-input"
              >
                <option value="">请选择</option>
                <option value="个人">个人</option>
                <option value="商家">商家</option>
              </select>
            </div>
            
            <!-- 地址 -->
            <div class="form-group" v-if="selectedCategoryId === 2">
              <label for="address">* 地址：</label>
              <input 
                type="text" 
                id="address" 
                v-model="form.address"
                placeholder="请输入地址，如：牟平区"
                class="form-input"
              >
            </div>
            
            <!-- 面积 -->
            <div class="form-group" v-if="selectedCategoryId === 1">
              <label for="area">* 面积：</label>
              <input 
                type="number" 
                id="area" 
                v-model.number="form.area"
                placeholder="请输入面积"
                min="0"
                class="form-input"
              >
              <span class="price-unit">㎡</span>
            </div>
            
            <!-- 户型 -->
            <div class="form-group" v-if="selectedCategoryId === 1">
              <label for="layout">* 户型：</label>
              <input 
                type="text" 
                id="layout" 
                v-model="form.layout"
                placeholder="请输入户型，如：三室一厅"
                class="form-input"
              >
            </div>
            
            <!-- 楼层 -->
            <div class="form-group" v-if="selectedCategoryId === 1">
              <label for="floor">* 楼层：</label>
              <input 
                type="text" 
                id="floor" 
                v-model="form.floor"
                placeholder="请输入楼层，如：3层/共6层"
                class="form-input"
              >
            </div>
            
            <!-- 装修情况 -->
            <div class="form-group" v-if="selectedCategoryId === 1">
              <label for="decoration">* 装修情况：</label>
              <select 
                id="decoration" 
                v-model="form.decoration"
                class="form-input"
              >
                <option value="">请选择</option>
                <option value="毛坯">毛坯</option>
                <option value="简装">简装</option>
                <option value="中装">中装</option>
                <option value="精装">精装</option>
              </select>
            </div>
            
            <!-- 朝向 -->
            <div class="form-group" v-if="selectedCategoryId === 1">
              <label for="orientation">* 朝向：</label>
              <select 
                id="orientation" 
                v-model="form.orientation"
                class="form-input"
              >
                <option value="">请选择</option>
                <option value="东">东</option>
                <option value="南">南</option>
                <option value="西">西</option>
                <option value="北">北</option>
                <option value="东南">东南</option>
                <option value="西南">西南</option>
                <option value="东北">东北</option>
                <option value="西北">西北</option>
              </select>
            </div>
            
            <!-- 地址 -->
            <div class="form-group" v-if="selectedCategoryId === 1">
              <label for="location">* 地址：</label>
              <input 
                type="text" 
                id="location" 
                v-model="form.location"
                placeholder="请输入详细地址"
                class="form-input"
              >
            </div>
            
            <!-- 配套设施 -->
            <div class="form-group" v-if="selectedCategoryId === 1">
              <label for="facilities">配套设施：</label>
              <textarea 
                id="facilities" 
                v-model="form.facilities"
                placeholder="请输入配套设施，如：空调、洗衣机、冰箱等"
                class="form-textarea"
                rows="3"
              ></textarea>
            </div>
            
            <!-- 描述 -->
            <div class="form-group">
              <label for="description">* 描述：</label>
              <textarea 
                id="description" 
                v-model="form.description"
                placeholder="请输入详细描述"
                class="form-textarea"
                rows="5"
              ></textarea>
            </div>
            
            <!-- 联系人 -->
            <div class="form-group">
              <label for="contactPerson">* 联系人：</label>
              <input 
                type="text" 
                id="contactPerson" 
                v-model="form.contactPerson"
                placeholder="请输入联系人姓名"
                class="form-input"
              >
            </div>
            
            <!-- 联系电话 -->
            <div class="form-group">
              <label for="contact">* 联系电话：</label>
              <input 
                type="text" 
                id="contact" 
                v-model="form.contact"
                placeholder="请输入联系电话"
                class="form-input"
              >
            </div>
            
            <!-- 联系QQ -->
            <div class="form-group" v-if="selectedCategoryId === 3 || selectedCategoryId === 4">
              <label for="contactQQ">联系QQ：</label>
              <input 
                type="text" 
                id="contactQQ" 
                v-model="form.contactQQ"
                placeholder="请输入联系QQ"
                class="form-input"
              >
            </div>
            
            <!-- 所属地区 -->
            <div class="form-group" v-if="selectedCategoryId === 4">
              <label for="region">* 所属地区：</label>
              <select 
                id="region" 
                v-model="form.region"
                class="form-input"
              >
                <option value="">请选择所属地区</option>
                <option value="芝罘区">芝罘区</option>
                <option value="莱山区">莱山区</option>
                <option value="开发区">开发区</option>
                <option value="福山区">福山区</option>
                <option value="牟平区">牟平区</option>
              </select>
            </div>
            
            <!-- 有效期 -->
            <div class="form-group" v-if="selectedCategoryId === 4">
              <label for="validity">* 有效期：</label>
              <select 
                id="validity" 
                v-model="form.validity"
                class="form-input"
              >
                <option value="">请选择有效期</option>
                <option value="长期有效">长期有效</option>
                <option value="30天">30天</option>
                <option value="60天">60天</option>
                <option value="90天">90天</option>
              </select>
            </div>
            
            <!-- 地理位置 -->
            <div class="form-group" v-if="selectedCategoryId === 4">
              <label for="location">地理位置：</label>
              <div class="location-input">
                <input 
                  type="text" 
                  id="location" 
                  v-model="form.location"
                  placeholder="请输入地理位置"
                  class="form-input"
                >
                <button type="button" class="location-btn">点击标注</button>
              </div>
            </div>
            
            <!-- 所属地区 -->
            <div class="form-group" v-if="selectedCategoryId === 3">
              <label for="region">* 所属地区：</label>
              <select 
                id="region" 
                v-model="form.region"
                class="form-input"
              >
                <option value="">请选择所属地区</option>
                <option value="芝罘区">芝罘区</option>
                <option value="莱山区">莱山区</option>
                <option value="开发区">开发区</option>
                <option value="福山区">福山区</option>
                <option value="牟平区">牟平区</option>
              </select>
            </div>
            
            <!-- 有效期 -->
            <div class="form-group" v-if="selectedCategoryId === 3">
              <label for="validity">* 有效期：</label>
              <select 
                id="validity" 
                v-model="form.validity"
                class="form-input"
              >
                <option value="">请选择有效期</option>
                <option value="长期有效">长期有效</option>
                <option value="30天">30天</option>
                <option value="60天">60天</option>
                <option value="90天">90天</option>
              </select>
            </div>
            
            <!-- 轿车品牌 -->
            <div class="form-group" v-if="selectedCategoryId === 3">
              <label for="brand">* 轿车品牌：</label>
              <select 
                id="brand" 
                v-model="form.brand"
                class="form-input"
              >
                <option value="">请选择轿车品牌</option>
                <option value="奔驰">奔驰</option>
                <option value="宝马">宝马</option>
                <option value="奥迪">奥迪</option>
                <option value="大众">大众</option>
                <option value="丰田">丰田</option>
                <option value="本田">本田</option>
                <option value="日产">日产</option>
                <option value="现代">现代</option>
                <option value="起亚">起亚</option>
                <option value="其他">其他</option>
              </select>
            </div>
            
            <!-- 型号 -->
            <div class="form-group" v-if="selectedCategoryId === 3">
              <label for="model">* 型号：</label>
              <input 
                type="text" 
                id="model" 
                v-model="form.model"
                placeholder="请输入车型号"
                class="form-input"
              >
            </div>
            
            <!-- 上牌年份 -->
            <div class="form-group" v-if="selectedCategoryId === 3">
              <label for="year">* 上牌年份：</label>
              <select 
                id="year" 
                v-model="form.year"
                class="form-input"
              >
                <option value="">请选择上牌年份</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
                <option value="2020">2020</option>
                <option value="2019">2019</option>
                <option value="2018">2018</option>
                <option value="2017">2017</option>
                <option value="2016">2016</option>
                <option value="2015">2015</option>
                <option value="2014">2014</option>
                <option value="2013">2013</option>
                <option value="2012">2012</option>
                <option value="2011">2011</option>
                <option value="2010">2010</option>
                <option value="2009">2009</option>
                <option value="2008">2008</option>
                <option value="2007">2007</option>
                <option value="2006">2006</option>
                <option value="2005">2005</option>
                <option value="2004">2004</option>
                <option value="2003">2003</option>
                <option value="2002">2002</option>
                <option value="2001">2001</option>
                <option value="2000">2000</option>
              </select>
            </div>
            
            <!-- 行驶里程 -->
            <div class="form-group" v-if="selectedCategoryId === 3">
              <label for="mileage">* 行驶里程：</label>
              <input 
                type="number" 
                id="mileage" 
                v-model.number="form.mileage"
                placeholder="请输入行驶里程"
                min="0"
                class="form-input"
              >
              <span class="price-unit">公里</span>
            </div>
            
            <!-- 新旧程度 -->
            <div class="form-group" v-if="selectedCategoryId === 3">
              <label for="condition">* 新旧程度：</label>
              <select 
                id="condition" 
                v-model="form.condition"
                class="form-input"
              >
                <option value="">请选择新旧程度</option>
                <option value="九成五新">九成五新</option>
                <option value="九成新">九成新</option>
                <option value="八成新">八成新</option>
                <option value="七成新">七成新</option>
                <option value="六成新">六成新</option>
                <option value="五成新以下">五成新以下</option>
              </select>
            </div>
            
            <!-- 来源 -->
            <div class="form-group" v-if="selectedCategoryId === 3">
              <label>来源：</label>
              <div class="radio-group">
                <label class="radio-item">
                  <input type="radio" v-model="form.source" value="个人">
                  <span>个人</span>
                </label>
                <label class="radio-item">
                  <input type="radio" v-model="form.source" value="商家">
                  <span>商家</span>
                </label>
              </div>
            </div>
            
            <!-- 图片上传 -->
            <div class="form-group">
              <label>* 图片上传（最多4张）：</label>
              <div class="image-upload">
                <div 
                  v-for="(image, index) in form.images" 
                  :key="index"
                  class="image-item"
                >
                  <img :src="image" alt="上传图片" class="uploaded-image">
                  <button type="button" @click="removeImage(index)" class="remove-image-btn">×</button>
                </div>
                <div 
                  v-if="form.images.length < 4"
                  class="upload-btn"
                  @click="triggerFileInput"
                >
                  <input 
                    type="file" 
                    ref="fileInput"
                    multiple
                    accept="image/*"
                    @change="handleFileUpload"
                    style="display: none;"
                  >
                  <div class="upload-icon">+</div>
                  <div class="upload-text">上传图片</div>
                </div>
              </div>
              <p class="upload-hint">最多上传4张图片，每张图片大小不超过5MB</p>
            </div>
            
            <!-- 表单操作 -->
            <div class="form-actions">
              <button type="button" @click="prevStep" class="prev-btn">上一步</button>
              <button type="submit" class="next-btn">下一步</button>
            </div>
          </form>
        </div>
        
        <!-- 步骤3：提交发布 -->
        <div v-if="currentStep === 3" class="step-content">
          <h2 class="section-title">确认信息</h2>
          <div class="confirm-info">
            <div class="info-item">
              <label>分类：</label>
              <span>{{ selectedCategory ? selectedCategory.name : '' }}</span>
            </div>
            <div class="info-item">
              <label>标题：</label>
              <span>{{ form.title }}</span>
            </div>
            <div class="info-item">
              <label>价格：</label>
              <span>{{ form.price }}元</span>
            </div>
            <div class="info-item">
              <label>描述：</label>
              <span>{{ form.description }}</span>
            </div>
            <div class="info-item">
              <label>联系方式：</label>
              <span>{{ form.contact }}</span>
            </div>
            <div class="info-item">
              <label>图片：</label>
              <div class="confirm-images">
                <img 
                  v-for="(image, index) in form.images" 
                  :key="index"
                  :src="image" 
                  alt="上传图片"
                  class="confirm-image"
                >
              </div>
            </div>
          </div>
          
          <!-- 表单操作 -->
          <div class="form-actions">
            <button type="button" @click="prevStep" class="prev-btn">上一步</button>
            <button type="button" @click="submitPost" class="submit-btn">确认发布</button>
          </div>
        </div>
        
        <!-- 步骤4：发布成功 -->
        <div v-if="currentStep === 4" class="step-content">
          <div class="success-message">
            <div class="success-icon">✓</div>
            <h2 class="success-title">发布成功！</h2>
            <p class="success-description">您的信息已提交，需要经过管理员审核后才能显示。</p>
            <div class="success-actions">
              <button @click="viewMyPosts" class="action-btn primary-btn">查看我的信息</button>
              <button @click="continuePosting" class="action-btn secondary-btn">继续发布</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { useUserStore } from '../stores/userStore'

export default {
  name: 'Post',
  data() {
    return {
      currentStep: 1,
      selectedCategoryId: null,
      categories: [
        { id: 1, name: '房屋租售', icon: '🏠', description: '房屋出租、出售、写字楼' },
        { id: 2, name: '二手物品', icon: '📦', description: '手机、电脑、家具等' },
        { id: 3, name: '车辆买卖', icon: '🚗', description: '二手车、新车交易' },
        { id: 4, name: '生活服务', icon: '🛠️', description: '陪驾、婚庆、化妆等' }
      ],
      form: {
        title: '',
        price: '',
        type: '',
        category: '',
        brand: '',
        condition: '',
        source: '',
        address: '',
        area: '',
        layout: '',
        floor: '',
        decoration: '',
        orientation: '',
        location: '',
        facilities: '',
        contactPerson: '',
        contact: '',
        contactQQ: '',
        region: '',
        validity: '',
        model: '',
        year: '',
        mileage: '',
        description: '',
        images: []
      },
      editMode: false,
      postId: null
    }
  },
  computed: {
    selectedCategory() {
      return this.categories.find(cat => cat.id === this.selectedCategoryId);
    },
    user() {
      return this.userStore.user
    }
  },
  setup() {
    const userStore = useUserStore()
    return { userStore }
  },
  mounted() {
    // 检查用户是否登录
    this.checkLoginStatus();
    
    // 检查URL参数
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type');
    const id = urlParams.get('id');
    
    if (type) {
      // 根据类型设置分类
      const categoryMap = {
        'house': 1,
        'secondhand': 2,
        'vehicle': 3,
        'service': 4
      };
      this.selectedCategoryId = categoryMap[type] || 1;
      this.currentStep = 2;
    }
    
    if (id) {
      // 编辑模式
      this.editMode = true;
      this.postId = id;
      this.loadPostData();
    }
  },
  methods: {
    checkLoginStatus() {
      this.userStore.checkLogin()
      if (!this.user) {
        alert('请先登录');
        this.$router.push('/login');
        return false;
      }
      return true;
    },
    selectCategory(categoryId) {
      this.selectedCategoryId = categoryId;
      this.nextStep();
    },
    nextStep() {
      if (this.currentStep === 1 && !this.selectedCategoryId) {
        alert('请选择分类');
        return;
      }
      if (this.currentStep === 2) {
        if (!this.form.title) {
          alert('请输入标题');
          return;
        }
        if (!this.form.price) {
          alert('请输入价格');
          return;
        }
        if (this.selectedCategoryId === 1) {
          if (!this.form.type) {
            alert('请选择房屋类型');
            return;
          }
          if (!this.form.area) {
            alert('请输入面积');
            return;
          }
          if (!this.form.layout) {
            alert('请输入户型');
            return;
          }
          if (!this.form.floor) {
            alert('请输入楼层');
            return;
          }
          if (!this.form.decoration) {
            alert('请选择装修情况');
            return;
          }
          if (!this.form.orientation) {
            alert('请选择朝向');
            return;
          }
          if (!this.form.location) {
            alert('请输入地址');
            return;
          }
          if (!this.form.contactPerson) {
            alert('请输入联系人');
            return;
          }
        } else if (this.selectedCategoryId === 2) {
          if (!this.form.category) {
            alert('请选择物品分类');
            return;
          }
          if (!this.form.brand) {
            alert('请输入品牌');
            return;
          }
          if (!this.form.condition) {
            alert('请选择新旧程度');
            return;
          }
          if (!this.form.source) {
            alert('请选择来源');
            return;
          }
          if (!this.form.address) {
            alert('请输入地址');
            return;
          }
          if (!this.form.contactPerson) {
            alert('请输入联系人');
            return;
          }
        } else if (this.selectedCategoryId === 3) {
          if (!this.form.region) {
            alert('请选择所属地区');
            return;
          }
          if (!this.form.validity) {
            alert('请选择有效期');
            return;
          }
          if (!this.form.brand) {
            alert('请选择轿车品牌');
            return;
          }
          if (!this.form.model) {
            alert('请输入车型号');
            return;
          }
          if (!this.form.year) {
            alert('请选择上牌年份');
            return;
          }
          if (!this.form.mileage) {
            alert('请输入行驶里程');
            return;
          }
          if (!this.form.condition) {
            alert('请选择新旧程度');
            return;
          }
          if (!this.form.source) {
            alert('请选择来源');
            return;
          }
          if (!this.form.contactPerson) {
            alert('请输入联系人');
            return;
          }
        } else if (this.selectedCategoryId === 4) {
          if (!this.form.category) {
            alert('请选择服务分类');
            return;
          }
          if (!this.form.region) {
            alert('请选择所属地区');
            return;
          }
          if (!this.form.validity) {
            alert('请选择有效期');
            return;
          }
          if (!this.form.contactPerson) {
            alert('请输入联系人');
            return;
          }
        }
        if (!this.form.description) {
          alert('请输入描述');
          return;
        }
        if (!this.form.contact) {
          alert('请输入联系方式');
          return;
        }
        if (this.form.images.length === 0) {
          alert('请至少上传一张图片');
          return;
        }
      }
      this.currentStep++;
    },
    prevStep() {
      this.currentStep--;
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    handleFileUpload(e) {
      const files = e.target.files;
      if (files.length > 0) {
        const remainingSlots = 4 - this.form.images.length;
        const filesToProcess = Array.from(files).slice(0, remainingSlots);
        
        filesToProcess.forEach(file => {
          if (file.size > 5 * 1024 * 1024) {
            alert('图片大小不能超过5MB');
            return;
          }
          
          const reader = new FileReader();
          reader.onload = (event) => {
            this.form.images.push(event.target.result);
          };
          reader.readAsDataURL(file);
        });
      }
    },
    removeImage(index) {
      this.form.images.splice(index, 1);
    },
    async loadPostData() {
      try {
        if (!this.user) {
          alert('请先登录');
          this.$router.push('/login');
          return;
        }
        
        const type = this.getSelectedCategoryType();
        
        const response = await fetch(`/api/${type}/${this.postId}`);
        if (response.ok) {
          const post = await response.json();
          this.form = {
            title: post.title,
            price: post.price,
            description: post.description,
            contact: post.contact,
            images: post.images ? JSON.parse(post.images) : []
          };
        }
      } catch (error) {
        console.error('加载帖子数据失败:', error);
        alert('加载失败，请重试');
      }
    },
    getSelectedCategoryType() {
      switch (this.selectedCategoryId) {
        case 1:
          return 'houses';
        case 2:
          return 'secondhand';
        case 3:
          return 'vehicles';
        case 4:
          return 'services';
        default:
          return 'houses';
      }
    },
    async submitPost() {
      try {
        // 检查用户是否登录
        if (!this.checkLoginStatus()) {
          return;
        }
        
        // 检查金币余额
        if (!this.editMode) {
          await this.userStore.fetchUserCoins()
          if (this.user.coins < 5) {
            alert('金币不足，发布信息需要5金币');
            return;
          }
        }
        
        let response;
        if (this.selectedCategoryId === 1) {
          // 房屋租售
          response = await this.submitHousePost();
        } else if (this.selectedCategoryId === 2) {
          // 二手物品
          response = await this.submitSecondhandPost();
        } else if (this.selectedCategoryId === 3) {
          // 车辆买卖
          response = await this.submitVehiclePost();
        } else if (this.selectedCategoryId === 4) {
          // 生活服务
          response = await this.submitServicePost();
        }
        
        if (response && response.ok) {
          // 刷新用户金币余额
          await this.userStore.fetchUserCoins()
          // 跳转到步骤 4 显示成功消息
          this.currentStep = 4;
        } else {
          const errorData = await response.json();
          if (errorData.message === '金币不足') {
            alert('金币不足，发布信息需要5金币');
            // 刷新用户金币余额
            await this.userStore.fetchUserCoins()
          } else {
            alert('操作失败，请重试');
          }
        }
      } catch (error) {
        console.error('提交失败:', error);
        alert('操作失败，请重试');
      }
    },
    async submitHousePost() {
      const postData = {
        title: this.form.title,
        price: this.form.price,
        type: this.form.type,
        area: this.form.area,
        layout: this.form.layout,
        floor: this.form.floor,
        decoration: this.form.decoration,
        orientation: this.form.orientation,
        location: this.form.location,
        facilities: this.form.facilities,
        contactPerson: this.form.contactPerson,
        contactPhone: this.form.contact,
        description: this.form.description,
        images: JSON.stringify(this.form.images),
        userId: this.user.id
      };
      
      console.log('House post data:', postData);
      
      let response;
      if (this.editMode) {
        response = await fetch(`/api/houses/${this.postId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(postData)
        });
      } else {
        response = await fetch('/api/houses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(postData)
        });
      }
      
      return response;
    },
    async submitSecondhandPost() {
      const formData = new FormData();
      formData.append('title', this.form.title);
      formData.append('price', this.form.price);
      formData.append('category', this.form.category);
      formData.append('brand', this.form.brand);
      formData.append('condition', this.form.condition);
      formData.append('source', this.form.source);
      formData.append('address', this.form.address);
      formData.append('contactPerson', this.form.contactPerson);
      formData.append('contactPhone', this.form.contact);
      formData.append('description', this.form.description);
      formData.append('images', JSON.stringify(this.form.images));
      formData.append('userId', this.user.id);
      
      console.log('Secondhand post data:', formData);
      
      let response;
      if (this.editMode) {
        response = await fetch(`/api/secondhand/${this.postId}`, {
          method: 'PUT',
          body: formData
        });
      } else {
        response = await fetch('/api/secondhand', {
          method: 'POST',
          body: formData
        });
      }
      
      return response;
    },
    async submitVehiclePost() {
      const formData = new FormData();
      formData.append('title', this.form.title);
      formData.append('price', this.form.price);
      formData.append('brand', this.form.brand);
      formData.append('model', this.form.model);
      formData.append('year', this.form.year);
      formData.append('mileage', this.form.mileage);
      formData.append('region', this.form.region);
      formData.append('validity', this.form.validity);
      formData.append('condition', this.form.condition);
      formData.append('source', this.form.source);
      formData.append('contactPerson', this.form.contactPerson);
      formData.append('contactPhone', this.form.contact);
      formData.append('contactQQ', this.form.contactQQ);
      formData.append('description', this.form.description);
      formData.append('images', JSON.stringify(this.form.images));
      formData.append('userId', this.user.id);
      
      console.log('Vehicle post data:', formData);
      
      let response;
      if (this.editMode) {
        response = await fetch(`/api/vehicles/${this.postId}`, {
          method: 'PUT',
          body: formData
        });
      } else {
        response = await fetch('/api/vehicles', {
          method: 'POST',
          body: formData
        });
      }
      
      return response;
    },
    async submitServicePost() {
      const formData = new FormData();
      formData.append('title', this.form.title);
      formData.append('price', this.form.price);
      formData.append('category', this.form.category);
      formData.append('region', this.form.region);
      formData.append('validity', this.form.validity);
      formData.append('location', this.form.location);
      formData.append('contactPerson', this.form.contactPerson);
      formData.append('contactPhone', this.form.contact);
      formData.append('contactQQ', this.form.contactQQ);
      formData.append('description', this.form.description);
      formData.append('images', JSON.stringify(this.form.images));
      formData.append('userId', this.user.id);
      
      console.log('Service post data:', formData);
      
      let response;
      if (this.editMode) {
        response = await fetch(`/api/services/${this.postId}`, {
          method: 'PUT',
          body: formData
        });
      } else {
        response = await fetch('/api/services', {
          method: 'POST',
          body: formData
        });
      }
      
      return response;
    },
    viewMyPosts() {
      // 跳转到用户中心的我的信息页面
      this.$router.push('/usercenter?tab=my-posts');
    },
    continuePosting() {
      // 重置表单，继续发布
      this.currentStep = 1;
      this.selectedCategoryId = null;
      this.form = {
        title: '',
        price: '',
        type: '',
        category: '',
        brand: '',
        condition: '',
        source: '',
        address: '',
        area: '',
        layout: '',
        floor: '',
        decoration: '',
        orientation: '',
        location: '',
        facilities: '',
        contactPerson: '',
        contact: '',
        contactQQ: '',
        region: '',
        validity: '',
        model: '',
        year: '',
        mileage: '',
        description: '',
        images: []
      };
      this.editMode = false;
      this.postId = null;
    }
  }
}
</script>

<style scoped>
/* 发布信息页面 */
.post-section {
  padding: 40px 0;
  background-color: #f8f9fa;
}

/* 页面标题 */
.page-title {
  margin: 0 0 30px 0;
  color: #333;
  font-size: 24px;
  text-align: center;
}

/* 步骤指示器 */
.step-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f8f9fa;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-bottom: 10px;
  transition: all 0.3s ease;
}

.step.active .step-number {
  background-color: #007bff;
  color: white;
}

.step-text {
  font-size: 14px;
  color: #666;
  transition: all 0.3s ease;
}

.step.active .step-text {
  color: #007bff;
  font-weight: bold;
}

.step-line {
  flex: 1;
  height: 2px;
  background-color: #e0e0e0;
  margin: 0 30px;
  transition: all 0.3s ease;
}

.step-line.active {
  background-color: #007bff;
}

/* 发布内容 */
.post-content {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 30px;
}

/* 步骤内容 */
.step-content {
  min-height: 400px;
}

/* 章节标题 */
.section-title {
  margin: 0 0 30px 0;
  color: #333;
  font-size: 20px;
  border-bottom: 2px solid #007bff;
  padding-bottom: 10px;
}

/* 分类网格 */
.category-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.category-card {
  padding: 30px;
  background-color: #f8f9fa;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-card:hover {
  border-color: #007bff;
  box-shadow: 0 5px 15px rgba(0, 123, 255, 0.2);
  transform: translateY(-5px);
}

.category-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.category-name {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.category-desc {
  font-size: 14px;
  color: #666;
}

/* 表单组 */
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
}

.form-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #80bdff;
  box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
}

.form-textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
  resize: vertical;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  box-sizing: border-box;
}

.form-textarea:focus {
  outline: none;
  border-color: #80bdff;
  box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
}

/* 价格单位 */
.price-unit {
  margin-left: 10px;
  color: #666;
  font-weight: bold;
}

/* 单选按钮组 */
.radio-group {
  display: flex;
  gap: 20px;
  margin-top: 5px;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
}

.radio-item input[type="radio"] {
  cursor: pointer;
}

.radio-item span {
  color: #666;
}

/* 图片上传 */
.image-upload {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.image-item {
  position: relative;
  width: 100px;
  height: 100px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.uploaded-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-image-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 20px;
  height: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
}

.remove-image-btn:hover {
  background-color: rgba(0, 0, 0, 0.8);
}

.upload-btn {
  width: 100px;
  height: 100px;
  border: 2px dashed #ced4da;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #f8f9fa;
}

.upload-btn:hover {
  border-color: #007bff;
  background-color: #e3f2fd;
}

.upload-icon {
  font-size: 32px;
  color: #666;
  margin-bottom: 5px;
}

.upload-text {
  font-size: 14px;
  color: #666;
}

.upload-hint {
  font-size: 12px;
  color: #999;
  margin: 5px 0 0 0;
}

/* 表单操作 */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;
}

.prev-btn,
.next-btn,
.submit-btn {
  padding: 10px 30px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.prev-btn {
  background-color: #6c757d;
  color: white;
}

.prev-btn:hover {
  background-color: #5a6268;
}

.next-btn {
  background-color: #007bff;
  color: white;
}

.next-btn:hover {
  background-color: #0069d9;
}

.submit-btn {
  background-color: #28a745;
  color: white;
}

.submit-btn:hover {
  background-color: #218838;
}

/* 确认信息 */
.confirm-info {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 30px;
}

.info-item {
  margin-bottom: 15px;
  display: flex;
}

.info-item label {
  width: 100px;
  font-weight: bold;
  color: #333;
}

.info-item span {
  flex: 1;
  color: #666;
  word-break: break-word;
}

.confirm-images {
  flex: 1;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.confirm-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  /* 发布信息页面 */
  .post-section {
    padding: 20px 0;
  }
  
  /* 页面标题 */
  .page-title {
    font-size: 20px;
    margin-bottom: 20px;
  }
  
  /* 步骤指示器 */
  .step-indicator {
    padding: 15px;
  }
  
  .step-line {
    margin: 0 15px;
  }
  
  .step-text {
    font-size: 12px;
  }
  
  /* 发布内容 */
  .post-content {
    padding: 20px;
  }
  
  /* 分类网格 */
  .category-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
  
  .category-card {
    padding: 20px;
  }
  
  .category-icon {
    font-size: 32px;
  }
  
  .category-name {
    font-size: 16px;
  }
  
  /* 图片上传 */
  .image-item,
  .upload-btn {
    width: 80px;
    height: 80px;
  }
  
  .upload-icon {
    font-size: 24px;
  }
  
  /* 确认图片 */
  .confirm-image {
    width: 60px;
    height: 60px;
  }
  
  /* 表单操作 */
  .form-actions {
    flex-direction: column;
  }
  
  .prev-btn,
  .next-btn,
  .submit-btn {
    width: 100%;
    padding: 12px;
  }
  
  /* 章节标题 */
  .section-title {
    font-size: 18px;
  }
  
  /* 信息项 */
  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  .info-item label {
    width: 100%;
  }
}

/* 成功消息 */
.success-message {
  text-align: center;
  padding: 40px 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.success-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #28a745;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  font-weight: bold;
  margin: 0 auto 20px;
}

.success-title {
  margin: 0 0 15px;
  color: #333;
  font-size: 24px;
}

.success-description {
  margin: 0 0 30px;
  color: #666;
  font-size: 16px;
  line-height: 1.5;
}

.success-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.action-btn {
  padding: 12px 30px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.primary-btn {
  background-color: #007bff;
  color: white;
}

.primary-btn:hover {
  background-color: #0069d9;
}

.secondary-btn {
  background-color: #6c757d;
  color: white;
}

.secondary-btn:hover {
  background-color: #5a6268;
}

@media (max-width: 768px) {
  /* 成功消息 */
  .success-message {
    padding: 30px 15px;
  }
  
  .success-icon {
    width: 60px;
    height: 60px;
    font-size: 36px;
  }
  
  .success-title {
    font-size: 20px;
  }
  
  .success-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .action-btn {
    width: 100%;
    max-width: 200px;
  }
}

@media (max-width: 360px) {
  /* 分类网格 */
  .category-grid {
    grid-template-columns: 1fr;
  }
  
  /* 发布内容 */
  .post-content {
    padding: 15px;
  }
  
  /* 步骤指示器 */
  .step-indicator {
    flex-wrap: wrap;
    gap: 20px;
  }
  
  .step-line {
    display: none;
  }
  
  /* 成功消息 */
  .success-icon {
    width: 50px;
    height: 50px;
    font-size: 30px;
  }
  
  .success-title {
    font-size: 18px;
  }
  
  .success-description {
    font-size: 14px;
  }
}
</style>
<template>
  <section class="info-detail-section">
    <div class="container">
      <!-- 面包屑导航 -->
      <div class="breadcrumb">
        <a href="/">首页</a>
        <span> &gt; </span>
        <a :href="'/'+category">{{ categoryName }}</a>
        <span> &gt; </span>
        <span>{{ info.title }}</span>
      </div>
      
      <!-- 信息详情 -->
      <div class="info-detail">
        <!-- 标题 -->
        <h1 class="info-title">{{ info.title }}</h1>
        
        <!-- 发布信息 -->
        <div class="info-meta">
          <span class="info-time">{{ formatDate(info.createdAt) }}</span>
          <span class="info-id">信息编号：{{ info.id }}</span>
        </div>
        
        <!-- 价格 -->
        <div class="info-price">{{ info.price }}元</div>
        
        <div class="info-main">
          <!-- 左侧图片 -->
          <div class="info-images">
            <div class="image-carousel">
              <div class="carousel-container" :style="{ transform: `translateX(-${currentImage * 100}%)` }">
                <div 
                  v-for="(image, index) in info.images" 
                  :key="index"
                  class="carousel-item"
                >
                  <img :src="image" :alt="info.title" class="carousel-image" @click="openImageViewer(index)">
                </div>
              </div>
              <button class="carousel-prev" @click="prevImage">&lt;</button>
              <button class="carousel-next" @click="nextImage">&gt;</button>
              <div class="carousel-indicators">
                <div 
                  v-for="(image, index) in info.images" 
                  :key="index"
                  class="indicator"
                  :class="{ active: currentImage === index }"
                  @click="currentImage = index"
                ></div>
              </div>
            </div>
          </div>
          
          <!-- 右侧信息 -->
          <div class="info-details">
            <div class="contact-section">
              <div class="contact-info">
                <!-- 房屋信息 -->
                <template v-if="category === 'house'">
                  <div class="contact-item">
                    <label>房屋类型：</label>
                    <span>{{ info.type || '未提供' }}</span>
                  </div>
                  <div class="contact-item">
                    <label>面积：</label>
                    <span>{{ info.area || 0 }}平米</span>
                  </div>
                  <div class="contact-item">
                    <label>户型：</label>
                    <span>{{ info.layout || '未提供' }}</span>
                  </div>
                  <div class="contact-item">
                    <label>楼层：</label>
                    <span>{{ info.floor || '未提供' }}</span>
                  </div>
                  <div class="contact-item">
                    <label>装修情况：</label>
                    <span>{{ info.decoration || '未提供' }}</span>
                  </div>
                  <div class="contact-item">
                    <label>朝向：</label>
                    <span>{{ info.orientation || '未提供' }}</span>
                  </div>
                  <div class="contact-item">
                    <label>价格：</label>
                    <span class="price">{{ info.price }}元</span>
                  </div>
                  <div class="contact-item">
                    <label>地址：</label>
                    <span>{{ info.location || '未提供' }}</span>
                  </div>
                  <div class="contact-item">
                    <label>配套设施：</label>
                    <span>{{ info.facilities || '未提供' }}</span>
                  </div>
                  <div class="contact-item">
                    <label>联系人：</label>
                    <span>{{ info.contactPerson || '未提供' }}</span>
                  </div>
                  <div class="contact-item">
                    <label>电话：</label>
                    <span v-if="!showPhone" class="hidden-phone">
                      <button @click="showPhone = true" class="show-phone-btn">点击查看完整号码</button>
                    </span>
                    <span v-else class="phone-number">{{ info.phone || '未提供' }}</span>
                  </div>
                </template>
                
                <!-- 二手物品信息 -->
                <template v-else-if="category === 'secondhand'">
                  <div class="contact-item">
                    <label>品牌：</label>
                    <span>{{ info.brand || '未提供' }}</span>
                  </div>
                  <div class="contact-item">
                    <label>新旧程度：</label>
                    <span>{{ info.condition || '未提供' }}</span>
                  </div>
                  <div class="contact-item">
                    <label>价格：</label>
                    <span class="price" style="color: red;">{{ info.price }}元</span>
                  </div>
                  <div class="contact-item">
                    <label>来源：</label>
                    <span>{{ info.source || '未提供' }}</span>
                  </div>
                  <div class="contact-item">
                    <label>地址：</label>
                    <span>{{ info.address || '未提供' }}</span>
                  </div>
                  <div class="contact-item">
                    <label>联系人：</label>
                    <span>{{ info.contactPerson || '未提供' }}</span>
                  </div>
                  <div class="contact-item">
                    <label>电话：</label>
                    <span v-if="!showPhone" class="hidden-phone">
                      <button @click="showPhone = true" class="show-phone-btn" style="color: red; border: 1px solid red; background-color: white;">点击查看完整号码</button>
                    </span>
                    <span v-else class="phone-number">{{ info.phone || '未提供' }}</span>
                  </div>
                </template>
                
                <!-- 车辆信息 -->
                <template v-else-if="category === 'vehicle'">
                  <div class="contact-item">
                    <label>所属地区：</label>
                    <span>{{ info.region || '未提供' }}</span>
                  </div>
                  <div class="contact-item">
                    <label>有效期：</label>
                    <span>{{ info.validity || '未提供' }}</span>
                  </div>
                  <div class="contact-item">
                    <label>轿车品牌：</label>
                    <span>{{ info.brand || '未提供' }}</span>
                  </div>
                  <div class="contact-item">
                    <label>型号：</label>
                    <span>{{ info.model || '未提供' }}</span>
                  </div>
                  <div class="contact-item">
                    <label>上牌年份：</label>
                    <span>{{ info.year || '未提供' }}年</span>
                  </div>
                  <div class="contact-item">
                    <label>行驶里程：</label>
                    <span>{{ info.mileage || 0 }}公里</span>
                  </div>
                  <div class="contact-item">
                    <label>价格：</label>
                    <span class="price" style="color: red;">{{ info.price }}元</span>
                  </div>
                  <div class="contact-item">
                    <label>新旧程度：</label>
                    <span>{{ info.condition || '未提供' }}</span>
                  </div>
                  <div class="contact-item">
                    <label>来源：</label>
                    <span>{{ info.source || '未提供' }}</span>
                  </div>
                  <div class="contact-item">
                    <label>联系人：</label>
                    <span>{{ info.contactPerson || '未提供' }}</span>
                  </div>
                  <div class="contact-item">
                    <label>联系电话：</label>
                    <span v-if="!showPhone" class="hidden-phone">
                      <button @click="showPhone = true" class="show-phone-btn" style="color: red; border: 1px solid red; background-color: white;">点击查看完整号码</button>
                    </span>
                    <span v-else class="phone-number">{{ info.contactPhone || info.phone || '未提供' }}</span>
                  </div>
                  <div class="contact-item">
                    <label>联系QQ：</label>
                    <span>{{ info.contactQQ || '未提供' }}</span>
                  </div>
                </template>
                
                <!-- 生活服务信息 -->
                <template v-else-if="category === 'service'">
                  <div class="contact-item">
                    <label>所属地区：</label>
                    <span>{{ info.region || '未提供' }}</span>
                  </div>
                  <div class="contact-item">
                    <label>有效期：</label>
                    <span>{{ info.validity || '未提供' }}</span>
                  </div>
                  <div class="contact-item">
                    <label>服务分类：</label>
                    <span>{{ info.category || '未提供' }}</span>
                  </div>
                  <div class="contact-item">
                    <label>价格：</label>
                    <span class="price" style="color: red;">{{ info.price }}元</span>
                  </div>
                  <div class="contact-item">
                    <label>地理位置：</label>
                    <span>{{ info.location || '未提供' }}</span>
                  </div>
                  <div class="contact-item">
                    <label>联系人：</label>
                    <span>{{ info.contactPerson || '未提供' }}</span>
                  </div>
                  <div class="contact-item">
                    <label>联系电话：</label>
                    <span v-if="!showPhone" class="hidden-phone">
                      <button @click="showPhone = true" class="show-phone-btn" style="color: red; border: 1px solid red; background-color: white;">点击查看完整号码</button>
                    </span>
                    <span v-else class="phone-number">{{ info.contactPhone || info.contact || '未提供' }}</span>
                  </div>
                  <div class="contact-item">
                    <label>联系QQ：</label>
                    <span>{{ info.contactQQ || '未提供' }}</span>
                  </div>
                </template>
              </div>
            </div>
            
            <!-- 防骗提示 -->
            <div class="warning-section">
              <div class="warning-content">
                <p>⚠️ 烟台日开智能技术有限公司提醒您：</p>
                <p>1. 让你提前汇款，或者价格明显低于市价，均有骗子嫌疑，不要轻易相信。</p>
                <p>2. 要求先付定金、押金、手续费等费用的信息，需谨慎对待。</p>
                <p>3. 不要将个人身份证、银行卡等信息透露给陌生人。</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 信息详情 -->
        <div class="info-content">
          <h2 class="content-title">信息详情</h2>
          <div class="content-text">
            <p>{{ info.description }}</p>
            <div class="detail-images" v-if="info.images.length > 1">
              <img v-for="(image, index) in info.images" :key="index" :src="image" :alt="info.title" @click="openImageViewer(index)">
            </div>
          </div>
        </div>
        
        <!-- 小提示 -->
        <div class="tip-box">
          <div class="tip-icon">💡</div>
          <div class="tip-text">
            本页信息由用户及第三方发布，真实性、合法性由发布人负责，请仔细甄别。
          </div>
        </div>
      </div>
      
      <!-- 您可能感兴趣 -->
      <div class="recommend-section">
        <h2 class="section-title">您可能感兴趣</h2>
        <div class="recommend-grid">
          <div 
            v-for="(item, index) in recommendItems.slice(0, 3)" 
            :key="item.id"
            class="recommend-item"
          >
            <router-link :to="'/'+category+'/detail/'+item.id">
              <img :src="item.images[0]" :alt="item.title" class="recommend-image">
              <div class="recommend-info">
                <h3 class="recommend-title">{{ item.title }}</h3>
                <p class="recommend-price">{{ item.price }}元</p>
                <p class="recommend-desc">{{ item.description.substring(0, 100) }}...</p>
              </div>
            </router-link>
          </div>
        </div>
      </div>
      
      <!-- 图片查看器 -->
      <div class="image-viewer" v-if="imageViewerVisible" @click="closeImageViewer">
        <div class="viewer-content" @click.stop>
          <button class="viewer-close" @click="closeImageViewer">&times;</button>
          <div class="viewer-images" :style="{ transform: `translateX(-${viewerImageIndex * 100}%)` }">
            <img 
              v-for="(image, index) in info.images" 
              :key="index"
              :src="image" 
              :alt="info.title" 
              class="viewer-image"
            >
          </div>
          <button class="viewer-prev" @click="prevViewerImage" v-if="info.images.length > 1">&lt;</button>
          <button class="viewer-next" @click="nextViewerImage" v-if="info.images.length > 1">&gt;</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'InfoDetail',
  data() {
    return {
      info: {
        id: 1,
        title: '加载中...',
        price: 0,
        description: '',
        images: [],
        contactPerson: '',
        contactPhone: '',
        phone: '',
        contactQQ: '',
        createdAt: new Date().toISOString(),
        views: 0,
        area: 0,
        location: '',
        type: '',
        layout: '',
        floor: '',
        decoration: '',
        orientation: '',
        facilities: '',
        brand: '',
        model: '',
        year: 0,
        mileage: 0,
        region: '',
        validity: '',
        condition: '',
        source: '',
        address: ''
      },
      currentImage: 0,
      imageViewerVisible: false,
      viewerImageIndex: 0,
      showPhone: false,
      recommendItems: [],
      category: 'house',
      loading: true
    }
  },
  computed: {
    categoryPath() {
      return this.category;
    },
    categoryName() {
      const categoryMap = {
        house: '房屋租售',
        secondhand: '二手物品',
        vehicle: '车辆买卖',
        service: '服务信息'
      };
      return categoryMap[this.category] || '信息详情';
    }
  },
  mounted() {
    // 从URL参数获取分类和ID
    const { category, id } = this.$route.params;
    if (category && id) {
      this.category = category;
      this.fetchInfo(id);
      this.fetchRecommendations();
    }
  },
  watch: {
    // 监听路由参数变化，当参数变化时重新获取数据
    '$route.params': {
      handler(newParams, oldParams) {
        const { category, id } = newParams;
        if (category && id) {
          // 滚动到页面顶部
          window.scrollTo({ top: 0, behavior: 'smooth' });
          this.category = category;
          this.fetchInfo(id);
          this.fetchRecommendations();
        }
      },
      deep: true
    }
  },
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleString('zh-CN');
    },
    prevImage() {
      this.currentImage = (this.currentImage - 1 + this.info.images.length) % this.info.images.length;
    },
    nextImage() {
      this.currentImage = (this.currentImage + 1) % this.info.images.length;
    },
    openImageViewer(index) {
      this.imageViewerVisible = true;
      this.viewerImageIndex = index;
    },
    closeImageViewer() {
      this.imageViewerVisible = false;
    },
    prevViewerImage() {
      this.viewerImageIndex = (this.viewerImageIndex - 1 + this.info.images.length) % this.info.images.length;
    },
    nextViewerImage() {
      this.viewerImageIndex = (this.viewerImageIndex + 1) % this.info.images.length;
    },
    async fetchInfo(id) {
      try {
        this.loading = true;
        // 确保使用正确的API端点（复数形式）
        let apiCategory = this.category;
        if (apiCategory === 'house') apiCategory = 'houses';
        if (apiCategory === 'secondhand') apiCategory = 'secondhand'; // 保持不变
        if (apiCategory === 'vehicle') apiCategory = 'vehicles';
        if (apiCategory === 'service') apiCategory = 'services';
        const response = await fetch(`/api/${apiCategory}/${id}`);
        if (response.ok) {
          const data = await response.json();
          // 处理图片数据
          let images = [];
          if (data.image) {
            // 如果只有单个图片
            images = [`/uploads/${data.image}`];
          } else if (data.images) {
            // 如果有多个图片（JSON格式）
            try {
              const parsedImages = JSON.parse(data.images);
              // 检查是否是Base64编码的图片数据
              if (Array.isArray(parsedImages)) {
                images = parsedImages;
              } else {
                images = [parsedImages];
              }
            } catch {
              // 如果解析失败，直接使用images字段
              images = [data.images];
            }
          }
          
          this.info = {
            ...data,
            images: images,
            contactPerson: data.contactPerson || data.contact || '未提供',
            contactPhone: data.contactPhone || data.contact || '未提供',
            phone: data.contactPhone || data.contact || data.phone || '未提供',
            contactQQ: data.contactQQ || '未提供',
            brand: data.brand || '未提供',
            model: data.model || '未提供',
            year: data.year || 0,
            mileage: data.mileage || 0,
            region: data.region || '未提供',
            validity: data.validity || '未提供',
            condition: data.condition || '未提供',
            source: data.source || '未提供',
            address: data.address || data.location || '未提供'
          };
        } else {
          // API返回错误时使用默认数据
          this.info = {
            id: id,
            title: '信息不存在',
            price: 0,
            description: '该信息不存在或已被删除。',
            images: [],
            contactPerson: '未提供',
            contactPhone: '未提供',
            phone: '未提供',
            contactQQ: '未提供',
            createdAt: new Date().toISOString(),
            views: 0,
            area: 0,
            location: '未提供',
            brand: '未提供',
            model: '未提供',
            year: 0,
            mileage: 0,
            region: '未提供',
            validity: '未提供',
            condition: '未提供',
            source: '未提供',
            address: '未提供'
          };
        }
      } catch (error) {
        console.error('获取信息详情失败:', error);
        // 网络错误时使用默认数据
        this.info = {
          id: id,
          title: '加载失败',
          price: 0,
          description: '信息加载失败，请稍后重试。',
          images: [],
          contactPerson: '未提供',
          contactPhone: '未提供',
          phone: '未提供',
          contactQQ: '未提供',
          createdAt: new Date().toISOString(),
          views: 0,
          area: 0,
          location: '未提供',
          brand: '未提供',
          model: '未提供',
          year: 0,
          mileage: 0,
          region: '未提供',
          validity: '未提供',
          condition: '未提供',
          source: '未提供',
          address: '未提供'
        };
      } finally {
        this.loading = false;
      }
    },
    async fetchRecommendations() {
      try {
        // 确保使用正确的API端点（复数形式）
        let apiCategory = this.category;
        if (apiCategory === 'house') apiCategory = 'houses';
        if (apiCategory === 'secondhand') apiCategory = 'secondhand'; // 保持不变
        if (apiCategory === 'vehicle') apiCategory = 'vehicles';
        if (apiCategory === 'service') apiCategory = 'services';
        const response = await fetch(`/api/${apiCategory}?limit=3`);
        if (response.ok) {
          const data = await response.json();
          // 处理新的API响应格式
          const items = data.items || data;
          this.recommendItems = items.map(item => {
            // 处理图片数据
            let images = [];
            if (item.image) {
              images = [`/uploads/${item.image}`];
            } else if (item.images) {
              try {
                const parsedImages = JSON.parse(item.images);
                // 检查是否是Base64编码的图片数据
                if (Array.isArray(parsedImages)) {
                  images = parsedImages;
                } else {
                  images = [parsedImages];
                }
              } catch {
                // 如果解析失败，直接使用images字段
                images = [item.images];
              }
            }
            return {
              ...item,
              images: images
            };
          });
        }
      } catch (error) {
        console.error('获取推荐信息失败:', error);
        // 使用默认数据
        this.recommendItems = [];
      }
    }
  }
}
</script>

<style scoped>
/* 信息详情页面 */
.info-detail-section {
  padding: 40px 0;
  background-color: #f8f9fa;
}

/* 面包屑导航 */
.breadcrumb {
  margin-bottom: 20px;
  font-size: 14px;
  color: #666;
}

.breadcrumb a {
  color: #007bff;
  text-decoration: none;
}

.breadcrumb a:hover {
  text-decoration: underline;
}

/* 信息详情 */
.info-detail {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 30px;
  margin-bottom: 30px;
}

/* 标题 */
.info-title {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 24px;
  line-height: 1.3;
}

/* 发布信息 */
.info-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
  font-size: 14px;
  color: #666;
  align-items: center;
}

.info-actions {
  display: flex;
  gap: 10px;
  margin-left: auto;
}

.action-btn {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 5px 10px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background-color: #e9ecef;
}

.top-btn {
  background-color: #ffc107;
  border-color: #ffc107;
  color: #212529;
}

.top-btn:hover {
  background-color: #e0a800;
  border-color: #d39e00;
}

/* 价格 */
.info-price {
  font-size: 24px;
  font-weight: bold;
  color: #dc3545;
  margin-bottom: 30px;
}

/* 主内容区域 */
.info-main {
  display: flex;
  gap: 30px;
  margin-bottom: 30px;
}

.info-images {
  flex: 1;
  min-width: 400px;
}

.info-details {
  flex: 1;
  min-width: 300px;
}

/* 图片轮播 */
.image-carousel {
  position: relative;
  width: 100%;
  height: 400px;
  overflow: hidden;
  border-radius: 8px;
}

.carousel-container {
  display: flex;
  transition: transform 0.5s ease;
  height: 100%;
}

.carousel-item {
  flex: 0 0 100%;
  height: 100%;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
}

.carousel-indicators {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
}

.indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator.active {
  background-color: white;
  width: 30px;
  border-radius: 5px;
}

.carousel-prev,
.carousel-next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.carousel-prev {
  left: 20px;
}

.carousel-next {
  right: 20px;
}

.carousel-prev:hover,
.carousel-next:hover {
  background-color: rgba(0, 0, 0, 0.8);
}

/* 图片查看器 */
.image-viewer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.viewer-content {
  position: relative;
  width: 90%;
  height: 90%;
  max-width: 1200px;
  max-height: 800px;
}

.viewer-close {
  position: absolute;
  top: -40px;
  right: 0;
  width: 30px;
  height: 30px;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.viewer-close:hover {
  background-color: rgba(255, 255, 255, 0.4);
}

.viewer-images {
  display: flex;
  height: 100%;
  transition: transform 0.5s ease;
}

.viewer-image {
  flex: 0 0 100%;
  height: 100%;
  object-fit: contain;
}

.viewer-prev,
.viewer-next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 24px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.viewer-prev {
  left: -60px;
}

.viewer-next {
  right: -60px;
}

.viewer-prev:hover,
.viewer-next:hover {
  background-color: rgba(255, 255, 255, 0.4);
}

/* 信息详情 */
.info-content {
  margin-bottom: 30px;
}

.content-title {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 20px;
  border-bottom: 2px solid #007bff;
  padding-bottom: 10px;
}

.content-text {
  color: #666;
  line-height: 1.6;
  white-space: pre-line;
}

.detail-images {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
}

.detail-images img {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.detail-images img:hover {
  transform: scale(1.05);
}

/* 联系方式 */
.contact-section {
  margin-bottom: 20px;
}

.contact-info {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 4px;
}

.contact-item {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
}

.contact-item label {
  width: 100px;
  font-weight: bold;
  color: #333;
}

.contact-item span {
  flex: 1;
  color: #666;
}

.hidden-phone {
  display: inline-block;
}

.show-phone-btn {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 15px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.show-phone-btn:hover {
  background-color: #0069d9;
}

.phone-number {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

/* 防骗提示 */
.warning-section {
  margin-bottom: 20px;
}

.warning-content {
  background-color: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 4px;
  padding: 20px;
}

.warning-content p {
  margin: 10px 0;
  color: #856404;
  line-height: 1.5;
}

/* 小提示 */
.tip-box {
  background-color: #e7f3ff;
  border: 1px solid #b3d7ff;
  border-radius: 4px;
  padding: 15px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-top: 20px;
}

.tip-icon {
  font-size: 20px;
  margin-top: 2px;
}

.tip-text {
  flex: 1;
  color: #004085;
  font-size: 14px;
  line-height: 1.5;
}

/* 推荐信息 */
.recommend-section {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 30px;
}

.section-title {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 20px;
  border-bottom: 2px solid #007bff;
  padding-bottom: 10px;
}

.recommend-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.recommend-item {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.recommend-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.recommend-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.recommend-info {
  padding: 15px;
}

.recommend-title {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 16px;
  line-height: 1.3;
}

.recommend-price {
  margin: 0 0 10px 0;
  color: #dc3545;
  font-weight: bold;
}

.recommend-desc {
  margin: 0;
  color: #666;
  font-size: 14px;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.more-btn {
  text-align: center;
  margin-top: 20px;
}

.more-btn button {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.more-btn button:hover {
  background-color: #0069d9;
}

/* 响应式设计 */
@media (max-width: 768px) {
  /* 信息详情页面 */
  .info-detail-section {
    padding: 20px 0;
  }
  
  /* 信息详情 */
  .info-detail {
    padding: 20px;
  }
  
  /* 标题 */
  .info-title {
    font-size: 20px;
  }
  
  /* 发布信息 */
  .info-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .info-actions {
    margin-left: 0;
    margin-top: 10px;
  }
  
  /* 价格 */
  .info-price {
    font-size: 20px;
  }
  
  /* 主内容区域 */
  .info-main {
    flex-direction: column;
    gap: 20px;
  }
  
  .info-images {
    min-width: 100%;
  }
  
  .info-details {
    min-width: 100%;
  }
  
  /* 图片轮播 */
  .image-carousel {
    height: 250px;
  }
  
  /* 图片查看器 */
  .viewer-prev {
    left: 10px;
  }
  
  .viewer-next {
    right: 10px;
  }
  
  /* 联系方式 */
  .contact-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  .contact-item label {
    width: 100%;
  }
  
  /* 推荐信息 */
  .recommend-section {
    padding: 20px;
  }
  
  .recommend-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
  
  .recommend-image {
    height: 150px;
  }
  
  /* 章节标题 */
  .content-title,
  .section-title {
    font-size: 18px;
  }
}

@media (max-width: 360px) {
  /* 信息详情 */
  .info-detail {
    padding: 15px;
  }
  
  /* 图片轮播 */
  .image-carousel {
    height: 200px;
  }
  
  /* 推荐信息 */
  .recommend-section {
    padding: 15px;
  }
  
  .recommend-grid {
    grid-template-columns: 1fr;
  }
  
  .recommend-image {
    height: 180px;
  }
  
  /* 详细图片 */
  .detail-images img {
    width: 100%;
    height: 200px;
  }
}
</style>
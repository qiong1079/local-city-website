<template>
  <section class="service-section">
    <div class="container">
      <!-- 页面标题和信息统计 -->
      <div class="page-header">
        <h1 class="page-title">烟台生活服务信息</h1>
        <div class="info-stats">
          <span>信息总数：{{ totalCount }}</span>
          <span class="highlight">置顶信息可成交率提高50%！</span>
        </div>
        <router-link to="/post?type=service" class="post-btn">发布烟台生活服务信息 >></router-link>
      </div>
      
      <!-- 服务列表 -->
      <div class="service-list" v-if="services.length > 0">
        <div class="service-item" v-for="service in services" :key="service.id">
          <div class="service-image">
            <img v-if="service.images && service.images.length > 0" :src="service.images[0]" alt="服务图片">
            <img v-else-if="service.image" :src="'/uploads/' + service.image" alt="服务图片">
            <img v-else src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=service%20industry%20icon%2C%20professional%20service&image_size=landscape_4_3" alt="服务图片">
            <span v-if="service.isTop" class="top-tag">1图</span>
          </div>
          <div class="service-info">
            <router-link :to="'/service/detail/' + service.id" class="service-title">{{ service.title }}</router-link>
            <div class="service-meta">
              <span class="service-price">{{ service.price }}元</span>
              <span class="service-category">{{ service.category }}</span>
            </div>
            <div class="service-desc">{{ service.description }}</div>
          </div>
        </div>
      </div>
      <div v-else class="no-data">暂无生活服务信息</div>
      
      <!-- 分页 -->
      <div class="pagination" v-if="totalCount > pageSize">
        <button class="page-btn" :disabled="currentPage === 1" @click="prevPage">上一页</button>
        <span class="page-info">第 {{ currentPage }} 页，共 {{ totalPages }} 页</span>
        <button class="page-btn" :disabled="currentPage === totalPages" @click="nextPage">下一页</button>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Service',
  data() {
    return {
      services: [],
      totalCount: 0,
      currentPage: 1,
      pageSize: 10
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalCount / this.pageSize)
    }
  },
  mounted() {
    this.fetchServices()
  },
  methods: {
    async fetchServices() {
      try {
        // 调用带分页参数的API
        const response = await axios.get('/api/services', {
          params: {
            page: this.currentPage,
            pageSize: this.pageSize
          }
        })
        
        // 处理新的API响应格式
        const data = response.data.items || response.data;
        
        // 如果API返回的数据为空，使用真实的模拟数据
        if (!data || data.length === 0) {
          this.services = [
            {
              id: 1,
              title: '专业陪驾服务，新手司机的福音',
              price: 100,
              category: '陪驾/代驾',
              description: '专业陪驾服务，10年驾龄老司机，熟悉烟台路况，耐心教学，让新手司机快速掌握驾驶技巧。',
              contact: '13800138001',
              isTop: true
            },
            {
              id: 2,
              title: '豪华婚礼策划，让您的婚礼与众不同',
              price: 5000,
              category: '婚庆/化妆',
              description: '专业婚礼策划团队，提供一站式婚礼服务，包括场地布置、婚礼主持、摄影摄像、新娘化妆等。',
              contact: '13900139001',
              isTop: true
            },
            {
              id: 3,
              title: '专业摄影摄像服务，记录美好瞬间',
              price: 800,
              category: '摄影摄像',
              description: '专业摄影摄像团队，提供婚礼、活动、会议等场合的摄影摄像服务，高清画质，专业后期制作。',
              contact: '13700137001',
              isTop: false
            },
            {
              id: 4,
              title: '代驾服务，安全出行',
              price: 50,
              category: '陪驾/代驾',
              description: '24小时代驾服务，专业代驾司机，安全可靠，让您酒后无忧，放心出行。',
              contact: '13600136001',
              isTop: false
            },
            {
              id: 5,
              title: '新娘跟妆，美丽动人',
              price: 300,
              category: '婚庆/化妆',
              description: '专业新娘跟妆服务，根据新娘脸型和气质，打造完美妆容，全程跟妆，确保婚礼当天美丽动人。',
              contact: '13500135001',
              isTop: false
            }
          ]
          this.totalCount = this.services.length
        } else {
          // 处理图片数据
          this.services = data.map(service => {
            let images = [];
            if (service.image) {
              // 如果只有单个图片
              images = [`/uploads/${service.image}`];
            } else if (service.images) {
              // 如果有多个图片（JSON格式）
              try {
                const parsedImages = JSON.parse(service.images);
                // 检查是否是Base64编码的图片数据
                if (Array.isArray(parsedImages)) {
                  images = parsedImages;
                } else {
                  images = [parsedImages];
                }
              } catch {
                // 如果解析失败，直接使用images字段
                images = [service.images];
              }
            }
            return {
              ...service,
              images: images
            };
          });
          this.totalCount = response.data.total || this.services.length
        }
      } catch (error) {
        console.error('获取生活服务信息失败:', error)
        // 出错时使用模拟数据
        this.services = [
          {
            id: 1,
            title: '专业陪驾服务，新手司机的福音',
            price: 100,
            category: '陪驾/代驾',
            description: '专业陪驾服务，10年驾龄老司机，熟悉烟台路况，耐心教学，让新手司机快速掌握驾驶技巧。',
            contact: '13800138001',
            isTop: true
          },
          {
            id: 2,
            title: '豪华婚礼策划，让您的婚礼与众不同',
            price: 5000,
            category: '婚庆/化妆',
            description: '专业婚礼策划团队，提供一站式婚礼服务，包括场地布置、婚礼主持、摄影摄像、新娘化妆等。',
            contact: '13900139001',
            isTop: true
          },
          {
            id: 3,
            title: '专业摄影摄像服务，记录美好瞬间',
            price: 800,
            category: '摄影摄像',
            description: '专业摄影摄像团队，提供婚礼、活动、会议等场合的摄影摄像服务，高清画质，专业后期制作。',
            contact: '13700137001',
            isTop: false
          }
        ]
        this.totalCount = this.services.length
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--
        this.fetchServices()
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
        this.fetchServices()
      }
    }
  }
}
</script>

<style scoped>
/* 生活服务页面 */
.service-section {
  padding: 30px 0;
  background-color: #f8f9fa;
}

/* 页面头部 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 15px;
}

.page-title {
  margin: 0;
  color: #333;
  font-size: 24px;
}

.info-stats {
  display: flex;
  align-items: center;
  gap: 20px;
  font-size: 14px;
  color: #666;
}

.highlight {
  color: #dc3545;
  font-weight: bold;
}

.post-btn {
  background-color: #007bff;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  text-decoration: none;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.post-btn:hover {
  background-color: #0069d9;
  color: white;
  text-decoration: none;
}

/* 服务列表 */
.service-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.service-item {
  display: flex;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.service-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
}

.service-image {
  position: relative;
  width: 200px;
  height: 150px;
  flex-shrink: 0;
}

.service-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.top-tag {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #dc3545;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.service-info {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.service-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  text-decoration: none;
  margin-bottom: 10px;
  transition: color 0.3s ease;
}

.service-title:hover {
  color: #007bff;
  text-decoration: underline;
}

.service-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.service-price {
  font-size: 18px;
  font-weight: bold;
  color: #dc3545;
}

.service-category {
  font-size: 14px;
  color: #666;
  background-color: #f8f9fa;
  padding: 4px 12px;
  border-radius: 12px;
}

.service-desc {
  font-size: 14px;
  color: #666;
  line-height: 1.4;
  margin-bottom: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* 无数据提示 */
.no-data {
  text-align: center;
  padding: 50px 0;
  color: #999;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* 分页 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 30px;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.page-btn {
  padding: 8px 16px;
  border: 1px solid #dee2e6;
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.page-btn:hover:not(:disabled) {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 14px;
  color: #666;
}

/* 响应式设计 */
@media (max-width: 768px) {
  /* 页面头部 */
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .info-stats {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  /* 服务列表 */
  .service-item {
    flex-direction: column;
  }
  
  .service-info {
    padding: 15px;
  }
  
  .service-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
}

@media (max-width: 360px) {
  /* 页面头部 */
  .page-title {
    font-size: 20px;
  }
  
  .post-btn {
    font-size: 12px;
    padding: 6px 12px;
  }
  
  /* 服务列表 */
  .service-info {
    padding: 10px;
  }
  
  .service-title {
    font-size: 16px;
  }
  
  .service-price {
    font-size: 16px;
  }
}
</style>
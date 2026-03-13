<template>
  <section class="house-section">
    <div class="container">
      <!-- 页面标题和信息统计 -->
      <div class="page-header">
        <h1 class="page-title">烟台房屋租售信息</h1>
        <div class="info-stats">
          <span>信息总数：{{ totalCount }}</span>
          <span class="highlight">置顶信息可成交率提高50%！</span>
        </div>
        <router-link to="/post" class="post-btn">发布烟台房屋租售信息 >></router-link>
      </div>
      
      <!-- 房屋列表 -->
      <div class="house-list" v-if="houses.length > 0">
        <div class="house-item" v-for="house in houses" :key="house.id">
          <div class="house-image">
            <img v-if="house.images && house.images.length > 0" :src="house.images[0]" alt="房屋图片">
            <img v-else-if="house.image" :src="'/uploads/' + house.image" alt="房屋图片">
            <img v-else src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20apartment%20exterior%2C%20building%2C%20real%20estate&image_size=landscape_4_3" alt="房屋图片">
            <span v-if="house.isTop" class="top-tag">1图</span>
          </div>
          <div class="house-info">
            <router-link :to="'/house/detail/' + house.id" class="house-title">{{ house.title }}</router-link>
            <div class="house-meta">
              <span class="house-price">{{ house.price }}元</span>
              <span class="house-details">{{ house.type }} | {{ house.area }}㎡ | {{ house.location }}</span>
            </div>
            <div class="house-desc">{{ house.description }}</div>
            <div class="house-region">{{ house.location }}</div>
          </div>
        </div>
      </div>
      <div v-else class="no-data">暂无房屋信息</div>
      
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
  name: 'House',
  data() {
    return {
      houses: [],
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
    this.fetchHouses()
  },
  methods: {
    async fetchHouses() {
      try {
        // 调用带分页参数的API
        const response = await axios.get('/api/houses', {
          params: {
            page: this.currentPage,
            pageSize: this.pageSize
          }
        })
        
        // 处理新的API响应格式
        const data = response.data.items || response.data;
        
        // 如果API返回的数据为空，使用真实的模拟数据
        if (!data || data.length === 0) {
          this.houses = [
            {
              id: 1,
              title: '绿地下中央广场 多面积可选',
              price: 5147,
              type: '二手写字楼',
              area: 514.7,
              location: '芝罘区',
              description: '单价1万/㎡，精装修，类型甲级写字楼，使用率85.0%，楼层高楼层(共11层)',
              image: '',
              isTop: true
            },
            {
              id: 2,
              title: '齐鲁国际大厦写字楼 面积自由划分',
              price: 4500,
              type: '写字楼',
              area: 307.44,
              location: '芝罘区',
              description: '写字楼总面积307.44平方米，共29层，框架结构，面积自由划分，满足商务方面要求；内区全年都冷暖舒适的环境，独特',
              image: '',
              isTop: true
            },
            {
              id: 3,
              title: '花园小区，环境干净，房东人好',
              price: 2500,
              type: '住宅',
              area: 80,
              location: '芝罘区',
              description: '环境干净，房东人好，烟台市市植物园，居家小窝的好选择',
              image: '',
              isTop: false
            },
            {
              id: 4,
              title: '出租 财富花园 精致二室 拎包入住 2900/月',
              price: 2900,
              type: '住宅',
              area: 90,
              location: '芝罘区',
              description: '此小区环境优美，楼层好，精装修，家电齐全，拎包入住，有储藏室，周边配套设施齐全，交通出行非常便利，满足您对生活的一切',
              image: '',
              isTop: false
            },
            {
              id: 5,
              title: '万科城市花园 三室一厅 南北通透',
              price: 3200,
              type: '住宅',
              area: 120,
              location: '莱山区',
              description: '万科城市花园，三室一厅，南北通透，采光好，家具家电齐全，拎包入住，周边配套齐全，交通便利',
              image: '',
              isTop: false
            },
            {
              id: 6,
              title: '开发区万达广场 精装公寓',
              price: 1800,
              type: '公寓',
              area: 50,
              location: '开发区',
              description: '开发区万达广场，精装公寓，家具家电齐全，拎包入住，周边配套齐全，交通便利，适合单身人士或小情侣',
              image: '',
              isTop: false
            },
            {
              id: 7,
              title: '莱山区海景房 豪华装修',
              price: 4500,
              type: '住宅',
              area: 150,
              location: '莱山区',
              description: '莱山区海景房，豪华装修，家具家电齐全，拎包入住，周边配套齐全，交通便利，视野开阔',
              image: '',
              isTop: false
            },
            {
              id: 8,
              title: '芝罘区市中心 两室一厅',
              price: 2800,
              type: '住宅',
              area: 85,
              location: '芝罘区',
              description: '芝罘区市中心，两室一厅，家具家电齐全，拎包入住，周边配套齐全，交通便利，生活方便',
              image: '',
              isTop: false
            },
            {
              id: 9,
              title: '牟平区养马岛 海景别墅',
              price: 8000,
              type: '别墅',
              area: 200,
              location: '牟平区',
              description: '牟平区养马岛，海景别墅，豪华装修，家具家电齐全，拎包入住，周边配套齐全，交通便利，环境优美',
              image: '',
              isTop: false
            },
            {
              id: 10,
              title: '高新区科技园 单身公寓',
              price: 1500,
              type: '公寓',
              area: 45,
              location: '高新区',
              description: '高新区科技园，单身公寓，家具家电齐全，拎包入住，周边配套齐全，交通便利，适合上班族',
              image: '',
              isTop: false
            },
            {
              id: 11,
              title: '福山区万科城 三室两厅',
              price: 3000,
              type: '住宅',
              area: 110,
              location: '福山区',
              description: '福山区万科城，三室两厅，家具家电齐全，拎包入住，周边配套齐全，交通便利，环境优美',
              image: '',
              isTop: false
            },
            {
              id: 12,
              title: '蓬莱区海景房 精装修',
              price: 3500,
              type: '住宅',
              area: 100,
              location: '蓬莱区',
              description: '蓬莱区海景房，精装修，家具家电齐全，拎包入住，周边配套齐全，交通便利，环境优美',
              image: '',
              isTop: false
            }
          ]
          this.totalCount = this.houses.length
        } else {
          // 处理图片数据
          this.houses = data.map(house => {
            let images = [];
            if (house.image) {
              // 如果只有单个图片
              images = [`/uploads/${house.image}`];
            } else if (house.images) {
              // 如果有多个图片（JSON格式）
              try {
                const parsedImages = JSON.parse(house.images);
                // 检查是否是Base64编码的图片数据
                if (Array.isArray(parsedImages)) {
                  images = parsedImages;
                } else {
                  images = [parsedImages];
                }
              } catch {
                // 如果解析失败，直接使用images字段
                images = [house.images];
              }
            }
            return {
              ...house,
              images: images
            };
          });
          this.totalCount = response.data.total || this.houses.length
        }
      } catch (error) {
        console.error('获取房屋信息失败:', error)
        // 出错时使用模拟数据
        this.houses = [
          {
            id: 1,
            title: '绿地下中央广场 多面积可选',
            price: 5147,
            type: '二手写字楼',
            area: 514.7,
            location: '芝罘区',
            description: '单价1万/㎡，精装修，类型甲级写字楼，使用率85.0%，楼层高楼层(共11层)',
            image: '',
            isTop: true
          },
          {
            id: 2,
            title: '齐鲁国际大厦写字楼 面积自由划分',
            price: 4500,
            type: '写字楼',
            area: 307.44,
            location: '芝罘区',
            description: '写字楼总面积307.44平方米，共29层，框架结构，面积自由划分，满足商务方面要求；内区全年都冷暖舒适的环境，独特',
            image: '',
            isTop: true
          },
          {
            id: 3,
            title: '花园小区，环境干净，房东人好',
            price: 2500,
            type: '住宅',
            area: 80,
            location: '芝罘区',
            description: '环境干净，房东人好，烟台市市植物园，居家小窝的好选择',
            image: '',
            isTop: false
          },
          {
            id: 4,
            title: '出租 财富花园 精致二室 拎包入住 2900/月',
            price: 2900,
            type: '住宅',
            area: 90,
            location: '芝罘区',
            description: '此小区环境优美，楼层好，精装修，家电齐全，拎包入住，有储藏室，周边配套设施齐全，交通出行非常便利，满足您对生活的一切',
            image: '',
            isTop: false
          }
        ]
        this.totalCount = this.houses.length
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--
        this.fetchHouses()
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
        this.fetchHouses()
      }
    }
  }
}
</script>

<style scoped>
/* 房屋租售页面 */
.house-section {
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

/* 房屋列表 */
.house-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.house-item {
  display: flex;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.house-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
}

.house-image {
  position: relative;
  width: 200px;
  height: 150px;
  flex-shrink: 0;
}

.house-image img {
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

.house-info {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.house-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  text-decoration: none;
  margin-bottom: 10px;
  transition: color 0.3s ease;
}

.house-title:hover {
  color: #007bff;
  text-decoration: underline;
}

.house-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.house-price {
  font-size: 18px;
  font-weight: bold;
  color: #dc3545;
}

.house-details {
  font-size: 14px;
  color: #666;
}

.house-desc {
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

.house-region {
  font-size: 14px;
  color: #999;
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
  
  /* 房屋列表 */
  .house-item {
    flex-direction: column;
  }
  
  .house-image {
    width: 100%;
    height: 200px;
  }
  
  .house-info {
    padding: 15px;
  }
  
  .house-meta {
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
  
  /* 房屋列表 */
  .house-image {
    height: 150px;
  }
  
  .house-info {
    padding: 10px;
  }
  
  .house-title {
    font-size: 16px;
  }
  
  .house-price {
    font-size: 16px;
  }
}
</style>
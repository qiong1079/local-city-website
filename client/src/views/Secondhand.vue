<template>
  <section class="secondhand-section">
    <div class="container">
      <!-- 页面标题和信息统计 -->
      <div class="page-header">
        <h1 class="page-title">烟台二手物品转让</h1>
        <div class="info-stats">
          <span>信息总数：{{ totalCount }}</span>
          <span class="highlight">置顶信息可成交率提高50%！</span>
        </div>
        <router-link to="/post?type=secondhand" class="post-btn">发布二手物品信息 >></router-link>
      </div>
      
      <!-- 二手物品列表 -->
      <div class="secondhand-list" v-if="items.length > 0">
        <div class="secondhand-item" v-for="item in items" :key="item.id">
          <div class="secondhand-image">
            <img v-if="item.images && item.images.length > 0" :src="item.images[0]" alt="物品图片">
            <img v-else-if="item.image" :src="'/uploads/' + item.image" alt="物品图片">
            <img v-else src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=secondhand%20items%2C%20electronics%2C%20furniture%2C%20clear%20image&image_size=landscape_4_3" alt="物品图片">
            <span v-if="item.isTop" class="top-tag">1图</span>
          </div>
          <div class="secondhand-info">
            <router-link :to="'/secondhand/detail/' + item.id" class="secondhand-title">{{ item.title }}</router-link>
            <div class="secondhand-meta">
              <span class="secondhand-price">{{ item.price }}元</span>
              <span class="secondhand-details">{{ item.category }}</span>
            </div>
            <div class="secondhand-desc">{{ item.description }}</div>
          </div>
        </div>
      </div>
      <div v-else class="no-data">暂无二手物品信息</div>
      
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
  name: 'Secondhand',
  data() {
    return {
      items: [],
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
    this.fetchItems()
  },
  methods: {
    async fetchItems() {
      try {
        // 调用带分页参数的API
        const response = await axios.get('/api/secondhand', {
          params: {
            page: this.currentPage,
            pageSize: this.pageSize
          }
        })
        
        // 处理新的API响应格式
        const data = response.data.items || response.data;
        
        // 如果API返回的数据为空，使用真实的模拟数据
        if (!data || data.length === 0) {
          this.items = [
            {
              id: 1,
              title: 'iPhone 13 Pro Max 256GB',
              price: 5999,
              category: '二手手机',
              description: '9成新，无划痕，配件齐全，电池健康度95%，支持验机',
              image: '',
              isTop: true
            },
            {
              id: 2,
              title: 'MacBook Pro 14英寸 M1 Pro',
              price: 8999,
              category: '台式/笔记本',
              description: '2021款，16GB内存，512GB SSD，成色很新，无磕碰',
              image: '',
              isTop: true
            },
            {
              id: 3,
              title: 'iPad Pro 11英寸 2022款',
              price: 4999,
              category: '二手手机',
              description: '128GB，WiFi版，配Apple Pencil 2代，95新',
              image: '',
              isTop: false
            },
            {
              id: 4,
              title: '联想拯救者 Y7000P 游戏本',
              price: 6999,
              category: '台式/笔记本',
              description: 'i7-11800H，RTX 3060，16GB内存，512GB SSD，144Hz屏幕',
              image: '',
              isTop: false
            }
          ]
          this.totalCount = this.items.length
        } else {
          // 处理图片数据
          this.items = data.map(item => {
            let images = [];
            if (item.image) {
              // 如果只有单个图片
              images = [`/uploads/${item.image}`];
            } else if (item.images) {
              // 如果有多个图片（JSON格式）
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
          this.totalCount = response.data.total || this.items.length
        }
      } catch (error) {
        console.error('获取二手物品信息失败:', error)
        // 出错时使用模拟数据
        this.items = [
          {
            id: 1,
            title: 'iPhone 13 Pro Max 256GB',
            price: 5999,
            category: '二手手机',
            description: '9成新，无划痕，配件齐全，电池健康度95%，支持验机',
            image: '',
            isTop: true
          },
          {
            id: 2,
            title: 'MacBook Pro 14英寸 M1 Pro',
            price: 8999,
            category: '台式/笔记本',
            description: '2021款，16GB内存，512GB SSD，成色很新，无磕碰',
            image: '',
            isTop: true
          },
          {
            id: 3,
            title: 'iPad Pro 11英寸 2022款',
            price: 4999,
            category: '二手手机',
            description: '128GB，WiFi版，配Apple Pencil 2代，95新',
            image: '',
            isTop: false
          },
          {
            id: 4,
            title: '联想拯救者 Y7000P 游戏本',
            price: 6999,
            category: '台式/笔记本',
            description: 'i7-11800H，RTX 3060，16GB内存，512GB SSD，144Hz屏幕',
            image: '',
            isTop: false
          }
        ]
        this.totalCount = this.items.length
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--
        this.fetchItems()
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
        this.fetchItems()
      }
    }
  }
}
</script>

<style scoped>
/* 二手物品页面 */
.secondhand-section {
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

/* 二手物品列表 */
.secondhand-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.secondhand-item {
  display: flex;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.secondhand-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
}

.secondhand-image {
  position: relative;
  width: 200px;
  height: 150px;
  flex-shrink: 0;
}

.secondhand-image img {
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

.secondhand-info {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.secondhand-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  text-decoration: none;
  margin-bottom: 10px;
  transition: color 0.3s ease;
}

.secondhand-title:hover {
  color: #007bff;
  text-decoration: underline;
}

.secondhand-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.secondhand-price {
  font-size: 18px;
  font-weight: bold;
  color: #dc3545;
}

.secondhand-details {
  font-size: 14px;
  color: #666;
}

.secondhand-desc {
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
  
  /* 二手物品列表 */
  .secondhand-item {
    flex-direction: column;
  }
  
  .secondhand-image {
    width: 100%;
    height: 200px;
  }
  
  .secondhand-info {
    padding: 15px;
  }
  
  .secondhand-meta {
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
  
  /* 二手物品列表 */
  .secondhand-image {
    height: 150px;
  }
  
  .secondhand-info {
    padding: 10px;
  }
  
  .secondhand-title {
    font-size: 16px;
  }
  
  .secondhand-price {
    font-size: 16px;
  }
}
</style>
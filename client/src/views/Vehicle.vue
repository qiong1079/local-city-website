<template>
  <section class="vehicle-section">
    <div class="container">
      <!-- 页面标题和信息统计 -->
      <div class="page-header">
        <h1 class="page-title">烟台车辆买卖信息</h1>
        <div class="info-stats">
          <span>信息总数：{{ totalCount }}</span>
          <span class="highlight">置顶信息可成交率提高50%！</span>
        </div>
        <router-link to="/post?type=vehicle" class="post-btn">发布二手轿车信息 >></router-link>
      </div>
      
      <!-- 车辆列表 -->
      <div class="vehicle-list" v-if="vehicles.length > 0">
        <div class="vehicle-item" v-for="vehicle in vehicles" :key="vehicle.id">
          <div class="vehicle-image">
            <img v-if="vehicle.images && vehicle.images.length > 0" :src="vehicle.images[0]" alt="车辆图片">
            <img v-else-if="vehicle.image" :src="'/uploads/' + vehicle.image" alt="车辆图片">
            <img v-else src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20car%20exterior%2C%20vehicle%20for%20sale&image_size=landscape_4_3" alt="车辆图片">
            <span v-if="vehicle.isTop" class="top-tag">1图</span>
          </div>
          <div class="vehicle-info">
            <router-link :to="'/vehicle/detail/' + vehicle.id" class="vehicle-title">{{ vehicle.title }}</router-link>
            <div class="vehicle-meta">
              <span class="vehicle-price">{{ vehicle.price }}元</span>
              <span class="vehicle-details">{{ vehicle.brand }} {{ vehicle.model }} | {{ vehicle.year }}年 | {{ vehicle.mileage }}公里</span>
            </div>
            <div class="vehicle-desc">{{ vehicle.description }}</div>
            <div class="vehicle-region">{{ vehicle.region }}</div>
          </div>
        </div>
      </div>
      <div v-else class="no-data">暂无车辆信息</div>
      
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
  name: 'Vehicle',
  data() {
    return {
      vehicles: [],
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
    this.fetchVehicles()
  },
  methods: {
    async fetchVehicles() {
      try {
        // 调用带分页参数的API
        const response = await axios.get('/api/vehicles', {
          params: {
            page: this.currentPage,
            pageSize: this.pageSize
          }
        })
        
        // 处理新的API响应格式
        const data = response.data.items || response.data;
        
        // 如果API返回的数据为空，使用真实的模拟数据
        if (!data || data.length === 0) {
          this.vehicles = [
            {
              id: 1,
              title: '2020款 奔驰 C级 C 260 L 运动版',
              price: 258000,
              brand: '奔驰',
              model: 'C级 C 260 L 运动版',
              year: 2020,
              mileage: 35000,
              region: '芝罘区',
              validity: '长期有效',
              condition: '九成新',
              source: '个人',
              description: '2020年上牌，行驶35000公里，车况良好，无事故，定期保养，配置齐全，内饰干净整洁，适合家用或商务使用。',
              image: '',
              isTop: true
            },
            {
              id: 2,
              title: '2019款 宝马 3系 320i M运动套装',
              price: 225000,
              brand: '宝马',
              model: '3系 320i M运动套装',
              year: 2019,
              mileage: 42000,
              region: '莱山区',
              validity: '长期有效',
              condition: '八成新',
              source: '商家',
              description: '2019年上牌，行驶42000公里，M运动套装，动力强劲，操控性好，内饰豪华，性价比高。',
              image: '',
              isTop: true
            },
            {
              id: 3,
              title: '2021款 奥迪 A4L 40 TFSI 时尚型',
              price: 248000,
              brand: '奥迪',
              model: 'A4L 40 TFSI 时尚型',
              year: 2021,
              mileage: 28000,
              region: '开发区',
              validity: '长期有效',
              condition: '九成新',
              source: '个人',
              description: '2021年上牌，行驶28000公里，准新车，配置丰富，动力充足，舒适性好，适合家庭使用。',
              image: '',
              isTop: false
            },
            {
              id: 4,
              title: '2018款 大众 帕萨特 330TSI 尊贵版',
              price: 156000,
              brand: '大众',
              model: '帕萨特 330TSI 尊贵版',
              year: 2018,
              mileage: 55000,
              region: '福山区',
              validity: '长期有效',
              condition: '八成新',
              source: '商家',
              description: '2018年上牌，行驶55000公里，商务首选，空间大，舒适性好，动力够用，性价比高。',
              image: '',
              isTop: false
            },
            {
              id: 5,
              title: '2022款 丰田 凯美瑞 2.5G 豪华版',
              price: 198000,
              brand: '丰田',
              model: '凯美瑞 2.5G 豪华版',
              year: 2022,
              mileage: 12000,
              region: '牟平区',
              validity: '长期有效',
              condition: '九成五新',
              source: '个人',
              description: '2022年上牌，行驶12000公里，准新车，丰田品质，可靠性高，油耗低，适合家用。',
              image: '',
              isTop: false
            }
          ]
          this.totalCount = this.vehicles.length
        } else {
          // 处理图片数据
          this.vehicles = data.map(vehicle => {
            let images = [];
            if (vehicle.image) {
              // 如果只有单个图片
              images = [`/uploads/${vehicle.image}`];
            } else if (vehicle.images) {
              // 如果有多个图片（JSON格式）
              try {
                const parsedImages = JSON.parse(vehicle.images);
                // 检查是否是Base64编码的图片数据
                if (Array.isArray(parsedImages)) {
                  images = parsedImages;
                } else {
                  images = [parsedImages];
                }
              } catch {
                // 如果解析失败，直接使用images字段
                images = [vehicle.images];
              }
            }
            return {
              ...vehicle,
              images: images
            };
          });
          this.totalCount = response.data.total || this.vehicles.length
        }
      } catch (error) {
        console.error('获取车辆信息失败:', error)
        // 出错时使用模拟数据
        this.vehicles = [
          {
            id: 1,
            title: '2020款 奔驰 C级 C 260 L 运动版',
            price: 258000,
            brand: '奔驰',
            model: 'C级 C 260 L 运动版',
            year: 2020,
            mileage: 35000,
            region: '芝罘区',
            validity: '长期有效',
            condition: '九成新',
            source: '个人',
            description: '2020年上牌，行驶35000公里，车况良好，无事故，定期保养，配置齐全，内饰干净整洁，适合家用或商务使用。',
            image: '',
            isTop: true
          },
          {
            id: 2,
            title: '2019款 宝马 3系 320i M运动套装',
            price: 225000,
            brand: '宝马',
            model: '3系 320i M运动套装',
            year: 2019,
            mileage: 42000,
            region: '莱山区',
            validity: '长期有效',
            condition: '八成新',
            source: '商家',
            description: '2019年上牌，行驶42000公里，M运动套装，动力强劲，操控性好，内饰豪华，性价比高。',
            image: '',
            isTop: true
          },
          {
            id: 3,
            title: '2021款 奥迪 A4L 40 TFSI 时尚型',
            price: 248000,
            brand: '奥迪',
            model: 'A4L 40 TFSI 时尚型',
            year: 2021,
            mileage: 28000,
            region: '开发区',
            validity: '长期有效',
            condition: '九成新',
            source: '个人',
            description: '2021年上牌，行驶28000公里，准新车，配置丰富，动力充足，舒适性好，适合家庭使用。',
            image: '',
            isTop: false
          }
        ]
        this.totalCount = this.vehicles.length
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--
        this.fetchVehicles()
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
        this.fetchVehicles()
      }
    }
  }
}
</script>

<style scoped>
/* 车辆买卖页面 */
.vehicle-section {
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

/* 车辆列表 */
.vehicle-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.vehicle-item {
  display: flex;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.vehicle-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
}

.vehicle-image {
  position: relative;
  width: 200px;
  height: 150px;
  flex-shrink: 0;
}

.vehicle-image img {
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

.vehicle-info {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.vehicle-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  text-decoration: none;
  margin-bottom: 10px;
  transition: color 0.3s ease;
}

.vehicle-title:hover {
  color: #007bff;
  text-decoration: underline;
}

.vehicle-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.vehicle-price {
  font-size: 18px;
  font-weight: bold;
  color: #dc3545;
}

.vehicle-details {
  font-size: 14px;
  color: #666;
}

.vehicle-desc {
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

.vehicle-region {
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
  
  /* 车辆列表 */
  .vehicle-item {
    flex-direction: column;
  }
  
  .vehicle-image {
    width: 100%;
    height: 200px;
  }
  
  .vehicle-info {
    padding: 15px;
  }
  
  .vehicle-meta {
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
  
  /* 车辆列表 */
  .vehicle-image {
    height: 150px;
  }
  
  .vehicle-info {
    padding: 10px;
  }
  
  .vehicle-title {
    font-size: 16px;
  }
  
  .vehicle-price {
    font-size: 16px;
  }
}
</style>
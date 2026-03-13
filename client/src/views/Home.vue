<template>
  <div class="home-container">
    <!-- 搜索栏 -->
    <div class="search-section">
      <div class="container">
        <div class="search-bar">
          <input type="text" v-model="searchQuery" placeholder="搜索信息..." class="search-input">
          <button @click="search" class="search-btn">搜索</button>
        </div>
      </div>
    </div>
    
    <!-- 主内容区 -->
    <div class="container main-content">
      <!-- 分类信息多列展示 -->
      <div class="category-grid">
        <div class="category-card">
          <router-link to="/house">
            <div class="category-icon">🏠</div>
            <h3>房屋租售</h3>
            <p>房屋出租、出售、写字楼</p>
          </router-link>
        </div>
        <div class="category-card">
          <router-link to="/secondhand">
            <div class="category-icon">📦</div>
            <h3>二手物品</h3>
            <p>手机、电脑、家具等</p>
          </router-link>
        </div>
        <div class="category-card">
          <router-link to="/vehicle">
            <div class="category-icon">🚗</div>
            <h3>车辆买卖</h3>
            <p>二手车、新车交易</p>
          </router-link>
        </div>
        <div class="category-card">
          <router-link to="/service">
            <div class="category-icon">🛠️</div>
            <h3>生活服务</h3>
            <p>陪驾、婚庆、化妆等</p>
          </router-link>
        </div>
      </div>
      
      <!-- 横幅广告 -->
      <div class="banner">
        <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=real%20estate%20banner%2C%20house%20rental%20and%20sale%2C%20modern%20design%2C%20colorful&image_size=landscape_16_9" alt="房屋租售">
      </div>
      
      <!-- 置顶信息 -->
      <div class="featured-section">
        <h2>置顶信息</h2>
        <div class="featured-grid">
          <div v-for="item in featuredItems" :key="item.id" class="featured-card">
            <div class="featured-tag">置顶</div>
            <router-link :to="getFeaturedItemLink(item)">
              <h3>{{ item.title }}</h3>
              <p>{{ item.description }}</p>
              <div class="featured-price">{{ item.price }}元</div>
            </router-link>
          </div>
          <div v-if="featuredItems.length === 0" class="no-data">暂无置顶信息</div>
        </div>
      </div>
      
      <!-- 最新信息 -->
      <div class="latest-section">
        <h2>最新信息</h2>
        
        <!-- 房屋租售信息 -->
        <div class="info-section">
          <div class="section-header">
            <h3>房屋租售</h3>
            <router-link to="/house" class="more">更多</router-link>
          </div>
          <div class="info-list">
            <div v-for="house in houses.slice(0, 8)" :key="house.id" class="info-item">
              <router-link :to="`/house/detail/${house.id}`">
                <h4>{{ house.title }}</h4>
                <p>{{ house.price }}元 | {{ house.area }}㎡ | {{ house.location }}</p>
              </router-link>
            </div>
            <div v-if="houses.length === 0" class="no-data">暂无房屋租售信息</div>
          </div>
        </div>
        
        <!-- 二手物品信息 -->
        <div class="info-section">
          <div class="section-header">
            <h3>二手物品</h3>
            <router-link to="/secondhand" class="more">更多</router-link>
          </div>
          <div class="info-list">
            <div v-for="item in secondhandItems.slice(0, 8)" :key="item.id" class="info-item">
              <router-link :to="`/secondhand/detail/${item.id}`">
                <h4>{{ item.title }}</h4>
                <p>{{ item.price }}元 | {{ item.category }}</p>
              </router-link>
            </div>
            <div v-if="secondhandItems.length === 0" class="no-data">暂无二手物品信息</div>
          </div>
        </div>
        
        <!-- 车辆买卖信息 -->
        <div class="info-section">
          <div class="section-header">
            <h3>车辆买卖</h3>
            <router-link to="/vehicle" class="more">更多</router-link>
          </div>
          <div class="info-list">
            <div v-for="vehicle in vehicles.slice(0, 8)" :key="vehicle.id" class="info-item">
              <router-link :to="`/vehicle/detail/${vehicle.id}`">
                <h4>{{ vehicle.title }}</h4>
                <p>{{ vehicle.price }}元 | {{ vehicle.brand }} | {{ vehicle.year }}年</p>
              </router-link>
            </div>
            <div v-if="vehicles.length === 0" class="no-data">暂无车辆买卖信息</div>
          </div>
        </div>
        
        <!-- 生活服务信息 -->
        <div class="info-section">
          <div class="section-header">
            <h3>生活服务</h3>
            <router-link to="/service" class="more">更多</router-link>
          </div>
          <div class="info-list">
            <div v-for="service in services.slice(0, 8)" :key="service.id" class="info-item">
              <router-link :to="`/service/detail/${service.id}`">
                <h4>{{ service.title }}</h4>
                <p>{{ service.price }}元 | {{ service.category }} | {{ service.contact }}</p>
              </router-link>
            </div>
            <div v-if="services.length === 0" class="no-data">暂无生活服务信息</div>
          </div>
        </div>
      </div>
    </div>
    

  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Home',
  data() {
    return {
      searchQuery: '',
      houses: [],
      secondhandItems: [],
      vehicles: [],
      services: [],
      featuredItems: []
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      try {
        // 从后端API获取数据
        const [housesResponse, secondhandResponse, vehicleResponse, serviceResponse] = await Promise.all([
          axios.get('/api/houses'),
          axios.get('/api/secondhand'),
          axios.get('/api/vehicles'),
          axios.get('/api/services')
        ]);
        
        // 处理新的API响应格式
        this.houses = housesResponse.data.items || housesResponse.data;
        this.secondhandItems = secondhandResponse.data.items || secondhandResponse.data;
        this.vehicles = vehicleResponse.data.items || vehicleResponse.data;
        this.services = serviceResponse.data.items || serviceResponse.data;
        
        // 从所有数据中随机选择置顶信息
        this.setFeaturedItems();
      } catch (error) {
        console.error('获取数据失败:', error)
        // 如果API调用失败，使用模拟数据作为 fallback
        this.houses = [
          { id: 1, title: '芝罘区精装修两居室', price: 3200, area: 85, location: '芝罘区南大街', description: '交通便利，周边配套齐全' },
          { id: 2, title: '莱山区海景房', price: 4500, area: 120, location: '莱山区滨海路', description: '一线海景，视野开阔' },
          { id: 3, title: '开发区单身公寓', price: 1800, area: 45, location: '开发区长江路', description: '精装修，拎包入住' }
        ]
        
        this.secondhandItems = [
          { id: 1, title: ' MacBook Pro 2021', price: 8999, category: '电子产品', description: '九成新，无划痕' },
          { id: 2, title: '宜家沙发', price: 1299, category: '家具', description: '使用一年，状态良好' },
          { id: 3, title: '尼康相机', price: 3499, category: '摄影器材', description: '带两个镜头，配件齐全' }
        ]
        
        this.vehicles = [
          { id: 1, title: '丰田卡罗拉 2022款', price: 98000, brand: '丰田', year: 2022, description: '自动挡，行驶1万公里' },
          { id: 2, title: '本田思域 2021款', price: 115000, brand: '本田', year: 2021, description: '手动挡，运动版' },
          { id: 3, title: '宝马3系 2020款', price: 220000, brand: '宝马', year: 2020, description: '豪华版，全景天窗' }
        ]
        
        this.services = [
          { id: 1, title: '专业搬家服务', price: 200, category: '搬家', contact: '13812345678', description: '全市范围内，价格合理' },
          { id: 2, title: '家庭保洁', price: 150, category: '家政', contact: '13987654321', description: '专业设备，服务周到' },
          { id: 3, title: '婚礼摄影', price: 800, category: '摄影', contact: '13765432109', description: '十年经验，效果保证' }
        ]
        
        // 从模拟数据中随机选择置顶信息
        this.setFeaturedItems();
      }
    },
    search() {
      if (this.searchQuery) {
        // 实际项目中会调用搜索API
        console.log('搜索:', this.searchQuery)
        // 可以跳转到搜索结果页面或过滤当前列表
      }
    },
    setFeaturedItems() {
      // 合并所有数据
      let allItems = [];
      
      // 处理房屋数据
      this.houses.forEach(house => {
        allItems.push({
          id: `house-${house.id}`,
          category: 'house',
          itemId: house.id,
          title: house.title,
          description: house.description || '房屋租售信息',
          price: house.price
        });
      });
      
      // 处理二手物品数据
      this.secondhandItems.forEach(item => {
        allItems.push({
          id: `secondhand-${item.id}`,
          category: 'secondhand',
          itemId: item.id,
          title: item.title,
          description: item.description || '二手物品信息',
          price: item.price
        });
      });
      
      // 处理车辆数据
      this.vehicles.forEach(vehicle => {
        allItems.push({
          id: `vehicle-${vehicle.id}`,
          category: 'vehicle',
          itemId: vehicle.id,
          title: vehicle.title,
          description: vehicle.description || '车辆买卖信息',
          price: vehicle.price
        });
      });
      
      // 处理生活服务数据
      this.services.forEach(service => {
        allItems.push({
          id: `service-${service.id}`,
          category: 'service',
          itemId: service.id,
          title: service.title,
          description: service.description || '生活服务信息',
          price: service.price
        });
      });
      
      // 随机排序
      allItems.sort(() => Math.random() - 0.5);
      
      // 取前3个作为置顶信息
      this.featuredItems = allItems.slice(0, 3);
    },
    getFeaturedItemLink(item) {
      // 使用item中的category和itemId字段生成链接
      if (item.category && item.itemId) {
        return `/${item.category}/detail/${item.itemId}`;
      }
      return '/';
    }
  }
}
</script>

<style scoped>
/* 全局样式 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 搜索栏 */
.search-section {
  background-color: #f8f9fa;
  padding: 20px 0;
  border-bottom: 1px solid #e0e0e0;
}

.search-bar {
  display: flex;
  max-width: 600px;
  margin: 0 auto;
  gap: 10px;
}

.search-input {
  flex: 1;
  padding: 10px 15px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 16px;
}

.search-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0 20px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.search-btn:hover {
  background-color: #c82333;
}

/* 主内容区 */
.main-content {
  padding: 20px 0;
}

/* 分类网格 */
.category-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.category-card {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  transition: transform 0.3s ease;
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.category-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.category-card h3 {
  margin: 0 0 10px 0;
  color: #333;
}

.category-card p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

/* 横幅 */
.banner {
  margin-bottom: 30px;
  border-radius: 8px;
  overflow: hidden;
}

.banner img {
  width: 100%;
  height: 300px;
  object-fit: cover;
}

/* 置顶信息 */
.featured-section {
  margin-bottom: 30px;
}

.featured-section h2 {
  margin: 0 0 20px 0;
  color: #333;
  border-bottom: 2px solid #dc3545;
  padding-bottom: 10px;
}

.featured-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.featured-card {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  position: relative;
}

.featured-tag {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #dc3545;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
}

.featured-card h3 {
  margin: 0 0 10px 0;
  color: #333;
}

.featured-card p {
  margin: 0 0 15px 0;
  color: #666;
  font-size: 14px;
}

.featured-price {
  font-weight: bold;
  color: #dc3545;
  font-size: 18px;
}

/* 最新信息 */
.latest-section {
  margin-bottom: 30px;
}

.latest-section h2 {
  margin: 0 0 20px 0;
  color: #333;
  border-bottom: 2px solid #dc3545;
  padding-bottom: 10px;
}

.info-section {
  margin-bottom: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.section-header h3 {
  margin: 0;
  color: #333;
}

.more {
  color: #007bff;
  font-size: 14px;
}

.info-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.info-item {
  background-color: #f8f9fa;
  border-radius: 4px;
  padding: 10px;
  transition: background-color 0.3s ease;
}

.info-item:hover {
  background-color: #e9ecef;
}

.info-item h4 {
  margin: 0 0 5px 0;
  color: #333;
  font-size: 16px;
}

.info-item p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.no-data {
  grid-column: 1 / -1;
  text-align: center;
  padding: 20px;
  color: #999;
  background-color: #f8f9fa;
  border-radius: 4px;
}



/* 响应式设计 */
@media (max-width: 768px) {
  /* 分类网格 */
  .category-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
  
  /* 横幅 */
  .banner img {
    height: 200px;
  }
  
  /* 置顶信息 */
  .featured-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  
  /* 最新信息 */
  .info-list {
    grid-template-columns: 1fr;
  }
  

  
  /* 导航菜单 */
  .nav-links {
    flex-wrap: wrap;
  }
  
  .nav-links li {
    margin: 5px;
  }
}

@media (max-width: 360px) {
  /* 分类网格 */
  .category-grid {
    grid-template-columns: 1fr;
  }
  
  /* 横幅 */
  .banner img {
    height: 150px;
  }
  
  /* 容器 */
  .container {
    padding: 0 10px;
  }
  
  /* 主内容区 */
  .main-content {
    padding: 10px 0;
  }
}

/* 通用链接样式 */
a {
  color: #333;
  text-decoration: none;
}

a:hover {
  color: #dc3545;
  text-decoration: underline;
}
</style>
import { defineStore } from 'pinia'
import axios from 'axios'

export const useAdminStore = defineStore('admin', {
  state: () => ({
    isLoggedIn: false,
    loading: false,
    error: null,
    // 分页和搜索状态
    pagination: {
      house: { page: 1, pageSize: 10, total: 0, search: '' },
      secondhand: { page: 1, pageSize: 10, total: 0, search: '' },
      vehicle: { page: 1, pageSize: 10, total: 0, search: '' },
      service: { page: 1, pageSize: 10, total: 0, search: '' },
      user: { page: 1, pageSize: 10, total: 0, search: '' }
    },
    // 数据状态
    houses: [],
    secondhandItems: [],
    vehicles: [],
    services: [],
    users: [],
    pendingItems: {
      houses: [],
      secondhand: [],
      vehicles: [],
      services: []
    }
  }),
  
  getters: {
    isAdminLoading: (state) => state.loading,
    getAdminError: (state) => state.error,
    getHouses: (state) => state.houses,
    getSecondhandItems: (state) => state.secondhandItems,
    getVehicles: (state) => state.vehicles,
    getServices: (state) => state.services,
    getUsers: (state) => state.users,
    getPendingItems: (state) => state.pendingItems,
    getPagination: (state) => state.pagination
  },
  
  actions: {
    async login(username, password) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.post('/api/login', { username, password })
        if (response.data.message === '登录成功') {
          this.isLoggedIn = true
          localStorage.setItem('token', 'admin')
        }
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || '登录失败'
        throw error
      } finally {
        this.loading = false
      }
    },
    
    logout() {
      this.isLoggedIn = false
      localStorage.removeItem('token')
    },
    
    checkLogin() {
      const token = localStorage.getItem('token')
      this.isLoggedIn = !!token
    },
    
    // 房屋管理
    async fetchHouses() {
      try {
        const response = await axios.get('/api/houses', {
          params: {
            page: this.pagination.house.page,
            pageSize: this.pagination.house.pageSize,
            search: this.pagination.house.search,
            contactPhone: this.pagination.house.search
          }
        })
        this.houses = response.data.items || response.data
        this.pagination.house.total = response.data.total || this.houses.length
      } catch (error) {
        console.error('获取房屋信息失败:', error)
        this.error = '获取房屋信息失败'
      }
    },
    
    // 二手物品管理
    async fetchSecondhand() {
      try {
        const response = await axios.get('/api/secondhand', {
          params: {
            page: this.pagination.secondhand.page,
            pageSize: this.pagination.secondhand.pageSize,
            search: this.pagination.secondhand.search,
            contactPhone: this.pagination.secondhand.search
          }
        })
        this.secondhandItems = response.data.items || response.data
        this.pagination.secondhand.total = response.data.total || this.secondhandItems.length
      } catch (error) {
        console.error('获取二手物品信息失败:', error)
        this.error = '获取二手物品信息失败'
      }
    },
    
    // 车辆管理
    async fetchVehicles() {
      try {
        const response = await axios.get('/api/vehicles', {
          params: {
            page: this.pagination.vehicle.page,
            pageSize: this.pagination.vehicle.pageSize,
            search: this.pagination.vehicle.search,
            contactPhone: this.pagination.vehicle.search
          }
        })
        this.vehicles = response.data.items || response.data
        this.pagination.vehicle.total = response.data.total || this.vehicles.length
      } catch (error) {
        console.error('获取车辆信息失败:', error)
        this.error = '获取车辆信息失败'
      }
    },
    
    // 生活服务管理
    async fetchServices() {
      try {
        const response = await axios.get('/api/services', {
          params: {
            page: this.pagination.service.page,
            pageSize: this.pagination.service.pageSize,
            search: this.pagination.service.search,
            contactPhone: this.pagination.service.search
          }
        })
        this.services = response.data.items || response.data
        this.pagination.service.total = response.data.total || this.services.length
      } catch (error) {
        console.error('获取生活服务信息失败:', error)
        this.error = '获取生活服务信息失败'
      }
    },
    
    // 用户管理
    async fetchUsers() {
      try {
        const response = await axios.get('/api/users', {
          params: {
            page: this.pagination.user.page,
            pageSize: this.pagination.user.pageSize,
            phone: this.pagination.user.search
          }
        })
        this.users = response.data.items || response.data
        this.pagination.user.total = response.data.total || this.users.length
      } catch (error) {
        console.error('获取用户信息失败:', error)
        this.error = '获取用户信息失败'
      }
    },
    
    // 审核管理
    async fetchPendingItems(searchContactPhone = '') {
      try {
        const response = await axios.get('/api/moderation/pending', {
          params: {
            contactPhone: searchContactPhone
          }
        })
        this.pendingItems = response.data
      } catch (error) {
        console.error('获取待审核内容失败:', error)
        this.error = '获取待审核内容失败'
      }
    },
    
    // 分页相关
    changePage(type, page) {
      if (this.pagination[type]) {
        this.pagination[type].page = page
        // 根据类型调用对应的获取数据方法
        switch (type) {
          case 'house':
            this.fetchHouses()
            break
          case 'secondhand':
            this.fetchSecondhand()
            break
          case 'vehicle':
            this.fetchVehicles()
            break
          case 'service':
            this.fetchServices()
            break
          case 'user':
            this.fetchUsers()
            break
        }
      }
    },
    
    // 更新搜索关键词
    updateSearch(type, search) {
      if (this.pagination[type]) {
        this.pagination[type].search = search
        this.pagination[type].page = 1 // 重置到第一页
        // 根据类型调用对应的获取数据方法
        switch (type) {
          case 'house':
            this.fetchHouses()
            break
          case 'secondhand':
            this.fetchSecondhand()
            break
          case 'vehicle':
            this.fetchVehicles()
            break
          case 'service':
            this.fetchServices()
            break
          case 'user':
            this.fetchUsers()
            break
        }
      }
    }
  }
})
import { defineStore } from 'pinia'
import axios from 'axios'

export const useUserStore = defineStore('user', {
  state: () => ({
    isLoggedIn: false,
    userInfo: null,
    coins: 0,
    loading: false,
    error: null
  }),
  
  getters: {
    getUserInfo: (state) => state.userInfo,
    user: (state) => state.userInfo,
    getCoins: (state) => state.coins,
    isUserLoading: (state) => state.loading,
    getUserError: (state) => state.error
  },
  
  actions: {
    async login(username, password) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.post('/api/login/user', { username, password })
        if (response.data.message === '登录成功') {
          this.isLoggedIn = true
          this.userInfo = response.data.user
          this.coins = response.data.user.coins
          localStorage.setItem('user', JSON.stringify(response.data.user))
        }
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || '登录失败'
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async logout() {
      this.isLoggedIn = false
      this.userInfo = null
      this.coins = 0
      localStorage.removeItem('user')
    },
    
    async fetchUserCoins(userId) {
      try {
        const response = await axios.get(`/api/users/${userId}`)
        if (response.data) {
          this.coins = response.data.coins
          if (this.userInfo) {
            this.userInfo.coins = response.data.coins
            localStorage.setItem('user', JSON.stringify(this.userInfo))
          }
        }
        return response.data
      } catch (error) {
        console.error('获取金币失败:', error)
        throw error
      }
    },
    
    checkLogin() {
      const user = localStorage.getItem('user')
      if (user) {
        try {
          const userData = JSON.parse(user)
          this.isLoggedIn = true
          this.userInfo = userData
          this.coins = userData.coins
        } catch (error) {
          console.error('解析用户数据失败:', error)
          this.logout()
        }
      }
    }
  }
})
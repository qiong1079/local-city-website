import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'
import House from './views/House.vue'
import Secondhand from './views/Secondhand.vue'
import Vehicle from './views/Vehicle.vue'
import Service from './views/Service.vue'
import Admin from './views/Admin.vue'
import Register from './views/Register.vue'
import RegisterPersonal from './views/RegisterPersonal.vue'
import RegisterOrganization from './views/RegisterOrganization.vue'
import Login from './views/Login.vue'
import UserCenter from './views/UserCenter.vue'
import Contact from './views/Contact.vue'
import MemberAd from './views/MemberAd.vue'
import About from './views/About.vue'
import OperationPrompt from './views/OperationPrompt.vue'
import CoinRecharge from './views/CoinRecharge.vue'
import Post from './views/Post.vue'
import InfoDetail from './views/InfoDetail.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/house',
    name: 'House',
    component: House
  },
  {
    path: '/secondhand',
    name: 'Secondhand',
    component: Secondhand
  },
  {
    path: '/vehicle',
    name: 'Vehicle',
    component: Vehicle
  },
  {
    path: '/service',
    name: 'Service',
    component: Service
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/register/personal',
    name: 'RegisterPersonal',
    component: RegisterPersonal
  },
  {
    path: '/register/organization',
    name: 'RegisterOrganization',
    component: RegisterOrganization
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/usercenter',
    name: 'UserCenter',
    component: UserCenter
  },

  {
    path: '/contact',
    name: 'Contact',
    component: Contact
  },
  {
    path: '/member-ad',
    name: 'MemberAd',
    component: MemberAd
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },

  {
    path: '/operation-prompt',
    name: 'OperationPrompt',
    component: OperationPrompt
  },
  {
    path: '/coin-recharge',
    name: 'CoinRecharge',
    component: CoinRecharge
  },
  {
    path: '/post',
    name: 'Post',
    component: Post
  },
  {
    path: '/:category/detail/:id',
    name: 'InfoDetail',
    component: InfoDetail
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
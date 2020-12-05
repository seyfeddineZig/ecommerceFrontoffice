import Vue from 'vue'
import axios from 'axios'
// We create our own axios instance and set a custom base URL.
// Note that if we wouldn't set any config here we do not need
// a named export, as we could just `import axios from 'axios'`
const axiosInstance = axios.create({
  baseURL: 'http://thebestdeal-dz.tk/backend/public/api/'
})

const token = localStorage.getItem('T')
if (token) {
  axiosInstance.defaults.headers.common.Authorization = 'Bearer ' + token
}

// for use inside Vue files through this.$axios
Vue.prototype.$axios = axiosInstance
// Here we define a named export
// that we can later use inside .js files:
export { axiosInstance }

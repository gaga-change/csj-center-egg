import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './sys/app.vue'

Vue.use(ElementUI);
Vue.prototype.$ELEMENT = { size: 'mini', zIndex: 3000 };

import('./lib').then(({ $, io }) => {
  Vue.prototype.$$ = $;
  Vue.prototype.$io = io;
  new Vue(App).$mount('#app')
})

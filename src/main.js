import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false;
Vue.use(VueRouter);

import Map from './components/Map.vue';
import Imprint from './components/Imprint.vue';

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: '/', component: Map },
    { path: '/imprint', component: Imprint }
  ]
});

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app');

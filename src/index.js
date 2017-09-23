import Vue from 'vue';
import VueRouter from 'vue-router';
import VueMaterial from 'vue-material';
import VueThemes from './themes';
import App from './app';
import routes from './routes';

import 'roboto-fontface/css/roboto/roboto-fontface.css';
import 'material-design-icons/iconfont/material-icons.css';
import 'vue-material/dist/vue-material.css';

Vue.config.productionTip = false;
Vue.use(VueRouter);
Vue.use(VueMaterial);
Vue.material.registerTheme(VueThemes);

new Vue({
  el: '#app',
  template: '<App/>',
  components: {
    App,
  },
  router: new VueRouter({
    routes,
  }),
});

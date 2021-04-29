import Amplify, { Auth } from 'aws-amplify';
import Vue from 'vue';
import App from './App.vue';
import awsExports from './aws-exports';
import './registerServiceWorker';
import router from './router';
import store from './store';
import '@aws-amplify/ui-vue';

Vue.config.productionTip = false;

Amplify.configure(awsExports);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');

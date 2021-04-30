import Amplify, { Hub } from 'aws-amplify';
import Vue from 'vue';
import App from './App.vue';
import awsExports from './aws-exports';
import './registerServiceWorker';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

Amplify.configure(awsExports);

new Vue({
  router,
  store,
  mounted() {
    Hub.listen('auth', ({ payload: { event, data } }) => {
      console.log('Hub', event, data);
      switch (event) {
        case 'signIn':
          break;
        case 'signOut':
          break;
        case 'customOAuthState':
          if (data === 'REDIRECT_KEY_NAME') {
            const redirectTo = localStorage.getItem('REDIRECT_KEY_NAME');
            localStorage.removeItem('REDIRECT_KEY_NAME');
            this.$router.push(redirectTo);
          }
          break;
        default:
          break;
      }
    });
  },
  render: (h) => h(App),
}).$mount('#app');

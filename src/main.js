import Amplify, { Auth, Hub } from 'aws-amplify';
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
    Hub.listen('auth', async ({ payload: { event, data } }) => {
      console.log('Hub', event, data);
      if (['signIn', 'tokenRefresh'].includes(event)) {
        const accessToken = (await Auth.currentSession())
          .getAccessToken()
          .getJwtToken();
        console.log('accessToken', accessToken);
      } else if (event === 'customOAuthState') {
        if (data === 'REDIRECT_KEY_NAME') {
          const redirectTo = localStorage.getItem('REDIRECT_KEY_NAME');
          localStorage.removeItem('REDIRECT_KEY_NAME');
          this.$router.push(redirectTo);
        }
      }
    });
  },
  render: (h) => h(App),
}).$mount('#app');

import Amplify from 'aws-amplify';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
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

onAuthUIStateChange((nextAuthState, authData) => {
  if (nextAuthState === AuthState.SignedIn) {
    console.log('user successfully signed in!', authData.signInUserSession.accessToken.jwtToken);
  }
});

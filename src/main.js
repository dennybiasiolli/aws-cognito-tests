import { Translations } from '@aws-amplify/ui-components';
import Amplify, { Auth, Hub, I18n } from 'aws-amplify';
import '@aws-amplify/ui-vue';
import Vue from 'vue';
import App from './App.vue';
import awsExports from './aws-exports';
import './registerServiceWorker';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

Amplify.configure(awsExports);

I18n.putVocabulariesForLanguage(navigator.language, {
  [Translations.CONFIRM_TOTP_CODE]: 'Enter code from your Authenticator App',
  [Translations.CODE_LABEL]: 'CODE_LABEL 2',
  [Translations.CODE_PLACEHOLDER]: 'CODE_PLACEHOLDER 2',
});

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

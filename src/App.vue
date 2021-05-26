<template>
  <div>
    <amplify-authenticator>
      <amplify-sign-in slot="sign-in" hide-sign-up="true" />
      <amplify-totp-setup
        slot="totp-setup"
        header-text="My Custom TOTP Setup Text"
      />
      <amplify-confirm-sign-in
        slot="confirm-sign-in"
        header-text="Enter code from your Authenticator App"
        :formFields.prop="formFields"
        :user.prop="user"
      />
      <div v-if="authState === 'signedin' && user" id="app">
        <div id="nav">
          <router-link to="/">Home</router-link> |
          <router-link to="/about">About</router-link> |
          <button @click="handleSignOut">Logout</button>
        </div>
        <router-view />
      </div>
    </amplify-authenticator>
  </div>
</template>

<script>
import { Auth } from 'aws-amplify';
import { onAuthUIStateChange } from '@aws-amplify/ui-components';

import axios from 'axios';

export default {
  data() {
    return {
      user: undefined,
      authState: undefined,
      unsubscribeAuth: undefined,
      formFields: [
        {
          type: 'code',
          required: true,
          inputProps: {
            type: 'text', // specify the actual html input type here
            inputmode: 'numeric',
            pattern: '[0-9]*',
            autocomplete: 'one-time-code',
            required: true,
          },
        },
      ],
    };
  },
  created() {
    this.unsubscribeAuth = onAuthUIStateChange((authState, authData) => {
      this.authState = authState;
      this.user = authData;
    });
  },
  async mounted() {
    try {
      const accessToken = (await Auth.currentSession())
        .getAccessToken()
        .getJwtToken();

      const { data } = await axios.get(
        `${process.env.VUE_APP_API}/api/v1/users/me/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: { expand: 'account' },
        }
      );
      console.log(data);
    } catch (err) {
      localStorage.setItem('REDIRECT_KEY_NAME', this.$route.fullPath);
      // Auth.federatedSignIn({
      //   customState: 'REDIRECT_KEY_NAME',
      // });
    }
  },
  beforeDestroy() {
    this.unsubscribeAuth();
  },
  methods: {
    handleSignOut() {
      Auth.signOut();
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>

<template>
  <amplify-authenticator>
    <amplify-sign-in slot="sign-in" hide-sign-up="true"></amplify-sign-in>
    <div v-if="isAuthenticated" id="app">
      <div id="nav">
        <router-link to="/">Home</router-link> |
        <router-link to="/about">About</router-link> |
        <button @click="handleSignOut">Logout</button>
      </div>
      <router-view />
    </div>
  </amplify-authenticator>
</template>

<script>
import { Auth, Hub } from 'aws-amplify';
import axios from 'axios';

export default {
  data() {
    return {
      isAuthenticated: false,
    };
  },
  async mounted() {
    const authEventHandler = async ({ payload: { event } }) => {
      if (
        ['signOut', 'signIn_failure', 'tokenRefresh_failure'].includes(event)
      ) {
        // Auth.signOut();
      } else {
        this.isAuthenticated = true;
      }
    };
    Hub.listen('auth', authEventHandler);

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

      this.isAuthenticated = true;
    } catch (err) {
      localStorage.setItem('REDIRECT_KEY_NAME', this.$route.fullPath);
      // Auth.federatedSignIn({
      //   customState: 'REDIRECT_KEY_NAME',
      // });
    }
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

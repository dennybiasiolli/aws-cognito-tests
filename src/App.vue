<template>
  <amplify-authenticator>
    <amplify-sign-in slot="sign-in" hide-sign-up="true"></amplify-sign-in>

    <template #sign-up> </template>
    <div id="app">
      <div id="nav">
        <router-link to="/">Home</router-link> |
        <router-link to="/about">About</router-link>
        <amplify-sign-out></amplify-sign-out>
      </div>
      <router-view />
    </div>
  </amplify-authenticator>
</template>

<script>
import { Auth } from 'aws-amplify';

export default {
  async mounted() {
    const accessToken = (await Auth.currentSession())
      .getAccessToken()
      .getJwtToken();
    console.log(accessToken);
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

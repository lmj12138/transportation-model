<template>
  <div id="app" class="app">
    <router-view />
  </div>
</template>
<script>

export default {
  name: "App",
};
</script>
<style lang="scss">
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  font-size: 16px;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  font-weight: 200;
  height: 100vh;
  // height: 100%;
  background-color: #dce1e9;
  margin: 0;
}
</style>

<template>
  <div id="app">
    <router-view/>
    <tabbar></tabbar>
  </div>
</template>

<script>
import tabbar from './components/tabbar.vue';
import './assets/css/icon.css'
export default {
  components: {
    tabbar
  },
  name: 'App'
}
</script>
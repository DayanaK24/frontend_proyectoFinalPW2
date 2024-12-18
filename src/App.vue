<template>
  <div id="app">
    <AppNavbar v-if="showNavbar" /> 
    <router-view />
  </div>
</template>

<script>
import AppNavbar from './components/AppNavbar.vue'; 

export default {
  name: 'App',
  components: {
    AppNavbar, 
  },
  computed: {
    showNavbar() {
      return this.$route.path !== '/login' && this.$route.path !== '/register';
    },
  },
};
</script>

<style>
/* Puedes agregar estilos generales aquí */
</style>

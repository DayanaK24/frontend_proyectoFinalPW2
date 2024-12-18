<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container">
      <router-link to="/" class="navbar-brand">Estacionamiento</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link to="/principal" class="nav-link">Principal</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/estacionamiento" class="nav-link">Estacionamiento</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/tarifas" class="nav-link">Tarifas</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/incidentes" class="nav-link">Incidentes</router-link>
          </li>
          <li class="nav-item">
            <button @click="cerrarSesion" class="btn btn-danger">Cerrar Sesión</button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'AppNavbar', 
  methods: {
    cerrarSesion() {
      localStorage.removeItem('usuario');
      this.$router.push('/login');
    },
  },
};
</script>

<style scoped>
.navbar {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>

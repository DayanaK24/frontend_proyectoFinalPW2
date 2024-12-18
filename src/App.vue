<template>
  <div id="app">
    <!-- Menú de navegación -->
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">Estacionamiento</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <router-link to="/principal" class="nav-link" active-class="active">Estacionamientos</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/tarifas" class="nav-link" active-class="active">Tarifas</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/control" class="nav-link" active-class="active">Control</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <!-- Vista principal -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
};
</script>

<style>
.nav-link {
  color: #000 !important;
}
.nav-link.active {
  color: #007bff !important;
}
</style>

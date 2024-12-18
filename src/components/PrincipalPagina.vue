<template>
  <div class="container mt-5">
    <!-- Encabezado de bienvenida -->
    <h1 class="text-center">Bienvenido, {{ usuario.usuarioIngresado }}</h1>

    <div class="card mt-4 mx-auto" style="width: 24rem;">
      <div class="card-body">
        <h5 class="card-title text-center">Información del Usuario</h5>
        <p class="card-text">
          <strong>Usuario:</strong> {{ usuario.usuarioIngresado }}
        </p>
        <p class="card-text">
          <strong>Código Único:</strong> {{ usuario.codigo_unico }}
        </p>
        <button @click="cerrarSesion" class="btn btn-danger w-100">Cerrar Sesión</button>
      </div>
    </div>

    <div class="text-center mt-5">
      <button
        class="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#agregarEstacionamientoModal"
      >
        Agregar Nuevo Estacionamiento
      </button>
    </div>

    <div
      class="modal fade"
      id="agregarEstacionamientoModal"
      tabindex="-1"
      aria-labelledby="agregarEstacionamientoModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="agregarEstacionamientoModalLabel">
              Agregar Nuevo Estacionamiento
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="agregarEstacionamiento">
              <div class="mb-3">
                <label for="nombre" class="form-label">Nombre</label>
                <input
                  v-model="nuevoEstacionamiento.nombre"
                  id="nombre"
                  type="text"
                  class="form-control"
                  placeholder="Nombre del Estacionamiento"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="ubicacion" class="form-label">Ubicación</label>
                <input
                  v-model="nuevoEstacionamiento.ubicacion"
                  id="ubicacion"
                  type="text"
                  class="form-control"
                  placeholder="Ubicación"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="espacios_totales" class="form-label">Espacios Totales</label>
                <input
                  v-model="nuevoEstacionamiento.espacios_totales"
                  id="espacios_totales"
                  type="number"
                  class="form-control"
                  placeholder="Espacios Totales"
                  required
                />
              </div>
              <button type="submit" class="btn btn-primary w-100">
                Guardar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-5">
      <h2 class="text-center">Estacionamientos</h2>
      <div v-if="loading" class="text-center my-4">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
      </div>
      <div v-else>
        <div v-if="estacionamientos.length > 0">
          <div class="row">
            <div
              v-for="estacionamiento in estacionamientos"
              :key="estacionamiento.id"
              class="col-md-6"
            >
              <div class="card mb-4 shadow-sm">
                <div class="card-body">
                  <h5 class="card-title">{{ estacionamiento.nombre }}</h5>
                  <p class="card-text">
                    <strong>Ubicación:</strong> {{ estacionamiento.ubicacion }}
                  </p>
                  <p class="card-text">
                    <strong>Espacios Totales:</strong> {{ estacionamiento.espacios_totales }}
                  </p>
                  <h6>Espacios:</h6>
                  <ul class="list-group">
                    <li
                      v-for="espacio in estacionamiento.espacios"
                      :key="espacio.id"
                      class="list-group-item"
                    >
                      Espacio #{{ espacio.numero }} - 
                      <span
                        :class="{
                          'text-success': espacio.disponible,
                          'text-danger': !espacio.disponible,
                        }"
                      >
                        {{ espacio.disponible ? 'Disponible' : 'Ocupado' }}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="alert alert-warning text-center" role="alert">
          No hay estacionamientos disponibles.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      usuario: {},
      estacionamientos: [],
      nuevoEstacionamiento: {
        nombre: '',
        ubicacion: '',
        espacios_totales: 0,
      },
      loading: false,
    };
  },
  mounted() {
    const usuarioData = localStorage.getItem('usuario');
    if (usuarioData) {
      this.usuario = JSON.parse(usuarioData);
      this.obtenerEstacionamientos();
    } else {
      this.$router.push('/login');
    }
  },
  methods: {
    async obtenerEstacionamientos() {
      this.loading = true;
      try {
        const response = await fetch('http://127.0.0.1:8000/api/estacionamientos/listar/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            usuario: this.usuario.usuarioIngresado,
            codigo_unico: this.usuario.codigo_unico,
          }),
        });

        if (!response.ok) {
          throw new Error('Error al obtener estacionamientos');
        }

        this.estacionamientos = await response.json();
      } catch (err) {
        console.error(err.message);
      } finally {
        this.loading = false;
      }
    },
    async agregarEstacionamiento() {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/estacionamientos/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            usuario: this.usuario.usuarioIngresado,
            codigo_unico: this.usuario.codigo_unico,
            ...this.nuevoEstacionamiento,
          }),
        });

        if (!response.ok) {
          throw new Error('Error al agregar estacionamiento');
        }

        const nuevo = await response.json();
        this.estacionamientos.push(nuevo); 
        alert('Estacionamiento agregado exitosamente.');
      } catch (err) {
        console.error(err.message);
        alert('Error al agregar estacionamiento.');
      }
    },
    cerrarSesion() {
      localStorage.removeItem('usuario');
      this.$router.push('/login');
    },
  },
};
</script>

<style>
.card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}
</style>

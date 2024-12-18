<template>
  <div class="container">
    <h1 class="text-center">Estacionamiento</h1>

    <!-- Mostrar cantidad total de espacios -->
    <div class="mb-4">
      <h2>Cantidad de Espacios Disponibles: {{ espaciosTotales }}</h2>
      <button class="btn btn-primary" @click="editarCantidadEspacios">Editar Cantidad de Espacios</button>
    </div>

    <!-- Listar los espacios con su disponibilidad -->
    <div v-if="espacios.length > 0" class="mb-4">
      <h3>Lista de Espacios</h3>
      <ul class="list-group">
        <li
          v-for="espacio in espacios"
          :key="espacio.id"
          class="list-group-item d-flex justify-content-between align-items-center"
        >
          Espacio {{ espacio.id }}
          <span :class="espacio.disponible ? 'badge bg-success' : 'badge bg-danger'">
            {{ espacio.disponible ? 'Disponible' : 'Ocupado' }}
          </span>
          <button
            v-if="espacio.disponible"
            @click="editarDisponibilidad(espacio.id, false)"
            class="btn btn-warning btn-sm"
          >
            Marcar como Ocupado
          </button>
          <button
            v-else
            @click="editarDisponibilidad(espacio.id, true)"
            class="btn btn-success btn-sm"
          >
            Marcar como Disponible
          </button>
        </li>
      </ul>
    </div>

    <!-- Mostrar mensaje de éxito/error -->
    <div v-if="successMessage" class="alert alert-success mt-3" role="alert">
      {{ successMessage }}
    </div>
    <div v-if="error" class="alert alert-danger mt-3" role="alert">
      {{ error }}
    </div>
  </div>
</template>

<script>
export default {
  name: "AppEstacionamiento",
  data() {
    return {
      espaciosTotales: 0, // Almacenar la cantidad de espacios totales
      espacios: [], // Almacenar la lista de espacios
      error: null, // Almacenar mensajes de error
      successMessage: null, // Almacenar mensajes de éxito
    };
  },
  created() {
    this.obtenerCantidadEspacios();
    this.listarEspacios();
  },
  methods: {
    // Obtener la cantidad total de espacios
    async obtenerCantidadEspacios() {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/cantidad-espacios/");
        if (!response.ok) {
          throw new Error("No se pudo obtener la cantidad de espacios");
        }
        const data = await response.json();
        this.espaciosTotales = data.espacios_totales;
      } catch (err) {
        this.error = err.message;
      }
    },

    // Editar la cantidad de espacios
    async editarCantidadEspacios() {
      const nuevaCantidad = prompt("Introduce la nueva cantidad de espacios:");
      if (nuevaCantidad && !isNaN(nuevaCantidad)) {
        try {
          const response = await fetch("http://127.0.0.1:8000/api/cantidad-espacios/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ espacios_totales: Number(nuevaCantidad) }),
          });
          if (!response.ok) {
            throw new Error("Error al actualizar la cantidad de espacios");
          }
          const data = await response.json();
          this.espaciosTotales = data.espacios_totales;
          this.successMessage = "Cantidad de espacios actualizada correctamente";
        } catch (err) {
          this.error = err.message;
        }
      } else {
        this.error = "Por favor, ingresa un número válido.";
      }
    },

    // Listar todos los espacios
    async listarEspacios() {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/lista-espacios/");
        if (!response.ok) {
          throw new Error("No se pudieron listar los espacios");
        }
        const data = await response.json();
        this.espacios = data;
      } catch (err) {
        this.error = err.message;
      }
    },

    // Editar la disponibilidad de un espacio
    async editarDisponibilidad(id, disponible) {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/editar-espacio/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id, disponible }),
        });
        if (!response.ok) {
          throw new Error("Error al editar la disponibilidad del espacio");
        }
        const data = await response.json();
        this.successMessage = `Espacio ${data.id} actualizado correctamente.`;
        this.listarEspacios(); // Actualizar la lista de espacios
      } catch (err) {
        this.error = err.message;
      }
    },
  },
};
</script>

<style scoped>
/* Estilos específicos para AppEstacionamiento */
.container {
  padding: 20px;
}

h1 {
  margin-bottom: 20px;
}

button {
  margin-left: 10px;
}

.list-group-item {
  margin-bottom: 10px;
}
</style>

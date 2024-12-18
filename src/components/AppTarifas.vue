<template>
  <div class="container">
    <h1 class="text-center">Tarifas de Estacionamiento</h1>

    <div class="mb-4">
      <button class="btn btn-primary" @click="mostrarFormularioAgregar">Agregar Tipo de Vehículo</button>
    </div>

    <div v-if="tiposVehiculos.length > 0" class="mb-4">
      <h3>Lista de Tipos de Vehículos</h3>
      <ul class="list-group">
        <li
          v-for="tipo in tiposVehiculos"
          :key="tipo.id"
          class="list-group-item d-flex justify-content-between align-items-center"
        >
          {{ tipo.tipo }} - ${{ tipo.tarifa_por_hora }} por hora
          <button @click="editarTipoVehiculo(tipo)" class="btn btn-warning btn-sm">Editar</button>
          <button @click="eliminarTipoVehiculo(tipo.id)" class="btn btn-danger btn-sm">Eliminar</button>
        </li>
      </ul>
    </div>

    <div v-if="formVisible" class="mt-4">
      <h3>{{ formData.id ? 'Editar' : 'Agregar' }} Tipo de Vehículo</h3>
      <form @submit.prevent="guardarTipoVehiculo">
        <div class="mb-3">
          <label for="tipo" class="form-label">Tipo de Vehículo</label>
          <input
            v-model="formData.tipo"
            id="tipo"
            type="text"
            class="form-control"
            placeholder="Tipo de vehículo"
            required
          />
        </div>
        <div class="mb-3">
          <label for="tarifa_por_hora" class="form-label">Tarifa por Hora</label>
          <input
            v-model="formData.tarifa_por_hora"
            id="tarifa_por_hora"
            type="number"
            class="form-control"
            placeholder="Tarifa por hora"
            required
            min="0"
          />
        </div>
        <button type="submit" class="btn btn-primary w-100">
          {{ formData.id ? 'Actualizar' : 'Agregar' }}
        </button>
      </form>
    </div>

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
  name: "AppTarifas",
  data() {
    return {
      tiposVehiculos: [],
      formData: {
        id: null,
        tipo: "",
        tarifa_por_hora: 0,
      },
      formVisible: false,
      successMessage: null,
      error: null,
    };
  },
  created() {
    this.obtenerTiposVehiculos();
  },
  methods: {
    async obtenerTiposVehiculos() {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/lista-tipo-vehiculo/");
        if (!response.ok) {
          throw new Error("No se pudieron obtener los tipos de vehículos");
        }
        const data = await response.json();
        this.tiposVehiculos = data;
      } catch (err) {
        this.error = err.message;
      }
    },
    mostrarFormularioAgregar() {
      this.formData = { id: null, tipo: "", tarifa_por_hora: 0 };
      this.formVisible = true;
    },
    async guardarTipoVehiculo() {
      if (this.formData.id) {
        await this.editarTipoVehiculoAPI();
      } else {
        await this.agregarTipoVehiculoAPI();
      }
    },
    async agregarTipoVehiculoAPI() {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/agregar-tipo-vehiculo/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.formData),
        });
        if (!response.ok) {
          throw new Error("Error al agregar tipo de vehículo");
        }
        const data = await response.json();
        this.tiposVehiculos.push(data);
        this.successMessage = "Tipo de vehículo agregado correctamente";
        this.formVisible = false;
      } catch (err) {
        this.error = err.message;
      }
    },
    async editarTipoVehiculo(tipo) {
      this.formData = { ...tipo };
      this.formVisible = true;
    },
    async editarTipoVehiculoAPI() {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/editar-tipo-vehiculo/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.formData),
        });
        if (!response.ok) {
          throw new Error("Error al editar tipo de vehículo");
        }
        const data = await response.json();
        const index = this.tiposVehiculos.findIndex((item) => item.id === data.id);
        this.tiposVehiculos[index] = data;
        this.successMessage = "Tipo de vehículo actualizado correctamente";
        this.formVisible = false;
      } catch (err) {
        this.error = err.message;
      }
    },
    async eliminarTipoVehiculo(id) {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/eliminar-tipo-vehiculo/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        });
        if (!response.ok) {
          throw new Error("Error al eliminar tipo de vehículo");
        }
        const data = await response.json();
        this.tiposVehiculos = this.tiposVehiculos.filter((tipo) => tipo.id !== id);
        this.successMessage = data.message;
      } catch (err) {
        this.error = err.message;
      }
    },
  },
};
</script>

<style scoped>
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

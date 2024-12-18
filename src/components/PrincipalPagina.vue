<template>
  <div class="container">
    <h1 class="text-center">Control de Estacionamiento</h1>

    <div class="mb-4">
      <button class="btn btn-primary" @click="mostrarFormularioRegistrarVehiculo">
        Registrar Vehículo
      </button>
    </div>

    <div v-if="formVisible" class="mt-4">
      <h3>Registrar Vehículo</h3>
      <form @submit.prevent="registrarVehiculo">
        <div class="mb-3">
          <label for="placa" class="form-label">Placa</label>
          <input
            v-model="formData.placa"
            id="placa"
            type="text"
            class="form-control"
            placeholder="Placa del vehículo"
            required
          />
        </div>

        <div class="mb-3">
          <label for="tipo_vehiculo" class="form-label">Tipo de Vehículo</label>
          <select v-model="formData.tipo_vehiculo" id="tipo_vehiculo" class="form-select" required>
            <option v-for="tipo in tiposVehiculos" :key="tipo.id" :value="tipo.id">
              {{ tipo.tipo }}
            </option>
          </select>
        </div>

        <div class="mb-3">
          <label for="espacio" class="form-label">Espacio de Estacionamiento</label>
          <select v-model="formData.espacio" id="espacio" class="form-select" required>
            <option v-for="espacio in espaciosDisponibles" :key="espacio.id" :value="espacio.id">
              Espacio {{ espacio.id }}
            </option>
          </select>
        </div>

        <button type="submit" class="btn btn-primary w-100">Registrar Vehículo</button>
      </form>
    </div>

    <div v-if="vehiculos.length > 0" class="mt-4">
      <h3>Lista de Vehículos</h3>
      <ul class="list-group">
        <li
          v-for="vehiculo in vehiculos"
          :key="vehiculo.id"
          class="list-group-item"
        >
          <p>Placa: {{ vehiculo.placa }}</p>
          <p>Tipo: {{ obtenerNombreTipo(vehiculo.tipo_vehiculo) }}</p>
          <p>Espacio: {{ obtenerNombreEspacio(vehiculo.espacio) }}</p>
          <p>Hora Entrada: {{ vehiculo.hora_entrada }}</p>
          <p v-if="vehiculo.hora_salida">Hora Salida: {{ vehiculo.hora_salida }}</p>
          <p v-if="vehiculo.precio_cobrado">Precio Cobrado: {{ vehiculo.precio_cobrado }}</p>
          <div class="d-flex justify-content-between">
            <button v-if="!vehiculo.hora_salida" @click="registrarSalida(vehiculo.id)" class="btn btn-warning btn-sm">Registrar Salida</button>
            <button @click="verVehiculo(vehiculo.id)" class="btn btn-info btn-sm">Ver</button>
          </div>
        </li>
      </ul>
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
  name: "PrincipalPagina",
  data() {
    return {
      vehiculos: [],
      tiposVehiculos: [],
      espaciosDisponibles: [],
      formData: {
        placa: "",
        tipo_vehiculo: null,
        espacio: null,
      },
      formVisible: false,
      successMessage: null,
      error: null,
    };
  },
  created() {
    this.obtenerTiposVehiculos();
    this.obtenerEspaciosDisponibles();
    this.obtenerVehiculos();
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
    async obtenerEspaciosDisponibles() {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/lista-espacios/");
        if (!response.ok) {
          throw new Error("No se pudieron obtener los espacios disponibles");
        }
        const data = await response.json();
        this.espaciosDisponibles = data.filter(espacio => 
          !this.vehiculos.some(vehiculo => vehiculo.espacio === espacio.id && !vehiculo.hora_salida)
        );
      } catch (err) {
        this.error = err.message;
      }
    },
    async obtenerVehiculos() {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/vehiculos/");
        if (!response.ok) {
          throw new Error("No se pudieron obtener los vehículos");
        }
        const data = await response.json();
        this.vehiculos = data;
      } catch (err) {
        this.error = err.message;
      }
    },
    obtenerNombreTipo(tipoId) {
      const tipo = this.tiposVehiculos.find((t) => t.id === tipoId);
      return tipo ? tipo.tipo : "Desconocido";
    },
    obtenerNombreEspacio(espacioId) {
      const espacio = this.espaciosDisponibles.find((e) => e.id === espacioId);
      return espacio ? `Espacio ${espacio.id}` : "Desconocido";
    },
    mostrarFormularioRegistrarVehiculo() {
      this.formData = { placa: "", tipo_vehiculo: null, espacio: null };
      this.formVisible = true;
    },
    async registrarVehiculo() {
      if (!this.formData.placa || !this.formData.tipo_vehiculo || !this.formData.espacio) {
        this.error = "Todos los campos son obligatorios";
        return;
      }
      try {
        const response = await fetch("http://127.0.0.1:8000/api/vehiculo/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(this.formData),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Error al registrar vehículo");
        }
        this.successMessage = "Vehículo registrado correctamente";
        this.obtenerVehiculos();
        this.obtenerEspaciosDisponibles();
        this.formVisible = false;
      } catch (err) {
        this.error = err.message;
      }
    },
    async registrarSalida(id) {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/vehiculo/salida/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ registro_id: id }),
        });
        if (!response.ok) {
          throw new Error("Error al registrar salida");
        }
        this.successMessage = "Salida registrada correctamente";
        this.obtenerVehiculos();
        this.obtenerEspaciosDisponibles();
      } catch (err) {
        this.error = err.message;
      }
    },
    verVehiculo(id) {
      const vehiculo = this.vehiculos.find((v) => v.id === id);
      if (vehiculo) {
        alert(`
          Detalles del Vehículo ${vehiculo.placa}:
          Tipo: ${this.obtenerNombreTipo(vehiculo.tipo_vehiculo)}
          Espacio: ${this.obtenerNombreEspacio(vehiculo.espacio)}
          Hora Entrada: ${vehiculo.hora_entrada}
          Hora Salida: ${vehiculo.hora_salida || "No disponible"}
          Precio Cobrado: ${vehiculo.precio_cobrado || "No disponible"}
        `);
      } else {
        this.error = "Vehículo no encontrado";
      }
    },
  },
};
</script>

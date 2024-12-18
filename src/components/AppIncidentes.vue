<template>
  <div class="container">
    <h1 class="text-center">Incidentes del Estacionamiento</h1>

    <div class="mb-4">
      <button class="btn btn-primary" @click="mostrarFormularioAgregarIncidente">
        Agregar Incidente
      </button>
    </div>

    <div v-if="formVisible" class="mt-4">
      <h3>Agregar Incidente</h3>
      <form @submit.prevent="agregarIncidente">
        <div class="mb-3">
          <label for="descripcion" class="form-label">Descripción</label>
          <input
            v-model="formData.descripcion"
            id="descripcion"
            type="text"
            class="form-control"
            placeholder="Descripción del incidente"
            required
          />
        </div>

        <div class="mb-3">
          <label for="espacio" class="form-label">Espacio</label>
          <select v-model="formData.espacio" id="espacio" class="form-select" required>
            <option v-for="espacio in espaciosDisponibles" :key="espacio.id" :value="espacio.id">
              Espacio {{ espacio.id }}
            </option>
          </select>
        </div>

        <button type="submit" class="btn btn-primary w-100">Registrar Incidente</button>
      </form>
    </div>

    <div v-if="incidentes.length > 0" class="mt-4">
      <h3>Lista de Incidentes</h3>
      <ul class="list-group">
        <li
          v-for="incidente in incidentes"
          :key="incidente.id"
          class="list-group-item"
        >
          <p><strong>Descripción:</strong> {{ incidente.descripcion }}</p>
          <p><strong>Fecha y Hora:</strong> {{ incidente.fecha_hora }}</p>
          <p><strong>Espacio:</strong> {{ obtenerNombreEspacio(incidente.espacio) }}</p>
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
  name: "IncidentesPagina",
  data() {
    return {
      incidentes: [],
      espaciosDisponibles: [],
      formData: {
        descripcion: "",
        espacio: null,
      },
      formVisible: false,
      successMessage: null,
      error: null,
    };
  },
  created() {
    this.obtenerIncidentes();
    this.obtenerEspaciosDisponibles();
  },
  methods: {
    async obtenerIncidentes() {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/incidentes/");
        if (!response.ok) {
          throw new Error("No se pudieron obtener los incidentes");
        }
        const data = await response.json();
        this.incidentes = data;
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
        this.espaciosDisponibles = data;
      } catch (err) {
        this.error = err.message;
      }
    },
    mostrarFormularioAgregarIncidente() {
      this.formData = { descripcion: "", espacio: null };
      this.formVisible = true;
    },
    async agregarIncidente() {
      if (!this.formData.descripcion || !this.formData.espacio) {
        this.error = "Todos los campos son obligatorios";
        return;
      }
      try {
        const response = await fetch("http://127.0.0.1:8000/api/incidentes/agregar/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(this.formData),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Error al agregar incidente");
        }
        const nuevoIncidente = await response.json();
        this.incidentes.push(nuevoIncidente);  // Agregar el incidente a la lista
        this.successMessage = "Incidente registrado correctamente";
        this.formVisible = false;
      } catch (err) {
        this.error = err.message;
      }
    },
    obtenerNombreEspacio(espacioId) {
      const espacio = this.espaciosDisponibles.find((e) => e.id === espacioId);
      return espacio ? `Espacio ${espacio.id}` : "Desconocido";
    },
  },
};
</script>

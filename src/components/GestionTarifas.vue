<template>
  <div class="container mt-5">
    <h2 class="text-center">Gestionar Tarifas de Vehículos</h2>

    <div class="card my-4">
      <div class="card-body">
        <h4 class="card-title">Agregar Tipo de Vehículo</h4>
        <form @submit.prevent="agregarVehiculo">
          <div class="mb-3">
            <label for="tipo" class="form-label">Tipo de Vehículo</label>
            <input
              v-model="nuevoVehiculo.tipo"
              id="tipo"
              type="text"
              class="form-control"
              placeholder="Tipo de Vehículo"
              required
            />
          </div>
          <div class="mb-3">
            <label for="tarifa" class="form-label">Tarifa</label>
            <input
              v-model="nuevoVehiculo.tarifa"
              id="tarifa"
              type="number"
              step="0.01"
              class="form-control"
              placeholder="Tarifa"
              required
            />
          </div>
          <div class="mb-3">
            <label for="estacionamiento" class="form-label">ID de Estacionamiento</label>
            <input
              v-model="nuevoVehiculo.estacionamiento_id"
              id="estacionamiento"
              type="number"
              class="form-control"
              placeholder="ID de Estacionamiento"
              required
            />
          </div>
          <button type="submit" class="btn btn-success w-100">Agregar</button>
        </form>
      </div>
    </div>

    <div v-if="loading" class="text-center my-4">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <div v-else>
      <div v-if="tiposVehiculos.length > 0">
        <div class="list-group">
          <div
            v-for="vehiculo in tiposVehiculos"
            :key="vehiculo.id"
            class="list-group-item d-flex justify-content-between align-items-center"
          >
            <span>{{ vehiculo.tipo }} - ${{ vehiculo.tarifa }}</span>
            <div>
              <button class="btn btn-warning btn-sm me-2" @click="mostrarModalEdicion(vehiculo)">Editar</button>
              <button class="btn btn-danger btn-sm" @click="eliminarVehiculo(vehiculo)">Eliminar</button>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="alert alert-warning text-center" role="alert">
        No hay tipos de vehículos registrados.
      </div>
    </div>

    <div class="modal fade" id="editarTarifaModal" tabindex="-1" aria-labelledby="editarTarifaModalLabel" aria-hidden="true" ref="modal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editarTarifaModalLabel">Editar Tarifa de Vehículo</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="guardarEdicion">
              <div class="mb-3">
                <label for="tipo-editar" class="form-label">Tipo de Vehículo</label>
                <input
                  v-model="vehiculoEditado.tipo"
                  id="tipo-editar"
                  type="text"
                  class="form-control"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="tarifa-editar" class="form-label">Tarifa</label>
                <input
                  v-model="vehiculoEditado.tarifa"
                  id="tarifa-editar"
                  type="number"
                  step="0.01"
                  class="form-control"
                  required
                />
              </div>
              <button type="submit" class="btn btn-primary w-100">Guardar</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.css';
import Modal from 'bootstrap/js/dist/modal';

export default {
  name: 'GestionTarifas',
  data() {
    return {
      tiposVehiculos: [],
      loading: false,
      nuevoVehiculo: {
        tipo: '',
        tarifa: '',
        estacionamiento_id: '',
      },
      vehiculoEditado: {
        id: null,
        tipo: '',
        tarifa: '',
      },
      modalInstance: null,
    };
  },
  mounted() {
    this.obtenerTiposVehiculos();
  },
  methods: {
    async obtenerTiposVehiculos() {
      this.loading = true;
      try {
        const response = await fetch('http://127.0.0.1:8000/api/tipo-vehiculo/', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) throw new Error('Error al obtener tipos de vehículos');
        this.tiposVehiculos = await response.json();
      } catch (err) {
        console.error(err.message);
      } finally {
        this.loading = false;
      }
    },
    async agregarVehiculo() {
      const usuario = 'juanperez'; 
      const codigo_unico = 'zfJzt827'; 

      try {
        const response = await fetch('http://127.0.0.1:8000/api/tipo-vehiculo/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...this.nuevoVehiculo, usuario, codigo_unico }),
        });
        if (!response.ok) throw new Error('Error al agregar tipo de vehículo');

        const data = await response.json();
        this.tiposVehiculos.push(data);
        alert('Tipo de vehículo agregado con éxito.');

        // Limpiar el formulario
        this.nuevoVehiculo.tipo = '';
        this.nuevoVehiculo.tarifa = '';
        this.nuevoVehiculo.estacionamiento_id = '';
      } catch (err) {
        alert('Error al agregar el tipo de vehículo.');
      }
    },
    mostrarModalEdicion(vehiculo) {
      this.vehiculoEditado = { ...vehiculo };
      const modalElement = this.$refs.modal;
      this.modalInstance = new Modal(modalElement);
      this.modalInstance.show();
    },
    async guardarEdicion() {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/tipo-vehiculo/${this.vehiculoEditado.id}/`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.vehiculoEditado),
        });
        if (!response.ok) throw new Error('Error al guardar la tarifa');

        const data = await response.json();
        const index = this.tiposVehiculos.findIndex((v) => v.id === data.id);
        this.tiposVehiculos[index] = data;

        alert('Tarifa actualizada correctamente.');
        this.modalInstance.hide();
      } catch (err) {
        alert('Error al actualizar la tarifa.');
      }
    },
    async eliminarVehiculo(vehiculo) {
      const usuario = 'juanperez'; 
      const codigo_unico = 'zfJzt827'; 

      try {
        const response = await fetch(`http://127.0.0.1:8000/api/tipo-vehiculo/${vehiculo.id}/`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ usuario, codigo_unico }),
        });
        if (!response.ok) throw new Error('Error al eliminar tipo de vehículo');

        const data = await response.json();
        alert(data.message);
        this.tiposVehiculos = this.tiposVehiculos.filter((v) => v.id !== vehiculo.id);
      } catch (err) {
        alert('Error al eliminar tipo de vehículo.');
      }
    },
  },
};
</script>

<style scoped>
.spinner-border {
  width: 3rem;
  height: 3rem;
}
</style>

<template>
  <div class="container d-flex justify-content-center align-items-center vh-100">
    <div class="card p-4" style="width: 22rem;">
      <h1 class="text-center mb-4">Registro</h1>
      <form class="needs-validation" @submit.prevent="registrar" novalidate>
        <div class="mb-3">
          <label for="nombreCompleto" class="form-label">Nombre Completo</label>
          <input
            v-model="form.nombre_completo"
            id="nombreCompleto"
            type="text"
            class="form-control"
            placeholder="Nombre Completo"
            required
          />
        </div>
        <div class="mb-3">
          <label for="usuario" class="form-label">Usuario</label>
          <input
            v-model="form.usuario"
            id="usuario"
            type="text"
            class="form-control"
            placeholder="Usuario"
            required
          />
        </div>
        <div class="mb-3">
          <label for="clave" class="form-label">Contraseña</label>
          <input
            v-model="form.clave"
            id="clave"
            type="password"
            class="form-control"
            placeholder="Contraseña"
            required
          />
        </div>
        <button type="submit" class="btn btn-primary w-100">Registrar</button>
      </form>
      <p class="text-center mt-3">
        ¿Ya tienes cuenta? 
        <router-link to="/login">Inicia sesión</router-link>
      </p>
      <div v-if="successMessage" class="alert alert-success mt-3" role="alert">
        {{ successMessage }}
      </div>
      <div v-if="error" class="alert alert-danger mt-3" role="alert">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        nombre_completo: '',
        usuario: '',
        clave: '',
      },
      error: null,
      successMessage: null,
    };
  },
  methods: {
    async registrar() {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/registrar/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.form),
        });

        if (!response.ok) {
          throw new Error('Error al registrar');
        }

        const data = await response.json();
        console.log('Registro exitoso:', data);
        this.successMessage = 'Registro exitoso. Redirigiendo a login...';
        setTimeout(() => this.$router.push('/login'), 2000);
      } catch (err) {
        this.error = err.message;
      }
    },
  },
};
</script>

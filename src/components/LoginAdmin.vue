<template>
  <div class="container d-flex justify-content-center align-items-center vh-100">
    <div class="card p-4" style="width: 22rem;">
      <h1 class="text-center mb-4">Iniciar Sesión</h1>
      <form class="needs-validation" @submit.prevent="login" novalidate>
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
        <button type="submit" class="btn btn-primary w-100">Iniciar Sesión</button>
      </form>
      <p class="text-center mt-3">
        ¿No tienes cuenta? 
        <router-link to="/register">Regístrate</router-link>
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
        usuario: '',
        clave: '',
      },
      error: null,
      successMessage: null,
    };
  },
  methods: {
    async login() {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/login/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.form),
        });

        if (!response.ok) {
          throw new Error('Error al iniciar sesión');
        }

        const serverData = await response.json();
        console.log('Inicio de sesión exitoso:', serverData);

        const usuarioData = {
          ...serverData, // Datos devueltos por el servidor
          usuarioIngresado: this.form.usuario,
        };

        localStorage.setItem('usuario', JSON.stringify(usuarioData));

        this.successMessage = 'Inicio de sesión exitoso. Redirigiendo...';
        setTimeout(() => this.$router.push('/principal'), 2000);
      } catch (err) {
        this.error = err.message;
      }
    },
  },
};
</script>

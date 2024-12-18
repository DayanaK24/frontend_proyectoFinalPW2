import { createRouter, createWebHistory } from 'vue-router';
import RegisterAdmin from '../components/RegisterAdmin.vue';
import LoginAdmin from '../components/LoginAdmin.vue';
import PrincipalPagina from '../components/PrincipalPagina.vue';
import AppEstacionamiento from '../components/AppEstacionamiento.vue';
import AppTarifas from '../components/AppTarifas.vue';
import AppIncidentes from '../components/AppIncidentes.vue';

const routes = [
  { path: '/register', component: RegisterAdmin },
  { path: '/login', component: LoginAdmin },
  { path: '/principal', component: PrincipalPagina },
  { path: '/estacionamiento', component: AppEstacionamiento },
  { path: '/tarifas', component: AppTarifas },
  { path: '/incidentes', component: AppIncidentes },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

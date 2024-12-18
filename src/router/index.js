import { createRouter, createWebHistory } from 'vue-router';
import RegisterAdmin from '../components/RegisterAdmin.vue';
import LoginAdmin from '../components/LoginAdmin.vue';
import PrincipalPagina from '../components/PrincipalPagina.vue';
import GestionTarifas from '../components/GestionTarifas.vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import 'bootstrap';

const routes = [
  { path: '/register', component: RegisterAdmin },
  { path: '/login', component: LoginAdmin },
  { path: '/principal', component: PrincipalPagina }, 
  { path: '/tarifas', component: GestionTarifas },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

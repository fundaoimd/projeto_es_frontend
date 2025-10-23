import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('./pages/MyHome.vue'),
  },
  {
    path: '/cliente',
    name: 'Cliente',
    component: () => import('./pages/MenuCliente.vue'),
  },
  {
    path: '/agendamento',
    name: 'Agendamento',
    component: () => import('./pages/MenuAgendamento.vue'),
  },
  {
    path: '/funcionario',
    name: 'Funcionario',
    component: () => import('./pages/MenuFuncionario.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router // <--- precisa disso

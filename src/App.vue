<script setup lang="ts">
import { ref } from 'vue';
import ClientCRUD from './components/ClientCRUD.vue';
import FuncionarioCRUD from './components/FuncionarioCRUD.vue';
import Agendamento from './components/Agendamento.vue';

const currentPage = ref('home');

function goToPage(page: string) {
  currentPage.value = page;
}
</script>

<template>
  <main class="app-container">
    <header>
      <h1 class="main-title">Sistema de Cadastro - Gloria Maria</h1>
    </header>

    <div v-if="currentPage === 'home'" class="home-nav">
      <button @click="goToPage('client')" class="nav-button">
        Ir para Cadastro de Cliente
      </button>
      <button @click="goToPage('funcionario')" class="nav-button">
        Ir para Cadastro de Funcionário
      </button>
      <button @click="goToPage('agendamento')" class="nav-button">
        Ir para Agendamento
      </button>
    </div>

    <div v-else class="crud-page">
      <ClientCRUD v-if="currentPage === 'client'" />
      <FuncionarioCRUD v-else-if="currentPage === 'funcionario'" />
      <Agendamento v-else-if="currentPage === 'agendamento'" />
      
      <button @click="currentPage = 'home'" class="back-button">
        Voltar ao Início
      </button>
    </div>
  </main>
</template>

<style scoped>
.app-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.main-title {
  color: var(--primary-color);
  margin-bottom: 3rem;
  font-size: 2.8rem;
}

.home-nav {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  max-width: 400px;
}

.nav-button {
  padding: 1rem 2rem;
  font-size: 1.2rem;
  border-radius: 12px;
  background-color: white;
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
}

.nav-button:hover {
  background-color: var(--primary-color);
  color: white;
}

.crud-page {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.back-button {
  margin-top: 1rem;
  align-self: center;
  padding: 0.7rem 1.5rem;
  font-size: 1rem;
  background-color: var(--secondary-color);
  color: var(--heading-color);
}

.back-button:hover {
  background-color: var(--primary-color);
  color: white;
}
</style>
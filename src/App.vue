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
  <main>
    <h1 style="text-align:center; margin-bottom: 2rem;">Sistema de Cadastro - Gloria Maria</h1>
    <div v-if="currentPage === 'home'">
      <button @click="goToPage('client')" style="display:block; margin: 0 auto 1rem auto; padding: 1rem 2rem; font-size: 1.2rem;">Ir para Cadastro de Cliente</button>
      <button @click="goToPage('funcionario')" style="display:block; margin: 0 auto 1rem auto; padding: 1rem 2rem; font-size: 1.2rem;">Ir para Cadastro de Funcionário</button>
      <button @click="goToPage('agendamento')" style="display:block; margin: 0 auto 1rem auto; padding: 1rem 2rem; font-size: 1.2rem;">Ir para Agendamento</button>
    </div>
    <div v-else-if="currentPage === 'client'" style="display: flex; flex-direction: column; min-height: 70vh;">
      <ClientCRUD />
      <button 
        @click="currentPage = 'home'" 
        style="margin-top: auto; align-self: flex-end; padding: 0.7rem 1.5rem; font-size: 1rem;">
        Voltar
      </button>
    </div>
    <div v-else-if="currentPage === 'funcionario'" style="display: flex; flex-direction: column; min-height: 70vh;">
      <FuncionarioCRUD />
      <button 
        @click="currentPage = 'home'" 
        style="margin-top: auto; align-self: flex-end; padding: 0.7rem 1.5rem; font-size: 1rem;">
        Voltar
      </button>
    </div>
    <div v-else-if="currentPage === 'agendamento'" style="display: flex; flex-direction: column; min-height: 70vh;">
      <Agendamento />
      <button 
        @click="currentPage = 'home'" 
        style="margin-top: auto; align-self: flex-end; padding: 0.7rem 1.5rem; font-size: 1rem;">
        Voltar
      </button>
    </div>
  </main>
</template>

<style scoped>
main {
  padding: 1rem;
}
</style>
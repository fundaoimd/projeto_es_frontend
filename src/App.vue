
<script setup lang="ts">
import { ref } from 'vue';
import ClientCRUD from './components/ClientCRUD.vue';
const showClientCRUD = ref(false);
function openClientCRUD() {
  showClientCRUD.value = true;
}
</script>

<template>
  <main>
    <h1 style="text-align:center; margin-bottom: 2rem;">Sistema de Cadastro - Gloria Maria</h1>
    <div v-if="!showClientCRUD">
      <button @click="openClientCRUD" style="display:block; margin: 0 auto 2rem auto; padding: 1rem 2rem; font-size: 1.2rem;">Ir para Cadastro de Cliente</button>
    </div>
    <div v-else style="display: flex; flex-direction: column; min-height: 70vh;">
      <ClientCRUD />
      <button 
        @click="showClientCRUD = false" 
        style="margin-top: auto; align-self: flex-end; padding: 0.7rem 1.5rem; font-size: 1rem;">
        Voltar
      </button>
    </div>
  </main>
</template>

<style scoped>
/* Estilos básicos para o container principal da aplicação */
main {
  padding: 1rem;
}
</style>
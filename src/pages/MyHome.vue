<template>
  <main class="app-container">
    <header>
      <h1 class="main-title">Sistema de Cadastro - Gloria Maria</h1>
    </header>

    <div class="home-nav">
      <router-link :to="{ name: 'Cliente' }" class="nav-button">
        Ir para Cadastro de Cliente
      </router-link>
      <router-link :to="{ name: 'Funcionario' }" class="nav-button">
        Ir para Cadastro de Funcionário
      </router-link>
      <router-link :to="{ name: 'Servicos' }" class="nav-button">
        Ir para Serviços
      </router-link>
      <router-link :to="{ name: 'Agendamento' }" class="nav-button">
        Ir para Agendamento
      </router-link>
    </div>
  </main>
</template>
<script setup lang="ts"></script>
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
    text-decoration: none;
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

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

// Define um "molde" (interface) para garantir que todos os objetos de cliente
// tenham sempre os mesmos campos (id, name, email, phone).
interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
}

// URL da nossa API no backend. Se a porta for diferente, ajusta aqui.
const API_URL = 'http://localhost:3000/api/clients';

// --- VARIÁVEIS DE ESTADO ---
// 'ref' cria uma variável "reativa". Sempre que o seu valor mudar,
// o Vue vai atualizar automaticamente o HTML que a estiver a usar.

// 'clients' é a nossa lista de clientes, que começa vazia.
const clients = ref<Client[]>([]);

// 'formData' representa os dados do formulário. Começa com valores vazios.
const formData = ref({ id: 0, name: '', email: '', phone: '' });

// 'isEditing' é uma variável que controla se o formulário está em modo de "criação" ou "edição".
const isEditing = ref(false);

// --- FUNÇÕES ---

// Função para buscar a lista de clientes no backend.
const fetchClients = async () => {
  try {
    // Usa o axios para fazer um pedido GET ao nosso backend.
    const response = await axios.get(API_URL);
    // Se o pedido for bem-sucedido, atualiza a nossa lista 'clients' com os dados recebidos.
    clients.value = response.data;
  } catch (error) {
    // Se der erro, mostra uma mensagem na consola do navegador.
    console.error('Erro ao buscar clientes:', error);
  }
};

// 'onMounted' é um "gancho de ciclo de vida" do Vue.
// A função dentro dele é executada automaticamente assim que o componente é criado e mostrado na tela.
onMounted(() => {
  fetchClients(); // Chamamos a função para carregar os clientes assim que a página abre.
});

// Função para limpar o formulário e voltar ao modo de criação.
const resetForm = () => {
  formData.value = { id: 0, name: '', email: '', phone: '' };
  isEditing.value = false;
};

// Função executada quando o formulário é submetido.
const handleSubmit = async () => {
  // Verifica se estamos a editar um cliente existente.
  if (isEditing.value) {
    // Se sim, faz um pedido PUT para o backend, enviando os dados atualizados.
    try {
      await axios.put(`${API_URL}/${formData.value.id}`, formData.value);
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
    }
  } else {
    // Se não, estamos a criar um novo cliente. Faz um pedido POST.
    try {
      await axios.post(API_URL, formData.value);
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
    }
  }
  // Após criar ou editar, limpa o formulário.
  resetForm();
  // E busca a lista de clientes atualizada do backend.
  await fetchClients();
};

// Função chamada quando o botão "Editar" de um cliente é clicado.
const handleEdit = (client: Client) => {
  // Copia os dados do cliente para o 'formData' para preencher o formulário.
  formData.value = { ...client };
  // Ativa o modo de edição.
  isEditing.value = true;
};

// Função chamada quando o botão "Apagar" é clicado.
const handleDelete = async (id: number) => {
  // Pede confirmação ao utilizador antes de apagar.
  if (confirm('Tem a certeza que quer apagar este cliente?')) {
    try {
      // Faz um pedido DELETE ao backend para o ID do cliente.
      await axios.delete(`${API_URL}/${id}`);
      // Recarrega a lista de clientes para remover o que foi apagado.
      await fetchClients();
    } catch (error) {
      console.error('Erro ao apagar cliente:', error);
    }
  }
};
</script>

<template>
  <div class="container">
    <h1>Gestão de Clientes</h1>

    <form @submit.prevent="handleSubmit" class="form-card">
      <h3>{{ isEditing ? 'Editar Cliente' : 'Adicionar Novo Cliente' }}</h3>

      <div class="form-group">
        <label for="name">Nome:</label>
        <input id="name" type="text" v-model="formData.name" placeholder="Nome do Cliente" required />
      </div>

      <div class="form-group">
        <label for="email">Email:</label>
        <input id="email" type="email" v-model="formData.email" placeholder="email@exemplo.com" required />
      </div>

      <div class="form-group">
        <label for="phone">Telefone:</label>
        <input id="phone" type="text" v-model="formData.phone" placeholder="(XX) XXXXX-XXXX" />
      </div>

      <div class="form-actions">
        <button type="submit">{{ isEditing ? 'Atualizar' : 'Adicionar' }}</button>
        <button v-if="isEditing" type="button" @click="resetForm">Cancelar</button>
      </div>
    </form>

    <hr />

    <h2>Clientes Registados</h2>
    <table class="client-table">
      <thead>
        <tr>
          <th>Nome</th>
          <th>Email</th>
          <th>Telefone</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="clients.length === 0">
            <td colspan="4">Nenhum cliente encontrado.</td>
        </tr>
        <tr v-for="client in clients" :key="client.id">
          <td>{{ client.name }}</td>
          <td>{{ client.email }}</td>
          <td>{{ client.phone }}</td>
          <td class="actions">
            <button @click="handleEdit(client)">Editar</button>
            <button class="delete" @click="handleDelete(client.id)">Apagar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: sans-serif;
  color: #333;
}
.form-card {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
  border: 1px solid #ddd;
}
.form-group {
  margin-bottom: 15px;
}
.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}
.form-group input {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}
button {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #007bff;
  color: white;
  font-size: 14px;
}
button.delete {
  background-color: #dc3545;
}
button:hover {
  opacity: 0.9;
}
hr {
    border: none;
    border-top: 1px solid #eee;
    margin: 30px 0;
}
.client-table {
  width: 100%;
  border-collapse: collapse;
}
.client-table th, .client-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}
.client-table th {
  background-color: #f2f2f2;
}
.client-table .actions {
    display: flex;
    gap: 10px;
}
</style>
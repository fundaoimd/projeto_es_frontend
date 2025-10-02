<script setup lang="ts">
import { ref, onMounted } from 'vue';
// Remove a importação direta do 'axios', pois o 'api' já o encapsula.
import api from '../services/api';

// A interface Client permanece a mesma.
interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
}

// --- VARIÁVEIS DE ESTADO ---
const clients = ref<Client[]>([]);
const formData = ref({ id: 0, name: '', email: '', phone: '' });
const isEditing = ref(false);

// --- FUNÇÕES ---

// Função para buscar a lista de clientes no backend.
const fetchClients = async () => {
  try {
    // Usa a instância 'api' e a rota correta (com / no final).
    const response = await api.get('/clients/');
    clients.value = response.data;
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    alert('Não foi possível carregar a lista de clientes. Verifique o console para mais detalhes.');
  }
};

// onMounted continua igual, chamando a função para carregar os clientes.
onMounted(() => {
  fetchClients();
});

// Função para limpar o formulário.
const resetForm = () => {
  formData.value = { id: 0, name: '', email: '', phone: '' };
  isEditing.value = false;
};

// Função executada quando o formulário é submetido.
const handleSubmit = async () => {
  try {
    if (isEditing.value) {
      // Modo de edição: usa o método PUT na rota do cliente específico.
      // Ex: /clients/1/
      await api.put(`/clients/${formData.value.id}/`, formData.value);
    } else {
      // Modo de criação: usa o método POST na rota principal.
      // Ex: /clients/
      await api.post('/clients/', formData.value);
    }
    // Após criar ou editar, limpa o formulário.
    resetForm();
    // E busca a lista de clientes atualizada do backend.
    await fetchClients();
  } catch (error) {
    console.error('Erro ao salvar cliente:', error);
    alert('Ocorreu um erro ao salvar o cliente. Verifique os dados e tente novamente.');
  }
};

// Função para preparar a edição.
const handleEdit = (client: Client) => {
  formData.value = { ...client };
  isEditing.value = true;
};

// Função para apagar um cliente.
const handleDelete = async (id: number) => {
  if (confirm('Tem a certeza que quer apagar este cliente?')) {
    try {
      // Usa o método DELETE na rota do cliente específico.
      await api.delete(`/clients/${id}/`);
      // Recarrega a lista de clientes para remover o que foi apagado.
      await fetchClients();
    } catch (error) {
      console.error('Erro ao apagar cliente:', error);
      alert('Não foi possível apagar o cliente.');
    }
  }
};
</script>

<template>
  <div class="container">
  <h1>Cadastro de Cliente</h1>

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
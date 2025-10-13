<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../services/api';

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
}

const clients = ref<Client[]>([]);
const formData = ref({ id: 0, name: '', email: '', phone: '' });
const isEditing = ref(false);

const fetchClients = async () => {
  try {
    const response = await api.get('/clients/');
    clients.value = response.data;
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    alert('Não foi possível carregar a lista de clientes.');
  }
};

onMounted(() => {
  fetchClients();
});

const resetForm = () => {
  formData.value = { id: 0, name: '', email: '', phone: '' };
  isEditing.value = false;
};

const handleSubmit = async () => {
  try {
    if (isEditing.value) {
      await api.put(`/clients/${formData.value.id}/`, formData.value);
    } else {
      await api.post('/clients/', formData.value);
    }
    resetForm();
    await fetchClients();
  } catch (error) {
    console.error('Erro ao salvar cliente:', error);
    alert('Ocorreu um erro ao salvar o cliente.');
  }
};

const handleEdit = (client: Client) => {
  formData.value = { ...client };
  isEditing.value = true;
};

const handleDelete = async (id: number) => {
  if (confirm('Tem a certeza que quer apagar este cliente?')) {
    try {
      await api.delete(`/clients/${id}/`);
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
    <h1 class="page-title">Cadastro de Cliente</h1>

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
        <button v-if="isEditing" type="button" @click="resetForm" class="btn-cancel">Cancelar</button>
      </div>
    </form>

    <div class="table-container">
      <h2>Clientes Registrados</h2>
      <table class="crud-table">
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
              <button @click="handleEdit(client)" class="btn-edit">Editar</button>
              <button class="btn-delete" @click="handleDelete(client.id)">Apagar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.page-title {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2.2rem;
  color: var(--heading-color);
}

.form-card {
  background: var(--form-bg-color);
  padding: 30px;
  border-radius: 12px;
  margin-bottom: 30px;
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 15px var(--shadow-color);
  text-align: left;
}

.form-card h3 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  text-align: center;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #666;
}

.form-group input {
  width: 100%;
  padding: 12px 15px;
  box-sizing: border-box;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(219, 112, 147, 0.2);
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
  justify-content: flex-end;
}

.btn-cancel {
  background-color: #f1f1f1;
  color: var(--text-color);
  border: 1px solid #ddd;
}

.btn-cancel:hover {
  background-color: #e7e7e7;
}

.table-container {
  width: 100%;
  background-color: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 15px var(--shadow-color);
}

.table-container h2 {
  margin-top: 0;
  text-align: center;
  margin-bottom: 1.5rem;
}

.crud-table {
  width: 100%;
  border-collapse: collapse;
}

.crud-table th, .crud-table td {
  border-bottom: 1px solid var(--border-color);
  padding: 15px;
  text-align: left;
}

.crud-table th {
  background-color: var(--background-color);
  font-weight: 700;
  color: var(--primary-color);
}

.crud-table tbody tr:hover {
  background-color: var(--background-color);
}

.crud-table .actions {
  display: flex;
  gap: 10px;
}

.actions button {
  padding: 6px 12px;
  font-size: 14px;
}

.btn-edit {
  background-color: var(--secondary-color);
  color: var(--heading-color);
}
.btn-edit:hover {
  background-color: #f7a0b0;
}

.btn-delete {
  background-color: var(--danger-color);
}
.btn-delete:hover {
  background-color: var(--danger-hover-color);
}
</style>
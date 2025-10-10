<script setup lang="ts">
import { ref } from 'vue';

// Define um "molde" (interface) para garantir que todos os objetos de agendamento
// tenham sempre os mesmos campos (id, cliente, data, horario).
interface Agendamento {
  id: number;
  cliente: string;
  data: string;
  horario: string;
}

// --- VARIÁVEIS DE ESTADO ---
// 'agendamentos' é a nossa lista de agendamentos, que começa com alguns exemplos.
const agendamentos = ref<Agendamento[]>([
  { id: 1, cliente: 'teste1', data: '2025-09-30', horario: '10:00' },
  { id: 2, cliente: 'teste2', data: '2025-10-01', horario: '14:30' },
]);

// 'formData' representa os dados do formulário. Começa com valores vazios.
const formData = ref<Agendamento>({ id: 0, cliente: '', data: '', horario: '' });

// 'isEditing' controla se o formulário está em modo de criação ou edição.
const isEditing = ref(false);

// --- FUNÇÕES ---

// Função para limpar o formulário e voltar ao modo de criação.
const resetForm = () => {
  formData.value = { id: 0, cliente: '', data: '', horario: '' };
  isEditing.value = false;
};

// Função executada quando o formulário é submetido.
const handleSubmit = () => {
  if (formData.value.cliente && formData.value.data && formData.value.horario) {
    if (isEditing.value) {
      // Atualiza o agendamento existente
      const idx = agendamentos.value.findIndex(a => a.id === formData.value.id);
      if (idx !== -1) {
        agendamentos.value[idx] = { ...formData.value };
      }
    } else {
      // Adiciona novo agendamento
      agendamentos.value.push({
        ...formData.value,
        id: agendamentos.value.length > 0 ? Math.max(...agendamentos.value.map(a => a.id)) + 1 : 1
      });
    }
    resetForm();
  }
};

// Função chamada quando o botão "Editar" de um agendamento é clicado.
const handleEdit = (agendamento: Agendamento) => {
  formData.value = { ...agendamento };
  isEditing.value = true;
};

// Função chamada quando o botão "Apagar" é clicado.
const handleDelete = (id: number) => {
  if (confirm('Tem certeza que deseja apagar este agendamento?')) {
    agendamentos.value = agendamentos.value.filter(a => a.id !== id);
    if (isEditing.value && formData.value.id === id) {
      resetForm();
    }
  }
};

// Função para formatar a data para o padrão brasileiro.
function formatarDataBR(dataISO: string): string {
  if (!dataISO) return '';
  const [ano, mes, dia] = dataISO.split('-');
  return `${dia}/${mes}/${ano}`;
}
</script>

<template>
  <div class="container">
    <h1>Agendamento</h1>

    <form @submit.prevent="handleSubmit" class="form-card">
      <h3>{{ isEditing ? 'Editar Agendamento' : 'Adicionar Novo Agendamento' }}</h3>

      <div class="form-group">
        <label for="cliente">Cliente:</label>
        <input id="cliente" v-model="formData.cliente" type="text" placeholder="Nome do cliente" required />
      </div>

      <div class="form-group">
        <label for="data">Data:</label>
        <input id="data" v-model="formData.data" type="date" required />
      </div>

      <div class="form-group">
        <label for="horario">Horário:</label>
        <input id="horario" v-model="formData.horario" type="time" required />
      </div>

      <div class="form-actions">
        <button type="submit">{{ isEditing ? 'Atualizar' : 'Adicionar' }}</button>
        <button v-if="isEditing" type="button" @click="resetForm">Cancelar</button>
      </div>
    </form>

    <hr />

    <h2>Lista de Agendamentos</h2>
    <table class="agendamento-table">
      <thead>
        <tr>
          <th>Cliente</th>
          <th>Data</th>
          <th>Horário</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="agendamentos.length === 0">
          <td colspan="4">Nenhum agendamento encontrado.</td>
        </tr>
        <tr v-for="ag in agendamentos" :key="ag.id">
          <td>{{ ag.cliente }}</td>
          <td>{{ formatarDataBR(ag.data) }}</td>
          <td>{{ ag.horario }}</td>
          <td class="actions">
            <button @click="handleEdit(ag)">Editar</button>
            <button class="delete" @click="handleDelete(ag.id)">Apagar</button>
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
  background-color: #1976d2;
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
.agendamento-table {
  width: 100%;
  border-collapse: collapse;
}
.agendamento-table th, .agendamento-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}
.agendamento-table th {
  background-color: #f2f2f2;
}
.agendamento-table .actions {
  display: flex;
  gap: 10px;
}
</style>
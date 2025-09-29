<script setup lang="ts">
import { ref } from 'vue';

interface Agendamento {
  id: number;
  cliente: string;
  data: string;
  horario: string;
}

const agendamentos = ref<Agendamento[]>([
  { id: 1, cliente: 'teste1', data: '2025-09-30', horario: '10:00' },
  { id: 2, cliente: 'teste2', data: '2025-10-01', horario: '14:30' },
]);

const novoAgendamento = ref<Agendamento>({ id: 0, cliente: '', data: '', horario: '' });

function adicionarAgendamento() {
  if (novoAgendamento.value.cliente && novoAgendamento.value.data && novoAgendamento.value.horario) {
    agendamentos.value.push({
      ...novoAgendamento.value,
      id: agendamentos.value.length + 1
    });
    novoAgendamento.value = { id: 0, cliente: '', data: '', horario: '' };
  }
}
function formatarDataBR(dataISO: string): string {
  if (!dataISO) return '';
  const [ano, mes, dia] = dataISO.split('-');
  return `${dia}/${mes}/${ano}`;
}
</script>

<template>
  <div>
    <h2>Agendamento:</h2>
    <form @submit.prevent="adicionarAgendamento" style="margin-bottom: 2rem; background: #f7f7f7; padding: 1rem; border-radius: 8px;">
      <div style="margin-bottom: 1rem;">
        <label>Cliente:</label>
        <input v-model="novoAgendamento.cliente" type="text" placeholder="Nome do cliente" required />
      </div>
      <div style="margin-bottom: 1rem;">
        <label>Data:</label>
        <input v-model="novoAgendamento.data" type="date" required />
      </div>
      <div style="margin-bottom: 1rem;">
        <label>Horário:</label>
        <input v-model="novoAgendamento.horario" type="time" required />
      </div>
      <button type="submit">Adicionar Agendamento</button>
    </form>

    <h3>Lista de Agendamentos</h3>
    <ul>
      <li v-for="ag in agendamentos" :key="ag.id">
        <strong>{{ ag.cliente }}</strong> - {{ formatarDataBR(ag.data) }} às {{ ag.horario }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
form label {
  display: inline-block;
  width: 80px;
}
form input {
  margin-left: 8px;
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
}
form button {
  margin-top: 8px;
  padding: 6px 16px;
  border-radius: 4px;
  border: none;
  background: #1976d2;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  background: #e3e3e3;
  margin-bottom: 8px;
  padding: 8px 12px;
  border-radius: 4px;
}
</style>
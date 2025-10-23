<template>
  <div class="container">
    <h1 class="page-title">Agendamentos</h1>

    <form @submit.prevent="handleSubmit" class="form-card">
      <h3>
        {{ isEditing ? 'Editar Agendamento' : 'Adicionar Novo Agendamento' }}
      </h3>

      <div class="form-group">
        <label for="cliente">Cliente:</label>
        <input
          id="cliente"
          v-model="formData.cliente"
          type="text"
          placeholder="Nome do cliente"
          required
        />
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
        <button type="submit">
          {{ isEditing ? 'Atualizar' : 'Adicionar' }}
        </button>
        <button
          v-if="isEditing"
          type="button"
          @click="resetForm"
          class="btn-cancel"
        >
          Cancelar
        </button>
      </div>
    </form>

    <div class="table-container">
      <h2>Lista de Agendamentos</h2>
      <table class="crud-table">
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
              <button @click="handleEdit(ag)" class="btn-edit">Editar</button>
              <button class="btn-delete" @click="handleDelete(ag.id)">
                Apagar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ref } from 'vue'

  interface Agendamento {
    id: number
    cliente: string
    data: string
    horario: string
  }

  const agendamentos = ref<Agendamento[]>([
    { id: 1, cliente: 'Maria da Silva', data: '2025-10-20', horario: '10:00' },
    { id: 2, cliente: 'João Pereira', data: '2025-10-21', horario: '14:30' },
  ])

  const formData = ref<Agendamento>({
    id: 0,
    cliente: '',
    data: '',
    horario: '',
  })
  const isEditing = ref(false)

  const resetForm = () => {
    formData.value = { id: 0, cliente: '', data: '', horario: '' }
    isEditing.value = false
  }

  const handleSubmit = () => {
    if (
      formData.value.cliente &&
      formData.value.data &&
      formData.value.horario
    ) {
      if (isEditing.value) {
        const idx = agendamentos.value.findIndex(
          (a) => a.id === formData.value.id,
        )
        if (idx !== -1) {
          agendamentos.value[idx] = { ...formData.value }
        }
      } else {
        agendamentos.value.push({
          ...formData.value,
          id:
            agendamentos.value.length > 0
              ? Math.max(...agendamentos.value.map((a) => a.id)) + 1
              : 1,
        })
      }
      resetForm()
    }
  }

  const handleEdit = (agendamento: Agendamento) => {
    formData.value = { ...agendamento }
    isEditing.value = true
  }

  const handleDelete = (id: number) => {
    if (confirm('Tem certeza que deseja apagar este agendamento?')) {
      agendamentos.value = agendamentos.value.filter((a) => a.id !== id)
      if (isEditing.value && formData.value.id === id) {
        resetForm()
      }
    }
  }

  function formatarDataBR(dataISO: string): string {
    if (!dataISO) return ''
    const [ano, mes, dia] = dataISO.split('-')
    return `${dia}/${mes}/${ano}`
  }
</script>

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
    transition:
      border-color 0.3s,
      box-shadow 0.3s;
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

  .crud-table th,
  .crud-table td {
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

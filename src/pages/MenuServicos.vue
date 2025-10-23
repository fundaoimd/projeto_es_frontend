<template>
  <div class="container">
    <h1 class="page-title">Cadastro de Serviço</h1>

    <form @submit.prevent="handleSubmit" class="form-card">
      <h3>{{ isEditing ? 'Editar Serviço' : 'Adicionar Novo Serviço' }}</h3>

      <div class="form-group">
        <label for="name">Nome:</label>
        <input
          id="name"
          type="text"
          v-model="formData.name"
          placeholder="Nome do Serviço"
          required
        />
      </div>

      <div class="form-group">
        <label for="descricao">Descrição:</label>
        <textarea
          id="descricao"
          v-model="formData.descricao"
          placeholder="Descrição do Serviço"
          rows="3"
          required
        ></textarea>
      </div>

      <div class="form-group">
        <label for="valor">Valor:</label>
        <input
          id="valor"
          type="text"
          v-model="valorInput"
          placeholder="0,00"
          @input="formatCurrency"
        />
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
      <h2>Serviços Registrados</h2>
      <table class="crud-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Valor</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="services.length === 0">
            <td colspan="4">Nenhum serviço encontrado.</td>
          </tr>
          <tr v-for="service in services" :key="service.id">
            <td>{{ service.name }}</td>
            <td>{{ service.descricao }}</td>
            <td>{{ service.valor.toFixed(2).replace('.', ',') }}</td>
            <td class="actions">
              <button @click="handleEdit(service)" class="btn-edit">
                Editar
              </button>
              <button class="btn-delete" @click="handleDelete(service.id)">
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
import { ref, onMounted } from 'vue'
import api from '../services/api'

interface Service {
  id: number
  name: string
  descricao: string
  valor: number
}

const services = ref<Service[]>([])
const formData = ref<Service>({ id: 0, name: '', descricao: '', valor: 0 })
const valorInput = ref('0,00')
const isEditing = ref(false)

const fetchServices = async () => {
  try {
    const response = await api.get('/services/')
    services.value = response.data.map((s: any) => ({
      ...s,
      valor: Number(s.valor),
    }))
  } catch (error) {
    console.error('Erro ao buscar serviços:', error)
    alert('Não foi possível carregar a lista de serviços.')
  }
}

onMounted(() => {
  fetchServices()
})

const resetForm = () => {
  formData.value = { id: 0, name: '', descricao: '', valor: 0 }
  valorInput.value = '0,00'
  isEditing.value = false
}

const handleSubmit = async () => {
  try {
    if (isEditing.value) {
      await api.put(`/services/${formData.value.id}/`, formData.value)
    } else {
      await api.post('/services/', formData.value)
    }
    resetForm()
    await fetchServices()
  } catch (error) {
    console.error('Erro ao salvar serviço:', error)
    alert('Ocorreu um erro ao salvar o serviço.')
  }
}

const handleEdit = (service: Service) => {
  formData.value = { ...service }
  valorInput.value = service.valor.toFixed(2).replace('.', ',')
  isEditing.value = true
}

const handleDelete = async (id: number) => {
  if (confirm('Tem certeza que quer apagar este serviço?')) {
    try {
      await api.delete(`/services/${id}/`)
      await fetchServices()
    } catch (error) {
      console.error('Erro ao apagar serviço:', error)
      alert('Não foi possível apagar o serviço.')
    }
  }
}

// FUNÇÃO DE FORMATAÇÃO DE MOEDA
const formatCurrency = () => {
  let onlyNumbers = valorInput.value.replace(/\D/g, '')
  onlyNumbers = onlyNumbers.padStart(3, '0') // garante pelo menos 3 dígitos
  const length = onlyNumbers.length
  const cents = onlyNumbers.slice(length - 2)
  const reais = onlyNumbers.slice(0, length - 2)
  valorInput.value = `${Number(reais)}${reais ? ',' : ''}${cents}`
  formData.value.valor = Number(onlyNumbers) / 100
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

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px 15px;
  box-sizing: border-box;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.form-group input:focus,
.form-group textarea:focus {
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

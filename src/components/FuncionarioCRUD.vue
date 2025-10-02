<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
}

const API_URL = 'http://localhost:3000/api/clients';

const employees = ref<Employee[]>([]);

const formData = ref({ id: 0, name: '', email: '', phone: '' , role: ''});

const isEditing = ref(false);


const fetchEmployees = async() => {
  try {
    const response = await axios.get(API_URL);

    employees.value= response.data
  }
  catch (error){
    console.error('Erro ao buscar funcionários:', error);
  }
};

onMounted(() => {
  fetchEmployees();
});

const resetForm =() => {
  formData.value = { id: 0, name: '', email: '', phone: '', role: '' }
  isEditing.value = false;
};

const handleSubmit = async() => {
  if (isEditing.value) {
    try {
      await axios.put(`${API_URL}/${formData.value.id}`, formData.value);
    } catch (error) {
      console.error('Erro ao atualizar funcionário:', error);
    }

  } else {
    try {
      await axios.post(API_URL, formData.value);
    } catch (error) {
      console.error('Erro ao criar funcionário:', error);
    }
 }
 resetForm();
 await fetchEmployees();
 };

const handleEdit = (employee: Employee) => {
  formData.value = {...employee };
  isEditing.value = true;
};
 const handleDelete = async(id: number) => {
  if (confirm('Tem certeza que quer apagar este funcionário?')) {
    try{
      await axios.delete(`${API_URL}/${id}`);
      await fetchEmployees();
    } catch (error){
      console.error('Erro ao apagar o funcionário:', error);
    }

  }

 };
</script>

<template>
  <div class = "container" >
    <h1>Cadastro de Funcionário</h1>

    <form @submit.prevent ="handleSubmit" class = "form-card">
    <h3>{{ isEditing ? 'Editar Funcionário' : 'Adicionar Novo Funcionário' }}</h3>

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
    
    <div class="form-group">
        <label for="role">Função:</label>
        <input id="role" type="text" v-model="formData.role" placeholder="Função" />
      </div>

    <div class="form-actions">
        <button type="submit">{{ isEditing ? 'Atualizar' : 'Adicionar' }}</button>
        <button v-if="isEditing" type="button" @click="resetForm">Cancelar</button>
      </div>
    </form>

  <h2>Funcionários Registados</h2>
    <table class="employee-table">
      <thead>
        <tr>
          <th>Nome</th>
          <th>Email</th>
          <th>Telefone</th>
          <th>Função</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="employees.length === 0">
            <td colspan="4">Nenhum funcionário encontrado.</td>
        </tr>
        <tr v-for="employee in employees" :key="employee.id">
          <td>{{ employee.name }}</td>
          <td>{{ employee.email }}</td>
          <td>{{ employee.phone }}</td>
          <td class="actions">
            <button @click="handleEdit(employee)">Editar</button>
            <button class="delete" @click="handleDelete(employee.id)">Apagar</button>
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
.employee-table {
  width: 100%;
  border-collapse: collapse;
}
.employee-table th, .client-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}
.employee-table th {
  background-color: #f2f2f2;
}
.employee-table .actions {
    display: flex;
    gap: 10px;
}

</style>

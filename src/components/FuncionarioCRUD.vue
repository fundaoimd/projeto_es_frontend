<script setup lang="ts">
import { ref, onMounted } from 'vue';
// Importa o serviço 'api' configurado para lidar com o baseURL (VITE_API_URL)
import api from '../services/api'; 

interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
}

// Endpoint correto, registrado no backend (api/urls.py)
const ENDPOINT = '/employees/';

// --- Variáveis de Estado ---
const employees = ref<Employee[]>([]);

// Inicializa o formData com todos os campos do modelo Employee
const formData = ref({ id: 0, name: '', email: '', phone: '', role: '' });
const isEditing = ref(false);

// --- Funções de Lógica ---

// Função para buscar a lista de funcionários no backend.
const fetchEmployees = async() => {
  try {
    const response = await api.get(ENDPOINT);
    employees.value= response.data
  }
  catch (error){
    console.error('Erro ao buscar funcionários:', error);
    // Mensagem mais informativa se a API não estiver respondendo
    alert('Erro ao carregar lista. Verifique se o servidor Django está rodando e se a URL da API (.env) está correta.');
  }
};

// Carrega os funcionários ao montar o componente
onMounted(() => {
  fetchEmployees();
});

// Limpa o formulário e sai do modo de edição
const resetForm =() => {
  formData.value = { id: 0, name: '', email: '', phone: '', role: '' }
  isEditing.value = false;
};

// Lida com a submissão do formulário (Criação ou Edição)
const handleSubmit = async() => {
  // Nota: O Django exige que e-mail seja válido e único. 
  // Se o erro 400 persistir, use um novo e-mail ao testar.
  try {
    if (isEditing.value) {
      // Edição: PUT para o recurso específico (ex: /employees/1/)
      // A barra final é necessária pela convenção do Django Rest Framework
      await api.put(`${ENDPOINT}${formData.value.id}/`, formData.value);
      alert('Funcionário atualizado com sucesso!');
    } else {
      // Criação: POST para a coleção (ex: /employees/)
      await api.post(ENDPOINT, formData.value);
      alert('Funcionário adicionado com sucesso!');
    }
    
    resetForm();
    await fetchEmployees();
  } catch (error) {
    console.error('Erro ao salvar funcionário:', error);
    // Dica para o usuário checar os dados (e-mail único!) e o console do BACKEND
    alert('Ocorreu um erro ao salvar o funcionário. Verifique os dados (Nome e E-mail obrigatórios e únicos) e o console do Backend.');
  }
 };

// Prepara o formulário para edição
const handleEdit = (employee: Employee) => {
  formData.value = {...employee };
  isEditing.value = true;
};

// Lida com a exclusão de um funcionário
 const handleDelete = async(id: number) => {
  if (confirm('Tem certeza que quer apagar este funcionário?')) {
    try{
      // Exclusão: DELETE para o recurso específico (ex: /employees/1/)
      await api.delete(`${ENDPOINT}${id}/`);
      alert('Funcionário apagado com sucesso!');
      await fetchEmployees();
    } catch (error){
      console.error('Erro ao apagar o funcionário:', error);
      alert('Não foi possível apagar o funcionário.');
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
        <input id="name" type="text" v-model="formData.name" placeholder="Nome do Funcionário" required />
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
            <td colspan="5">Nenhum funcionário encontrado.</td>
        </tr>
        <tr v-for="employee in employees" :key="employee.id">
          <td>{{ employee.name }}</td>
          <td>{{ employee.email }}</td>
          <td>{{ employee.phone }}</td>
          <td>{{ employee.role }}</td>
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
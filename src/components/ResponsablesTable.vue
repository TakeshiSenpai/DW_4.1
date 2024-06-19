<template>
  <v-container>
    <v-data-table :headers="headers" :items="responsables" class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Responsables</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="abrirDialogo">Nuevo Responsable</v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item.action="{ item }">
        <v-icon small @click="editarResponsable(item)">mdi-pencil</v-icon>
        <v-icon small @click="eliminarResponsable(item)">mdi-delete</v-icon>
      </template>
    </v-data-table>

    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ modoEdicion ? 'Editar Responsable' : 'Nuevo Responsable' }}</span>
        </v-card-title>

        <v-card-text>
          <v-form ref="form">
            <v-text-field v-model="nuevoResponsable.numeroEmpleado" label="Número de Empleado" required></v-text-field>
            <v-text-field v-model="nuevoResponsable.nombre" label="Nombre del Responsable" required></v-text-field>
            <v-text-field v-model="nuevoResponsable.imagen" label="URL de la Imagen" required></v-text-field>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="cerrarDialogo">Cancelar</v-btn>
          <v-btn color="blue darken-1" text @click="guardarResponsable">{{ modoEdicion ? 'Guardar Cambios' : 'Guardar' }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
  setup() {
    const responsables = ref([]);
    const dialog = ref(false);
    const nuevoResponsable = ref({
      numeroEmpleado: '',
      nombre: '',
      imagen: ''
    });
    const modoEdicion = ref(false);
    let responsableIdEnEdicion = null;

    const headers = [
      { text: 'ID', value: 'id' },
      { text: 'Número de Empleado', value: 'numeroEmpleado' },
      { text: 'Nombre', value: 'nombre' },
      { text: 'Imagen', value: 'imagen' },
      { text: 'Acciones', value: 'action', sortable: false },
    ];

    const fetchResponsables = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/responsables');
        responsables.value = Array.isArray(response.data) ? response.data : [];
      } catch (error) {
        console.error('Error fetching responsables:', error);
        responsables.value = [];
      }
    };

    const abrirDialogo = () => {
      modoEdicion.value = false;
      nuevoResponsable.value = {
        numeroEmpleado: '',
        nombre: '',
        imagen: ''
      };
      dialog.value = true;
    };

    const cerrarDialogo = () => {
      dialog.value = false;
    };

    const guardarResponsable = async () => {
      if (modoEdicion.value) {
        await actualizarResponsable();
      } else {
        await crearResponsable();
      }
    };

    const crearResponsable = async () => {
      console.log('Crear Responsable:', nuevoResponsable.value);
      try {
        const response = await axios.post('http://localhost:5000/api/responsables', nuevoResponsable.value);
        console.log('Respuesta del servidor:', response);
        fetchResponsables();
        dialog.value = false;
        resetNuevoResponsable();
      } catch (error) {
        console.error('Error creating responsable:', error.response ? error.response.data : error.message);
      }
    };

    const editarResponsable = (responsable) => {
      modoEdicion.value = true;
      responsableIdEnEdicion = responsable.id;
      nuevoResponsable.value = { ...responsable };
      dialog.value = true;
    };

    const actualizarResponsable = async () => {
      try {
        await axios.put(`http://localhost:5000/api/responsables/${responsableIdEnEdicion}`, nuevoResponsable.value);
        fetchResponsables();
        dialog.value = false;
      } catch (error) {
        console.error('Error updating responsable:', error.response ? error.response.data : error.message);
      }
    };

    const eliminarResponsable = async (responsable) => {
      try {
        await axios.delete(`http://localhost:5000/api/responsables/${responsable.id}`);
        fetchResponsables();
      } catch (error) {
        console.error('Error deleting responsable:', error.response ? error.response.data : error.message);
      }
    };

    const resetNuevoResponsable = () => {
      nuevoResponsable.value = {
        numeroEmpleado: '',
        nombre: '',
        imagen: ''
      };
      responsableIdEnEdicion = null;
    };

    onMounted(() => {
      fetchResponsables();
    });

    return {
      headers,
      responsables,
      dialog,
      nuevoResponsable,
      modoEdicion,
      abrirDialogo,
      cerrarDialogo,
      guardarResponsable,
      editarResponsable,
      actualizarResponsable,
      eliminarResponsable,
      resetNuevoResponsable,
    };
  },
};
</script>

<style scoped>
/* Aquí puedes agregar estilos específicos para este componente */
</style>

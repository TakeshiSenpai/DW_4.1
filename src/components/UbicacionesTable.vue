<template>
  <v-container>
    <v-data-table :headers="headers" :items="ubicaciones" class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Ubicaciones</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="dialog = true">Nueva Ubicación</v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item.action="{ item }">
        <v-icon small @click="editarUbicacion(item)">mdi-pencil</v-icon>
        <v-icon small @click="eliminarUbicacion(item)">mdi-delete</v-icon>
      </template>
    </v-data-table>

    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ modoEdicion ? 'Editar Ubicación' : 'Nueva Ubicación' }}</span>
        </v-card-title>

        <v-card-text>
          <v-form ref="form">
            <v-text-field v-model="nuevaUbicacion.nombre" label="Nombre de la Ubicación"></v-text-field>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">Cancelar</v-btn>
          <v-btn color="blue darken-1" text @click="modoEdicion ? guardarEdicion() : crearUbicacion()">{{ modoEdicion ? 'Guardar Cambios' : 'Guardar' }}</v-btn>
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
    const ubicaciones = ref([]);
    const dialog = ref(false);
    const nuevaUbicacion = ref({
      nombre: ''
    });
    const modoEdicion = ref(false);
    let ubicacionIdEnEdicion = null;

    const headers = [
      { text: 'ID', value: 'id' },
      { text: 'Nombre', value: 'nombre' },
      { text: 'Acciones', value: 'action', sortable: false },
    ];

    const fetchUbicaciones = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/ubicaciones');
        ubicaciones.value = Array.isArray(response.data) ? response.data : [];
      } catch (error) {
        console.error('Error fetching ubicaciones:', error);
        ubicaciones.value = [];
      }
    };

    const crearUbicacion = async () => {
      console.log('Crear Ubicación:', nuevaUbicacion.value);
      try {
        const response = await axios.post('http://localhost:5000/api/ubicaciones', nuevaUbicacion.value);
        console.log('Respuesta del servidor:', response);
        fetchUbicaciones();
        dialog.value = false;
        resetNuevaUbicacion();
      } catch (error) {
        console.error('Error creating ubicación:', error);
      }
    };

    const editarUbicacion = (ubicacion) => {
      console.log('Editar Ubicación:', ubicacion);
      modoEdicion.value = true;
      ubicacionIdEnEdicion = ubicacion.id;
      nuevaUbicacion.value = { ...ubicacion };
      dialog.value = true;
    };

    const guardarEdicion = async () => {
      console.log('Guardar Edición Ubicación:', nuevaUbicacion.value);
      try {
        const response = await axios.put(`http://localhost:5000/api/ubicaciones/${ubicacionIdEnEdicion}`, nuevaUbicacion.value);
        console.log('Respuesta del servidor:', response);
        fetchUbicaciones();
        dialog.value = false;
        resetNuevaUbicacion();
        modoEdicion.value = false;
      } catch (error) {
        console.error('Error saving edited ubicación:', error);
      }
    };

    const eliminarUbicacion = async (ubicacion) => {
      console.log('Eliminar Ubicación:', ubicacion);
      try {
        const response = await axios.delete(`http://localhost:5000/api/ubicaciones/${ubicacion.id}`);
        console.log('Respuesta del servidor:', response);
        fetchUbicaciones();
      } catch (error) {
        console.error('Error deleting ubicación:', error);
      }
    };

    const resetNuevaUbicacion = () => {
      nuevaUbicacion.value = {
        nombre: ''
      };
      ubicacionIdEnEdicion = null;
    };

    onMounted(() => {
      fetchUbicaciones();
    });

    return {
      headers,
      ubicaciones,
      dialog,
      nuevaUbicacion,
      modoEdicion,
      crearUbicacion,
      editarUbicacion,
      guardarEdicion,
      eliminarUbicacion,
      resetNuevaUbicacion,
    };
  },
};
</script>

<style scoped>
/* Aquí puedes agregar estilos específicos para este componente */
</style>

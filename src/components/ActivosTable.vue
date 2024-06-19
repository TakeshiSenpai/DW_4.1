<template>
  <v-container>
    <v-data-table :headers="headers" :items="activos" class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Activos</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="dialog = true">Nuevo Activo</v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item.imagen="{ item }">
        <v-img :src="item.imagen" max-height="100" max-width="100"></v-img>
      </template>
      <template v-slot:item.numeroSerie="{ item }">
        <span>{{ item.numeroSerie }}</span>
      </template>
      <template v-slot:item.ubicacion="{ item }">
        <span>{{ item.Ubicacion?.nombre }}</span>
      </template>
      <template v-slot:item.responsable="{ item }">
        <span>{{ item.Responsable?.nombre }}</span>
      </template>
      <template v-slot:item.action="{ item }">
        <v-icon small @click="editarActivo(item)">mdi-pencil</v-icon>
        <v-icon small @click="eliminarActivo(item)">mdi-delete</v-icon>
      </template>
    </v-data-table>

    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ modoEdicion ? 'Editar Activo' : 'Nuevo Activo' }}</span>
        </v-card-title>

        <v-card-text>
          <v-form ref="form">
            <v-text-field v-model="nuevoActivo.numeroSerie" label="Número de Serie"></v-text-field>
            <v-text-field v-model="nuevoActivo.numeroInventarioUABC" label="Número de Inventario UABC"></v-text-field>
            <v-text-field v-model="nuevoActivo.tipo" label="Tipo"></v-text-field>
            <v-text-field v-model="nuevoActivo.descripcion" label="Descripción"></v-text-field>
            <v-text-field v-model="nuevoActivo.imagen" label="URL de la Imagen"></v-text-field>

            <!-- Agregar selección de Ubicación -->
            <v-select :items="ubicaciones" item-title="nombre" item-value="id" v-model="nuevoActivo.ubicacionId" label="Ubicaciones"></v-select>

            <!-- Agregar selección de Responsable -->
            <v-select :items="responsables" item-title="nombre" item-value="id" v-model="nuevoActivo.responsableId" label="Responsables"></v-select>
            
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">Cancelar</v-btn>
          <v-btn color="blue darken-1" text @click="modoEdicion ? guardarEdicion() : crearActivo()">{{ modoEdicion ? 'Guardar Cambios' : 'Guardar' }}</v-btn>
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
    const activos = ref([]);
    const dialog = ref(false);
    const nuevoActivo = ref({
      numeroSerie: '',
      numeroInventarioUABC: '',
      tipo: '',
      descripcion: '',
      imagen: '',
      ubicacionId: null,
      responsableId: null,
    });
    const ubicaciones = ref([]);
    const responsables = ref([]);
    const modoEdicion = ref(false);
    let activoIdEnEdicion = null;

    const headers = [
      { text: 'ID', value: 'id' },
      { text: 'Número de Serie', value: 'numeroSerie' },
      { text: 'Número de Inventario UABC', value: 'numeroInventarioUABC' },
      { text: 'Tipo', value: 'tipo' },
      { text: 'Descripción', value: 'descripcion' },
      { text: 'Imagen', value: 'imagen' },
      { text: 'Ubicación', value: 'Ubicacion.nombre' },
      { text: 'Responsable', value: 'Responsable.nombre' },
      { text: 'Acciones', value: 'action', sortable: false },
    ];

    const fetchActivos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/activos');
        activos.value = Array.isArray(response.data) ? response.data : [];
      } catch (error) {
        console.error('Error fetching activos:', error);
        activos.value = [];
      }
    };

    const fetchUbicaciones = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/ubicaciones');
        ubicaciones.value = response.data.map(ubicacion => ({
          id: ubicacion.id,
          nombre: ubicacion.nombre,
        }));
      } catch (error) {
        console.error('Error fetching ubicaciones:', error);
      }
    };

    const fetchResponsables = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/responsables');
        responsables.value = response.data.map(responsable => ({
          id: responsable.id,
          nombre: responsable.nombre,
        }));
      } catch (error) {
        console.error('Error fetching responsables:', error);
      }
    };

    const crearActivo = async () => {
      console.log('Crear Activo:', nuevoActivo.value);
      try {
        const response = await axios.post('http://localhost:5000/api/activos', nuevoActivo.value);
        console.log('Respuesta del servidor:', response);
        fetchActivos();
        dialog.value = false;
        resetNuevoActivo();
      } catch (error) {
        console.error('Error creating activo:', error);
      }
    };

    const editarActivo = (activo) => {
      console.log('Editar Activo:', activo);
      modoEdicion.value = true;
      activoIdEnEdicion = activo.id;
      nuevoActivo.value = { ...activo };
      dialog.value = true;
    };

    const guardarEdicion = async () => {
      console.log('Guardar Edición:', nuevoActivo.value);
      try {
        const response = await axios.put(`http://localhost:5000/api/activos/${activoIdEnEdicion}`, nuevoActivo.value);
        console.log('Respuesta del servidor:', response);
        fetchActivos();
        dialog.value = false;
        resetNuevoActivo();
        modoEdicion.value = false;
      } catch (error) {
        console.error('Error saving edited activo:', error);
      }
    };

    const eliminarActivo = async (activo) => {
      console.log('Eliminar Activo:', activo);
      try {
        const response = await axios.delete(`http://localhost:5000/api/activos/${activo.id}`);
        console.log('Respuesta del servidor:', response);
        fetchActivos();
      } catch (error) {
        console.error('Error deleting activo:', error);
      }
    };

    const resetNuevoActivo = () => {
      nuevoActivo.value = {
        numeroSerie: '',
        numeroInventarioUABC: '',
        tipo: '',
        descripcion: '',
        imagen: '',
        ubicacionId: null,
        responsableId: null,
      };
      activoIdEnEdicion = null;
    };

    onMounted(() => {
      fetchActivos();
      fetchUbicaciones();
      fetchResponsables();
    });

    return {
      headers,
      activos,
      dialog,
      nuevoActivo,
      ubicaciones,
      responsables,
      modoEdicion,
      crearActivo,
      editarActivo,
      guardarEdicion,
      eliminarActivo,
      resetNuevoActivo,
    };
  },
};
</script>

<style scoped>
/* Aquí puedes agregar estilos específicos para este componente */
</style>

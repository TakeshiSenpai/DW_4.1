<template>
    <v-app>
      <v-main>
        <v-container>
          <activos-table></activos-table>
          <responsables-table></responsables-table>
          <ubicaciones-table></ubicaciones-table>
        </v-container>
      </v-main>
    </v-app>
  </template>
  
  <script>
    import ActivosTable from '@/components/ActivosTable.vue';
    import ResponsablesTable from '@/components/ResponsablesTable.vue';
    import UbicacionesTable from '@/components/UbicacionesTable.vue';
  
  export default {
    components: {
      ActivosTable,
      ResponsablesTable,
      UbicacionesTable,
    },
  };
  </script>
  
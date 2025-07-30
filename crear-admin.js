// Script para crear el administrador inicial
// Ejecutar en la consola del navegador

import { crearAdministradorInicial } from './src/firebase/test.js';

// Función global para crear admin
window.crearAdmin = async () => {
  try {
    console.log('🔐 Creando administrador inicial...');
    const resultado = await crearAdministradorInicial();
    
    if (resultado) {
      console.log('✅ ¡Administrador creado exitosamente!');
      console.log('📧 Email: admin@moteclipse.com');
      console.log('🔑 Contraseña: eclipse2024');
      console.log('⚠️ CAMBIAR CONTRASEÑA DESPUÉS DEL PRIMER LOGIN');
    } else {
      console.log('❌ Error al crear administrador');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

console.log('🚀 Para crear el administrador inicial, ejecute: crearAdmin()');

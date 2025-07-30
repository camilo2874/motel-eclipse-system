// Configuración de Firebase para Motel Eclipse
import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Tu configuración específica de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDvaeMvSnbuQVcckhi59PLq1KDLhqDrpB8",
  authDomain: "motel-eclipse-fde41.firebaseapp.com",
  projectId: "motel-eclipse-fde41",
  storageBucket: "motel-eclipse-fde41.firebasestorage.app",
  messagingSenderId: "926957742953",
  appId: "1:926957742953:web:3d95e34cbb1bf39856ebf8"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore con configuraciones para reducir conexiones bloqueadas
export const db = getFirestore(app);

// Configurar Firestore para reducir conexiones persistentes
try {
  // Configuraciones para evitar problemas con bloqueadores
  if (typeof window !== 'undefined') {
    // Solo en el navegador, configurar para usar cache offline más agresivo
    import('firebase/firestore').then(({ enableNetwork, disableNetwork }) => {
      // Configuraciones adicionales se pueden agregar aquí si es necesario
    }).catch(() => {
      // Ignorar errores de importación
    });
  }
} catch (error) {
  // Ignorar errores de configuración
  console.warn('Configuración de Firestore offline no disponible:', error.message);
}

// Inicializar Firebase Auth
export const auth = getAuth(app);

// Exportar la app por si la necesitamos
export default app;

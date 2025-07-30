// Configuración de Firebase para Motel Eclipse
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
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

// Inicializar Firestore (base de datos)
export const db = getFirestore(app);

// Inicializar Firebase Auth
export const auth = getAuth(app);

// Exportar la app por si la necesitamos
export default app;

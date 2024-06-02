  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
  import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
  const firebaseConfig = {
    apiKey: "AIzaSyA0SIQ-K4BXGrju7-DaYPrTP7HxEdBx294",
    authDomain: "pruebatecnicaplatillos.firebaseapp.com",
    projectId: "pruebatecnicaplatillos",
    storageBucket: "pruebatecnicaplatillos.appspot.com",
    messagingSenderId: "582574443484",
    appId: "1:582574443484:web:60606cfe9f84ed1cca9d19"
  };
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

export { db };

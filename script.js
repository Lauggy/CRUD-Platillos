
// Importar el objeto 'db' de firebaseauth.js y funciones necesarias de Firestore
import { db } from './firebaseauth.js';
import { collection, addDoc, getDocs, onSnapshot,  doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Obtener referencia al formulario de registro de platillos
const registrarPlatillo = document.getElementById('registrar-platillo');
const productosRegistrados = document.querySelector('.left-column');

let editando = false;
let idActual = '';

// Función para renderizar los platillos en el HTML
const renderPlatillos = (platillos) => {
    productosRegistrados.innerHTML = '<h2>Platillos Registrados</h2>';
    platillos.forEach(platillo => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');
        productDiv.innerHTML = `
            <h3>${platillo.nombre}</h3>
            <p><strong>DESCRIPCIÓN:</strong> ${platillo.descripcion}</p>
            <p><strong>PRECIO:</strong> $${platillo.precio.toFixed(2)}</p>
            <p><strong>CATEGORÍA:</strong> ${platillo.categoria}</p>
            <p><strong>INGREDIENTES:</strong> ${platillo.ingredientes}</p>
            <button class="editar-btn" data-id="${platillo.id}" type="submit">EDITAR</button>
            <button class="eliminar-btn" data-id="${platillo.id}" type="submit">ELIMINAR</button>
        `;
        productosRegistrados.appendChild(productDiv);
    });

    // Añadir eventos a los botones de editar y eliminar
    document.querySelectorAll('.editar-btn').forEach(button => {
        button.addEventListener('click', editarPlatillo);
    });

    document.querySelectorAll('.eliminar-btn').forEach(button => {
        button.addEventListener('click', eliminarPlatillo);
    });
};

// Función para obtener y mostrar los platillos desde Firestore
const obtenerPlatillos = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, 'platillos'));
        const platillos = [];
        querySnapshot.forEach((doc) => {
            platillos.push({
                id: doc.id,
                ...doc.data()
            });
        });
        renderPlatillos(platillos);
    } catch (e) {
        console.error("Error obteniendo documentos: ", e);
    }
};

// Añadir un evento para manejar el submit del formulario
registrarPlatillo.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Obtener los valores de los campos del formulario
    const nombre = registrarPlatillo['nombre'].value;
    console.log("NULL",nombre);
    const precio = parseFloat(registrarPlatillo['precio'].value);
    const descripcion = registrarPlatillo['descripcion'].value;
    const categoria = registrarPlatillo['categoria'].value;
    const ingredientes = registrarPlatillo['ingredientes'].value;

    // Verificar si la descripción está vacía y asignar un valor predeterminado
    const desc = descripcion.trim() ? descripcion : "Sin descripción";

    // Verificar si algún campo requerido está vacío
        if (!nombre || !precio || !categoria || !ingredientes) {
        swal({
            title: "Todos los campos son obligatorios!",
            icon: "warning",
            text: "Rellénelos antes de enviar"
            
          });
        console.log("No bien")
        return; // Detener la ejecución si hay campos vacíos
    }

    try {
        if (editando) {
            // Actualizar el documento existente
            const docRef = doc(db, 'platillos', idActual);
            await updateDoc(docRef, {
                nombre,
                descripcion:desc,
                precio,
                categoria,
                ingredientes
            });
            swal({
                icon: "success",
                text: "Platillo actualizado con éxito!"
                
              });
            editando = false;
            idActual = '';
        } else {
            // Agregar un nuevo documento
            const docRef = await addDoc(collection(db, 'platillos'), {
                nombre,
                descripcion:desc,
                precio,
                categoria,
                ingredientes
            });
            console.log("Documento escrito con ID: ", docRef.id);
            swal({
                icon: "success",
                text: "Platillo registrado con éxito!"
                
              });
        }

        registrarPlatillo.reset();
        obtenerPlatillos();
    } catch (e) {
        console.error("Error al guardar el documento: ", e);
        swal({
            title: "Error al registrar el platillo!",
            icon: "warning",
            text: "Inténtalo de nuevo."
            
          });
    }
});

const editarPlatillo = (e) => {
    const id = e.target.getAttribute('data-id');
    const platillo = e.target.closest('.product');
    const nombre = platillo.querySelector('h3').innerText;
    const descripcion = platillo.querySelectorAll('p')[0].innerText.split(': ')[1];
    const precio = parseFloat(platillo.querySelectorAll('p')[1].innerText.split(': ')[1].slice(1));
    const categoria = platillo.querySelectorAll('p')[2].innerText.split(' ')[1];
    const ingredientes = platillo.querySelectorAll('p')[3].innerText.split(': ')[1];

    // Llenar el formulario con los valores del platillo a editar
    registrarPlatillo['nombre'].value = nombre;
    console.log("nombre",nombre);
    registrarPlatillo['descripcion'].value = descripcion;
    registrarPlatillo['precio'].value = precio;
    registrarPlatillo['categoria'].value = categoria;
    console.log("categoria",categoria)
    registrarPlatillo['ingredientes'].value = ingredientes;

    editando = true;
    idActual = id;
};

const eliminarPlatillo = async (e) => {
    const id = e.target.getAttribute('data-id');
    const confirmar = confirm('¿Estás seguro de que deseas eliminar este platillo?');
    if (confirmar) {
        try {
            await deleteDoc(doc(db, 'platillos', id));
            swal({
                icon: "success",
                text: "Platillo eliminado con éxito!."
                
              });
            obtenerPlatillos();
        } catch (e) {
            console.error("Error eliminando documento: ", e);
            swal({
                title: "Error al eliminar el platillo!",
                icon: "warning",
                text: "Inténtalo de nuevo."
                
              });
        }
    }
};

// Obtener y mostrar los platillos al cargar la página
window.addEventListener('DOMContentLoaded', obtenerPlatillos);

// Escuchar los cambios en la colección 'platillos' en Firestore y actualizar la lista en tiempo real
onSnapshot(collection(db, 'platillos'), (snapshot) => {
    const platillos = [];
    snapshot.forEach((doc) => {
        platillos.push({
            id: doc.id,
            ...doc.data()
        });
    });
    renderPlatillos(platillos);
});

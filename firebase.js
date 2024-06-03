//------------------Firebase SDK--------------------

//Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {getFirestore, addDoc, collection, getDocs, onSnapshot, deleteDoc, doc, updateDoc} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

//import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDYlilL3QEK7aboLOceYx0XuHgKFiD3HgE",
  authDomain: "pruebaliz2.firebaseapp.com",
  projectId: "pruebaliz2",
  storageBucket: "pruebaliz2.appspot.com",
  messagingSenderId: "926790944674",
  appId: "1:926790944674:web:ecbbf5c40225b3f18d54fb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);       
//get ref to database services
const db = getFirestore(app);

let isFirstLoad = true;

export async function agregarPlatillo(nombre, precio, descripcion, categoria, ingredientes, imagen) {

  try{
      await addDoc(collection(db, "platillos"), {
        nombre: nombre,
        precio: parseFloat(precio),
        descripcion: descripcion,
        categoria: categoria,
        ingredientes: ingredientes,
        imagen: imagen
      });

      return true;
    } catch(error){
      console.error("Error añadiendo documento", error);
      return false;
    }
  }

//para obtenerlos y mostrarlos en tarjetas

export async function mostrarPlatillos(callback) {
  try{
    const querySnapshot = await getDocs(collection(db, "platillos"));
    const platillos = [];
    querySnapshot.forEach((doc) => {
      const data =doc.data();
      platillos.push({
        id: doc.id,
        nombre: data.nombre,
        precio: parseFloat(data.precio), 
        descripcion: data.descripcion,
        categoria: data.categoria,
        ingredientes: data.ingredientes,
        imagen: data.imagen
      });
    });        
    console.log("Platillos en base de datos:", platillos);
    callback(platillos);
  } catch (error) {
    console.error("Error obteniendo documentos:", error);
  }

  
  onSnapshot(collection(db, "platillos"),(snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added" && !isFirstLoad) {
        const data = change.doc.data();
        const platillo ={
          id: change.doc.id,
          nombre: data.nombre,
          precio: parseFloat(data.precio), 
          descripcion: data.descripcion,
          categoria: data.categoria,
          ingredientes: data.ingredientes,
          imagen: data.imagen
        };

        callback([platillo]);
    }
  });

  isFirstLoad =false;

  });
}

export async function eliminarPlatillo(platilloId) {
  try{
    //confirmar o cancelar eliminar platillo
    const confirmar = window.confirm("¿Seguro que desea eliminar el platillo?");
    if(confirmar) {
      await deleteDoc(doc(db, "platillos", platilloId));
      console.log("Platillo eliminado exitosamente");
      return true;
    } else {
      console.log("Eliminación cancelada");
      return false;
    }
  } catch (error) {
    console.error("Error  al eliminar platillo:", error);
    return false;
  }
}

/*export async function actualizarPlatillo(platilloId) {
  try{
    //actualizar form*/


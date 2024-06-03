import { agregarPlatillo, mostrarPlatillos, eliminarPlatillo } from "./firebase.js";

function createCard (nombre, precio, descripcion, categoria, ingredientes, id, imagen) {
  
  const card = document.createElement('div');
  card.classList.add('col-lg-6', 'col-md-6', 'col-12', 'mb-4', 'card', 'card-body', 'card-container'); 

  const cardTitulo = document.createElement('h5');
  cardTitulo.classList.add('card-title');
  cardTitulo.textContent = nombre;

  const cardPrecio = document.createElement('p');
  cardPrecio.classList.add('card-text');
  if (typeof precio === 'number') {
    cardPrecio.textContent = `Precio: $${precio.toFixed(2)}`;
  } else {
    console.error("El precio no es un número válido");
    cardPrecio.textContent = `Precio: precio no disponible`;
  }

  const cardCategoria = document.createElement('p');
  cardCategoria.innerHTML = `<span class="badge rounded-pill text-bg-light">${categoria}</span>`;

  const cardDescripcion = document.createElement('p');
  cardDescripcion.classList.add('card-text');
  cardDescripcion.textContent = descripcion;

  const cardIngredientes = document.createElement('p');
  cardIngredientes.classList.add('card-text');
  cardIngredientes.textContent = ingredientes;

  const cardImage = document.createElement('img');
    cardImage.classList.add('card-img-top');
    cardImage.src = imagen; 
    cardImage.alt = nombre;
  
  const cardBody = document.createElement('div');
  card.classList.add('card-container');

  card.appendChild(cardTitulo);
  card.appendChild(cardImage);
  card.appendChild(cardPrecio);
  card.appendChild(cardCategoria);
  card.appendChild(cardDescripcion);
  card.appendChild(cardIngredientes);

  const cardFooter = document.createElement('div');
  cardFooter.classList.add('card-footer', 'text-muted');

  //editar
  const editButton = document.createElement('a');
  editButton.href = '#';
  editButton.classList.add('btn', 'btn-custom');
  editButton.textContent = 'Editar';

  //eliminar
  const deleteButton = document.createElement('a');
  deleteButton.href = '#';
  deleteButton.classList.add('btn', 'btn-custom');
  deleteButton.textContent = 'Eliminar';
  
  deleteButton.addEventListener('click', async() => {
    const eliminar = await eliminarPlatillo(id);
    if (eliminar) {
      card.remove();
    }
  });

  cardFooter.appendChild(editButton);
  cardFooter.appendChild(deleteButton);
 
  card.appendChild(cardFooter);

  
  return card;

}

document.addEventListener('DOMContentLoaded', async() => {
  const cardContainer = document.querySelector('.card-container');
    
    await mostrarPlatillos((platillos) => {
      platillos.forEach((platillo) => {
        const nuevaTarjeta = createCard (
          platillo.nombre,
          platillo.precio,
          platillo.descripcion,
          platillo.categoria,
          platillo.ingredientes,
          platillo.id,
          platillo.imagen
        );
        cardContainer.appendChild(nuevaTarjeta);
      });
    });

   //agregar platillo 
  const agregar = document.getElementById('submit');
  agregar.addEventListener('click', async(e) => {
      e.preventDefault();

        const nombre = document.getElementById("nombre").value;
        const precio = parseFloat(document.getElementById("precio").value);
        const descripcion = document.getElementById("descripcion").value;
        const categoria = document.getElementById("categoria").value;
        const ingredientes = document.getElementById("ingredientes").value;
        const imagen = document.getElementById("imagen").value


        // validar todos los campos del formulario
        if (!nombre || !descripcion || !categoria || !ingredientes || !imagen) {
            alert("Por favor, complete todos los campos requeridos");
            return;
          }
  
          if (isNaN(precio) || precio < 0) {
            alert("Por favor, ingrese un precio válido mayor o igual a 0.");
            return;
          }

          const platilloAgregado = await agregarPlatillo(nombre, precio, descripcion, categoria, ingredientes, imagen);

          if(platilloAgregado){
            alert("Platillo agregado exitosamente");
             //Borrar campos del formulario una vez enviado 
            document.getElementById("dish-form").reset();
            //crear card
            const nuevaTarjeta = createCard(nombre, precio, descripcion, categoria, ingredientes, imagen);
            cardContainer.appendChild(nuevaTarjeta);

          } else {
            console.error("Error adding document", error);
            alert("Error al agregar platillo.");
          }
        });
      });

let indiceActual = 0;  //tracks which image/text to show
let gatos = [];  //will store cats from API

function cambiarTexto() {  //changes the definition on button click
    let parrafo = document.getElementById('texto-cambiable');  //gets the paragraph
    parrafo.innerHTML = 'A cozy café where cats sit right beside you'; 
}

function adoptar() {  //shows cat images and info on button click
    if (gatos.length === 0) return;  //if cats not loaded yet, do nothing

    let contenedor = document.querySelector('.contenedor-imagen-adoptar');
    let imagen = document.getElementById('imagen-adoptar');
    let data = document.getElementById('texto-gato');

    let gato = gatos[indiceActual];  //gets current cat from API data

    contenedor.classList.remove('hidden');
    imagen.src = gato.image_url;  //image from API
    data.innerHTML = `<b>Name:</b> ${gato.name}<br><b>Age:</b> ${gato.age}<br><b>About:</b> ${gato.description}`;  //info from API

    indiceActual++;
    if (indiceActual >= gatos.length) {  //if reached the end
        indiceActual = 0;  //reset to first cat
    }
}

function cambiarDia() {
    let diaSeleccionado = document.getElementById('selector-dia').value;  //value of selected day 
    let contenedor = document.querySelectorAll('.dia-menu'); //gets all the hidden containers
    for (let i = 0; i < contenedor.length; i++){
        contenedor[i].classList.add('hidden');
    }
    // fetch menu from API
    fetch(`http://localhost:3000/menu/${diaSeleccionado}`)
        .then(response => response.json())  //parses response as JSON
        .then(data => {
            // find the container for the selected day and show it
            let diaContenedor = document.getElementById(diaSeleccionado);
            diaContenedor.classList.remove('hidden');
            diaContenedor.classList.remove('expand');
            void diaContenedor.offsetWidth;  //forces animation reset
            diaContenedor.classList.add('expand');

            // build the menu HTML from the API data
            let menuHTML = `<section class="interactivo"><h3>${diaSeleccionado} menú</h3>`;
            data.forEach(item => {  //loops through each product from the API
                const emoji = item.category === 'drink' ? '☕' : '🍮';  //emoji by category
                menuHTML += `
                    <div class="menu-item">
                        ${emoji} ${item.name}
                        <img src="${item.image_url}" class="img-hover">
                    </div>`;
            });
            menuHTML += `</section>`;
            diaContenedor.innerHTML = menuHTML;  //replaces hardcoded HTML with API data
        })
        .catch(error => console.error('Error fetching menu:', error));
}

window.onload = function() {
    document.getElementById('selector-dia').selectedIndex = 0;  //reset dropdown to default on page load

    // fetch all cats once on page load and store them
    fetch('http://localhost:3000/cats')
        .then(response => response.json())
        .then(data => {
            gatos = data;  //stores cats in global variable
        })
        .catch(error => console.error('Error fetching cats:', error));
}



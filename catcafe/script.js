//array de imagenes para la parte final
const imagenesGatos = [
    'https://i.pinimg.com/originals/f2/3d/c9/f23dc98eb201242822f2f5fc7eb56dc3.jpg',
    'https://i.pinimg.com/236x/1d/40/0e/1d400e79e924b844848049f3e52172b2.jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzzfbbOFzIUajMHRgrAMErDcTjzktqbyaA4A&s',
    'https://preview.redd.it/meu-gato-%C3%A9-praticamente-o-gato-do-meme-v0-n9dleoj8dgfc1.jpg?width=640&crop=smart&auto=webp&s=52de2578fe227e639db822d551bba33c6d28a2f1',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbNOkyC3htq_UHkMeoB2p2abbQ4cspxrPsTQ&s',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTctGeEV6HVZ3lyJEV8pRGF07p8bha4nGLmtg&s',
    'https://i.pinimg.com/736x/ea/5f/c9/ea5fc9680cec81756dcd5f12d63dc3f5.jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRk2o0D409PkvuhAlUZL5DOdpc7L-pHimBE61D9sfPIwg&s',
    'https://stickerly.pstatic.net/sticker_pack/M6DUfwweCC1PPhJ9HOcpw/DAS3U4/19/-808047720.png'
];
let indiceActual = 0; // Empezamos con la primera imagen (índice 0)
let contadorgatos = 0; // Variable para el contador de texto

// cambia el texto de la definicion
function cambiarTexto() {
    let parrafo = document.getElementById('texto-cambiable');
    parrafo.innerHTML = 'Es una cafeteria con gatos sentados junto a ti';
}

function adoptar() {
    let contenedor = document.querySelector('.contenedor-imagen-adoptar');
    let imagen = document.getElementById('imagen-adoptar');

    //si está oculto, lo mostramos y ponemos la 1ra imagen
    if (contenedor.classList.contains('hidden')) {
        contenedor.classList.remove('hidden');
        imagen.src = imagenesGatos[0];   //primera imagen del array
        indiceActual = 0;                 //indice para ver todas la imagenes
    } else {
        //pasamos a la siguiente cuadno ya se vea la pic
        indiceActual++;
        if (indiceActual >= imagenesGatos.length) {
            indiceActual = 0;             //se reinicia cuando ya llego al final
        }
        imagen.src = imagenesGatos[indiceActual];
    }

    contadorgatos++;

}
const imagenesGatos = [  //cat images array
    'https://i.pinimg.com/originals/f2/3d/c9/f23dc98eb201242822f2f5fc7eb56dc3.jpg',
    'https://i.pinimg.com/236x/1d/40/0e/1d400e79e924b844848049f3e52172b2.jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzzfbbOFzIUajMHRgrAMErDcTjzktqbyaA4A&s',
    'https://preview.redd.it/meu-gato-%C3%A9-praticamente-o-gato-do-meme-v0-n9dleoj8dgfc1.jpg?width=640&crop=smart&auto=webp&s=52de2578fe227e639db822d551bba33c6d28a2f1',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbNOkyC3htq_UHkMeoB2p2abbQ4cspxrPsTQ&s',
    'https://tn.com.ar/resizer/v2/el-felino-duerme-de-una-forma-tan-particular-que-no-tardo-en-hacerse-viral-y-por-supuesto-los-memes-no-se-hicieron-esperar-foto-instagram-necode67-HIVQANZFPVH6FFUNQRD5ZCZTSM.jpg?auth=a27eab01006ab1d3c35091ff33cc42098d2a21a96d33f871739a5618e48f639e&width=767',
    'https://i.pinimg.com/736x/ea/5f/c9/ea5fc9680cec81756dcd5f12d63dc3f5.jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRk2o0D409PkvuhAlUZL5DOdpc7L-pHimBE61D9sfPIwg&s',
    'https://stickerly.pstatic.net/sticker_pack/M6DUfwweCC1PPhJ9HOcpw/DAS3U4/19/-808047720.png'
];
const textoGatos = [  //cat info array, same order as images
    '<b>Name:</b> Juan<br><b>Age:</b> 10 años<br><b>Personality:</b> Optimistic',  //<br> for line break
    '<b>Name:</b> Luna<br><b>Age:</b> 3 años<br><b>Personality:</b> Playful',
    '<b>Name:</b> Pedro<br><b>Age:</b> 3 meses<br><b>Personality:</b> Shy',
    '<b>Name:</b> Lola<br><b>Age:</b> 7 años<br><b>Personality:</b> Funny',
    '<b>Name:</b> Copito<br><b>Age:</b> 3 años<br><b>Personality:</b> Friendly',
    '<b>Name:</b> Mimi<br><b>Age:</b> 11 meses<br><b>Personality:</b> Lazy',
    '<b>Name:</b> Bob<br><b>Age:</b> 19 años<br><b>Personality:</b> Mischievous',
    '<b>Name:</b> Gema<br><b>Age:</b> 7 años<br><b>Personality:</b> Affectionate',
    '<b>Name:</b> Zafiro<br><b>Age:</b> 5 años<br><b>Personality:</b> Curious',
];
let indiceActual = 0;  //tracks which image/text to show

function cambiarTexto() {  //changes the definition on button click
    let parrafo = document.getElementById('texto-cambiable');  //gets the paragraph
    parrafo.innerHTML = 'A cozy café where cats sit right beside you'; 
}

function adoptar() {  //shows cat images and info on button click
    let contenedor = document.querySelector('.contenedor-imagen-adoptar');  //gets the container
    let imagen = document.getElementById('imagen-adoptar');  //img element
    let data = document.getElementById('texto-gato');  //text element

    contenedor.classList.remove('hidden');  //makes container visible
    imagen.src = imagenesGatos[indiceActual];  //sets image from array
    data.innerHTML = textoGatos[indiceActual];  //sets text, innerHTML for <br>
    indiceActual++;  //moves to next cat

    if (indiceActual >= imagenesGatos.length) {  //if reached the end
        indiceActual = 0;  //reset to first cat
    }
}

function cambiarDia() {
    let diaSeleccionado = document.getElementById('selector-dia').value;  //value of selected day 
    let contenedor = document.querySelectorAll('.dia-menu'); //gets all the hidden containers
    for (let i = 0; i < contenedor.length; i++){
        contenedor[i].classList.add('hidden');
        if (diaSeleccionado === contenedor[i].id){
            contenedor[i].classList.remove('hidden');
            contenedor[i].classList.remove('expand'); // remove first
            void contenedor[i].offsetWidth; // forces browser to reset the animation
            contenedor[i].classList.add('expand'); // add it back
        }
    }
}

window.onload = function() {  // reset dropdown to default
    document.getElementById('selector-dia').selectedIndex = 0;
}


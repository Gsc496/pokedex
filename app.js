var lista_tipos;
var lista_pokemones;
var lista_habilidades;
var url_imagen;
var listeners = {};
var stats;
var types;
var sonido;
`<`

document.addEventListener('DOMContentLoaded', async function() {
    document.getElementById('buscar').style.display = 'none';
    document.getElementById('contenido_busqueda').style.display = 'none';
    document.getElementById('img').style.display = 'none';
    document.getElementById('datos').style.display = 'none';

    limpiar();

    await _tipos();
    await _pokemones(0);
    await _habilidades(0);
    await _imagen(0);

    await eventos(lista_tipos);
});

document.querySelector('#busqueda').addEventListener('click', async function() {
    document.getElementById('botonera').style.display = 'none';
    document.getElementById('buscar').style.display = 'flex';
    document.getElementById('contenido').style.display = 'none';
    document.getElementById('contenido_busqueda').style.display = 'flex';
    document.getElementById('img').style.display = 'none';
    document.getElementById('datos').style.display = 'none';

    limpiar();
});

document.querySelector('#btnBuscar').addEventListener('click', async function() {

    let busqueda = document.getElementById('txtPokemon').value.toLowerCase();

    _listado_completo(busqueda);
});

document.querySelector('#tipos').addEventListener('click', async function() {
    document.getElementById('buscar').style.display = 'none';
    document.getElementById('botonera').style.display = 'grid';
    document.getElementById('contenido').style.display = 'grid';
    document.getElementById('contenido_busqueda').style.display = 'none';

    limpiar();

    limpiarEventos(lista_tipos);

    await eventos(lista_tipos);
});

async function _listado_completo(busqueda) {
    
    types = '';

    let encontrado = false;

    for (let i = 0; i < lista_tipos.length && !encontrado; i++) {
        await _pokemones(i);

        for (let j = 0; j < lista_pokemones.length && !encontrado; j++) {
            //let sound = new Audio(`${sonido}`);

            if (busqueda === await lista_pokemones[j].pokemon.name) {
                await _habilidades(j);
                await _imagen(j);

                console.log(sonido);

                for(k = 0; k < await stats.types.length; k++){

                    var colorCode = `${k}0d${k}${k}e`;

                    types += `
                        <div class='rounded-full bg-[#${colorCode}] text-center'>
                            ${await stats.types[k].type.name}
                        </div>
                    `;
                }

                document.getElementById('img').style.display = 'flex';
                document.getElementById('datos').style.display = 'flex';

                document.querySelector('#img').innerHTML = `
                    <img src="${url_imagen}" alt="${lista_pokemones[j].pokemon.name}" width="150">

                `;   

                document.querySelector('#name').innerHTML = `
                    <strong>${await lista_pokemones[j].pokemon.name}</strong>
                `; 

                document.querySelector('#altura').innerHTML = `
                    ${await (stats.height)/10}m
                `; 

                document.querySelector('#peso').innerHTML = `
                    ${await (stats.weight)/10}kg
                `; 

                document.querySelector('#tipos_poke').innerHTML = `
                    ${types}
                `;

                document.querySelector('#play').addEventListener('click', async function (){
                    var audioElement = document.getElementById('player');
                    var sourceElement = document.getElementById('oggSource');

                    sourceElement.src = `${sonido}`;

                    audioElement.load();
                    audioElement.play();
                })

                encontrado = true;
            }
        }
    }
}


async function eventos(tips) {

    limpiar();
    
    for(let i = 0; i < tips.length; i++) {

        let listener = async function() {

            limpiar();
           
            await _pokemones(i);
            
            for(let j = 0; j < lista_pokemones.length; j++){
                var habilidades_html =  ``;

                await _habilidades(j);
                
                await _imagen(j);
                
                for(let k = 0; k < lista_habilidades.length; k++){

                    habilidades_html += `
                        <div >
                            ${await lista_habilidades[k].ability.name}
                        </div>
                    `;
                }

                const contenido = document.querySelector('#contenido').innerHTML += `
                    <div>
                        <img src="${url_imagen}" alt="${lista_pokemones[j].pokemon.name}" width="100">
                        <strong>${await lista_pokemones[j].pokemon.name}</strong>

                        ${habilidades_html}
                    </div>
                `;
            }
        };

        listeners[tips[i].name] = listener;

        document.querySelector(`#${tips[i].name}`).addEventListener('click', listener);
    }
}


function limpiarEventos(tips) {
    for(let i = 0; i < tips.length; i++) {
        let elemento = document.querySelector(`#${tips[i].name}`);
        let listener = listeners[tips[i].name];

        if (elemento && listener) {
            elemento.removeEventListener('click', listener);
        }
    }
}

async function _tipos(){
    var tmp_tipos = await fetch('https://pokeapi.co/api/v2/type/');
    var res = await tmp_tipos.json();

    lista_tipos = await res.results;
}

async function _pokemones(index) {
    var pokemones_tmp = await fetch(lista_tipos[index].url);
    var res = await pokemones_tmp.json();

    lista_pokemones = res.pokemon;
}

async function _habilidades(index) {
    var habilidades_tmp = await fetch(lista_pokemones[index].pokemon.url);
    var res = await habilidades_tmp.json();

    stats = res;
    sonido = res.cries.latest;

    lista_habilidades = res.abilities;
}

async function _imagen(index) {
    var imagen_tmp = await fetch(lista_pokemones[index].pokemon.url);
    var res = await imagen_tmp.json();

    url_imagen = await res.sprites.other['official-artwork'].front_default;
}

function limpiar(){
    document.querySelector('#contenido').innerHTML = '';
}
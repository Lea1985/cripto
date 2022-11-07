const criptomonedasSelect = document.querySelector("#criptomonedas");
const monedasSelect = document.querySelector("#moneda");

const formulario = document.querySelector("#formulario");
const resultado = document.querySelector("#resultado");



const objBusqueda = {
    moneda: "",
    criptomoneda: ""
}

//  Crear un promise

const obtenerCriptomoneda = criptomonedas => new Promise(resolve => {
    resolve(criptomonedas)
});


document.addEventListener("DOMContentLoaded", () => {

    consultarCriptomonedas();

    formulario.addEventListener("submit", submitFormulario);

    criptomonedasSelect.addEventListener("change", leerValor)
    monedasSelect.addEventListener("change", leerValor)


})


function consultarCriptomonedas() {

    const url = "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD";

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => obtenerCriptomoneda(resultado.Data))
        .then(criptomonedas => selectCriptomonedas(criptomonedas))
}

function selectCriptomonedas(criptomonedas) {

    criptomonedas.forEach(cripto => {
        const { Name, FullName } = cripto.CoinInfo;

        const option = document.createElement("OPTION");
        option.value = Name;
        option.textContent = FullName;

        criptomonedasSelect.appendChild(option);

    });
};

function leerValor(e) {
    objBusqueda[e.target.name] = e.target.value;
    console.log(objBusqueda);
}

function submitFormulario(e) {

    e.preventDefault();


    const { moneda, criptomoneda } = objBusqueda;
    if (moneda === "" || criptomoneda === "") {

        mostrarAlerta("Ambos campos son obligatorios");
        return;
    }

    //  Consultar la API con los resultados

    consultarAPI()

}

function mostrarAlerta(mensaje) {

    const existeError = document.querySelector(".error");

    if (!existeError) {

        const divMensaje = document.createElement("DIV");
        divMensaje.classList.add('error');
        divMensaje.textContent = mensaje;

        formulario.appendChild(divMensaje);

        setTimeout(() => {
            formulario.removeChild(divMensaje);
        }, 3000);

    }

}

function consultarAPI() {

    const { moneda, criptomoneda } = objBusqueda;

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    mostarSpinner();

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(cotizacion => {

            setTimeout(() => { mostarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]); }, 930)

        });

}

function mostarCotizacionHTML(cotizacion) {

    limpiarHTML();

    console.log(resultado);
    const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = cotizacion;


    const precio = document.createElement("P");
    precio.innerHTML = ` El precio es: <span>${PRICE}</span>`;

    const precioAlto = document.createElement("P");
    precioAlto.innerHTML = `Precio mas alto del dia: <span>${HIGHDAY}</span>`

    const precioBajo = document.createElement("P");
    precioBajo.innerHTML = `Precio mas bajo del dia: <span>${LOWDAY}</span>`

    const variacionUltimas24 = document.createElement("P");
    variacionUltimas24.innerHTML = `Variacion de las ultimas 24 hs: <span>${CHANGEPCT24HOUR}%</span>`

    const ultimaActulizacion = document.createElement("P");
    ultimaActulizacion.innerHTML = `Ultima actualizacion <span>${LASTUPDATE}</span>`

    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(variacionUltimas24);
    resultado.appendChild(ultimaActulizacion);


}

function limpiarHTML() {

    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}

function mostarSpinner() {

    limpiarHTML();

    const spinner = document.createElement("DIV");
    spinner.classList.add("spinner");
    spinner.innerHTML = ` 
    <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>
`

    resultado.appendChild(spinner);



}
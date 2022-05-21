
let arrayProductos = [];
let v = [];
// ----------------------------------

let Cant_1 = document.getElementById("can_1");
let Cant_2 = document.getElementById("can_2");
let Cant_3 = document.getElementById("can_3");
let Cant_4 = document.getElementById("can_4");
let Cant_5 = document.getElementById("can_5");
let totalC = document.getElementById("total");

// ----------------Funciones------------------

//guarda del .json al localStorage
function getJSON(arrayP) {
    const guardarL = (clave, valor) => {
        localStorage.setItem(clave, valor);
    };
    for (const x of arrayP) {
        guardarL(x.id, JSON.stringify(x));
    }
    for (const x of arrayP) {
        arrayProductos.push(x);
    }
}
//trae lo del localStorage lo guarda en el array y lo ordena
function getLocalS() {
    for (let i = 0; i < localStorage.length; i++) {
        arrayProductos.push(JSON.parse(localStorage.getItem(localStorage.key(i))));
    }

    arrayProductos.sort((a, b) => {
        if (a.id > b.id) {
            return 1;
        }
        if (a.id < b.id) {
            return -1;
        }
        return 0;
    });
    
}
//guarda los cambios en el localStorage
function saveLocalS(arrayP) {
    const guardarL = (clave, valor) => {
        localStorage.setItem(clave, valor);
    };
    
    guardarL(arrayP.id, JSON.stringify(arrayP));
}
//suma el total
function sumarArray(...numeros) {
  return numeros.reduce((acc, n) => acc + n, 0);
}
//muestra los cambios en el html
function mostrar_Cant_total(arrayC) {
    
    Cant_1.innerHTML = arrayC[0].cantidad
    Cant_2.innerHTML = arrayC[1].cantidad
    Cant_3.innerHTML = arrayC[2].cantidad
    Cant_4.innerHTML = arrayC[3].cantidad
    Cant_5.innerHTML = arrayC[4].cantidad
   
    v.length = 0;
    for (let i = 0; i < arrayC.length; i++) {
        v.push(arrayC[i].precio * arrayC[i].cantidad);
    }
    totalC.innerHTML = sumarArray(...v);
}

//--------bloqueo de botones --------------
function lockButton(estado) {

    document.getElementById("compra").disabled = estado;
    document.getElementById("nuevaCompra").disabled = false;
    for (let i = 0; i < arrayProductos.length; i++) {
        document.getElementById(i).disabled = estado;
    }
}

// ----------------------------------
const pedidoP = async () => { 
    const resp = await fetch("js/data.json");
    const data = await resp.json();
    
    localStorage.length == 0 ? getJSON(data) : getLocalS();
    mostrar_Cant_total(arrayProductos);
     document.getElementById("nuevaCompra").disabled = true;
};
pedidoP();

//-----agregar al carrito y guarda la compra en el localStorage-----
function show(id) { 

    if (arrayProductos[id].cantidad < 6) {

        arrayProductos[id].cantidad++;
        saveLocalS(arrayProductos[id]);
        mostrar_Cant_total(arrayProductos);
    } else {
        Swal.fire({
            icon: 'error',
            title:  `Supero la cantidad maxima de ${arrayProductos[id].nombre} limite 6`,
        })
    }
}

//---------------boton comprar-------------
function ticketCompra() {
    let compra = arrayProductos.filter(gpu => gpu.cantidad > 0);

    for (let i = 0; i < compra.length; i++) {
        document.getElementById("ticket").innerHTML += "->  " + compra[i].nombre + "  ->  " + compra[i].cantidad + " x " + compra[i].precio + "    ";
    }
    document.getElementById("ticket").innerHTML += "Toral compra -> " + sumarArray(...v);
    lockButton(true);
}

let btnCompra = document.getElementById("compra");
btnCompra.onclick = () => {
    let r = arrayProductos.filter(gpu => gpu.cantidad === 0);
    
    r.length == arrayProductos.length ? Swal.fire('El carrito esta vacio') : ticketCompra();
    localStorage.clear();
}

//---------  boton nueva compra -----------
let btnNueva = document.getElementById("nuevaCompra");
btnNueva.onclick = () => {
    lockButton(false);
    arrayProductos.length = 0;
    
    pedidoP();
    document.getElementById("ticket").innerHTML = "           --ticket--           ";
}

//boton borrar compra



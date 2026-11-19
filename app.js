const PRECIO = 13000;

/* ==========================
   CANTIDADES
========================== */

function cambiarCantidad(id, cambio){

    const input = document.getElementById(id);

    if(!input) return;

    let cantidad = parseInt(input.value) || 0;

    cantidad += cambio;

    if(cantidad < 0){
        cantidad = 0;
    }

    input.value = cantidad;
}

/* ==========================
   STORAGE
========================== */

function obtenerPedidos(){

    return JSON.parse(
        localStorage.getItem("pedidos")
    ) || [];

}

function guardarStorage(pedidos){

    localStorage.setItem(
        "pedidos",
        JSON.stringify(pedidos)
    );

}

/* ==========================
   GUARDAR PEDIDO
========================== */

function guardarPedido(){

    const cliente =
    document.getElementById("cliente")
    .value
    .trim();

    const melocoton =
    parseInt(
        document.getElementById("melocoton")
        .value
    ) || 0;

    const mora =
    parseInt(
        document.getElementById("mora")
        .value
    ) || 0;

    const pina =
    parseInt(
        document.getElementById("pina")
        .value
    ) || 0;

    const totalUnidades =
    melocoton + mora + pina;

    if(cliente === ""){

        alert(
        "Debe ingresar el nombre del comprador"
        );

        return;
    }

    if(totalUnidades === 0){

        alert(
        "Debe seleccionar al menos un yogurt"
        );

        return;
    }

    const total =
    totalUnidades * PRECIO;

    const pedidos =
    obtenerPedidos();

    pedidos.push({

        id: Date.now(),

        cliente,

        melocoton,

        mora,

        pina,

        total,

        estado: "Pendiente"

    });

    guardarStorage(pedidos);

    document.getElementById("cliente").value = "";
    document.getElementById("melocoton").value = 0;
    document.getElementById("mora").value = 0;
    document.getElementById("pina").value = 0;

    alert("Pedido guardado correctamente");
}

/* ==========================
   LISTAR PEDIDOS
========================== */

function mostrarPedidos(){

    const pedidos =
    obtenerPedidos();

    const lista =
    document.getElementById(
        "listaPedidos"
    );

    if(!lista) return;

    if(pedidos.length === 0){

        lista.innerHTML = `
            <div class="card">
                No existen pedidos registrados.
            </div>
        `;

        return;
    }

    lista.innerHTML = "";

    pedidos.forEach(p => {

        lista.innerHTML += `
        <div class="tarjeta-pedido ${
            p.estado === "Pagado"
            ? "pagado"
            : "pendiente"
        }">

            <h3>${p.cliente}</h3>

            <p>
            🍑 Melocotón:
            <strong>${p.melocoton}</strong>
            </p>

            <p>
            🫐 Mora:
            <strong>${p.mora}</strong>
            </p>

            <p>
            🍍 Piña:
            <strong>${p.pina}</strong>
            </p>

            <p>
            <strong>
            Total:
            $${p.total.toLocaleString("es-CO")}
            </strong>
            </p>

            <div class="
                estado
                ${
                    p.estado === "Pagado"
                    ? "pagado"
                    : "pendiente"
                }
            ">
                ${p.estado}
            </div>

            <div class="botones">

                <button
                    class="pagar"
                    onclick="cambiarEstado(${p.id})">
                    💰 Estado
                </button>

                <button
                    class="editar"
                    onclick="editarPedido(${p.id})">
                    ✏ Editar
                </button>

                <button
                    class="eliminar"
                    onclick="eliminarPedido(${p.id})">
                    🗑 Eliminar
                </button>

            </div>

        </div>
        `;
    });

}

/* ==========================
   CAMBIAR ESTADO
========================== */

function cambiarEstado(id){

    const pedidos =
    obtenerPedidos();

    const pedido =
    pedidos.find(
        p => p.id === id
    );

    if(!pedido) return;

    pedido.estado =
    pedido.estado === "Pagado"
    ? "Pendiente"
    : "Pagado";

    guardarStorage(pedidos);

    mostrarPedidos();

}

/* ==========================
   EDITAR
========================== */

function editarPedido(id){

    const pedidos =
    obtenerPedidos();

    const pedido =
    pedidos.find(
        p => p.id === id
    );

    if(!pedido) return;

    const nuevoNombre =
    prompt(
        "Nombre del cliente",
        pedido.cliente
    );

    if(nuevoNombre === null) return;

    const nuevoMelocoton =
    prompt(
        "Cantidad Melocotón",
        pedido.melocoton
    );

    if(nuevoMelocoton === null) return;

    const nuevaMora =
    prompt(
        "Cantidad Mora",
        pedido.mora
    );

    if(nuevaMora === null) return;

    const nuevaPina =
    prompt(
        "Cantidad Piña",
        pedido.pina
    );

    if(nuevaPina === null) return;

    pedido.cliente =
    nuevoNombre;

    pedido.melocoton =
    parseInt(nuevoMelocoton) || 0;

    pedido.mora =
    parseInt(nuevaMora) || 0;

    pedido.pina =
    parseInt(nuevaPina) || 0;

    const totalUnidades =
    pedido.melocoton +
    pedido.mora +
    pedido.pina;

    pedido.total =
    totalUnidades * PRECIO;

    guardarStorage(pedidos);

    mostrarPedidos();
}

/* ==========================
   ELIMINAR
========================== */

function eliminarPedido(id){

    if(
        !confirm(
        "¿Eliminar este pedido?"
        )
    ){
        return;
    }

    let pedidos =
    obtenerPedidos();

    pedidos =
    pedidos.filter(
        p => p.id !== id
    );

    guardarStorage(pedidos);

    mostrarPedidos();
}

/* ==========================
   VACIAR TODO
========================== */

function vaciarPedidos(){

    if(

        confirm(
        "¿Seguro que desea eliminar todos los pedidos?"
        )

    ){

        localStorage.removeItem(
            "pedidos"
        );

        mostrarPedidos();

    }

}

/* ==========================
   CONTABILIDAD
========================== */

function mostrarContabilidad(){

    const pedidos =
    obtenerPedidos();

    let totalVentas = 0;
    let totalPagado = 0;
    let totalPendiente = 0;

    let melocoton = 0;
    let mora = 0;
    let pina = 0;

    pedidos.forEach(p => {

        totalVentas += p.total;

        melocoton += p.melocoton;
        mora += p.mora;
        pina += p.pina;

        if(
            p.estado === "Pagado"
        ){

            totalPagado += p.total;

        }else{

            totalPendiente += p.total;

        }

    });

    const tv =
    document.getElementById(
        "totalVentas"
    );

    if(tv){
        tv.textContent =
        "$" +
        totalVentas.toLocaleString(
            "es-CO"
        );
    }

    const tp =
    document.getElementById(
        "totalPagado"
    );

    if(tp){
        tp.textContent =
        "$" +
        totalPagado.toLocaleString(
            "es-CO"
        );
    }

    const tpe =
    document.getElementById(
        "totalPendiente"
    );

    if(tpe){
        tpe.textContent =
        "$" +
        totalPendiente.toLocaleString(
            "es-CO"
        );
    }

    const tm =
    document.getElementById(
        "totalMelocoton"
    );

    if(tm){
        tm.textContent =
        melocoton;
    }

    const tmo =
    document.getElementById(
        "totalMora"
    );

    if(tmo){
        tmo.textContent =
        mora;
    }

    const tpina =
    document.getElementById(
        "totalPina"
    );

    if(tpina){
        tpina.textContent =
        pina;
    }

}
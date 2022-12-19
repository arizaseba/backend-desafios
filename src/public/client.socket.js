const socket = io();

//#region Productos
// const productForm = document.getElementById("productForm");
// const nombreInput = document.getElementById("nombreInput");
// const descInput = document.getElementById("descInput");
// const codigoInput = document.getElementById("codigoInput");
// const precioInput = document.getElementById("precioInput");
// const stockInput = document.getElementById("stockInput");
// const fotoInput = document.getElementById("fotoInput");
// const productsPool = document.getElementById("productsPool");

// const sendProduct = (productInfo) => {
//     socket.emit("client:product", productInfo);
// };

// const renderProduct = (productsData) => {
//     const html = productsData.map(productInfo => {
//         return `<tr>
//                     <td>${productInfo.nombre}</td>
//                     <td>${productInfo.precio}</td>
//                     <td>
//                         <img style="height:100px" src="${productInfo.foto}"/>
//                     </td>
//                 </tr>`;
//     });
//     // console.log("Arreglo de string de productos", html);
//     // console.log("String de productos", html.join(" "));
//     productsPool.innerHTML = html.join("");
// };

// const submitHandler = (event) => {
//     event.preventDefault();

//     const productInfo = new Producto(
//         Date.now(),
//         nombreInput.value,
//         descInput.value,
//         codigoInput.value,
//         fotoInput.value,
//         precioInput.value,
//         stockInput.value
//     );

//     sendProduct(productInfo);

//     // nombreInput.value = "";
//     // descInput.value = "";
//     // codigoInput.value = "";
//     // precioInput.value = "";
//     // fotoInput.value = "";
//     // stockInput.value = "";
// };

// productForm.addEventListener("submit", submitHandler);

// socket.on("server:product", renderProduct);
//#endregion

//#region Mensajes
const msgForm = document.getElementById("msgForm");
const emailInput = document.getElementById("emailInput");
const msgInput = document.getElementById("msgInput");
const msgPool = document.getElementById("msgPool");

const sendMsg = (msgInfo) => {
    socket.emit("client:msg", msgInfo);
};

const renderMsg = (msgsData) => {
    const html = msgsData.map(msgInfo => {
        return `<div><strong class="text-primary">${msgInfo.email}</strong> <span class="text-danger">[${msgInfo.date}]</span> : <em class="text-success">${msgInfo.msg}</em></div>`;
    });
    // console.log("Arreglo de string de msgs", html);
    // console.log("String de msgs", html.join(" "));
    msgPool.innerHTML = html.join("");
};

const submitHandlerMsg = (event) => {
    event.preventDefault();

    const date = new Date()
    const msgInfo = {
        email: emailInput.value,
        msg: msgInput.value,
        date: date.toLocaleString()
    };

    sendMsg(msgInfo);

    emailInput.value = "";
    msgInput.value = "";
};

msgForm.addEventListener("submit", submitHandlerMsg);

socket.on("server:msg", renderMsg);
//#endregion
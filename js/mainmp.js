//primero: seleccionamos el elemnto canvas.
const canvas = document.querySelector("canvas");

//Ejemplo de botones rápidos para probar pausa...
const a = document.querySelector("#a");
const b = document.querySelector("#b");
a.addEventListener("click", empezar);
b.addEventListener("click", detener);

//se genera el contexto
const ctx = canvas.getContext("2d");
//color de relleno
ctx.fill = "#1d1d1d";
//volumne
const VOLUMEN = [10, 10];
const MULTIPLO = 5;
const VELOCIDAD = 1;
//hago un cuadrado en el lienzo
ctx.fillRect(10, 10, ...VOLUMEN);

//variable que indica para dónde se movería la serpiente
let direccion;

//creo un objeto controles con:info de la direccion e info de la serpiente:
let controles = {
  direccion: { x: 1, y: 0 },
  serpiente: [
    { x: 160, y: 0 },
    { x: 150, y: 0 },
    { x: 140, y: 0 },
    { x: 130, y: 0 },
    { x: 120, y: 0 },
    { x: 110, y: 0 },
    { x: 100, y: 0 },
    { x: 90, y: 0 },
    { x: 80, y: 0 },
    { x: 70, y: 0 },
    { x: 60, y: 0 },
    { x: 50, y: 0 },
    { x: 40, y: 0 },
    { x: 30, y: 0 },
    { x: 20, y: 0 },
    { x: 10, y: 0 },
    { x: 0, y: 0 },
  ],
};

// constante Direccion, es un objeto con todas las posiblidade de direccion que podemos tomar
const DIRECCION = {
  A: [-1, 0],
  D: [1, 0],
  S: [0, 1],
  W: [0, -1],
  a: [-1, 0],
  d: [1, 0],
  s: [0, 1],
  w: [0, -1],
  ArrowUp: [
    0,
    -1,
  ] /* se queda en cero eje x pero sube uno eje Y, en realidad resta 1 */,
  ArrowDown: [
    0,
    1,
  ] /* se queda en cero eje x pero baja uno eje Y, se suma +1 */,
  ArrowRight: [1, 0] /* se queda en cero eje Y y hace +1 eje de las x*/,
  ArrowLeft: [-1, 0] /* se queda en cero eje Y y hace -1 eje de las x*/,
};

document.addEventListener("keydown", (e) => {
  let [x, y] = DIRECCION[e.key];
  controles.direccion.x = x;
  controles.direccion.y = y;
});

const dibujar = (x, y) => {
  console.log(controles.serpiente);
  ctx.clearRect(0, 0, 500, 500);
  for (let index = controles.serpiente.length - 1; index >= 0; index--) {
    if (index === 0) {
      ctx.fillRect(
        controles.serpiente[index].x * MULTIPLO,
        controles.serpiente[index].y * MULTIPLO,
        ...VOLUMEN
      );
    } else {
      ctx.fillRect(
        controles.serpiente[index - 1].x * MULTIPLO,
        controles.serpiente[index - 1].y * MULTIPLO,
        ...VOLUMEN
      );
    }
  }
};

const looper = () => {
  let { x, y } = controles.direccion;
  controles.serpiente[0].x += x;
  controles.serpiente[0].y += y;

  dibujar(controles.serpiente[0].x, controles.serpiente[0].y);
  console.log("looper", controles.direccion.x, controles.direccion.y);
  //   setTimeout(looper, 80 / VELOCIDAD);
};

//interesanteeee. en vez de loooper
const animacionRepetimos = () => {
  let { x, y } = controles.direccion;
  controles.serpiente[0].x += x * 10;
  controles.serpiente[0].y += y * 10;

  ctx.clearRect(0, 0, 500, 500);
  console.log(controles.serpiente);
  for (let index = controles.serpiente.length - 1; index >= 0; index--) {
    //   ctx.fillRect(
    //     controles.serpiente[index].x,
    //     controles.serpiente[index].y,
    //     ...VOLUMEN
    //   );
    if (index === 0) {
      ctx.fillRect(
        controles.serpiente[index].x * MULTIPLO,
        controles.serpiente[index].y * MULTIPLO,
        ...VOLUMEN
      );
    } else {
      controles.serpiente[index].x = controles.serpiente[index - 1].x;
      controles.serpiente[index].y = controles.serpiente[index - 1].y;
      ctx.fillRect(
        controles.serpiente[index].x,
        controles.serpiente[index].y,
        ...VOLUMEN
      );
    }
  }

  globalID = requestAnimationFrame(animacionRepetimos);
};
window.onload = () => {
  animacionRepetimos();
};
function empezar() {
  globalID = requestAnimationFrame(animacionRepetimos);
}

function detener() {
  cancelAnimationFrame(globalID);
}

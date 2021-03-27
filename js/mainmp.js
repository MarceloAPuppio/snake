//primero: seleccionamos el elemnto canvas.
const canvas = document.querySelector("canvas");
const a = document.querySelector("#a");
const b = document.querySelector("#b");
a.addEventListener("click", empezar);
b.addEventListener("click", detener);

const ctx = canvas.getContext("2d");
ctx.fill = "#1d1d1d";
const VOLUMEN = [10, 10];
const MULTIPLO = 1;
const VELOCIDAD = 1;
ctx.fillRect(10, 10, ...VOLUMEN);

//variable que indica para dónde se movería la serpiente
let direccion;

//creo un objeto controles con:info de la direccion e info de la serpiente:
let controles = { direccion: { x: 1, y: 0 }, serpiente: [{ x: 0, y: 0 }] };
console.log(controles.direccion, controles.serpiente[0]);

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
  ctx.clearRect(0, 0, 500, 500);
  ctx.fillRect(
    controles.serpiente[0].x * MULTIPLO,
    controles.serpiente[0].y * MULTIPLO,
    ...VOLUMEN
  );
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
  controles.serpiente[0].x += x;
  controles.serpiente[0].y += y;
  console.log("raf");
  ctx.clearRect(0, 0, 500, 500);
  ctx.fillRect(
    controles.serpiente[0].x * MULTIPLO,
    controles.serpiente[0].y * MULTIPLO,
    ...VOLUMEN
  );
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

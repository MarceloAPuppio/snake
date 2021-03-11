const papel = document.querySelector("canvas");
const ctx = papel.getContext("2d");
//le damos un color a lo que vamos a hacer
ctx.fillStyle = "green";
//lo que queremos que dibuje. Fill Rect, espera 4 parámetros:
//X: posicion sobre eje X, Y:posición eje Y
//W: ancho en px, H: alto en px
ctx.fillRect(0, 0, 10, 10);

//para donde va a ir la serpiente
let padonde;

//Obejto con direccion para donde se va a mover la serpiente, y la posicion que ocupa:
//inicialmente se mueve hacia la derecha, y empieza en 0 , 0
let controles = { direccion: { x: 1, y: 0 }, bicho: [{ x: 0, y: 0 }] };
//Vamos a generar una constante DIRECCION.
//Va  a ser un objeto, donde va a detectar cuales son las posibles teclsa que vamos a verificar,
//Y cuáles son las direcciones en x e Y que me va a dar eso
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
//Cada caundo se va a ejecutar el looper
const INTERVALO = 80;
//peso sirve para ancho y alto y para los multiplos del bicho
const PESO = 10;
//Esta funcion va a generar el movimiento del bichito
let looper = () => {
  //referencio la cabeza del bicho
  const cabeza = controles.bicho[0]; //la primera posicion, que es la cabeza
  //referencio la direccion actual de x e y
  let dx = controles.direccion.x;
  let dy = controles.direccion.y;
  //Hago que en cada vuelta sume a la posicion que tiene, los valores de los controles actuales
  cabeza.x += dx;
  cabeza.y += dy;
  //esot al canvas le pide un frame, llamando a dibujar
  requestAnimationFrame(dibujar);
  // se vuelve a ejectuar looper cuando pasa el intervalo
  setTimeout(looper, INTERVALO);
};

//vamos a detectar cuando se apreten teclas en el teclado:
//llamamos a Document
document.onkeydown = (e) => {
  //guardo en padonde la nueva direccionpadonde apunta a direccion[nombbre de la tecla]
  padonde = DIRECCION[e.key];
  //vamos a desestructurar padonde:
  const [x, y] = padonde;
  //valido que no se pueda ir en direccion contraria
  if (-x !== controles.direccion.x && -y !== controles.direccion.y) {
    //asigno las direcciones a mis controles
    controles.direccion.x = x;
    controles.direccion.y = y;
  }
};

//funcion dibujar, para actualizar el canvas
let dibujar = (color) => {
  //borro el lienzo/ canvas
  ctx.clearRect(0, 0, 500, 500);
  ctx.fillStyle = "green";
  const cabeza = controles.bicho[0];
  //lo que queremos que dibuje. Fill Rect, espera 4 parámetros:
  //X: posicion sobre eje X, Y:posición eje Y
  //W: ancho en px, H: alto en px
  ctx.fillRect(cabeza.x * PESO, cabeza.y * PESO, PESO, PESO);
};
//cuando se carga el documento el looper comienza a correr.
//Esto supongo que se hará luego con un botón.
window.onload = () => {
  looper();
};

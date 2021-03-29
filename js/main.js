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
let controles = {
  direccion: { x: 1, y: 0 },
  bicho: [{ x: 0, y: 0 }],
  victima: { x: 0, y: 0 },
  jugando: false,
  crecimiento: 0,
};
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
//ancho y alto de mi canvas
const ANCHO = 500;
//Cada caundo se va a ejecutar el looper
const INTERVALO = 80;
//peso sirve para ancho y alto y para los multiplos del bicho
const PESO = 10;
//Esta funcion va a generar el movimiento del bichito
let looper = () => {
  let cola = {};
  const cabeza = controles.bicho[0]; //la primera posicion, que es la cabeza
  Object.assign(cola, controles.bicho[controles.bicho.length - 1]);
  //si se cumple la condición que plantea atrado, guardará un true
  let atrapado =
    cabeza.x === controles.victima.x && cabeza.y === controles.victima.y;

  //referencio la direccion actual de x e y
  let dx = controles.direccion.x;
  let dy = controles.direccion.y;
  //Hago que en cada vuelta sume a la posicion que tiene, los valores de los controles actuales
  let tamaño = controles.bicho.length - 1;
  if (controles.jugando) {
    for (let index = tamaño; index > -1; index--) {
      //referencio la cabeza del bicho
      const sq = controles.bicho[index]; //la primera posicion, que es la cabeza
      if (index === 0) {
        sq.x += dx;
        sq.y += dy;
      } else {
        sq.x = controles.bicho[index - 1].x;
        sq.y = controles.bicho[index - 1].y;
      }
    }
  }

  if (atrapado) {
    controles.crecimiento += 5;
    revictima();
  }

  if (controles.crecimiento > 0) {
    controles.bicho.push({});
    controles.crecimiento -= 1;
  }

  if (detectarChoque()) {
    console.log("perdisteeee");
    controles.jugando = false;
    controles.bicho = [{}];
    reiniciar();
  }
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
let dibujar = () => {
  //borro el lienzo/ canvas
  ctx.clearRect(0, 0, ANCHO, ANCHO);
  //instancio cabeza del bicho
  const cabeza = controles.bicho[0];
  //instancio victima
  const victima = controles.victima;
  for (const partes of controles.bicho) {
    dibujarActores("green", partes.x, partes.y);
  }
  dibujarActores("red", victima.x, victima.y);
  console.log("green", cabeza.x, cabeza.y);
  console.log("red", victima.x, victima.y);
};

let dibujarActores = (color, x, y) => {
  ctx.fillStyle = color;
  //lo que queremos que dibuje. Fill Rect, espera 4 parámetros:
  //X: posicion sobre eje X, Y:posición eje Y
  //W: ancho en px, H: alto en px
  ctx.fillRect(x * PESO, y * PESO, PESO, PESO);
};
const randomxy = () => {
  let direccion = Object.values(DIRECCION);
  return {
    x: Math.round((Math.random() * ANCHO) / PESO),
    y: Math.round((Math.random() * ANCHO) / PESO),
    direccion: direccion[Math.round(Math.random() * 11)],
  };
};

const revictima = () => {
  posicionesVictima = randomxy();
  let victima = controles.victima;
  victima.x = posicionesVictima.x;
  victima.y = posicionesVictima.y;
};

const detectarChoque = () => {
  let cabeza = controles.bicho[0];
  if (
    cabeza.x < 0 ||
    cabeza.y < 0 ||
    cabeza.x > ANCHO / PESO ||
    cabeza.y > ANCHO / PESO
  ) {
    return true;
  }
  for (let index = 1; index < controles.bicho.length; index++) {
    let { x, y } = controles.bicho[0];
    if (x === controles.bicho[index].x && y === controles.bicho[index].y) {
      return true;
    }
  }
};

let reiniciar = () => {
  posiciones = randomxy();

  console.log(posiciones);
  let head = controles.bicho[0];
  head.x = posiciones.x;
  head.y = posiciones.y;
  controles.direccion.x = posiciones.direccion[0];
  controles.direccion.y = posiciones.direccion[1];
  posicionesVictima = randomxy();
  let victima = controles.victima;
  victima.x = posicionesVictima.x;
  victima.y = posicionesVictima.y;
  console.log(victima, head);
  //tarea: si el puntito de origen es 0 hacer que la direccion  no vaya para arriba
  //cuando empieza, el juego
  controles.jugando = true;
};
//cuando se carga el documento el looper comienza a correr.
//Esto supongo que se hará luego con un botón.
window.onload = () => {
  reiniciar();
  looper();
};

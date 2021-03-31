//CONSTANTES
const INTERVALO = 400;
const MOVIMIENTO = 10;
const ANCHO = 500;
const DIRECCION = {
  A: [-MOVIMIENTO, 0],
  D: [MOVIMIENTO, 0],
  S: [0, MOVIMIENTO],
  W: [0, -MOVIMIENTO],
  a: [-MOVIMIENTO, 0],
  d: [1, 0],
  s: [0, MOVIMIENTO],
  w: [0, -MOVIMIENTO],
  ArrowUp: [
    0,
    -MOVIMIENTO,
    180,
  ] /* se queda en cero eje x pero sube uno eje Y, en realidad resta 1 */,
  ArrowDown: [
    0,
    MOVIMIENTO,
    0,
  ] /* se queda en cero eje x pero baja uno eje Y, se suma +1 */,
  ArrowRight: [
    MOVIMIENTO,
    0,
    270,
  ] /* se queda en cero eje Y y hace +1 eje de las x*/,
  ArrowLeft: [
    -MOVIMIENTO,
    0,
    90,
  ] /* se queda en cero eje Y y hace -1 eje de las x*/,
};
let myInterval;
const stop = document.querySelector("#stop");
const puntaje = document.querySelector("#puntaje");
let puntajeTotal = 0;
stop.addEventListener("click", () => {
  clearInterval(myInterval);
});
let controles = {
  direccion: { x: 0, y: MOVIMIENTO },
  victima: { x: 0, y: 250 },
  rotate: 0,
  jugando: false,
  touch: { x: 0, y: 0 },
};
//hago referencia a la serpiente
const container = document.querySelector(".snake-wrapper");
const serpiente = document.querySelectorAll(".snake");
const btnMobileLeft = document.querySelector("#btnMobileLeft");
const btnMobileTop = document.querySelector("#btnMobileTop");
const btnMobileRight = document.querySelector("#btnMobileRight");
const btnMobileDown = document.querySelector("#btnMobileDown");

btnMobileLeft.addEventListener("click", () => {
  let [x, y, z] = DIRECCION["ArrowLeft"];
  controles.direccion.x = x;
  controles.direccion.y = y;
  controles.rotate = z;
});
btnMobileTop.addEventListener("click", () => {
  let [x, y, z] = DIRECCION["ArrowUp"];
  controles.direccion.x = x;
  controles.direccion.y = y;
  controles.rotate = z;
});
btnMobileDown.addEventListener("click", () => {
  let [x, y, z] = DIRECCION["ArrowDown"];
  controles.direccion.x = x;
  controles.direccion.y = y;
  controles.rotate = z;
});
btnMobileRight.addEventListener("click", () => {
  let [x, y, z] = DIRECCION["ArrowRight"];
  controles.direccion.x = x;
  controles.direccion.y = y;
  controles.rotate = z;
});
const cabeza = serpiente[0];
//hago referencia a la víctima
const victima = document.querySelector(".victima");

const avanzar = (top, left, element) => {
  let elementStyles = getComputedStyle(element);
  previousTop = elementStyles.getPropertyValue("top");
  previousLeft = elementStyles.getPropertyValue("left");
  arrayTop = previousTop.split("px")[0];
  arrayLeft = previousLeft.split("px")[0];
  console.log(previousLeft, previousTop, arrayTop);
  incrementoX = +arrayLeft + left;
  incrementoY = +arrayTop + top;
  element.style.top = incrementoY + "px";
  element.style.left = incrementoX + "px";
  element.setAttribute("data-position", `${incrementoY},${incrementoX}`);
};
const avanzarCola = (top, left, element) => {
  element.style.top = top + "px";
  element.style.left = left + "px";
  element.setAttribute("data-position", `${top},${left}`);
};
const dibujarVictima = (x, y) => {
  victima.style.top = y + "px";
  victima.style.left = x + "px";
  //   console.log(controles.victima.x, controles.victima, victima.style.top);
};

const dibujar = () => {
  //dibujo la serpiente
  let serpiente = document.querySelectorAll(".snake");

  let size = serpiente.length;

  for (let index = size - 1; index >= 0; index--) {
    if (index === 0) {
      cabeza.style.setProperty("--rotate", controles.rotate + "deg");
      avanzar(controles.direccion.y, controles.direccion.x, cabeza);
    } else {
      avanzarCola(
        serpiente[index - 1].getAttribute("data-position").split(",")[0],
        serpiente[index - 1].getAttribute("data-position").split(",")[1],
        serpiente[index]
      );
    }
    console.log(index);
  }
  detectarChoque();
  //   avanzar(controles.direccion.y, controles.direccion.x, cabeza);
  //dibujo la victima
  atrapado();
};

window.addEventListener("keydown", (e) => {
  let [x, y, z] = DIRECCION[e.key];
  controles.direccion.x = x;
  controles.direccion.y = y;
  controles.rotate = z;
});

//Intento de hacer movimintos touch... próximamente
// window.addEventListener("touchstart", function (e) {
//   let { x, y } = controles.touch;
//   x = e.touches[0].pageX;
//   y = e.touches[0].pageY;
// });
// window.addEventListener("touchmove", function (e) {
//   stop.innerHTML = `x:${e.touches[0].pageX} y:${e.touches[0].pageY}`;
//   // if (controles.touch.x < e.touches[0].pageX) stop.innerHTML = "derecha";
//   // if (controles.touch.y < e.touches[0].pageY) stop.innerHTML = "abajo";
//   // if (controles.touch.y > e.touches[0].pageY) stop.innerHTML = "arriba";
// });

const atrapado = () => {
  if (
    cabeza.style.top === victima.style.top &&
    cabeza.style.left === victima.style.left
  ) {
    revictima();
    agregarCola();
    puntajeTotal += 1000;
  }
};

let randomXY = (ANCHO) => {
  let x = Math.round((Math.random() * ANCHO) / MOVIMIENTO) * MOVIMIENTO;
  let y = Math.round((Math.random() * ANCHO) / MOVIMIENTO) * MOVIMIENTO;
  return { x: x, y: y };
};

let revictima = () => {
  let { x, y } = randomXY(ANCHO);
  controles.victima.x = x;
  controles.victima.y = y;
  dibujarVictima(controles.victima.y, controles.victima.x);
};
let agregarCola = () => {
  let cola = document.createElement("div");
  cola.innerHTML = "";
  cola.classList.add("snake", "tail");
  container.appendChild(cola);
};
let detectarChoque = () => {
  let [y, x] = cabeza.getAttribute("data-position").split(",");
  if (y > 500 || y < 0 || x > 500 || x < 0) controles.jugando = false;
};
let actualizarPuntaje = () => {
  ++puntajeTotal;
  puntaje.innerHTML = puntajeTotal;
};
window.onload = () => {
  dibujarVictima(controles.victima.y, controles.victima.x);
  controles.jugando = true;
  myInterval = setInterval(() => {
    if (controles.jugando) {
      dibujar();
      actualizarPuntaje();
    }
  }, 80);
};

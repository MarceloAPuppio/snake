const config = {
  apiKey: "AIzaSyDaxbNEb2KyBnEE2_MV3PmgE3Dw7RgNZyQ",
  authDomain: "puppio-chat.firebaseapp.com",
  projectId: "puppio-chat",
  storageBucket: "puppio-chat.appspot.com",
  messagingSenderId: "617150733560",
  appId: "1:617150733560:web:c835c6c43eec98a2446f0d",
};
firebase.initializeApp(config);
//CONSTANTES
const INTERVALO = 40;
const MOVIMIENTO = 10;
let ANCHO = 500;
let ALTO = 500;
const DIRECCION = {
  A: [-MOVIMIENTO, 0],
  D: [MOVIMIENTO, 0],
  S: [0, MOVIMIENTO],
  W: [0, -MOVIMIENTO],
  a: [-MOVIMIENTO, 0],
  d: [MOVIMIENTO, 0],
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
  vidas: 3,
  touch: { x: 0, y: 0 },
};
//hago referencia a la serpiente
const gameOver = document.querySelector("#gameover");
const audioGameOver = document.querySelector("#audioGameOver");
const audioLifeLost = document.querySelector("#audioLifeLost");
const audioEat = document.querySelector("#audioEat");
const tBody = document.getElementById("tbody");
const bonus = document.getElementById("bonus");
const tryAgain = document.querySelector("#tryagain");
const container = document.querySelector(".snake-wrapper");
const serpiente = document.querySelectorAll(".snake");
const btnMobileLeft = document.querySelector("#btnMobileLeft");
const btnMobileTop = document.querySelector("#btnMobileTop");
const btnMobileRight = document.querySelector("#btnMobileRight");
const btnMobileDown = document.querySelector("#btnMobileDown");

btnMobileLeft.addEventListener("click", () => {
  let [x, y, z] = DIRECCION["ArrowLeft"];
  if (x !== controles.direccion.x && y !== controles.direccion.y)
    asignarDirecciones(x, y, z);
});
btnMobileTop.addEventListener("click", () => {
  let [x, y, z] = DIRECCION["ArrowUp"];
  if (x !== controles.direccion.x && y !== controles.direccion.y)
    asignarDirecciones(x, y, z);
});
btnMobileDown.addEventListener("click", () => {
  let [x, y, z] = DIRECCION["ArrowDown"];
  if (x !== controles.direccion.x && y !== controles.direccion.y)
    asignarDirecciones(x, y, z);
});
btnMobileRight.addEventListener("click", () => {
  let [x, y, z] = DIRECCION["ArrowRight"];
  if (x !== controles.direccion.x && y !== controles.direccion.y)
    asignarDirecciones(x, y, z);
});
tryAgain.addEventListener("click", () => {
  gameOver.style.display = "none";
  document.querySelectorAll(".tail").forEach((el) => el.remove());
  controles.jugando = true;
  controles.direccion.x = 0;
  controles.direccion.y = 10;
  controles.rotate = 0;

  controles.vidas = 3;
  const vidas = document.getElementById("vidas");
  vidas.innerHTML = "💗 💗 💗";
  puntajeTotal = 0;
  jugar();
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
  // console.log(previousLeft, previousTop, arrayTop);
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
    // console.log(index);
  }
  detectarChoque();
  //   avanzar(controles.direccion.y, controles.direccion.x, cabeza);
  //dibujo la victima
  atrapado();
};

window.addEventListener("keydown", (e) => {
  let [x, y, z] = DIRECCION[e.key];
  if (x !== controles.direccion.x && y !== controles.direccion.y) {
    //si las posiciones no son opuestas ni iguales asigno las direcciones a mis controles
    controles.direccion.x = x;
    controles.direccion.y = y;
    controles.rotate = z;
  }
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
    audioEat.play();
    revictima();
    agregarCola();

    puntajeTotal += 1000;
  }
};

let randomXY = (ANCHO, ALTO) => {
  let x =
    Math.round((Math.random() * (ALTO - MOVIMIENTO)) / MOVIMIENTO) * MOVIMIENTO;
  let y =
    Math.round((Math.random() * (ANCHO - MOVIMIENTO)) / MOVIMIENTO) *
    MOVIMIENTO;
  return { x: x, y: y };
};

let revictima = () => {
  let { x, y } = randomXY(ANCHO, ALTO);
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
  let serpiente = document.querySelectorAll(".snake");

  let [y, x] = cabeza.getAttribute("data-position").split(",");
  if (y >= ALTO || y < 0 || x >= ANCHO || x < 0) {
    vidasPerdiste();
  }
  for (let index = 0; index < serpiente.length; index++) {
    if (
      index !== 0 &&
      y === serpiente[index].getAttribute("data-position").split(",")[0] &&
      x === serpiente[index].getAttribute("data-position").split(",")[1]
    ) {
      vidasPerdiste();
    }
  }
};
let actualizarPuntaje = () => {
  // ++puntajeTotal;
  puntaje.innerHTML = puntajeTotal;
};
let asignarDirecciones = (x, y, z) => {
  controles.direccion.x = x;
  controles.direccion.y = y;
  controles.rotate = z;
};
const vidasPerdiste = () => {
  audioLifeLost.play();
  controles.vidas -= 1;
  const vidas = document.getElementById("vidas");
  switch (controles.vidas) {
    case 2:
      vidas.innerHTML = "💗 💗 🖤";
      break;
    case 1:
      vidas.innerHTML = "💗 🖤 🖤";
      break;
    case 0:
      vidas.innerHTML = "🖤 🖤 🖤";
      break;
  }
  if (controles.vidas > 0) {
    // controles.jugando = true;
    controles.direccion.x = 0;
    controles.direccion.y = 10;
    controles.rotate = 0;

    clearInterval(myInterval);

    cuentaRegresiva();
  } else {
    audioGameOver.play();
    controles.jugando = false;
    gameOver.style.display = "flex";
    clearInterval(myInterval);
    recuperarMensajes();
    // guardarScore();
  }
};
const jugar = () => {
  let { x, y } = randomXY(ANCHO, ALTO);
  console.log(x, y);
  serpiente[0].style.top = `${y}px`;
  serpiente[0].style.left = `${x}px`;
  myInterval = setInterval(() => {
    let mediaqueryListMobile = window.matchMedia("(max-width: 768px)");
    let mediaqueryListDesktop = window.matchMedia("(min-width: 769px)");
    if (mediaqueryListMobile.matches) {
      ANCHO = 350;
      ALTO = 600;
    }
    if (mediaqueryListDesktop.matches) {
      ANCHO = 500;
      ALTO = 500;
    }
    if (controles.jugando) {
      dibujar();
      actualizarPuntaje();
    }
  }, INTERVALO);
};
guardarScore = (nombre, score) => {
  const record = {
    jugador: nombre,
    score: score,
    // txt: inputMessage.value,
    // hour: getDate(),
  };
  const db = firebase.database();
  const dbRef = db.ref("snake");
  const newMessage = dbRef.push();
  newMessage.set(record);
};
recuperarMensajes = () => {
  const db = firebase.database();
  const dbRef = db.ref("snake");
  dbRef.once("value", (snapchot) => {
    let recover = snapchot.val()
      ? snapchot.val()
      : { id: { nombre: "pepe", score: 0 } };
    let arrayScores = Object.values(recover);
    let arraySort = arrayScores.sort((a, b) => b.score - a.score);
    console.log(arraySort);
    if (puntajeTotal > arraySort[4].score) {
      let nombre = prompt("Ingresá tu nombre");
      guardarScore(nombre, puntajeTotal);
      leaderBoard();
    }
  });
};
leaderBoard = () => {
  const db = firebase.database();
  const dbRef = db.ref("snake");
  dbRef.once("value", (snapchot) => {
    let recover = snapchot.val();
    let arrayScores = Object.values(recover);
    let arraySort = arrayScores.sort((a, b) => b.score - a.score);
    arraySort.length = 5;
    tBody.innerHTML = "";
    arraySort.forEach((item, index) => {
      // let df= document.createDocumentFragment();
      let tr = document.createElement("tr");
      let tdPuesto = document.createElement("td");
      tdPuesto.innerHTML = index + 1;
      let tdNombre = document.createElement("td");
      tdNombre.innerHTML = item.jugador;
      let tdScore = document.createElement("td");
      tdScore.innerHTML = item.score;
      tr.appendChild(tdPuesto);
      tr.appendChild(tdNombre);
      tr.appendChild(tdScore);
      tBody.appendChild(tr);
    });
  });
};
const cuentaRegresiva = () => {
  setTimeout(() => {
    bonus.innerHTML = "2";
  }, 500);
  setTimeout(() => {
    bonus.innerHTML = "1";
  }, 1500);
  setTimeout(() => {
    bonus.innerHTML = "GO";
    jugar();
  }, 2000);
};
window.onload = () => {
  //Queries
  leaderBoard();
  revictima();
  controles.jugando = true;
  cuentaRegresiva();
};

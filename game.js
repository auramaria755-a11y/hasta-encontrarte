const canvas = document.getElementById("juego");
const ctx = canvas.getContext("2d");

const personaje = {
    x: 170,
    y: 218,
    ancho: 32,
    alto: 67,
    velocidad: 3,
    velocidadY: 0,
    saltando: false
};

const teclas = {
    izquierda: false,
    derecha: false
};

const gravedad = 0.4;
const fuerzaSalto = -8.5;
let mensajeAbierto = false;
let corazonesRecogidos = 0;

const frasesDeAmor = [
    "Por ti, por mí, por todo lo que somos juntas. Por la vida que estamos construyendo, por cada sueño que compartimos y por todo lo que todavía nos queda por cumplir.",

    "Porque te miro y entiendo por qué todo en mi vida tenía que pasar como pasó: era para llegar a ti. Eres mi destino, mi sueño hecho realidad, mi felicidad y el amor que tanto soñé tener.",

    "Mi parte favorita de verte nunca fue la intimidad; fue sentir tu olor, ver tus ojitos, acariciar tus ricitos, abrazarte, darte besitos por la cara, escucharte hablarme suave, entrelazar nuestras manos, oírte reír y verte sonreír.",

    "Quiero estar contigo cuando las cosas se pongan difíciles, cuando tu cuerpo cambie, cuando envejezcas y cuando el trabajo se ponga difícil.",

    "Quiero que mi forma de amarte sea lo que nuestros hijos sientan que merecen.",

    "Contigo aprendí lo importante que es elegir bien.",

    "Sé que hemos atravesado muchos momentos difíciles. Yo quiero demostrarte que voy contigo hasta la muerte, porque junto a ti siento que nuestras vidas bailan en perfecta armonía. En un mundo donde las personas parecen incompatibles, nosotras encajamos a la perfección. Te amo, amor de mi vida."
];

const plataformas = [
    { x: 280, y: 225, ancho: 120, alto: 20 }
];

const corazones = [
    { x: 65, y: 245, recogido: false },
    { x: 145, y: 245, recogido: false },
    { x: 225, y: 225, recogido: false },
    { x: 320, y: 185, recogido: false },
    { x: 420, y: 245, recogido: false },
    { x: 500, y: 245, recogido: false },
    { x: 575, y: 245, recogido: false }
];

// Ventana romántica
const ventana = document.createElement("div");

ventana.style.cssText = `
    display: none;
    position: fixed;
    inset: 0;
    z-index: 1000;
    background: rgba(15, 10, 30, 0.82);
    align-items: center;
    justify-content: center;
    padding: 20px;
`;

ventana.innerHTML = `
    <div style="
        width: 100%;
        max-width: 430px;
        max-height: 85vh;
        overflow-y: auto;
        background: #292039;
        border: 3px solid #FF83A8;
        border-radius: 18px;
        padding: 28px 22px;
        color: #FFF0F5;
        text-align: center;
        box-shadow: 0 0 30px rgba(255, 100, 160, 0.3);
    ">
        <div style="font-size: 42px;">❤️</div>
        <h2 style="color: #FFB6CE; margin: 10px 0 18px;">
            Un corazón para ti
        </h2>
        <p id="frase-romantica" style="
            font-size: 18px;
            line-height: 1.7;
            overflow-wrap: anywhere;
        "></p>
        <p id="contador-corazones" style="color: #E8CFEF;"></p>
        <button id="continuar-amor" style="
            background: #D94F70;
            color: white;
            border: none;
            border-radius: 12px;
            padding: 14px 20px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
        ">Continuar, mi amor ❤️</button>
    </div>
`;

document.body.appendChild(ventana);

const pantallaFinal = document.createElement("div");

pantallaFinal.style.cssText = `
    display: none;
    position: fixed;
    inset: 0;
    z-index: 2000;
    background: linear-gradient(
        180deg,
        #F4B183 0%,
        #F58FA8 45%,
        #292039 100%
    );
    color: #FFF0F5;
    align-items: center;
    justify-content: center;
    padding: 24px;
    text-align: center;
    box-sizing: border-box;
`;

pantallaFinal.innerHTML = `
    <div style="
        max-width: 440px;
        width: 100%;
        padding: 28px 20px;
        box-sizing: border-box;
    ">
        <div style="font-size: 54px; margin-bottom: 12px;">
            ❤️ 💗 ❤️
        </div>

        <h1 style="
            color: #FFFFFF;
            font-size: clamp(30px, 8vw, 44px);
            margin: 10px 0 18px;
        ">
            Hasta encontrarte
        </h1>

        <p style="
            font-size: 19px;
            line-height: 1.7;
            margin-bottom: 24px;
        ">
            De todos los caminos que pude tomar,
            mi favorito siempre será el que me lleva a ti.
        </p>

        <p style="
            font-size: 21px;
            color: #FFF0A8;
            font-weight: bold;
            line-height: 1.5;
        ">
            Tú eres mi lugar favorito. ❤️
        </p>

        <p style="font-size: 16px; margin: 24px 0;">
            Fin… o el comienzo de nuestra historia.
        </p>

        <button id="volver-jugar" style="
            background: #D92764;
            color: white;
            border: 2px solid #FFFFFF;
            border-radius: 14px;
            padding: 14px 22px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
        ">
            Volver a jugar ❤️
        </button>
    </div>
`;

document.body.appendChild(pantallaFinal);

// Botón para cerrar cada mensaje y mostrar el final después del séptimo corazón
document.getElementById("continuar-amor").addEventListener("click", () => {
    ventana.style.display = "none";

    if (corazonesRecogidos === corazones.length) {
        mensajeAbierto = true;
        pantallaFinal.style.display = "flex";
    } else {
        mensajeAbierto = false;
    }
});

// Botón para volver a empezar el juego
document.getElementById("volver-jugar").addEventListener("click", () => {
    window.location.reload();
});

function mostrarFrase(numero) {
    mensajeAbierto = true;

    document.getElementById("frase-romantica").textContent =
        frasesDeAmor[numero];

    document.getElementById("contador-corazones").textContent =
        `Corazón ${numero + 1} de ${frasesDeAmor.length}`;

    ventana.style.display = "flex";
}
// Dibujar el escenario tropical
function dibujarFondo() {
    const cielo = ctx.createLinearGradient(0, 0, 0, canvas.height);
    cielo.addColorStop(0, "#87CEEB");
    cielo.addColorStop(1, "#FFE0B5");

    ctx.fillStyle = cielo;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Sol
    ctx.fillStyle = "#FFD166";
    ctx.beginPath();
    ctx.arc(540, 55, 30, 0, Math.PI * 2);
    ctx.fill();

    // Mar
    ctx.fillStyle = "#40C9D8";
    ctx.fillRect(0, 270, canvas.width, canvas.height - 270);

    // Arena
    ctx.fillStyle = "#F6D7A7";
    ctx.fillRect(0, 250, canvas.width, 25);

    // Nubes
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.arc(100, 60, 18, 0, Math.PI * 2);
    ctx.arc(120, 50, 24, 0, Math.PI * 2);
    ctx.arc(145, 62, 18, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(350, 85, 15, 0, Math.PI * 2);
    ctx.arc(370, 75, 22, 0, Math.PI * 2);
    ctx.arc(395, 86, 16, 0, Math.PI * 2);
    ctx.fill();

    // Palmeras
    dibujarPalmera(35, 240);
    dibujarPalmera(585, 240);

    // Suelo
    ctx.fillStyle = "#E8BD82";
    ctx.fillRect(0, 250, canvas.width, 25);
}

function dibujarPalmera(x, y) {
    ctx.fillStyle = "#8B5A2B";
    ctx.fillRect(x - 5, y - 65, 10, 65);

    ctx.strokeStyle = "#287A45";
    ctx.lineWidth = 7;
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(x, y - 65);
    ctx.lineTo(x - 28, y - 83);
    ctx.moveTo(x, y - 65);
    ctx.lineTo(x + 30, y - 87);
    ctx.moveTo(x, y - 65);
    ctx.lineTo(x - 35, y - 65);
    ctx.moveTo(x, y - 65);
    ctx.lineTo(x + 34, y - 60);
    ctx.moveTo(x, y - 65);
    ctx.lineTo(x, y - 95);
    ctx.stroke();
}

// Dibujar a la protagonista
function dibujarPersonaje() {
    const x = personaje.x;
    const y = personaje.y;

    // Pelo oscuro
    ctx.fillStyle = "#30201C";
    ctx.fillRect(x + 5, y, 22, 17);
    ctx.fillRect(x + 2, y + 7, 7, 17);
    ctx.fillRect(x + 23, y + 7, 7, 19);

    // Cara
    ctx.fillStyle = "#C68655";
    ctx.fillRect(x + 7, y + 8, 18, 19);

    // Ojos
    ctx.fillStyle = "#30201C";
    ctx.fillRect(x + 11, y + 15, 3, 3);
    ctx.fillRect(x + 19, y + 15, 3, 3);

    // Sonrisa
    ctx.fillStyle = "#8D3B4A";
    ctx.fillRect(x + 14, y + 22, 6, 2);

    // Camiseta rosa
    ctx.fillStyle = "#FF75A0";
    ctx.fillRect(x + 5, y + 28, 22, 20);
    ctx.fillRect(x, y + 30, 7, 14);
    ctx.fillRect(x + 25, y + 30, 7, 14);

    // Pantalón azul
    ctx.fillStyle = "#3978C5";
    ctx.fillRect(x + 7, y + 48, 8, 12);
    ctx.fillRect(x + 17, y + 48, 8, 12);

    // Zapatos
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(x + 4, y + 60, 12, 5);
    ctx.fillRect(x + 17, y + 60, 12, 5);
}

// Dibujar los corazones coleccionables
function dibujarCorazones() {
    corazones.forEach((corazon) => {
        if (corazon.recogido) return;

        ctx.font = "25px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("❤️", corazon.x, corazon.y);
    });
}

// Dibujar las plataformas
function dibujarPlataformas() {
    plataformas.forEach((plataforma) => {
        ctx.fillStyle = "#B77B45";
        ctx.fillRect(
            plataforma.x,
            plataforma.y,
            plataforma.ancho,
            plataforma.alto
        );

        ctx.fillStyle = "#53A653";
        ctx.fillRect(
            plataforma.x,
            plataforma.y,
            plataforma.ancho,
            6
        );
    });
}

// Comprobar colisiones entre la protagonista y los corazones
function comprobarCorazones() {
    corazones.forEach((corazon, indice) => {
        if (corazon.recogido) return;

        const distanciaX = Math.abs(
            (personaje.x + personaje.ancho / 2) - corazon.x
        );

        const distanciaY = Math.abs(
            (personaje.y + personaje.alto / 2) - corazon.y
        );

        if (distanciaX < 28 && distanciaY < 35) {
            corazon.recogido = true;
            corazonesRecogidos++;
            mostrarFrase(indice);
        }
    });
}

// Movimiento y salto
function actualizarPersonaje() {
    if (mensajeAbierto) return;

    if (teclas.izquierda) {
        personaje.x -= personaje.velocidad;
    }

    if (teclas.derecha) {
        personaje.x += personaje.velocidad;
    }

    // Evitar que salga de la pantalla
    personaje.x = Math.max(
        0,
        Math.min(canvas.width - personaje.ancho, personaje.x)
    );

    // Gravedad
    personaje.y += personaje.velocidadY;
    personaje.velocidadY += gravedad;

    // Suelo
    const suelo = 250 - personaje.alto;

    if (personaje.y >= suelo) {
        personaje.y = suelo;
        personaje.velocidadY = 0;
        personaje.saltando = false;
    }

    // Colisión con plataformas al caer
    plataformas.forEach((plataforma) => {
        const piesAntes = personaje.y + personaje.alto - personaje.velocidadY;

        const tocaHorizontal =
            personaje.x + personaje.ancho > plataforma.x &&
            personaje.x < plataforma.x + plataforma.ancho;

        const caeSobrePlataforma =
            personaje.velocidadY >= 0 &&
            piesAntes <= plataforma.y &&
            personaje.y + personaje.alto >= plataforma.y;

        if (tocaHorizontal && caeSobrePlataforma) {
            personaje.y = plataforma.y - personaje.alto;
            personaje.velocidadY = 0;
            personaje.saltando = false;
        }
    });

    comprobarCorazones();
}

// Bucle principal del juego
function dibujarJuego() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    dibujarFondo();
    dibujarPlataformas();
    dibujarCorazones();
    dibujarPersonaje();

    actualizarPersonaje();

    requestAnimationFrame(dibujarJuego);
}

// Controles del teclado
document.addEventListener("keydown", (evento) => {
    if (
        ["ArrowLeft", "ArrowRight", "ArrowUp", " "].includes(evento.key)
    ) {
        evento.preventDefault();
    }

    if (evento.key === "ArrowLeft" || evento.key.toLowerCase() === "a") {
        teclas.izquierda = true;
    }

    if (evento.key === "ArrowRight" || evento.key.toLowerCase() === "d") {
        teclas.derecha = true;
    }

    if (
        (evento.key === "ArrowUp" ||
            evento.key === " " ||
            evento.key.toLowerCase() === "w") &&
        !personaje.saltando &&
        !mensajeAbierto
    ) {
        personaje.velocidadY = fuerzaSalto;
        personaje.saltando = true;
    }
});

document.addEventListener("keyup", (evento) => {
    if (evento.key === "ArrowLeft" || evento.key.toLowerCase() === "a") {
        teclas.izquierda = false;
    }

    if (evento.key === "ArrowRight" || evento.key.toLowerCase() === "d") {
        teclas.derecha = false;
    }
});

// Controles táctiles para jugar desde el móvil
function crearControlMovil(id, accion) {
    const boton = document.getElementById(id);

    if (!boton) return;

    boton.addEventListener("touchstart", (evento) => {
        evento.preventDefault();
        accion(true);
    }, { passive: false });

    boton.addEventListener("touchend", (evento) => {
        evento.preventDefault();
        accion(false);
    }, { passive: false });

    boton.addEventListener("mousedown", () => accion(true));
    boton.addEventListener("mouseup", () => accion(false));
    boton.addEventListener("mouseleave", () => accion(false));
}

crearControlMovil("izquierda", (activo) => {
    teclas.izquierda = activo;
});

crearControlMovil("derecha", (activo) => {
    teclas.derecha = activo;
});

const botonSaltar = document.getElementById("saltar");

if (botonSaltar) {
    botonSaltar.addEventListener("touchstart", (evento) => {
        evento.preventDefault();

        if (!personaje.saltando && !mensajeAbierto) {
            personaje.velocidadY = fuerzaSalto;
            personaje.saltando = true;
        }
    }, { passive: false });

    botonSaltar.addEventListener("click", () => {
        if (!personaje.saltando && !mensajeAbierto) {
            personaje.velocidadY = fuerzaSalto;
            personaje.saltando = true;
        }
    });
}

// Iniciar el juego
dibujarJuego();

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

function mostrarFrase(numero) {
    mensajeAbierto = true;

    document.getElementById("frase-romantica").textContent =
        frasesDeAmor[numero];

    document.getElementById("contador-corazones").textContent =
        `Corazón ${numero + 1} de ${frasesDeAmor.length}`;

    ventana.style.display = "flex";
}

document.getElementById("continuar-amor").addEventListener("click", () => {
    ventana.style.display = "none";
    mensajeAbierto = false;
});

function dibujarEscenario() {
    // Cielo
    ctx.fillStyle = "#F4B183";
    ctx.fillRect(0, 0, 640, 360);

    // Sol
    ctx.fillStyle = "#FFE27A";
    ctx.fillRect(500, 45, 32, 32);
    ctx.fillRect(492, 53, 8, 16);
    ctx.fillRect(532, 53, 8, 16);
    ctx.fillRect(508, 37, 16, 8);
    ctx.fillRect(508, 77, 16, 8);

    // Mar
    ctx.fillStyle = "#20B8C4";
    ctx.fillRect(0, 210, 640, 75);

    // Arena
    ctx.fillStyle = "#EBCB87";
    ctx.fillRect(0, 285, 640, 75);

    // Tronco de la palmera
    ctx.fillStyle = "#8B5A2B";
    ctx.fillRect(105, 160, 12, 125);

    // Hojas
    ctx.fillStyle = "#287A45";
    ctx.fillRect(92, 137, 12, 30);
    ctx.fillRect(78, 143, 18, 8);
    ctx.fillRect(65, 151, 18, 8);
    ctx.fillRect(70, 163, 35, 8);
    ctx.fillRect(116, 137, 12, 30);
    ctx.fillRect(124, 143, 18, 8);
    ctx.fillRect(139, 151, 18, 8);
    ctx.fillRect(117, 163, 35, 8);

    // Plataformas
    for (const plataforma of plataformas) {
        ctx.fillStyle = "#795548";
        ctx.fillRect(
            plataforma.x, plataforma.y,
            plataforma.ancho, plataforma.alto
        );

        ctx.fillStyle = "#4CAF50";
        ctx.fillRect(
            plataforma.x, plataforma.y,
            plataforma.ancho, 7
        );
    }

    // Corazones coleccionables
    for (const corazon of corazones) {
        if (corazon.recogido) continue;

        const x = corazon.x;
        const y = corazon.y;

        ctx.fillStyle = "#D92764";

        // Silueta pixelada del corazón
        ctx.fillRect(x - 10, y - 8, 8, 8);
        ctx.fillRect(x + 2, y - 8, 8, 8);
        ctx.fillRect(x - 14, y - 4, 28, 8);
        ctx.fillRect(x - 10, y + 4, 20, 8);
        ctx.fillRect(x - 6, y + 12, 12, 4);

        // Brillo
        ctx.fillStyle = "#FFB6CE";
        ctx.fillRect(x - 7, y - 6, 4, 4);
    }
}

function dibujarPersonaje() {
    const x = Math.round(personaje.x);
    const y = Math.round(personaje.y);

    // Cabello rizado
    ctx.fillStyle = "#3B241C";
    ctx.fillRect(x, y + 4, 8, 8);
    ctx.fillRect(x + 4, y, 8, 8);
    ctx.fillRect(x + 12, y, 8, 8);
    ctx.fillRect(x + 20, y + 4, 8, 8);
    ctx.fillRect(x, y + 8, 8, 16);
    ctx.fillRect(x + 24, y + 8, 8, 12);
    ctx.fillRect(x + 4, y + 8, 24, 8);

    // Cara canela
    ctx.fillStyle = "#B8754F";
    ctx.fillRect(x + 4, y + 8, 24, 20);

    // Ojos y sonrisa
    ctx.fillStyle = "#2B1B16";
    ctx.fillRect(x + 9, y + 15, 3, 4);
    ctx.fillRect(x + 20, y + 15, 3, 4);
    ctx.fillRect(x + 13, y + 23, 7, 2);

    // Brazos
    ctx.fillStyle = "#B8754F";
    ctx.fillRect(x, y + 30, 6, 18);
    ctx.fillRect(x + 26, y + 30, 6, 18);

    // Camiseta
    ctx.fillStyle = "#D94F70";
    ctx.fillRect(x + 6, y + 28, 20, 24);

    // Piernas
    ctx.fillStyle = "#303A70";
    ctx.fillRect(x + 7, y + 52, 7, 10);
    ctx.fillRect(x + 19, y + 52, 7, 10);

    // Zapatos
    ctx.fillStyle = "#5B3529";
    ctx.fillRect(x + 3, y + 62, 11, 5);
    ctx.fillRect(x + 19, y + 62, 11, 5);
}

function actualizar() {
    const anteriorY = personaje.y;

    if (teclas.izquierda) personaje.x -= personaje.velocidad;
    if (teclas.derecha) personaje.x += personaje.velocidad;

    personaje.x = Math.max(
        0,
        Math.min(canvas.width - personaje.ancho, personaje.x)
    );

    // Gravedad y salto
    personaje.velocidadY += gravedad;
    personaje.y += personaje.velocidadY;

    personaje.saltando = true;

    const superficies = [
        { x: 0, y: 285, ancho: canvas.width },
        ...plataformas
    ];

    for (const superficie of superficies) {
        const pieAnterior = anteriorY + personaje.alto;
        const pieActual = personaje.y + personaje.alto;

        const dentroHorizontal =
            personaje.x + personaje.ancho > superficie.x &&
            personaje.x < superficie.x + superficie.ancho;

        if (
            dentroHorizontal &&
            personaje.velocidadY >= 0 &&
            pieAnterior <= superficie.y &&
            pieActual >= superficie.y
        ) {
            personaje.y = superficie.y - personaje.alto;
            personaje.velocidadY = 0;
            personaje.saltando = false;
        }
    }

    // Recoger corazones
    for (let i = 0; i < corazones.length; i++) {
        const corazon = corazones[i];

        if (corazon.recogido) continue;

        const tocaCorazon =
            personaje.x < corazon.x + 12 &&
            personaje.x + personaje.ancho > corazon.x - 12 &&
            personaje.y < corazon.y + 12 &&
            personaje.y + personaje.alto > corazon.y - 12;

        if (tocaCorazon) {
            corazon.recogido = true;
            corazonesRecogidos++;
            mostrarFrase(i);
            break;
        }
    }
}

function dibujarCorazones() {
    corazones.forEach((corazon) => {
        if (corazon.recogido) return;

        const x = Math.round(corazon.x);
        const y = Math.round(corazon.y);

        // Dibujar el corazón en pixel art
        ctx.fillStyle = "#FF4F87";

        ctx.fillRect(x - 10, y - 8, 8, 8);
        ctx.fillRect(x + 2, y - 8, 8, 8);
        ctx.fillRect(x - 14, y, 28, 8);
        ctx.fillRect(x - 10, y + 8, 20, 8);
        ctx.fillRect(x - 6, y + 16, 12, 4);

        // Brillo del corazón
        ctx.fillStyle = "#FFB6CE";
        ctx.fillRect(x - 7, y - 5, 4, 4);
    });
}
console.log("Juego cargado. Corazones:", corazones.length);
function bucleJuego() {
    if (!mensajeAbierto) actualizar();

    dibujarEscenario();
    dibujarPersonaje();
    dibujarCorazones();

    requestAnimationFrame(bucleJuego);
}

// Teclado
document.addEventListener("keydown", (evento) => {
    if (mensajeAbierto) return;

    if (["ArrowLeft", "ArrowRight", "ArrowUp", " "].includes(evento.key)) {
        evento.preventDefault();
    }

    if (evento.key === "ArrowLeft") teclas.izquierda = true;
    if (evento.key === "ArrowRight") teclas.derecha = true;

    if (
        (evento.key === "ArrowUp" || evento.key === " ") &&
        !personaje.saltando
    ) {
        personaje.velocidadY = fuerzaSalto;
        personaje.saltando = true;
    }
});

document.addEventListener("keyup", (evento) => {
    if (evento.key === "ArrowLeft") teclas.izquierda = false;
    if (evento.key === "ArrowRight") teclas.derecha = false;
});

// Botones táctiles
function conectarBoton(id, alPulsar, alSoltar) {
    const boton = document.getElementById(id);
    if (!boton) return;

    boton.addEventListener("pointerdown", (evento) => {
        evento.preventDefault();
        if (!mensajeAbierto) alPulsar();
    });

    boton.addEventListener("pointerup", alSoltar);
    boton.addEventListener("pointercancel", alSoltar);
    boton.addEventListener("pointerleave", alSoltar);
}

conectarBoton(
    "izquierda",
    () => teclas.izquierda = true,
    () => teclas.izquierda = false
);

conectarBoton(
    "derecha",
    () => teclas.derecha = true,
    () => teclas.derecha = false
);

conectarBoton(
    "saltar",
    () => {
        if (!personaje.saltando) {
            personaje.velocidadY = fuerzaSalto;
            personaje.saltando = true;
        }
    },
    () => {}
);

bucleJuego();

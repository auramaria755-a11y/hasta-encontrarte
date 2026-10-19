
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

const plataformas = [
    { x: 280, y: 225, ancho: 120, alto: 20 }
];

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
            plataforma.x,
            plataforma.y,
            plataforma.ancho,
            plataforma.alto
        );

        ctx.fillStyle = "#4CAF50";
        ctx.fillRect(
            plataforma.x,
            plataforma.y,
            plataforma.ancho,
            7
        );
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

    if (teclas.izquierda) {
        personaje.x -= personaje.velocidad;
    }

    if (teclas.derecha) {
        personaje.x += personaje.velocidad;
    }

    // Mantener al personaje dentro de la pantalla
    personaje.x = Math.max(
        0,
        Math.min(640 - personaje.ancho, personaje.x)
    );

    // Gravedad
    personaje.velocidadY += gravedad;
    personaje.y += personaje.velocidadY;

    personaje.saltando = true;

    // Suelo y plataformas
    const superficies = [
        { x: 0, y: 285, ancho: 640 },
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
}

function bucleJuego() {
    actualizar();
    dibujarEscenario();
    dibujarPersonaje();
    requestAnimationFrame(bucleJuego);
}

// Controles del teclado
document.addEventListener("keydown", function (evento) {
    if (
        ["ArrowLeft", "ArrowRight", "ArrowUp", " "].includes(evento.key)
    ) {
        evento.preventDefault();
    }

    if (evento.key === "ArrowLeft") {
        teclas.izquierda = true;
    }

    if (evento.key === "ArrowRight") {
        teclas.derecha = true;
    }

    if (
        (evento.key === "ArrowUp" || evento.key === " ") &&
        !personaje.saltando
    ) {
        personaje.velocidadY = fuerzaSalto;
        personaje.saltando = true;
    }
});

document.addEventListener("keyup", function (evento) {
    if (evento.key === "ArrowLeft") {
        teclas.izquierda = false;
    }

    if (evento.key === "ArrowRight") {
        teclas.derecha = false;
    }
});

bucleJuego();

function conectarBoton(id, alPulsar, alSoltar) {
    const boton = document.getElementById(id);

    boton.addEventListener("pointerdown", (evento) => {
        evento.preventDefault();
        alPulsar();
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

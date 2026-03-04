let mouseX = 0;
let mouseY = 0;

export default class SelectScene {
    constructor(canvas) {
        this.canvas = canvas;
        this.imageLoaded = false;
        this.backgroundLoaded = false;

        // Imagen de fondo
        this.background = new Image();
        this.background.src = "./assets/Coliseo.png";
        this.background.onload = () => { this.backgroundLoaded = true; };

        // Imagen de gladiadores
        this.gladiatorsImage = new Image();
        this.gladiatorsImage.src = "./assets/gladiadores.png";
        this.gladiatorsImage.onload = () => { this.imageLoaded = true; };

        // Zonas de los personajes
        this.zones = [
            { x: 200, y: 150, width: 200, height: 300, name: "Guerrero", stats: "Vida:120 Ataque:20 Vel:5", description: "Gladiador equilibrado en ataque y defensa. Ideal para un estilo adaptable" },
            { x: 400, y: 150, width: 200, height: 300, name: "Lancero", stats: "Vida:100 Ataque:25 Vel:6", description: "Gladiador rápido con mayor alcance. Perfecto para jugadores ágiles" },
            { x: 600, y: 150, width: 200, height: 300, name: "Pesado", stats: "Vida:150 Ataque:15 Vel:3", description: "Gladiador resistente con gran defensa. Soporta mucho daño pero es más lento" }
        ];

        canvas.addEventListener("mousemove", this.handleMouseMove.bind(this));
    }

    handleMouseMove(event) {
        const rect = this.canvas.getBoundingClientRect();
        mouseX = event.clientX - rect.left;
        mouseY = event.clientY - rect.top;
    }

    draw(ctx) {
        // Dibujar fondo negro si la imagen no está lista
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Dibujar fondo Coliseo
        if (this.backgroundLoaded) {
            ctx.drawImage(this.background, 0, 0, this.canvas.width, this.canvas.height);
        }

        // Dibujar gladiadores o mensaje de carga
        if (!this.imageLoaded) {
            ctx.fillStyle = "white";
            ctx.font = "30px Arial";
            ctx.textAlign = "center";
            ctx.fillText("Cargando...", this.canvas.width / 2, this.canvas.height / 2);
            return;
        }

        ctx.drawImage(this.gladiatorsImage, 200, 150, 600, 300);

        ctx.fillStyle = "white";
        ctx.font = "40px Arial";
        ctx.textAlign = "center";
        ctx.fillText("ELIGE TU GLADIADOR", this.canvas.width / 2, 100);

        // Mostrar stats al pasar el mouse
        this.zones.forEach(zone => {
            const isHover = mouseX > zone.x && mouseX < zone.x + zone.width && mouseY > zone.y && mouseY < zone.y + zone.height;

            if (isHover) {
                ctx.fillStyle = "rgba(0,0,0,0.85)";
                ctx.fillRect(150, 480, 700, 160);

                ctx.fillStyle = "yellow";
                ctx.font = "22px Arial";
                ctx.fillText(zone.name, this.canvas.width / 2, 510);

                const vida = zone.stats.match(/Vida:(\d+)/)[1];
                const ataque = zone.stats.match(/Ataque:(\d+)/)[1];
                const vel = zone.stats.match(/Vel:(\d+)/)[1];

                ctx.font = "18px Arial";
                ctx.fillStyle = "red";
                ctx.fillText(`Vida: ${vida}`, this.canvas.width / 2 - 100, 540);

                ctx.fillStyle = "#40E0D0";
                ctx.fillText(`Ataque: ${ataque}`, this.canvas.width / 2, 540);

                ctx.fillStyle = "green";
                ctx.fillText(`Velocidad: ${vel}`, this.canvas.width / 2 + 100, 540);

                ctx.font = "16px Arial";
                ctx.fillStyle = "white";
                ctx.fillText(zone.description, this.canvas.width / 2, 570);
            }
        });
    }
}
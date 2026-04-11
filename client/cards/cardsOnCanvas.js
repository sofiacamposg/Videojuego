"use strict";

class cardsOnCanvas {
    constructor() {
        this.isActive = false;
        this.offeredCards = [];
        this.selectedIndex = null;  //selected card
        this.Player = null;
        this._enemies = null;
        this._game = null;  //TODO arreglarlo con el nivel en el que va a ser usado
        this.activeEffects = [];  //effects currently active with a duration
    }

    show(allCards, player, enemies, game = null) {
        this.shuffle = allCards.sort(() => Math.random() - 0.5)
        this.offeredCards = this.shuffle.slice(0, 3);  //only show 3
        this.selectedIndex = null;
        this.isActive = true;
        this._player = player;  //track player, enemies and level for later
        this._enemies = enemies;
        this._game = game;
    }

    /** Cierra la UI sin aplicar nada */  //TODO poner una x y que se llame cuando se de click
    close() {
        this.isActive      = false;
        this.offeredCards  = [];
        this.selectedIndex = null;
    }

    draw(ctx, canvas) {
        if (!this.isActive) return;

        const W = canvas.width;
        const H = canvas.height;

        ctx.fillStyle = "rgba(0,0,0,0.75)";  //screen darker
        ctx.fillRect(0, 0, W, H);

        //title
        ctx.fillStyle   = "rgb(255, 187, 86)";
        ctx.font = "40px 'VT323'";
        ctx.textAlign   = "center";
        ctx.fillText("SELECT A CARD", W / 2, 72);

        //cards info
        const cardW = 220;  //card Width 
        const cardH = 300;  //card height
        const gap   = 28;  //space between cards
        const count = 3;  //cards shown array lenght
        //(total - (acho de todas las cartas + ancho de tods los espacios)/2
        const startX = (canvas.width - (count * cardW + (count - 1) * gap)) / 2;  
        const cardY  = (canvas.height - cardH) / 2;

        this.offeredCards.forEach((card, i) => {
            const x = startX + i * (cardW + gap);  //initial point + current card * (Width + space)
            const isSelected = this.selectedIndex === i;
            this.drawCard(ctx, card, x, cardY, cardW, cardH, isSelected);
        });

        if (this.selectedIndex !== null) { //only visible when one card is selected
            this.drawConfirmButton(ctx, W / 2, cardY + cardH + 48);
        }
        
    }

    handleClick(mx, my, canvas) {  
        if (!this.isActive) return null;

        //cards info
        const cardW = 220;  //card Width 
        const cardH = 300;  //card height
        const gap   = 28;  //space between cards
        const count = 3;  //cards shown array lenght
        //(total - (acho de todas las cartas + ancho de tods los espacios)/2
        const startX = (canvas.width - (count * cardW + (count - 1) * gap)) / 2;
        const cardY  = (canvas.height - cardH) / 2 + 10;

        for (let i = 0; i < this.offeredCards.length; i++) {  //click on the card?
            const x = startX + i * (cardW + gap);
            if (mx >= x && mx <= x + cardW && my >= cardY && my <= cardY + cardH) {
                this.selectedIndex = i;
            }
        }

        if (this.selectedIndex !== null) {  //confirmed?
            //button info
            const W   = canvas.width;
            const bW  = 180;
            const bH  = 40;
            const bX  = W / 2 - bW / 2;
            const bY  = cardY + cardH + 28;

            if (mx >= bX && mx <= bX + bW && my >= bY && my <= bY + bH) {
                return this.confirm();
            }
        }

        return null;
    }

    confirm() {
        const card = this.offeredCards[this.selectedIndex];
        this.close();

        card.applyEffect(this._player, this._enemies, this._game);  //apply effect to the character

        if (card.duration && card.removeEffect) {  //schedule removal via update()
            this.activeEffects.push({
                card,
                player: this._player,
                enemies: this._enemies,
                endTime: Date.now() + card.duration
            });
        }

        console.log(`Carta aplicada: ${card.name}`);
        return card;
    }

    update() {
        const now = Date.now();  //real tiempe, does not depend on fps
        this.activeEffects = this.activeEffects.filter(effect => {
            if (now >= effect.endTime) {  
                effect.card.removeEffect(effect.player, effect.enemies);  //remove effect
                return false;  //remove affect from array
            }
            return true;  //keeps on array
        });
    }

    drawCard(ctx, card, x, y, w, h, isSelected) {
        //check if the image is ok, no rompe el juego si no carga
        if (card.image && card.image.complete && card.image.naturalWidth > 0) {
            ctx.drawImage(card.image, x, y, w, h);
        }

        //visual confirmation
        if (isSelected) {
            ctx.shadowColor = card.type === "powerup" ? "#D4A537" : "#C0392B";
            ctx.shadowBlur  = 15;
            ctx.strokeStyle = card.type === "powerup" ? "#D4A537" : "#C0392B";
            ctx.lineWidth   = 3;
            ctx.beginPath();
            ctx.roundRect(x, y, w, h, 8);
            ctx.stroke();
            ctx.shadowBlur  = 0;
            ctx.shadowColor = "transparent";
        }
    }

    drawConfirmButton(ctx, cx, topY) {
        const w = 180;
        const h = 40;
        const x = cx - w / 2;

        ctx.fillStyle = "#D4A537";
        ctx.beginPath();
        ctx.roundRect(x, topY, w, h, 8);
        ctx.fill();

        ctx.fillStyle   = "#1A0E00";
        ctx.font = "30px 'VT323'";
        ctx.textAlign   = "center";
        ctx.fillText("CONFIRM", cx, topY + 28);
    }
}
export { cardsOnCanvas };
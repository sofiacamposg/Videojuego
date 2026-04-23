"use strict";
import { MessageBox } from "../objects/MessageBox.js";

class cardsOnCanvas {
    constructor() {
        //offered cards state
        this.isActive = false;
        this.offeredCards = [];
        this.selectedIndex = null;

        //deck state
        this.playerDeck = [];
        this.isDeckOpen = false;
        this.selectedDeckIndex = -1;

        //references set on show()
        this._player = null;
        this._enemies = null;
        this._game = null;

        this.activeEffects = [];

        this.cardBackImage = new Image();
        this.cardBackImage.src = "./assets/cards/BaseCard.png";

        //MessageBox as background container for each overlay
        this.cardBox = new MessageBox("SELECT A CARD", "", 80, 30, 840, 540);
        this.deckBox = new MessageBox("YOUR DECK", "", 80, 30, 840, 540);
    }

    // ========================= OFFERED CARDS =========================

    show(allCards, player, enemies, game = null) {
        const shuffled = [...allCards].sort(() => Math.random() - 0.5);
        this.offeredCards  = shuffled.slice(0, 3);
        this.selectedIndex = null;
        this.isActive      = true;
        this._player  = player;
        this._enemies = enemies;
        this._game    = game;
        this.cardBox.show();
    }

    close() {
        this.isActive      = false;
        this.offeredCards  = [];
        this.selectedIndex = null;
        this.cardBox.hide();
    }

    draw(ctx, canvas) {
        if (!this.isActive) return;

        this.cardBox.draw(ctx); //background + title via MessageBox

        const W = canvas.width;
        const H = canvas.height;
        const cardW = 220;
        const cardH = 300;
        const gap = 28;
        const count = 3;
        const startX = (W - (count * cardW + (count - 1) * gap)) / 2;
        const cardY = (H - cardH) / 2;

        this.offeredCards.forEach((card, i) => {
            const x = startX + i * (cardW + gap);
            const isSelected = this.selectedIndex === i;
            this.drawCard(ctx, card, x, cardY, cardW, cardH, isSelected);
        });

        if (this.selectedIndex !== null) {
            this.drawConfirmButton(ctx, W / 2, cardY + cardH + 48);
        }
    }

    handleClick(mx, my, canvas) {
        if (!this.isActive) return null;

        const cardW = 220;
        const cardH = 300;
        const gap = 28;
        const count = 3;
        const startX = (canvas.width - (count * cardW + (count - 1) * gap)) / 2;
        const cardY = (canvas.height - cardH) / 2;  //same as draw()

        for (let i = 0; i < this.offeredCards.length; i++) {
            const x = startX + i * (cardW + gap);
            if (mx >= x && mx <= x + cardW && my >= cardY && my <= cardY + cardH) {
                this.selectedIndex = i;
            }
        }

        if (this.selectedIndex !== null) {
            const bW = 180;
            const bH = 40;
            const bX = canvas.width / 2 - bW / 2;
            const bY = cardY + cardH + 48;  //same offset as drawConfirmButton call

            if (mx >= bX && mx <= bX + bW && my >= bY && my <= bY + bH) {
                return this.confirm();
            }
        }

        return null;
    }

    confirm() {
        const card = this.offeredCards[this.selectedIndex];
        this.close();

        card.applyEffect(this._player, this._enemies, this._game);

        if (card.duration && card.removeEffect) {
            this.activeEffects.push({
                card,
                player:  this._player,
                enemies: this._enemies,
                endTime: card.duration
            });
        }

        this.playerDeck.push(card);
        return card;
    }

    update(deltaTime) {
        this.activeEffects = this.activeEffects.filter(effect => {
            effect.endTime -= deltaTime;
            if (effect.endTime <= 0) {
                effect.card.removeEffect(effect.player, effect.enemies);
                return false;
            }
            return true;
        });
    }

    // ========================= DECK =========================

    toggleDeck() {
        this.isDeckOpen = !this.isDeckOpen;
        this.selectedDeckIndex = -1;
        if (this.isDeckOpen) this.deckBox.show();
        else this.deckBox.hide();
    }

    //dibuja el deck del jugador en una cuadrícula
    drawDeck(ctx, canvas) {
        if (!this.isDeckOpen) return;

        this.deckBox.draw(ctx); //background + title via MessageBox

        const W = canvas.width;
        const H = canvas.height;

        if (this.playerDeck.length === 0) {
            ctx.fillStyle = "white";
            ctx.font      = "24px 'VT323'";
            ctx.fillText("No cards yet", W / 2, H / 2);
            return;
        }

        const cardW   = 140;
        const cardH   = 200;
        const cols    = 3;
        const spacingX = 220;
        const spacingY = 240;
        const startX  = (W - (cols * cardW + (cols - 1) * (spacingX - cardW))) / 2;
        const startY  = 110;

        for (let i = 0; i < this.playerDeck.length; i++) {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const x   = startX + col * spacingX;
            const y   = startY + row * spacingY;
            this.drawCard(ctx, this.playerDeck[i], x, y, cardW, cardH, this.selectedDeckIndex === i);
        }
    }

    handleDeckClick(mx, my, canvas) {
        if (!this.isDeckOpen) return null;

        const cardW    = 140;
        const cardH    = 200;
        const cols     = 3;
        const spacingX = 220;
        const spacingY = 240;
        const startX   = (canvas.width - (cols * cardW + (cols - 1) * (spacingX - cardW))) / 2;
        const startY   = 110;

        for (let i = 0; i < this.playerDeck.length; i++) {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const x   = startX + col * spacingX;
            const y   = startY + row * spacingY;
            if (mx >= x && mx <= x + cardW && my >= y && my <= y + cardH) {
                this.selectedDeckIndex = i;
                return;
            }
        }

        //botón usar carta seleccionada
        if (this.selectedDeckIndex !== -1) {
            const bW = 180;
            const bH = 40;
            const bX = canvas.width / 2 - bW / 2;
            const bY = canvas.height - 80;
            if (mx >= bX && mx <= bX + bW && my >= bY && my <= bY + bH) {
                const card = this.playerDeck[this.selectedDeckIndex];
                card.applyEffect(this._player, this._enemies, this._game);
                this.playerDeck.splice(this.selectedDeckIndex, 1);
                this.selectedDeckIndex = -1;
                this.isDeckOpen = false;
            }
        }
    }

    // ========================= HELPERS =========================

    drawCard(ctx, card, x, y, w, h, isSelected) {
        if (card.image && card.image.complete && card.image.naturalWidth > 0) {
            ctx.drawImage(card.image, x, y, w, h);
        } else {
            ctx.drawImage(this.cardBackImage, x, y, w, h);
        }

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

        //nombre bajo la carta
        ctx.fillStyle = "white";
        ctx.font      = "14px Arial";
        ctx.textAlign = "center";
        ctx.fillText(card.name, x + w / 2, y + h + 16);
        ctx.textAlign = "left";
    }

    drawConfirmButton(ctx, cx, topY) {
        const w = 180;
        const h = 40;
        const x = cx - w / 2;

        ctx.fillStyle = "#D4A537";
        ctx.beginPath();
        ctx.roundRect(x, topY, w, h, 8);
        ctx.fill();

        ctx.fillStyle = "#1A0E00";
        ctx.font      = "30px 'VT323'";
        ctx.textAlign = "center";
        ctx.fillText("CONFIRM", cx, topY + 28);
    }
}
export { cardsOnCanvas };

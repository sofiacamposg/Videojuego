"use strict";
import { MessageBox } from "../objects/MessageBox.js";
import { saveCardUse } from "../libs/level_functions.js";

class cardsOnCanvas {
    constructor() {
        //offered cards state, mid game
        this.isActive = false;
        this.offeredCards = [];
        this.selectedIndex = null;

        //deck state, when c is pressed
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
        this.cardBox = new MessageBox("SELECT A CARD", "The crowd wants to help you, but your fate will choose!", 80, 30, 840, 540);
        this.deckBox = new MessageBox("YOUR DECK", "Choose wisely", 80, 30, 840, 540);
        this.rewardBox = new MessageBox("Your reward, gladiator.", "By order of the Emperor, these powers are yours. Use them wisely, gladiator.", 80, 30, 840, 540);

        //cards added as reward at the end of a level, shown in drawReward
        this.rewardCards = [];
    }

// ========================= Mid game cards =========================
    show(allCards, player, enemies, game = null) {  //? call this to open the card pick screen with the 3 options
        this.offeredCards = allCards;
        this.selectedIndex = null;
        this.isActive = true;
        this._player = player;
        this._enemies = enemies;
        this._game = game;
        this.cardBox.show();
    }
    close() {  //? hides everything and resets the offered cards state
        this.isActive = false;
        this.offeredCards = [];
        this.selectedIndex = null;
        this.cardBox.buttons = [];
        this.cardBox.hide();
    }
    draw(ctx, canvas) {  //? draws the background box and the 3 cards centered on screen
        if (!this.isActive) return;  //no event triggered
        //dimentions
        const W = canvas.width;
        const H = canvas.height;
        const cardW = 220;
        const cardH = 300;
        const gap = 28;
        const count = 3;
        const startX = (W - (count * cardW + (count - 1) * gap)) / 2;
        const cardY = (H - cardH) / 2;
        this.cardBox.draw(ctx);  //draw form messageBox.js
        this.offeredCards.forEach((card, i) => {  //cards display
            const x = startX + i * (cardW + gap);
            const isSelected = this.selectedIndex === i;
            this.drawCard(ctx, card, x, cardY, cardW, cardH, isSelected);
        });
    }
    handleClick(mx, my, canvas) {  //? checks if the player clicked a card, marks it as selected and shows the confirm button
        if (!this.isActive) return null;  //no event triggered
        //dimentions
        const cardW = 220;
        const cardH = 300;
        const gap = 28;
        const count = 3;
        const startX = (canvas.width - (count * cardW + (count - 1) * gap)) / 2;
        const cardY = (canvas.height - cardH) / 2;

        for (let i = 0; i < this.offeredCards.length; i++) {  //position of every card
            const x = startX + i * (cardW + gap);
            if (mx >= x && mx <= x + cardW && my >= cardY && my <= cardY + cardH) {
                this.selectedIndex = i;
                this.cardBox.buttons = [];  //confirm button action
                this.cardBox.addButton("CONFIRM", canvas.width / 2 - 90, cardY + cardH + 48, 180, 40, () => this.confirm());
            }
        }

        //lets the messagebox check if the confirm button was clicked
        return this.cardBox.handleClick(mx, my);
    }
    confirm() {  //? applies the card effect and saves it to the db
        const card = this.offeredCards[this.selectedIndex];  //which card?
        this.close();  //ahh okay, close the screen
        card.applyEffect(this._player, this._enemies, this._game);  //apply the cards effect 
        
        if (this._player.cardCostHP) {  //hunger of the plebs effect
            this._player.takeDamage(this._player.maxHp / 2);
        }

        saveCardUse(1, card.id, card.duration || 0); 

        //track the time so we can undo the effect later
        if (card.duration && card.removeEffect) {
            this.activeEffects.push({
                card,
                player: this._player,
                enemies: this._enemies,
                game: this._game,
                endTime: card.duration
            });
        }

        return card;
    }
    update(deltaTime) {  //?counts down active card timers and removes effects when they run out
        this.activeEffects = this.activeEffects.filter(effect => {
            effect.endTime -= deltaTime;
            if (effect.endTime <= 0) {
                effect.card.removeEffect(effect.player, effect.enemies, effect.game);
                return false;
            }
            return true;
        });
    }
// ========================= deck cards =========================
    toggleDeck() {  //? call this to open the card pick screen
        this.isDeckOpen = !this.isDeckOpen;
        this.selectedDeckIndex = -1;
        this.deckBox.buttons = [];
        if (this.isDeckOpen) this.deckBox.show();  //show from messageBox.js
        else this.deckBox.hide();
    }
    drawDeck(ctx, canvas) {  //? draw plpayers deck in a box
        if (!this.isDeckOpen) return;  //c not clicked

        this.deckBox.draw(ctx); //background and title from MessageBox
        //dimentions
        const W = canvas.width;
        const H = canvas.height;
        const cardW = 140;
        const cardH = 200;
        const cols = 3;
        const spacingX = 220;
        const spacingY = 240;
        const startX = (W - (cols * cardW + (cols - 1) * (spacingX - cardW))) / 2;
        const startY = 110;
        //no cards screen
        if (this.playerDeck.length === 0) {
            ctx.fillStyle = "white";
            ctx.font = "24px 'VT323'";
            ctx.fillText("No cards yet", W / 2, H / 2);
            return;
        }
        for (let i = 0; i < this.playerDeck.length; i++) {  //cards display
            const col = i % cols;
            const row = Math.floor(i / cols);
            const x = startX + col * spacingX;
            const y = startY + row * spacingY;
            this.drawCard(ctx, this.playerDeck[i], x, y, cardW, cardH, this.selectedDeckIndex === i);  
        }

    }
    //draws the reward cards centered on screen using the same style as the mid-game event
    drawReward(ctx, canvas) {
        if (this.rewardCards.length === 0) return;

        const W = canvas.width;
        const H = canvas.height;
        const cardW = 220;
        const cardH = 300;
        const gap = 28;
        const count = this.rewardCards.length;
        const startX = (W - (count * cardW + (count - 1) * gap)) / 2;
        const cardY = (H - cardH) / 2;

        this.rewardBox.draw(ctx);

        this.rewardCards.forEach((card, i) => {
            const x = startX + i * (cardW + gap);
            this.drawCard(ctx, card, x, cardY, cardW, cardH, false);
        });
    }
    handleDeckClick(mx, my, canvas) {  //? checks if the player clicked a card, marks it as selected and shows the confirm button
        if (!this.isDeckOpen) return null;  //deck is close
        //dimentions
        const cardW = 140;
        const cardH = 200;
        const cols = 3;
        const spacingX = 220;
        const spacingY = 240;
        const startX = (canvas.width - (cols * cardW + (cols - 1) * (spacingX - cardW))) / 2;
        const startY = 110;
        //cards space to know if the click is inside or outside
        for (let i = 0; i < this.playerDeck.length; i++) {  
            const col = i % cols;
            const row = Math.floor(i / cols);
            const x = startX + col * spacingX;
            const y = startY + row * spacingY;
            if (mx >= x && mx <= x + cardW && my >= y && my <= y + cardH) {  //any card clicked
                this.selectedDeckIndex = i;
                this.deckBox.buttons = [];  //button actions
                this.deckBox.addButton("USE CARD", canvas.width / 2 - 90, canvas.height - 80, 180, 40, () => {
                    const card = this.playerDeck[this.selectedDeckIndex];
                    card.applyEffect(this._player, this._enemies, this._game);
                    saveCardUse(1, card.id, card.duration || 0);
                    this.playerDeck.splice(this.selectedDeckIndex, 1);
                    this.selectedDeckIndex = -1;
                    this.isDeckOpen = false;
                    this.deckBox.buttons = [];
                });
                return;
            }
        }
        this.deckBox.handleClick(mx, my)  //handle click in the botton
    }

// ========================= helpers for mid game event =========================
    drawCard(ctx, card, x, y, w, h, isSelected) {
        //* para test
        if (card.image && card.image.complete && card.image.naturalWidth > 0) {
            ctx.drawImage(card.image, x, y, w, h);
        } else {
            ctx.drawImage(this.cardBackImage, x, y, w, h);  //esta es la linea real
        }    
        if (this._game?.revealNextCard) {  //reveal card effect
            const isPowerUp = card.type === "POWER_UP";
            ctx.fillStyle = "white";
            ctx.font = "bold 30px 'VT323'";
            ctx.textAlign = "center";
            ctx.fillText(isPowerUp ? "POWER UP" : "PUNISHMENT", x + w / 2, y + h + 22);
            ctx.textAlign = "left";
        }
        if (isSelected) {  //shadow to have a visual confirmation
            ctx.shadowColor = "#ffed66";
            ctx.shadowBlur = 15;
            ctx.strokeStyle = "#ffc739";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.roundRect(x, y, w, h, 8);
            ctx.stroke();
            ctx.shadowBlur = 0;
            ctx.shadowColor = "transparent";
        }
    }

}
export { cardsOnCanvas };

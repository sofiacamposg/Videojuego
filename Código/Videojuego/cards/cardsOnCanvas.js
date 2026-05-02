/* 
& Handles everything related to drawing and managing cards within the game, includes:
& mid-level card event, player deck, and end-of-level reward

^ Note: We recommend installing the Colorful Comments extension to improve code readability 
^ https://marketplace.visualstudio.com/items?itemName=ParthR2031.colorful-comments
^ Color Legend:
    & pink: file description
    * green: section title
    ~ purple: general funtion description
*/

"use strict";
//* === imports ===
import { MessageBox } from "../objects/MessageBox.js";
import { saveCardUse } from "../libs/level_functions.js";

//* === class cards On Canvas ===
//~ general info about events
class cardsOnCanvas {
    constructor() {
        this.type = "";

        //offered cards state, mid game
        this.isActive = false;
        this.offeredCards = [];
        this.selectedIndex = null;

        //deck state, when c is pressed
        this.playerDeck = [];
        this.isDeckOpen = false;
        this.selectedDeckIndex = -1;

        //references set on show function
        this._player = null;
        this._enemies = null;
        this._game = null;

        this.activeEffects = [];
        this.permanentEffects = [];  //save permanent cards to reset them at the end of the level

        this.cardBackImage = new Image();
        this.cardBackImage.src = "../Videojuego/assets/cards/BaseCard.png";

        //MessageBox as background container for each event
        this.cardBox = new MessageBox("SELECT A CARD", "The crowd wants to help you, but your fate will choose!", 80, 30, 840, 540);
        this.deckBox = new MessageBox("YOUR DECK", "Choose wisely", 80, 30, 840, 540);
        this.rewardBox = new MessageBox("Your reward, gladiator.", "By order of the Emperor, these powers are yours. Use them wisely, gladiator.", 80, 30, 840, 540);

        //cards added as reward at the end of a level, shown in drawReward
        this.rewardCards = [];
    }

    //* === mid game cards ===
    show(allCards, player, enemies, game = null) {  //~ call this to open the card pick screen with the 3 options
        this.offeredCards = allCards;
        this.selectedIndex = null;
        this.isActive = true;
        this._player = player;
        this._enemies = enemies;
        this._game = game;
        this.cardBox.show();
    }

    close() {  //~ hides everything and resets the offered cards state
        this.isActive = false;
        this.offeredCards = [];
        this.selectedIndex = null;
        this.cardBox.buttons = [];
        this.cardBox.hide();
    }

    draw(ctx, canvas) {  //~ draws the background box and the 3 cards centered on screen
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
            this.drawCard(ctx, card, x, cardY, cardW, cardH, isSelected, "midgame");
        });
    }

    handleClick(mx, my, canvas) {  //~ checks if the player clicked a card, marks it as selected and shows the confirm button
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

        return this.cardBox.handleClick(mx, my);  //lets the messagebox check if the confirm button was clicked
    }

    confirm() {  //~ applies the card effect and saves it to the db
        const card = this.offeredCards[this.selectedIndex];  //which card?
        this.close();  //ahh okay, close the screen
        card.applyEffect(this._player, this._enemies, this._game);  //apply the cards effect 
        
        if (this._player.cardCostHP) {  //hunger of the plebs effect
            this._player.takeDamage(this._player.maxHp / 2);
        }

        saveCardUse(1, card.id, card.duration || 0); 

        //track the time so we can undo the effect later
        if (card.duration && card.removeEffect) {  //timed card: count down and remove when it expires
            this.activeEffects.push({
                card,
                player: this._player,
                enemies: this._enemies,
                game: this._game,
                endTime: card.duration
            });
        } else if (!card.duration && card.removeEffect) {  //permanent card: track it so we can undo it when the level ends
            this.permanentEffects.push({
                card,
                player: this._player,
                enemies: this._enemies,
                game: this._game,
            });
        }

        return card;
    }

    update(deltaTime) {  //~ counts down active card timers and removes effects when they run out
        this.activeEffects = this.activeEffects.filter(effect => {
            effect.endTime -= deltaTime;
            if (effect.endTime <= 0) {
                effect.card.removeEffect(effect.player, effect.enemies, effect.game);
                return false;
            }
            return true;
        });
    }

    clearPermanentEffects() {  //~ undo all permanent cards effects when level ends or game resets
        this.permanentEffects.forEach(e => e.card.removeEffect(e.player, e.enemies, e.game));
        this.permanentEffects = [];
    }

    //* === deck cards (when c is pressed) ===
    toggleDeck() {  //~ call this to open the card pick screen
        this.isDeckOpen = !this.isDeckOpen;
        this.selectedDeckIndex = -1;
        this.deckBox.buttons = [];
        if (this.isDeckOpen)  //show from messageBox.js
            this.deckBox.show();  
        else 
            this.deckBox.hide();
    }

    drawDeck(ctx, canvas) {  //~ draw plpayers deck in a box
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
            this.drawCard(ctx, this.playerDeck[i], x, y, cardW, cardH, this.selectedDeckIndex === i, "deck");  
        }

    }

    //* === reward event (end of level event) ===
    drawReward(ctx, canvas) { //~ draws the reward cards centered on screen using the same style as the mid-game event
        if (this.rewardCards.length === 0) return;
        //dimentions
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
            this.drawCard(ctx, card, x, cardY, cardW, cardH, false, "reward");
        });
    }

    //* === helpers ===
    handleDeckClick(mx, my, canvas) {  //~ checks if the player clicked a card, marks it as selected and shows the confirm button
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
                    if (card.duration && card.removeEffect) {  //added to show the banner (level_functions.js)
                        this.activeEffects.push({
                            card,
                            player: this._player,
                            enemies: this._enemies,
                            game: this._game,
                            endTime: card.duration
                        });
                    }
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

    drawCard(ctx, card, x, y, w, h, isSelected, type) {   //~ handle full logic on how to draw all cards
        if (type === "reward" || type === "deck")  //if is a reward or deck event, cards are upward
            ctx.drawImage(card.image, x, y, w, h);
        else  //mid game event, cards are downward
            ctx.drawImage(this.cardBackImage, x, y, w, h);

        if (this._game?.revealNextCard) {  //reveal card effect: show the cards type in the next event
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

//* === exports ===
export { cardsOnCanvas };

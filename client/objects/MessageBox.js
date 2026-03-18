class MessageBox {
    constructor(title, message, x, y, width,height){
        this.title = title;
        this.message = message;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.visible = false;
        this.buttons = [];
    }
    show(){ //optional
        this.visible = true;
    }
    hide(){ //optional
        this.visible = false;
    }
    addButton (text, x, y, width, height, action){
        this.buttons.push({
            text, x, y, width, height, action
        });
    }
    draw(ctx){
        if(this.visible){
        ctx.fillStyle = 'black';
        ctx.strokeStyle = 'rgb(255,187,86)';
        ctx.lineWidth = 4;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeRect(this.x, this.y, this.width, this.height);

        //títle
        ctx.fillStyle = 'white';
        ctx.font = '35px VT323';
        ctx.textAlign = 'center';
        ctx.fillText(this.title, this.x + this.width / 2, this.y + 50);

        //message
        ctx.font = '35px VT323';
        ctx.fillText(this.message, this.x + this.width / 2, this.y + 110);

        this.buttons.forEach (button =>{
            ctx.strokeStyle = 'rgb(255,187,86)';
            ctx.strokeRect(button.x, button.y, button.width, button.height);
            ctx.fillStyle = 'white';
            ctx.font = '24px VT323';
            ctx.fillText(button.text, button.x + button.width / 2, button.y + button.height / 2 + 8);
        });
    }
    }

    handleClick(mouseX, mouseY){
        for(let button of this.buttons){
            const inside =
                mouseX > button.x &&
                mouseX < button.x + button.width &&
                mouseY > button.Y &&
                mouseY < button.y + button.height;
            if(inside){
                if(button.action) button.action();
                return button.text;
            }
        }
        return null;
    }
}
export { MessageBox };
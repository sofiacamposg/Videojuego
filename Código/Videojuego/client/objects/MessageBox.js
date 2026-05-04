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
        ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
        ctx.strokeStyle = 'rgb(255,187,86)';
        ctx.lineWidth = 4;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeRect(this.x, this.y, this.width, this.height);

        //títle
        ctx.fillStyle = 'orange';
        ctx.font = '40px VT323';
        ctx.textAlign = 'center';
        ctx.fillText(this.title, this.x + this.width / 2, this.y + 50);

        //message — split by \n for multi-line support
        ctx.fillStyle = 'white';
        ctx.font = '25px VT323';
        const lines = this.message.split('\n');  //& la pueden quitar, solo era para ver como se veia el game over
        lines.forEach((line, i) => {
            ctx.fillText(line, this.x + this.width / 2, this.y + 110 + i * 30);
        });

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
                mouseY > button.y &&
                mouseY < button.y + button.height;
            if(inside){
                if(button.action) {
                    return button.action();
                }
                return button.text;
            }
        }
        return null;
    }
}
export { MessageBox };
/* 
& messages screen functions, to let know something to the player, includes:
& style draw, show/hide/handle click logic

^ Note: We recommend installing the Colorful Comments extension to improve code readability 
^ https://marketplace.visualstudio.com/items?itemName=ParthR2031.colorful-comments
^ Color Legend:
    & pink: file description
    * green: section title
    ~ purple: general funtion description
*/

//* === class message box ===
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

    //* === functions ===
    show(){ //~ when to show the message, easier to call in level base
        this.visible = true;
    }

    hide(){ //~ when to hide the message box, easier to call in level base
        this.visible = false;
    }

    addButton (text, x, y, width, height, action){  //~ add the button to the array, boxes can include a button
        this.buttons.push({ text, x, y, width, height, action });
    } 

    draw(ctx){  //~ draw all the backgroun, text and button
        if(this.visible){ //case1: box is being draw in canvas
            //backgroud 
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

            //message
            ctx.fillStyle = 'white';
            ctx.font = '25px VT323';
            const lines = this.message.split('\n');  // split by \n for multi-line 
            lines.forEach((line, i) => {
                ctx.fillText(line, this.x + this.width / 2, this.y + 110 + i * 30);
            });

            //button
            this.buttons.forEach (button =>{
                ctx.strokeStyle = 'rgb(255,187,86)';
                ctx.strokeRect(button.x, button.y, button.width, button.height);
                ctx.fillStyle = 'white';
                ctx.font = '24px VT323';
                ctx.fillText(button.text, button.x + button.width / 2, button.y + button.height / 2 + 8);
            });
        }
    }

    handleClick(mouseX, mouseY){  //~ function to know what to do if user clicks a button
        for(let button of this.buttons){ 
            //dimentions
            const inside =  
                mouseX > button.x &&
                mouseX < button.x + button.width &&
                mouseY > button.y &&
                mouseY < button.y + button.height;
            if(inside){
                if(button.action) {
                    return button.action();  //each button has their own action, and its defined on creation
                }
                return button.text;
            }
        }
        return null;
    }
}

//* === export ===
export { MessageBox };
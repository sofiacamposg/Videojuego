//& MessageBox.js
//& Reusable UI overlay component used throughout the game for pause menus,
//& game over screens, level complete messages, warnings, and card selection prompts
//& Supports multi-line messages and multiple clickable buttons

//* renders a styled dialog box on the canvas with a title, message and optional buttons
class MessageBox {
    constructor(title, message, x, y, width, height){
        this.title = title;    // text shown at the top of the box
        this.message = message; // body text — supports \n for multiple lines
        this.x = x;            // top-left X position of the box
        this.y = y;            // top-left Y position of the box
        this.width = width;    // box width
        this.height = height;  // box height

        this.visible = false;  // hidden by default — call show() to display
        this.buttons = [];     // array of button objects added via addButton()
    }

    //* makes the message box visible
    show(){
        this.visible = true;
    }

    //* hides the message box
    hide(){
        this.visible = false;
    }

    //* adds a clickable button to the message box with a callback action
    addButton(text, x, y, width, height, action){
        this.buttons.push({
            text, x, y, width, height, action
        });
    }

    //* draws the message box, title, message lines and all buttons on the canvas
    //* only draws if visible is true
    draw(ctx){
        if(this.visible){
            //? dark background panel with golden border
            ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
            ctx.strokeStyle = 'rgb(255,187,86)';
            ctx.lineWidth = 4;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.strokeRect(this.x, this.y, this.width, this.height);

            //? title text centered at the top of the box
            ctx.fillStyle = 'orange';
            ctx.font = '40px VT323';
            ctx.textAlign = 'center';
            ctx.fillText(this.title, this.x + this.width / 2, this.y + 50);

            //? message body — split by \n to support multi-line text
            ctx.fillStyle = 'white';
            ctx.font = '25px VT323';
            const lines = this.message.split('\n');
            lines.forEach((line, i) => {
                ctx.fillText(line, this.x + this.width / 2, this.y + 110 + i * 30);
            });

            //? draw each button with a golden border and centered white text
            this.buttons.forEach(button => {
                ctx.strokeStyle = 'rgb(255,187,86)';
                ctx.strokeRect(button.x, button.y, button.width, button.height);
                ctx.fillStyle = 'white';
                ctx.font = '24px VT323';
                ctx.fillText(button.text, button.x + button.width / 2, button.y + button.height / 2 + 8);
            });
        }
    }

    //* checks if a mouse click landed inside any button and fires its action
    //* returns the button action result or the button text if no action is defined
    handleClick(mouseX, mouseY){
        for(let button of this.buttons){
            //? check if click coordinates are within this button's bounds
            const inside =
                mouseX > button.x &&
                mouseX < button.x + button.width &&
                mouseY > button.y &&
                mouseY < button.y + button.height;
            if(inside){
                if(button.action) {
                    return button.action();  // fire the button's callback
                }
                return button.text;  // return text if no action defined
            }
        }
        return null;  // click was outside all buttons
    }
}
export { MessageBox };
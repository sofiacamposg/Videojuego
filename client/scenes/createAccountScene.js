"use strict"

// Mouse
let mouseX = 0;
let mouseY = 0;

let username = "";
let password = "";
let name = "";
let age = "";

let currentField = "username";

const buttonBack = {
    x: 800,
    y: 100,
    text: "BACK"
};

const buttonConfirm = {
    x: 800,
    y: 200,
    text: "CREATE"
};

export function draw(ctx, canvas){

    ctx.clearRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.fillText("CREATE ACCOUNT",330,100);

    ctx.font = "25px Arial";

    ctx.fillText("Username:",250,220);
    ctx.fillText(username,450,220);

    ctx.fillText("Password:",250,260);
    ctx.fillText(password,450,260);

    ctx.fillText("Name:",250,300);
    ctx.fillText(name,450,300);

    ctx.fillText("Age:",250,340);
    ctx.fillText(age,450,340);

    drawButton(ctx, buttonBack);
    drawButton(ctx, buttonConfirm);

}

function drawButton(ctx, button){

    ctx.fillStyle = "gray";
    ctx.fillRect(button.x-120,button.y-30,240,60);

    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(button.text,button.x-80,button.y+5);

}

export function handleMouseMove(event,canvas){

    const rect = canvas.getBoundingClientRect();

    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;

}

export function handleClick(){

    if(isMouseOver(buttonBack)) return "back";

    if(isMouseOver(buttonConfirm)) return "confirm";

}

function isMouseOver(button){

    return mouseX > button.x-120 &&
           mouseX < button.x+120 &&
           mouseY > button.y-30 &&
           mouseY < button.y+30;

}

export function handleKeyDown(event){

    if(event.key === "Tab"){
        event.preventDefault();

        if(currentField === "username") currentField = "password";
        else if(currentField === "password") currentField = "name";
        else if(currentField === "name") currentField = "age";
        else currentField = "username";

        return;
    }

    if(event.key === "Backspace"){

        if(currentField === "username") username = username.slice(0,-1);
        else if(currentField === "password") password = password.slice(0,-1);
        else if(currentField === "name") name = name.slice(0,-1);
        else if(currentField === "age") age = age.slice(0,-1);

        return;
    }

    if(event.key.length === 1){

        if(currentField === "username") username += event.key;
        else if(currentField === "password") password += event.key;
        else if(currentField === "name") name += event.key;
        else if(currentField === "age") age += event.key;

    }

}

export function getAccountData(){

    return{
        username: username,
        password: password,
        name: name,
        age: age
    };

}

export function reset(){

    username = "";
    password = "";
    name = "";
    age = "";
    currentField = "username";

}
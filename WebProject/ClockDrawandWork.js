const canvas = document.getElementById("Clock");
const ctx = canvas.getContext("2d");
const xTextElement = document.getElementById("x");
const yTextElement = document.getElementById("y");
const sTextElement = document.getElementById("s");
const aTextElement = document.getElementById("a");

const event = new Event('segmentChanged');

const handsColors = ["#a941f4", "#41e5f4", "#dcf441"]
const secondHandColor = handsColors[0];
const minuteHandColor = handsColors[1];
const hourHandColor = handsColors[2];

let clickedColor = "";
let radius = canvas.height / 2.0;
let angle = 0;
let a = 0;
let z = 400;
let previousMouseSegment = 1;
let mouseSegment = 1;
let isHandClicked = false;
let clockTime = new Date();
let mousePosition = {
    x: 0,
    y: 0,
    z: 0,
    c: 0,
}

canvas.addEventListener("click", canvasClicked_Event);
canvas.addEventListener("segmentChanged", onSegmentChanged_Event);
document.addEventListener("mousemove", onMouseMove_Event);

ctx.translate(radius, radius);
radius = radius * 0.90

const drawer = new Drawer(ctx, radius);

setInterval(update, 25);

setInterval(() => {
    if (isHandClicked) {
        return;
    }
    clockTime.setSeconds(clockTime.getSeconds() + 1);
}, 1000);

function update() {
    drawer.drawClock();
    drawer.drawTime(getSecondsAngle(), getMinutesAngle(), getHoursAngle(), secondHandColor, minuteHandColor, hourHandColor);
}

function getSecondsAngle() {
    return clickedColor == secondHandColor ? (angle / 6) * (Math.PI / 30) : (clockTime.getSeconds() * Math.PI / 30);
}

function getMinutesAngle() {
    return clickedColor == minuteHandColor ? (angle / 6) * (Math.PI / 30) : ((clockTime.getMinutes() + clockTime.getSeconds() / 60) * Math.PI / 30);
}

function getHoursAngle() {
    return clickedColor == hourHandColor ? (angle / 6) * (Math.PI / 30) : ((clockTime.getHours() + clockTime.getMinutes() / 60) * Math.PI / 6);
}

function onSegmentChanged_Event(event) {
    sTextElement.innerText = mouseSegment;

    if (mouseSegment === 1 && previousMouseSegment === 4 && isHandClicked == true && clickedColor == "#a941f4") {
        clockTime.setMinutes(clockTime.getMinutes() + 1);
    }

    if (mouseSegment === 4 && previousMouseSegment === 1 && isHandClicked == true && clickedColor == "#a941f4") {
        clockTime.setMinutes(clockTime.getMinutes() - 1);
    }

    if (mouseSegment === 1 && previousMouseSegment === 4 && isHandClicked == true && clickedColor == "#41e5f4") {
        clockTime.setHours(clockTime.getHours() + 1);
    }

    if (mouseSegment === 4 && previousMouseSegment === 1 && isHandClicked == true && clickedColor == "#41e5f4") {
        clockTime.setHours(clockTime.getHours() - 1);
    }
}

function onMouseMove_Event(event) {
    mousePosition = getCursorPositionOnCanvas(canvas, event);
    xTextElement.innerText = mousePosition.x.toFixed(2);
    yTextElement.innerText = mousePosition.y.toFixed(2);
    calculateMouseSegment(mousePosition.x, mousePosition.y);

    angle = angleCalcStartAndEnd(mousePosition.x, mousePosition.y, a, z);
    aTextElement.innerText = angle;

    if (clickedColor == secondHandColor) {
        clockTime.setSeconds(angle / 6);
    }
    if (clickedColor == minuteHandColor) {
        clockTime.setMinutes(angle / 6);
    }
    if (clickedColor == hourHandColor) {
        clockTime.setHours(angle / 30);
    }
}

function calculateMouseSegment(x, y) {
    previousMouseSegment = mouseSegment;
    if (x > 400 && y < 400) {
        mouseSegment = 1;
    }

    if (x <= 400 && y < 400) {
        mouseSegment = 4;
    }

    if (x > 400 && y >= 400) {
        mouseSegment = 2;
    }

    if (x < 400 && y >= 400) {
        mouseSegment = 3;
    }

    if (previousMouseSegment != mouseSegment) {
        canvas.dispatchEvent(event);
    }
}

function canvasClicked_Event(event) {
    let cursorPosition = getCursorPositionOnCanvas(canvas, event);
    let newclickedColor = getHexColorFromPosition(cursorPosition.x, cursorPosition.y);

    if ((handsColors.indexOf(clickedColor) > -1 && handsColors.indexOf(newclickedColor) > -1) || handsColors.indexOf(newclickedColor) === -1) {
        clickedColor = "";
        onClockClicked();
    } else {
        clickedColor = newclickedColor;
        onHandClicked();
    }
}

function onHandClicked() {
    isHandClicked = true;
}

function onClockClicked() {
    isHandClicked = false;
}

function getCursorPositionOnCanvas(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    return { x: x, y: y };
}

function getHexColorFromPosition(x, y) {
    let imageData = ctx.getImageData(x, y, 1, 1).data;
    return "#" + ("000000" + rgbToHex(imageData[0], imageData[1], imageData[2])).slice(-6);
}

function rgbToHex(r, g, b) {
    return ((r << 16) | (g << 8) | b).toString(16);
}

function calculateFinalRadius(x) {
    return x + (mouseSegment - 1) * 90;
}

function angleCalcStartAndEnd(x, y, a, z) {
    let a1 = (400 - y) / (400 - x);
    let a2 = (400 - z) / (400 - a)
    let ang = (Math.atan(Math.abs((a1 - a2) / (1 + a1 * a2))) * (180 / Math.PI))

    if (mouseSegment == 1 || mouseSegment == 3) {
        ang = 90 - ang;
    }

    return calculateFinalRadius(ang);
}
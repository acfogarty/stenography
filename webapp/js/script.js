// global variables

var canvas, ctx;

var canvasWidth = 600;
var canvasHeight = 200;

// position of lines dividing the three zones
var ssl_greggs_x = 200;
var greggs_ssn_x = 400;

function init() {
    // create the canvas element if possible 
    //(same canvas for singlestroke letters, singlestroke numbers and greggs)
    canvasDiv = document.getElementById('writingCanvasDiv');
    canvas = document.createElement('canvas');
    canvas.setAttribute('width', canvasWidth);
    canvas.setAttribute('height', canvasHeight);
    canvas.setAttribute('id', 'writingCanvas');
    canvasDiv.appendChild(canvas);

    // (canvas not supported by IE 8 and earlier, so first check if getContext is defined)
    if (canvas.getContext) {
        ctx = canvas.getContext('2d');
    }

    // add event listeners
    if (ctx) {
        // mouse
        canvas.addEventListener('mousedown', mouseDown, false);
        canvas.addEventListener('mousemove', mouseMove, false);
        window.addEventListener('mouseup', mouseUp, false);

        // touchstreen
        canvas.addEventListener('touchstart', touchStart, false);
        canvas.addEventListener('touchend', touchEnd, false);
        canvas.addEventListener('touchmove', touchMove, false);
    }

    resetCanvas();
}

function mouseDown() {
}
function mouseMove() {
}
function mouseUp() {
}
function touchStart() {
}
function touchEnd() {
}
function touchMove() {
}

// fill the canvas with black and draw two vertical white lines to demarcate the three zones (ss letters, ss numbers and stenography)
function resetCanvas() {

    // fill entire canvas
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // draw white vertical lines at x=ssl_greggs_x and x=greggs_ssn_x
    color = "white";
    lineWidth = 10;
    drawLine(ssl_greggs_x, 10, ssl_greggs_x, canvas.height-10, color, lineWidth);
    drawLine(greggs_ssn_x, 10, greggs_ssn_x, canvas.height-10, color, lineWidth);

}

// line from x1,y1 to x2,y2 in specified color and width
function drawLine(x1, y1, x2, y2, color, lineWidth) {
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function getEventCoordinates(event) {

}

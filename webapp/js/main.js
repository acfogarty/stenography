// global variables

var canvas, ctx;
var resizingCanvas, resizingCtx;  // invisible canvas for resizing images

var canvasWidth = 600;
var canvasHeight = 200;

var lineColor = "white";
var lineWidth = 5;

// position of lines dividing the three zones
var ssl_greggs_x = 200;
var greggs_ssn_x = 400;

// current positions
var touchX, touchY, mouseX, mouseY;

// previous positions
var prevX, prevY = -1;

// true if mouse is being held down
var paint;

function init() {
    // create the canvas element if possible 
    //(same canvas for singlestroke letters, singlestroke numbers and greggs)
    canvasDiv = document.getElementById('writingCanvasDiv');
    canvas = document.createElement('canvas');
    canvas.setAttribute('width', canvasWidth);
    canvas.setAttribute('height', canvasHeight);
    canvas.setAttribute('id', 'writingCanvas');
    canvasDiv.appendChild(canvas);

    // invisible canvas for resizing images
    resizingCanvas = document.createElement('canvas');

    // (canvas not supported by IE 8 and earlier, so first check if getContext is defined)
    if (canvas.getContext) {
        ctx = canvas.getContext('2d');
        resizingCtx = resizingCanvas.getContext('2d');
    }

    // add event listeners
    if (ctx) {
        // mouse
        canvas.addEventListener('mousedown', mouseDown, false);
        canvas.addEventListener('mousemove', mouseMove, false);
        window.addEventListener('mouseup', mouseUp, false);

        // touchscreen
        canvas.addEventListener('touchstart', touchStart, false);
        canvas.addEventListener('touchend', touchEnd, false);
        canvas.addEventListener('touchmove', touchMove, false);
    }

    resetCanvas();
}

function mouseDown() {
    paint = 1;
    prevX = mouseX;
    prevY = mouseY;
}

// called whenever mouse is moved (whether button is held down or not)
// paint == True if button is held down
function mouseMove(e) {
    setCurrentMouseCoordinates(e);
    if (paint) {
        drawLine(prevX, prevY, mouseX, mouseY, lineColor, lineWidth) 
    }
    prevX = mouseX;
    prevY = mouseY;
}

function mouseUp() {
    paint = 0;
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
    ctx.lineCap = "round";
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function setCurrentMouseCoordinates(e) {
    // offsetX/Y gets coords relative to parent container (here, the canvas)
    // supported by firefox >= v39
    mouseX = e.offsetX;
    mouseY = e.offsetY;
}

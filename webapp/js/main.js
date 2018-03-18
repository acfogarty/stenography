// global variables

var canvas, ctx;  // canvas for user input
var resizingCanvas, resizingCtx;  // invisible canvas for resizing images

var canvasWidth = 600;
var canvasHeight = 200;

// x-coordinates of lines dividing the three zones of the canvas
// (singlestroke letters, Gregg's, singlestroke numbers)
var sslGreggsDividerX = 200;
var greggsSsnDividerX = 400;

// parameters of lines drawn by user
var lineColor = "white";
var lineWidth = 5;

// current positions on canvas of input event
var touchX, touchY, mouseX, mouseY;

// previous positions on canvas of input event
var prevX, prevY = -1;

// true if mouse is being held down
var paint = 0;

// true if zone has been written on since last call to resetCanvas()
var zoneWritten = 0;  

// time of last mouseUp/touchEnd
var timeOfLastWrite = 0;

// wait this number of ms since last write until predicting word
var timeDelay = 2000;  

// 0: singlestroke letters, 1: Greggs stenography, 2: singlestroke numbers
var predictionModel = 0;  

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

    loadParameters();

    animate();
}

function mouseDown() {
    // TODO only if mouseX and mouseY are in canvas
    paint = 1;  // will remain 1 until mouseUp
    prevX = mouseX;
    prevY = mouseY;
    // find which prediction model to use based on the zone
    predictionModel = getPredictionModelFromCoordinates(mouseX);
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
    paint = 0;  // will remain 0 until next mouseDown
    // TODO only if mouseX and mouseY are in canvas
    zoneWritten = 1;  // will remain 1 until next word prediction
    timeOfLastWrite = new Date().getTime();
}

function touchStart(e) {
    e.preventDefault();
    setCurrentTouchCoordinates(e);
    // TODO draw a dot at current coordinates
    mouseDown();
}

function touchEnd(e) {
    e.preventDefault();
    mouseUp();
}

function touchMove(e) {
    e.preventDefault();
    setCurrentTouchCoordinates(e);
    drawLine(prevX, prevY, mouseX, mouseY, lineColor, lineWidth);
    prevX = mouseX;
    prevY = mouseY;
}

// fill the canvas with black and draw two vertical green lines to demarcate the three zones (ss letters, ss numbers and stenography)
function resetCanvas() {

    // fill entire canvas
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // draw vertical lines at x=sslGreggsDividerX and x=greggsSsnDividerX
    color = "green";
    lineWidth = 10;
    drawLine(sslGreggsDividerX, 10, sslGreggsDividerX, canvas.height-10, color, lineWidth);
    drawLine(greggsSsnDividerX, 10, greggsSsnDividerX, canvas.height-10, color, lineWidth);

    // reset the variable that tells us whether the user has written on the canvas
    zoneWritten = 0;
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

function setCurrentTouchCoordinates(e) {
    var rect = canvas.getBoundingClientRect();
    mouseX = e.touches[0].clientX - rect.left;
    mouseY = e.touches[0].clientY - rect.top;
}

// choose one of three prediction models, based on
// which of the three zones the coordinate X is in
function getPredictionModelFromCoordinates(X) {

    if (X < sslGreggsDividerX) {
        predictionModel = 0;
    } else if (X < greggsSsnDividerX) {
        predictionModel = 1;
    } else {
        predictionModel = 2;
    }

}

function animate() {

    var now = new Date().getTime();
    var timeSinceLastWrite = now - timeOfLastWrite;

    // if timeDelay ms have passed since last mouseUp/touchEnd event
    // and canvas has been written on since last call to resetCanvas
    if ((timeSinceLastWrite > timeDelay) && (zoneWritten)) {
        convertWord();
        resetCanvas();
    }

    requestAnimationFrame(arguments.callee, null);

}

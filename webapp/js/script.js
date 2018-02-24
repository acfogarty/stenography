// global variables

ssl_greggs_x = 200;
greggs_ssn_x = 400;

function init() {
    // get the canvas element (same canvas for singlestroke letters, singlestroke numbers and greggs)
    canvas = document.getElementById('writingCanvas');

    // (canvas not supported by IE 8 and earlier, so first check if getContext is defined)
    if (canvas.getContext) {
        ctx = canvas.getContext('2d');
    }

    // add event listeners
    //if (ctx) {
    //    canvas.addEventListener('mousedown', mouseDown, false);
    //    canvas.addEventListener('mousemove', mouseMove, false);
    //    window.addEventListener('mouseup', mouseUp, false);
    //}

    resetCanvas(ctx, canvas);
}

// fill the canvas with black and draw two vertical white lines to demarcate the three zones (ss letters, ss numbers and stenography)
function resetCanvas(ctx, canvas) {

    // fill entire canvas
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // draw white vertical lines at x=ssl_greggs_x and x=greggs_ssn_x
    color = "white";
    lineWidth = 10;
    drawLine(ctx, ssl_greggs_x, 10, ssl_greggs_x, canvas.height-10, color, lineWidth);
    drawLine(ctx, greggs_ssn_x, 10, greggs_ssn_x, canvas.height-10, color, lineWidth);

}

// line from x1,y1 to x2,y2 in specified color and width
function drawLine(ctx, x1, y1, x2, y2, color, lineWidth) {
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

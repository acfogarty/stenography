// get the white pixels from the black canvas
// crop image
// resize
// convert to black on white (values between 0 and 1)
// return array of floats between 0 and 1 of length modelImageSize*modelImageSize
function extractData() {

    // first extract image data from the visible canvas
    var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // get definition of crop box (smallest box bounding all white pixels)
    var cropBox = cropWhitespace(imgData);
    console.log(cropBox);

    // resize data in crop box to be modelImageSize*modelImageSize
    var croppedRescaledImgData = resizeImage(cropBox.cropX, cropBox.cropY, cropBox.cropWidth, cropBox.cropHeight, modelImageSize, modelImageSize);

    // image is black and white, all channels the same
    // therefore we simply take the pixels of the first channel (R)
    var data = new Array();
    for (var i = 0; i < croppedRescaledImgData.data.length; i += 4) {
        data.push(croppedRescaledImgData.data[i]);
    }
    console.log(data);

    // convert to black on white, values scaled between 0 and 1
    // data = convert();

    return data;
}

// along the dimension 0, find the indices of the first and last white pixels
// input:
//     rows: array of arrays containing integers between 0 and 255
function findCropIndices(rows) {

    var firstWhiteIndex = [];
    var lastWhiteIndex = [];

    // find first and last white pixels in each row
    for (var ir = 0; ir < rows.length; ir += 1) {
        var ifirst = rows[ir].findIndex(r => r == 255);
        if (ifirst > 0) { firstWhiteIndex.push(ifirst); }
        var ilast = rows[ir].reverse().findIndex(r => r == 255);
        if (ilast > 0) { lastWhiteIndex.push(rows[ir].length - ilast); }
    }

    // find min and max over all rows
    // TODO deal with case where no white indices found
    var minI = Math.min.apply(Math, firstWhiteIndex);
    var maxI = Math.max.apply(Math, lastWhiteIndex);

    return {'minWhitePixel': minI, 'maxWhitePixel': maxI};
}

// crop whitespace around symbol, up until the first non-white pixel found in each direction
// imgData: ImageData object
// symbol is drawn in white on black, all channels the same
// and lines dividing the three zones are green
// therefore we simply work with the pixels of the red channel 
function cropWhitespace(imgData) {

    var data = imgData.data;
    var nPointsPerRow = imgData.width * 4 // 4 channels
    var nPointsPerCol = imgData.height * 4 // 4 channels

    // get array of rows and cols in R channel
    var rows = [];
    var cols = [];
    for (var j = 0; j < nPointsPerRow; j += 4) {  // red channel only
        var col = [];
        cols.push(col);
    }
    for (var i = 0; i < data.length; i += nPointsPerRow) {  //  
        var row = [];
        for (var j = i; j < (i + nPointsPerRow); j += 4) {  // red channel only
            row.push(data[j]);
            var ic = (j - i) / 4;
            cols[ic].push(data[j]);
        }
        rows.push(row);
    } 

    // get first and last white pixels in each direction
    var rowsIndices = findCropIndices(rows);
    var colsIndices = findCropIndices(cols);
    console.log(rowsIndices);
    console.log(colsIndices);

    // get bounding box in each direction
    var cropX = rowsIndices.minWhitePixel;
    var cropY = colsIndices.minWhitePixel;
    var cropWidth = rowsIndices.maxWhitePixel - rowsIndices.minWhitePixel;
    var cropHeight = colsIndices.maxWhitePixel - colsIndices.minWhitePixel;

    return {'cropX': cropX, 'cropY': cropY, 'cropWidth': cropWidth, 'cropHeight': cropHeight};
}

// Take the sub-rectangle defined by sourceX, sourceY, sourceWidth, sourceHeight
// of the image currently drawn on the global canvas,
// and output that image array rescaled to newWidth and newHeight.
// Function rescales image by writing to an invisible canvas with context resizingCtx
// and returns the cropped, rescaled imgData extracted from that invisible canvas.
function resizeImage(sourceX, sourceY, sourceWidth, sourceHeight, newWidth, newHeight) {
    ctx.drawImage(canvas, sourceX, sourceY, 
    //resizingCtx.drawImage(sourceX, sourceY, 
                          sourceWidth, sourceHeight, 
                          0, 0, newWidth, newHeight);
    var imgData = resizingCtx.getImageData(0, 0, newWidth, newHeight);
    console.log(imgData);
    return imgData;
}

// get the white pixels from the black canvas
// crop image
// resize
// convert to black on white (values between 0 and 1)
// return array of floats between 0 and 1 of length modelImageSize*modelImageSize
function extractData() {

    // first extract image data from the visible canvas
    var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // get definition of crop box (smallest box bounding all white pixels)
    var cropBox = crop_whitespace(imgData);

    // resize data in crop box to be modelImageSize*modelImageSize
    var croppedRescaledImgData = resize_image(cropBox.cropX, cropBox.cropY, cropBox.cropWidth, cropBox.cropHeight, modelImageSize, modelImageSize);

    // black and white, therefore we simply take the pixels of the first channel (R)
    var data = new Array();
    for (var i = 0; i < croppedRescaledImgData.data.length; i += 4) {
        data.push(croppedRescaledImgData.data[i]);
    }
    console.log(data);

    // convert to black on white, values scaled between 0 and 1
    // data = convert();

    return data;
}

// along the dimension axis, find the index of the first non-white pixel
// input:
//     image: np.array with dimension m*n containing floats between 0 and 1 (grey  scale image)
//     axis: np array axis (0=rows, 1=columns)
function find_crop_index(image, axis) {
    //white_cut = 1.0  # value below which we consider pixels to be non-white

    //// get the first index in each col/row along that axis where there is a non-white pixel
    //first_non_white = np.apply_along_axis(np.argmax, axis, image < white_cut)

    //// get the smallest non-zero value
    //// (np.argmax returns 0 when no index is found)
    //index = np.min(np.extract(first_non_white > 0, first_non_white))

    return index
}

// crop whitespace around image, up until the first non-white pixel found in each direction
// image: np.array with dimension m*n containing floats between 0 and 1 (greyscale image)
function crop_whitespace(image) {

    // for axis in [0, 1]:
    //     // get bounding box for this axis
    //     min_index = find_crop_index(image, axis)
    //     max_index = image.shape[axis] - find_crop_index(flip(image, axis), axis)
    //     // crop this axis
    //     image = np.take(image, range(min_index, max_index), axis=axis)

    return {'cropX': 100, 'cropY': 100, 'cropWidth': 50, 'cropHeight': 50};
}

// Take the sub-rectangle defined by sourceX, sourceY, sourceWidth, sourceHeight
// of the image currently drawn on the global canvas,
// and output that image array rescaled to newWidth and newHeight.
// Function rescales image by writing to an invisible canvas with context resizingCtx
// and returns the cropped, rescaled imgData extracted from that invisible canvas.
function resize_image(sourceX, sourceY, sourceWidth, sourceHeight, newWidth, newHeight) {
    ctx.drawImage(canvas, sourceX, sourceY, 
    //resizingCtx.drawImage(sourceX, sourceY, 
                          sourceWidth, sourceHeight, 
                          0, 0, newWidth, newHeight);
    var imgData = resizingCtx.getImageData(0, 0, newWidth, newHeight);
    console.log(imgData);
    return imgData;
}

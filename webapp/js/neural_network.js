// neural network model parameters and fowardprop functions

var modelFilename = 'model.json';
var modelData;
// modelData contains:
// classes  // mapping for int class labels to words (dict)
// weights  // neural network weights (array of arrays of arrays)
// intercepts  // neural network biases (array of arrays)
// imageSize  // all cropped images will be rescaled to this width and height (int)

function loadParameters() {
    loadModelData();
}

function convertWord() {
    // extract pixels from input zone
    var X = extractData();
    // forwardprop neural network for one sample
    // use predictModel variable TODO
    var Y = predict(X);
    // get max classes
    var iclass = Y.indexOf(Math.max(...Y));
    // convert from integer to word
    var word = modelData.classes[String(iclass)];
    // append word to text in editor
    appendWordToEditor(word);
}

// forward prop for one sample
// a: activations from prev layer, array with dimension n_nodes_prev_layer
// W: weights, array of arrays with dimension n_nodes * n_nodes_prev_layer
// b: bias, array with length n_nodes
// activation: 'relu' or 'softmax'
// returns relu(W*a + b)
function forwardPropogateLayer(a, W, b, activation) {

    z = matrixMultiply(a, W)
    z = addVectors(z[0], b);
    if (activation == 'relu') {
        return relu(z);
    } else if (activation == 'softmax') {
        return softmax(z);
    } else {
        alert('unknown value ' + activation + 'in forwardPropogateLayer');
    }

}

// ReLU activation function for one sample (x is 1D array)
function relu(z) {

    for (var i = 0; i < z.length; i += 1) {
        z[i] = Math.max(0, z[i]);
    }

    return z;

}

// softmax activation function for one sample (x is 1D array)
function softmax(z) {

    //e_x = np.exp(x - np.max(x))  # subtract this constant for numerical stability
    var sum = 0.0;
    for (var i = 0; i < z.length; i += 1) {
        z[i] = Math.exp(z[i]);
        sum += z[i];
    }
    for (var i = 0; i < z.length; i += 1) {
        z[i] = z[i]/sum;
    }

    return z;

}

function addVectors(a, b) {

    if (a.length != b.length) {
        throw "a and b have different lengths in addVectors";
    }

    var c = [];
    for (var i = 0; i < a.length; i += 1) {
        c.push(a[i] + b[i]);
    }

    return c;

}

// a is n * m
// b is m * p
// c will be n * p
function matrixMultiply(a, b) {

    var n = a.length;
    var m = b.length;
    var p = b[0].length;

    // initialize n*p array of 0s
    var c = [];
    for (var i = 0; i < n; i += 1) {
        r = Array(p); r.fill(0.0);
        c.push(r);
    }

    for (var i = 0; i < n; i += 1) {
        for (var j = 0; j < p; j += 1) {
            for (var k = 0; k < m; k += 1) {
                c[i][j] += a[i][k] * b[k][j];
            }
        }
    }

    return c;
}

// transposes 2D array
function transpose(a) {
    return a[0].map((x,i) => a.map(x => x[i]));
}

// X: array with dimensions n_features
// returns array with dimensions n_classes
function predict(X) {

    var a = X;
    var activation_fn = 'relu';

    for (var l = 0; l < modelData.nLayers; l += 1) {
        a = [a];
        var w = modelData.weights[l];
        var b = modelData.intercepts[l];

        // change activation function for output layer only
        if (l == (modelData.nLayers - 1)) {
            activation_fn = 'softmax';
        }

        a = forwardPropogateLayer(a, w, b, activation_fn);
    }

    return a;
}

// get current contents of textarea and append word (string)
function appendWordToEditor(word) {
    document.getElementById("editor").value += ' ';
    document.getElementById("editor").value += word;
}

// load model data from json file
function loadModelData() {

    loadJSON(function(response) {
        modelData = JSON.parse(response);
        modelData.nLayers = modelData.intercepts.length;
    });

}

// load local file 
function loadJSON(callback) {

    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', modelFilename, true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
        }
    }
    xobj.send(null);
}


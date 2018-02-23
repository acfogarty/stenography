from algos_from_scratch.common_functions.encoders import LabelEncoder, OneHotEncoder
from algos_from_scratch.common_functions.common_fns import normalize_input_data, split_train_test, cross_entropy_loss, hardmax, confusion_matrix, calculate_scores_from_confusion_matrix, print_model_test
from algos_from_scratch.neural_network.neural_network import NeuralNetwork
import numpy as np
from support import load_input_data

# load individual image files and train feed forward NN
# two hidden layers
# activation function: tanh
# loss function: cross-entropy loss

# hyperparameters
test_fraction = 0.2
n_nodes_per_hidden_layer = [6]
n_hidden_layers = len(n_nodes_per_hidden_layer)
lambda_regul = 0.5  # regularisation hyperparameter
alpha = 0.01  # learning rate

# load data
images, labels = load_input_data()

# process and normalise X
images = np.asarray(images)
X = images.reshape((-1, images.shape[1] * images.shape[2])).astype(np.float32)
X, _, _ = normalize_input_data(X)

# encode Y
l_enc = LabelEncoder()
oh_enc = OneHotEncoder()
labels_encoded = l_enc.fit_transform(labels)  # from strings to integers
Y = oh_enc.fit_transform(labels_encoded).astype(np.float32)  # from array of length n_samples to array of n_samples * n_classes

# random split into test and train
X_train, Y_train, X_test, Y_test = split_train_test(X, Y, test_fraction=test_fraction)

n_samples = len(Y_train)
n_features = X.shape[1]
# n_classes = len(np.unique(Y_train, axis=0)) np v1.13
n_classes = len(np.vstack({tuple(row) for row in Y_train}))
n_classes_test = len(np.vstack({tuple(row) for row in Y_test}))
if n_classes != n_classes_test:
    print('{} classes in train but {} classes in test'.format(n_classes, n_classes_test)) 
    # raise Exception('{} classes in train but {} classes in test'.format(n_classes, n_classes_test)) 

print('n_features', n_features)

print('In total dataset:')
print('n_samples', X.shape[0])

print('In train:')
print('n_samples', n_samples)
print('n_classes', n_classes)
print('input matrix shape', X_train.shape)
print('output matrix shape', Y_train.shape)

# initialise model
nn = NeuralNetwork(n_features, n_classes, n_nodes_per_hidden_layer, alpha=alpha, lambda_regul=lambda_regul)

# fit network on train set
nn.fit(X_train, Y_train)


print('training set')
print_model_test(nn, X_train, Y_train, cross_entropy_loss, oh_enc, l_enc)

print('test set')
print_model_test(nn, X_test, Y_test, cross_entropy_loss, oh_enc, l_enc)

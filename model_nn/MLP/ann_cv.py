from algos_from_scratch.common_functions.encoders import LabelEncoder, OneHotEncoder
from algos_from_scratch.common_functions.common_fns import normalize_input_data, split_train_test, cross_entropy_loss, hardmax, confusion_matrix, calculate_scores_from_confusion_matrix, cross_validation_scores, learning_curve, accuracy_onehot, print_model_test
from algos_from_scratch.neural_network.neural_network import NeuralNetwork
import numpy as np
from support import load_input_data

# load individual image files and train feed forward NN
# two hidden layers
# activation function: tanh
# loss function: cross-entropy loss

# hyperparameters
test_fraction = 0.2
n_nodes_per_hidden_layer = [200, 100]
n_hidden_layers = len(n_nodes_per_hidden_layer)
lambda_regul = 1.0  # regularisation hyperparameter
alpha = 0.01  # learning rate
cv_n_fold = 5  # number of folds for cross validation

# load data
images, labels = load_input_data()

# process and normalise X
X = images.reshape((-1, images.shape[1] * images.shape[2])).astype(np.float32)
X, _, _ = normalize_input_data(X)

# encode Y
l_enc = LabelEncoder()
oh_enc = OneHotEncoder()
labels_encoded = l_enc.fit_transform(labels)  # from strings to integers
Y = oh_enc.fit_transform(labels_encoded).astype(np.float32)  # from array of length n_samples to array of n_samples * n_classes

n_samples = len(Y)
n_features = X.shape[1]
n_classes = len(np.vstack({tuple(row) for row in Y}))

print('n_features', n_features)

print('In total dataset:')
print('n_samples', X.shape[0])
print('n_classes', n_classes)
print('input matrix shape', X.shape)
print('output matrix shape', Y.shape)

# initialise model
nn = NeuralNetwork(n_features, n_classes, n_nodes_per_hidden_layer, alpha=alpha, lambda_regul=lambda_regul)

# learning curve with cross validation
train_sizes = [2, 5, 10] + [int(n_samples * frac) for frac in np.arange(0.2, 1.0, 0.1)]
datapoint_xtics, training_scores, test_scores = learning_curve(nn, X, Y, cv_n_fold=cv_n_fold, score_fn=accuracy_onehot, train_sizes=train_sizes)

# print learning curve and hyperparameters to file
print('lambda_regul = {}  # regularisation hyperparameter'.format(lambda_regul))
print('alpha = {}  # learning rate'.format(alpha))
print('cv_n_fold = {}  # number of folds for cross validation'.format(cv_n_fold))
print('n_nodes_per_hidden_layer = {}'.format(n_nodes_per_hidden_layer))
for xtic, tr, te in zip(datapoint_xtics, training_scores, test_scores):
    print('x', xtic, tr.mean(), tr.std(), te.mean(), te.std())

# print accuracy and confusion matrix and decoded predictions for model on all data
print_model_test(nn, X, Y, accuracy_onehot, oh_enc, l_enc)

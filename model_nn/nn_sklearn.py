from sklearn.preprocessing import StandardScaler
from sklearn.neural_network import MLPClassifier
from sklearn.model_selection import train_test_split
import matplotlib.pyplot as plt
from sklearn import preprocessing
from support import load_input_data
import numpy as np

# cross-validated hyperparameters
hidden_layer_sizes = (50,)  # length = n_layers - 2
alpha = 1e-4  # L2 regularizatio parameter
learning_rate_init = 0.001
solver = 'adam'

# non-cross-validated hyperparameters
activation = 'relu'
batch_size = 'auto'  # min(200, n_samples)
learning_rate = 'constant'  # only for sgd
max_iter = 200
shuffle = True
momentum = 0.9  # only for sgd
beta_1 = 0.9  # only for adam
beta_2 = 0.999  # only for adam

test_fraction = 0.25

# load data
images, labels = load_input_data()

# preprocess X
X = images.reshape((-1, images.shape[1] * images.shape[2])).astype(np.float32)

# preprocess Y
le = preprocessing.LabelEncoder()
Y = le.fit_transform(labels)
print('classes', le.classes_)

# random split
X_train, X_test, Y_train, Y_test = train_test_split(X, Y, stratify=Y, test_size=test_fraction)
# print(np.unique(Y_train, return_counts=True))
# print(np.unique(Y_test, return_counts=True))

# preprocess X
scaler = StandardScaler()
scaler.fit(X_train)
X_train = scaler.transform(X_train)
X_test = scaler.transform(X_test)

# fit NN
clf = MLPClassifier(hidden_layer_sizes=hidden_layer_sizes, activation=activation, solver=solver, alpha=alpha, batch_size=batch_size, learning_rate=learning_rate, learning_rate_init=learning_rate_init, max_iter=max_iter, shuffle=shuffle, momentum=momentum, beta_1=beta_1, beta_2=beta_2)
clf.fit(X_train, Y_train)

print("Training set score: %f" % clf.score(X_train, Y_train))
print("Test set score: %f" % clf.score(X_test, Y_test))

fig, axes = plt.subplots(4, 4)
# use global min / max to ensure all weights are shown on the same scale
vmin, vmax = clf.coefs_[0].min(), clf.coefs_[0].max()
for coef, ax in zip(clf.coefs_[0].T, axes.ravel()):
    ax.matshow(coef.reshape(28, 28), cmap=plt.cm.gray, vmin=.5 * vmin,
               vmax=.5 * vmax)
    ax.set_xticks(())
    ax.set_yticks(())

plt.show()

quit()
# print weights
print([coef.shape for coef in clf.coefs_])

le.inverse_transform(Y_predict)


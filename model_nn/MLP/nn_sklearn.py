from sklearn.preprocessing import StandardScaler
from sklearn.neural_network import MLPClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import confusion_matrix
import matplotlib.pyplot as plt
from sklearn import preprocessing
from support import load_input_data, plot_confusion_matrix, plot_learning_curve
import numpy as np
import json

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
X = (X - 255*0.5) / (255*0.5)
print(X.min(), X.max(), X.mean(), X.std())

# preprocess Y
le = preprocessing.LabelEncoder()
Y = le.fit_transform(labels)
class_names = le.classes_
print('Label encoder mapping')
classes_dict = dict(zip(range(len(le.classes_)), le.classes_))

# random split
X_train, X_test, Y_train, Y_test = train_test_split(X, Y, stratify=Y, test_size=test_fraction)
# print(np.unique(Y_train, return_counts=True))
# print(np.unique(Y_test, return_counts=True))

# fit weights
clf = MLPClassifier(hidden_layer_sizes=hidden_layer_sizes, activation=activation, solver=solver, alpha=alpha, batch_size=batch_size, learning_rate=learning_rate, learning_rate_init=learning_rate_init, max_iter=max_iter, shuffle=shuffle, momentum=momentum, beta_1=beta_1, beta_2=beta_2)
clf.fit(X_train, Y_train)

# print weights
print([coef.shape for coef in clf.coefs_])
print([intercept.shape for intercept in clf.intercepts_])

# output model
model_dict = {'weights': [l.tolist() for l in clf.coefs_], 'intercepts': [l.tolist() for l in clf.intercepts_], 'classes': classes_dict}
with open('model.json', 'w') as f:
    json.dump(model_dict, f)
quit()

# plot_learning_curve(clf, title='', filename='learning_curve.png', X=X, y=Y, ylim=None, cv=3, n_jobs=1, train_sizes=np.linspace(.1, 1.0, 5))

print("Training set score: %f" % clf.score(X_train, Y_train))
print("Test set score: %f" % clf.score(X_test, Y_test))

# confusion matrix
Y_pred = clf.predict(X_test)
cm = confusion_matrix(Y_test, Y_pred)
np.set_printoptions(precision=2)

plot_confusion_matrix(cm, class_names, 'confusion_matrix_test.png',
                      normalize=False,
                      title='Confusion matrix',
                      cmap=plt.cm.Blues)

# plot weights
fig, axes = plt.subplots(4, 4)
# use global min / max to ensure all weights are shown on the same scale
vmin, vmax = clf.coefs_[0].min(), clf.coefs_[0].max()
for coef, ax in zip(clf.coefs_[0].T, axes.ravel()):
    ax.matshow(coef.reshape(28, 28), cmap=plt.cm.gray, vmin=.5 * vmin,
               vmax=.5 * vmax)
    ax.set_xticks(())
    ax.set_yticks(())

plt.show()

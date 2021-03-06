# stenography recognition

1. process multi-image pngs to produce a series of labelled images each containing one stenographic brief form

2. NN from scratch (numpy) to predict one of 7 classes (1 word = 1 brief form = 1 class)

3. get more data

4. NN in sklearn to predict one of 100 classes (1 word = 1 brief form = 1 class)

5. webapp to read touchscreen input

6. implement forwardprop in javascript

7. (TODO) get more data

8. (TODO) CNN in tensorflow to predict one of 100 classes

------------------------------------

_Note_: uses a git submodule algos-from-scratch

After cloning, run:
`git submodule init`
`git submodule update`

To update submodule, run:
`git submodule update --remote`

In older git versions run:
```
cd algos_from_scratch
git fetch
git merge origin/master
```

---------------------------------

`model_nn`

main scripts:

parse_images.py : preprocess data (extract labelled images from multi-image files)
ann.py : feedforward nn from scratch
ann_cv.py : feedforward nn from scratch with CV (tanh, softmax)
nn_sklearn.py : feedforward nn with sklearn (relu, softmax)

support modules:

support.py
image_processing.py

------------------------------------

`webapp`

* weights for three models (one-stroke letters, one-stroke numbers, Gregg's stenography)

* html5 canvas with three zones: one-stroke letters, one-stroke numbers, Gregg's stenography

* touchscreen input -> image matrix, after timedelay of X seconds

* preprocess (crop) input

* forwardprop in js with one of the three models

* propose top output class (or top X outputs if probability of top output is less than threshold)

------------------------------------

### TODO

* propose multiple words if probability of top output is less than threshold, or for brief forms with multiple translations

* dot on touchStart event

* don't distort image shape when cropping and resizing

* add singlestroke models

* add time feature to singlestroke models

* save/backup text from textarea

* CNN

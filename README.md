# stenography recognition

1. process multi-image pngs to produce a series of labelled images each containing one stenographic brief form

2. NN from scratch (numpy) to predict one of 7 classes (1 word = 1 brief form = 1 class)

3. get more data

4. NN in sklearn to predict one of 100 classes (1 word = 1 brief form = 1 class)

5. webapp to read touchscreen input

6. implement forwardprop in javascript

7. get more data

8. CNN in tensorflow to predict one of 100 classes

------------------------------------

_Note_: uses a git submodule algos-from-scratch

After cloning, run:
`git submodule init`
`git submodule update`

To update submodule, run:
`git submodule update --remote`

In older git versions run:
```cd algos_from_scratch
git fetch
git merge origin/master```

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

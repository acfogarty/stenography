# stenography recognition

1. process multi-image pngs to produce a series of labelled images each containing one stenographic symbol
   `parse_images.py`

2. feedforward NN from scratch to predict one of 7 classes (1 word = 1 class)

3. feedforward NN in tensorflow to predict one of 100 classes

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

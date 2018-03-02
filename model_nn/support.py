import re
import scipy.ndimage as nd
import glob
import os
import numpy as np


def load_input_data():
    '''returns:
        images: list of np.array, greyscale pixels for each image
        labels: list of strings, label for each image
    '''

    regex_filename = '(\D+)_\d+.png'
    p = re.compile(regex_filename)
    # TODO XXXX add punctuation marks

    images = []
    labels = []
    filenames = glob.glob('processed_data/*png')
    for filename in filenames:

        # load image data as greyscale
        img = nd.imread(filename, flatten=True)
        images.append(img)

        # parse label from filename
        m = p.search(os.path.basename(filename))
        if m:
            label = m.group(1)
        else:
            raise Exception('could not extract label from filename {}'.format(filename))
        labels.append(label)

    images = np.asarray(images)

    return images, labels



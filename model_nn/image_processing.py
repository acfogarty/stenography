from PIL import Image  # pip install pillow
import numpy as np
import scipy.ndimage as nd
from scipy.misc import imsave


#def rgb2gray(rgb):
#
#    r, g, b = rgb[:,:,0], rgb[:,:,1], rgb[:,:,2]
#    gray = 0.2989 * r + 0.5870 * g + 0.1140 * b
#
#    return gray


def rgb_to_gray(rgb_image):
    return (np.dot(rgb_image[...,:3], [0.299, 0.587, 0.114])) / 255.0


def resize_image(image, new_shape):
    '''resize image to have specified shape new_shape
    image: np.array (2D or 3D)
    new_shape: tuple with number of pixels in width and height of new image
    '''

    # numpy to PIL
    image_pil = Image.fromarray(image)

    image_pil = image_pil.resize(new_shape, Image.BILINEAR)

    # PIL to numpy
    image = np.asarray(image_pil)

    return image


def red_to_white(image):
    '''image: np.array with dimension m*n*3 (image with RGB layers)
    converts all red pixels to white'''

    red_pixels = ((image[:,:,0] > 200) & (image[:,:,1] < 20) & (image[:,:,2] < 20))
    image[red_pixels,:] = 255

    return image


def find_crop_index(image, axis):
    '''along the dimension axis, find the index of the first non-white pixel
    input:
        image: np.array with dimension m*n containing floats between 0 and 1 (grey  scale image)
        axis: np array axis (0=rows, 1=columns)
    '''
    white_cut = 1.0  # value below which we consider pixels to be non-white

    # get the first index in each col/row along that axis where there is a non-white pixel
    first_non_white = np.apply_along_axis(np.argmax, axis, image < white_cut)

    # get the smallest non-zero value
    # (np.argmax returns 0 when no index is found)
    index = np.min(np.extract(first_non_white > 0, first_non_white))

    return index


def flip(image, axis):
    '''reimplement flip function from numpy v1.12.0'''
    if axis == 0:
        return np.flipud(image)
    else:
        return np.fliplr(image)


def crop_whitespace(image):
    '''crop whitespace around image, up until the first non-white
    pixel found in each direction
    image: np.array with dimension m*n containing floats between 0 and 1 (greyscale image)'''

    for axis in [0, 1]:
        # get bounding box for this axis
        min_index = find_crop_index(image, axis)
        max_index = image.shape[axis] - find_crop_index(flip(image, axis), axis)
        # crop this axis
        image = np.take(image, range(min_index, max_index), axis=axis)

    return image

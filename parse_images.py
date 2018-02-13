import numpy as np
import scipy.ndimage as nd
import glob
from scipy.cluster.hierarchy import dendrogram, linkage, fcluster
from scipy.cluster.vq import kmeans, vq
import matplotlib.pyplot as plt
from image_processing import resize_image, crop_whitespace, red_to_white, rgb_to_gray
from scipy.misc import imsave


def get_red_lines(red_pixels, k_lines, axis):
    '''input:
        red_pixels: 2d np.array of the indices of all red pixels
        k_lines: number of red lines we expect to find
        axis: 0 for horizontal lines, 1 for vertical
    returns: np.array of integers giving average indices of red lines on that axis''' 

    pixel_cutoff = 50  # detect a line when at least pixel_cutoff pixels are colored in a line or column

    # get indices of lines (pixel repeated at least pixel_cutoff times in one row or column)
    lines, counts = np.unique(red_pixels[:, axis], return_counts=True)
    line_indices = lines[counts > pixel_cutoff]

    # HAC clustering to detect number of individual lines (they may be several pixels wide)
    Z = linkage(line_indices.reshape((-1, 1)), 'ward')
    clusters = fcluster(Z, k_lines, criterion='maxclust')

    # get mean value of each cluster
    means = [line_indices[clusters == i].mean() for i in np.unique(clusters)]
    line_indices_clustered = [int(c) for c in sorted(means)]
    
    # # calculate full dendrogram
    # plt.figure(figsize=(25, 10))
    # plt.title('Hierarchical Clustering Dendrogram')
    # plt.xlabel('sample index')
    # plt.ylabel('distance')
    # dendrogram(
    #     Z,
    #     leaf_rotation=90.,  # rotates the x axis labels
    #     leaf_font_size=8.,  # font size for the x axis labels
    # )
    # plt.show()

    # # k-means clustering to detect number of individual lines (they may be several pixels wide)
    # less stable than HAC
    # centroids, _ = kmeans(line_indices.reshape((-1, 1)).astype(np.float64), k_lines)
    # line_indices_clustered = [int(c) for c in sorted(centroids)]
    # print(line_indices_clustered)

    return line_indices_clustered


def process_multiimage(img_filename, labels_filename):
    '''extract sub-images from png file containing multiple images
    Sub-images are in black and white separated by a grid of red lines'''

    # get labels from text file with format
    # label11, label12, label13\n label21, label22, label23\n etc.
    ff = open(labels_filename, 'r')
    label_lines = ff.read().split('\n')
    ff.close()
    labels = []
    for line in label_lines:
        if len(line.strip()) > 0:
            labels.append([l.strip() for l in line.split(',')])
    labels = np.asarray(labels)

    print(img_filename)

    # read image containing many sub-images
    img = nd.imread(img_filename)

    # detect red lines forming bounding boxes of sub-images
    # indices of red pixels
    red_pixels = np.argwhere((img[:,:,0] > 200) & (img[:,:,1] < 20) & (img[:,:,2] < 20))
    # average indices of red lines
    horizontal_lines = get_red_lines(red_pixels, labels.shape[0]+1, axis=0)
    vertical_lines = get_red_lines(red_pixels, labels.shape[1]+1, axis=1)

    # get sub-images
    images = []
    for i in range(len(horizontal_lines) - 1):
       row = []
       for j in range(len(vertical_lines) - 1):
           row.append(img[horizontal_lines[i]:horizontal_lines[i+1], vertical_lines[j]:vertical_lines[j+1]])
       images.append(row)

    print('labels:',labels.shape)

    # output image files
    return labels, images


pixel_depth = 255.0  # Number of levels per pixel
image_shape = (28, 28)  # all images will be rescaled to this size

labels_used = []

img_filenames = glob.glob('data/*png')
labels_filenames = glob.glob('data/*dat')
for f1, f2 in zip(img_filenames, labels_filenames):
    labels, sub_images = process_multiimage(f1, f2)
    for i in range(labels.shape[0]):
        for j in range(labels.shape[1]):
            image = sub_images[i][j]
            label = labels[i][j]
            image = red_to_white(image)
            image = rgb_to_gray(image)
            image = crop_whitespace(image)
            image = resize_image(image, image_shape)
            count = labels_used.count(label)
            imsave('{}_{}.png'.format(label, count + 1), image)
            labels_used.append(label)

#image_data = (ndimage.imread(image_file).astype(float) - pixel_depth / 2) / pixel_depth





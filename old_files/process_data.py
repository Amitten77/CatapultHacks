import os
import cv2
from skimage.transform import resize
from skimage.feature import hog

# For static images:
raw_data_path = '../datasets/fruits-360_dataset/fruits-360/Training'
processed_data_path =  '/Users/rahulbansal/Documents/CatapultHacks/processed_data/fruits-360_dataset/Training'

dirs = os.listdir(raw_data_path)
# sorts the folders into alphabetical order
dirs.sort()

for letter, folder in enumerate(dirs):
    # print(folder)
    if not os.path.exists(processed_data_path + "/" + folder):
        print(processed_data_path + "/" + folder)
        os.makedirs(processed_data_path + "/" + folder)
    for idx, file in enumerate(os.listdir(raw_data_path + "/" + folder)):
        image = cv2.flip(cv2.imread(raw_data_path + "/" + folder + "/" + file), 1)
        gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # image from cv2 camera is (1080, 1920, 3)
        # each cell needs to be (8,8), so the image sizes have to be a multiple of this

        fd, hog_image = hog(gray_image, orientations=9, pixels_per_cell=(2, 2),
                        cells_per_block=(1, 1), visualize=True, channel_axis=None)

        enlarged_image = resize(hog_image, (1080, 1920))
        cv2.imwrite(processed_data_path + "/" + folder + "/" + file, gray_image)
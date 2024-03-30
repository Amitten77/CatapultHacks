from skimage.transform import resize
from skimage.feature import hog
from skimage import exposure
import matplotlib.pyplot as plt
import cv2

cap = cv2.VideoCapture(0)


while cap.isOpened():
    success, image = cap.read()
    if not success:
        continue
    image.flags.writeable = True

    
    # converts the rgb image to grayscale
    # Note: may have to "subtract" the previous image to remove the background (or rolling average)
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # image from cv2 camera is (1080, 1920, 3)
    # each cell needs to be (8,8), so the image sizes have to be a multiple of this
    # resized_img = gray_image
    resized_img = resize(gray_image, (1080/5, 1920/5))

    # feature detection
    fd, hog_image = hog(resized_img, orientations=9, pixels_per_cell=(2, 2),
                	cells_per_block=(1, 1), visualize=True, channel_axis=None)

    enlarged_image = resize(hog_image, (1080, 1920))
    cv2.imshow("yooooo", cv2.flip(enlarged_image, 1))
    if cv2.waitKey(5) & 0xFF == 27:
      break

cap.release()

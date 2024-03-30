import cv2
import numpy as np

def is_black_screen(image_path, threshold = 5):
    image = cv2.imread(image_path)

    #grayscale_image = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
    

    avg_color = np.mean(image, axis=(0, 1))

    print(avg_color)
    # num_black_pixels = cv2.countNonZero(grayscale_image)

    # total_pixels = grayscale_image.shape[0] * grayscale_image.shape[1]

    # black_percentage = num_black_pixels / total_pixels

    avg = (avg_color[0] + avg_color[1] + avg_color[2]) / 3
    print(avg)

    if avg <= threshold:
        return True
    
    return False

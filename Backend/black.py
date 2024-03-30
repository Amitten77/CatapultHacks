import cv2
import numpy as np

def is_black_screen(image_data, threshold=5):
    image_np = np.frombuffer(image_data, np.uint8)
    image = cv2.imdecode(image_np, cv2.IMREAD_COLOR)

    if image is None:
        return False

    avg_color = np.mean(image, axis=(0, 1))
    print(avg_color)

    avg = (avg_color[0] + avg_color[1] + avg_color[2]) / 3
    print(avg)

    return avg <= threshold

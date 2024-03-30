# from imageai.Detection import ObjectDetection

# obj_detect = ObjectDetection()
# obj_detect.setModelTypeAsYOLOv3()

# obj_detect.setModelPath(r"/Users/vikrampidaparthi/Documents/FridgeAI/CatapultHacks/Datasets/yolo.h5")

# obj_detect.loadModel()

from ultralytics import YOLO

# Load a model
model = YOLO("yolov8n.yaml")  # build a new model from scratch

# Use the model
results = model.train(data="config.yaml", epochs=1)  # train the model

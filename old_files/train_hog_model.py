import pandas as pd
import numpy as np
import keras
from keras.models import Sequential
from keras.layers import Conv3D, MaxPooling3D, Flatten, Dense
import pickle

from sklearn import datasets
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier

def loadModel():
    return pickle.load(open('model', 'rb'))
def trainModel():
    data = pd.read_csv('new_generated_data.csv', header=None)
    test_data = pd.read_csv('generated_test_data.csv', header=None)

    coordinates = data.iloc[:, 1:].values
    labels = data.iloc[:, 0].values

    test_coords = test_data.iloc[:, 1:].values
    test_labels = test_data.iloc[:, 0].values

    num_rows = coordinates.shape[0]
    num_test_rows = test_coords.shape[0]
    coordinates = coordinates.reshape((num_rows, 21, 3, 1, 1))
    # coordinates = coordinates[:, :, 0:2]
    test_coords = test_coords.reshape((num_test_rows, 21, 3, 1, 1))
    # test_coords = test_coords[:, :, 0:2]
    coordinates = coordinates.reshape((num_rows, 63))
    test_coords = test_coords.reshape((num_test_rows, 63))

    print(coordinates.shape)
    print(labels.shape)
    knn = KNeighborsClassifier(n_neighbors = 24)
    knn.fit(coordinates, labels)

    knn_file = open('model', 'wb')
    pickle.dump(knn, knn_file)
    knn_file.close()
    

    # accuracy = knn.score(test_coords, test_labels)
    # print("accuracy: " + str(accuracy))

    # model.evaluate(test_coords, test_labels, verbose=2)
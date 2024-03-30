#Image Operations
import cv2
import numpy as np
import matplotlib.pyplot as plt
import matplotlib

#Not so important
import pandas as pd

#image operation using skimage
from skimage.color import rgb2gray
from skimage.transform import rescale, resize, downscale_local_mean

#classification using sklearn
from sklearn.model_selection import train_test_split
from skimage import data, color, feature
from skimage.feature import hog

#load the data
import glob


def loadimage(arr,n,name_of_fruit):
    #Because there is not any label in datasets, so you must add the label manually
    label=[]
    for i in range(n):
        #This is the name of the folder, because this is nested file
        strr = "rgb/"+name_of_fruit+"_"+str(i+1)+"/*.png"
        #Load data per folder
        for file in glob.glob(strr):
            #read an image as array
            img=np.asarray(plt.imread(file))
            #Append to array
            arr.append(img)
            #Append the label
            label.append(name_of_fruit)
    return arr,label

#the list of data
apple=[]
banana =[]
lemon=[]
lime=[]
orange=[]
peach=[]
pear=[]

#load the data, loadimage(array,num_of_folder,name_of_fruit)
apple,label_apple=loadimage(apple,5,"apple")
banana,label_banana=loadimage(banana,4,"banana")
lemon,label_lemon=loadimage(lemon,6,"lemon")
lime,label_lime=loadimage(lime,4,"lime")
orange,label_orange=loadimage(orange,4,"orange")
peach,label_peach=loadimage(peach,3,"peach")
pear,label_pear=loadimage(pear,3,"pear")

X_Shapedes=np.concatenate((apple,banana,lemon,lime,orange,peach,pear))
y_Shapedes=np.concatenate((label_apple,label_banana,label_lemon,label_lime,label_orange,label_peach,label_pear))


X_train, X_test, y_train, y_test = train_test_split(X_Shapedes, y_Shapedes, test_size=0.33, random_state=42)

def preprocessing1(arr):
    arr_prep=[]
    for i in range(np.shape(arr)[0]):
        img=cv2.cvtColor(arr[i], cv2.COLOR_BGR2GRAY)
        img=resize(img, (72, 72),anti_aliasing=True)
        arr_prep.append(img)
    return arr_prep

def FtrExtractHOG(img):
    ftr,_=hog(img, orientations=8, pixels_per_cell=(16, 16),
            cells_per_block=(1, 1), visualize=True, multichannel=False)
    return ftr
  
def featureExtraction1(arr):
    arr_feature=[]
    for i in range(np.shape(arr)[0]):
        arr_feature.append(FtrExtractHOG(arr[i]))
    return arr_feature


#Preprocessing
X_trainp=preprocessing1(X_train)
X_testp=preprocessing1(X_test)
#Feature Extraction 
X_trainftr=featureExtraction1(X_trainp)
X_testftr=featureExtraction1(X_testp)

from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score

knn_clf = KNeighborsClassifier(n_jobs=-1, weights='distance', n_neighbors=11)
knn_clf.fit(X_trainftr, y_train)

y_knn_pred = knn_clf.predict(X_testftr)

print(accuracy_score(y_test, y_knn_pred)*100,'%')
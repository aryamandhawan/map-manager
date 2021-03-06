from django.http import HttpResponse
from django.shortcuts import render
from django.http import JsonResponse

import pymongo
from bson import json_util
from pprint import pprint
import json
import os
import logging


# Create your views here.
def index(request):
    return HttpResponse('Map Manager API - INDEX')

# DB CONNECTION 
def db_connection():
    # TODO: 
    # 1. change connection back to mongodb atlas
    mongo_conn = os.environ.get('MONGODB_HOST')
    myclient = pymongo.MongoClient(mongo_conn)
    # myclient = pymongo.MongoClient("mongodb://localhost:27017/")
    return myclient

index_file_path = os.path.join('C:\\Users\\aryam\\Desktop\\Projects\\frontend', 'build', 'index.html')
def react(request):
    try:
        with open(index_file_path) as f:
            print ("index_file_path : ",index_file_path)
            return HttpResponse(f.read())
    except FileNotFoundError:
        logging.exception('Production build of app not found')

def get_image_data(request):
    # REQUEST PARAMS
    print("\n--------REQUEST PARAMS---------\n")
    region = request.GET.get('region', "adelaide")
    id = request.GET.get('image_id', None)
    geometry = request.GET.get('geometry', None)
    num_neighbours = request.GET.get('num_neighbours', None)
    print("region",region)
    print("id",id)
    print("geometry",geometry," ",type(geometry))
    print("num_neighbours",num_neighbours)
    print("\n--------------------------------\n")

    # DB CONN
    print("\n--------DB CONN---------\n")
    myclient = db_connection()
    mydb = myclient["mapillary_data"]
    collection_name = region+"_images"
    print("collection_name" , collection_name)
    collection = mydb[collection_name]
    images_data_json = { "type": "FeatureCollection", "features": [] }
    print("\n------------------------\n")
    
    if(id != None):
        if(geometry==None):
            print("id != None and geometry==None")
            geometry = collection.find_one({"properties.id":int(id)},{"_id":0,"geometry.coordinates":1})
            geometry = geometry["geometry"]        
        else:
            print("id != None and geometry!=None")
            geometry = json.loads(geometry)
            
        print(geometry)
        query_ = { "geometry" : { "$near" : { "$geometry" : { "type":"Point" , "coordinates":  [ geometry["coordinates"][0],geometry["coordinates"][1] ]   } } } }
        image_dataset = collection.find(query_).limit(int(num_neighbours))
        for image_data in image_dataset :
            images_data_json['features'].append(image_data["properties"]["id"])
    else:
        # TODO: 
        # 1. change limit
        image_dataset = collection.find()
        print("image_dataset",type(image_dataset))
        for image_data in image_dataset :
            images_data_json['features'].append(image_data)

        images_data_json = json.loads(json_util.dumps(images_data_json))
    return JsonResponse(images_data_json, safe=True)

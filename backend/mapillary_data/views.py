from django.http import HttpResponse
from django.shortcuts import render
from django.http import JsonResponse

import pymongo
from bson import json_util
from pprint import pprint
import json


# Create your views here.
def index(request):
    return HttpResponse('Django example')
    
import os
import logging
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
    region = request.GET.get('region', "adelaide")
    id = request.GET.get('image_id', None)
    geometry = request.GET.get('geometry', None)
    print("region",region)
    print("id",id)
    print("geometry",geometry)
    print("\n\n")

    # DB CONNECTION 
    myclient = pymongo.MongoClient("mongodb://localhost:27017/")
    mydb = myclient["mapillary_data"]
    collection_name = region+"_images"
    print("collection_name" , collection_name)
    collection = mydb[collection_name]
    
    images_data_json = { "type": "FeatureCollection", "features": [] }
    # QUERY FOR ALL IMAGES
    image_dataset = collection.find().limit(20)
    for image_data in image_dataset :
        images_data_json['features'].append(image_data)
    new_d = json.loads(json_util.dumps(images_data_json))
    return JsonResponse(new_d, safe=True)
    # # request.
    # if region == None:
    #     region = "adelaide"
    # try:
    #     # with open(f"C:\\Users\\aryam\\Desktop\\Projects\\backend\\mapillary_data\\{region.lower()}_images.geojson") as f:
    #     with open(f"C:\\Users\\aryam\\Desktop\\Projects\\backend\\mapillary_data\\adl_data.geojson") as f:
    #         # print(f.read(), "\n\n\n")
    #         return HttpResponse(f.read())
    # except FileNotFoundError:
    #     logging.exception('Production build of app not found')
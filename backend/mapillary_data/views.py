from django.http import HttpResponse
from django.shortcuts import render
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
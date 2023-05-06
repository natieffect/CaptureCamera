from django.urls import path
from . import views

app_name= 'stream'
urlpatterns=[
    path('',views.stream_main,name='main'),
]
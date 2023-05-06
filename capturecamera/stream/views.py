from django.shortcuts import render

# Create your views here.

def stream_main(request):
    return render(request,'stream/stream_main.html',{})

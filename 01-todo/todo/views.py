from django.shortcuts import render, redirect
from .models import Task

def home(request):
    if request.method == 'POST':
        title = request.POST.get('title')
        description = request.POST.get('description')
        Task.objects.create(title=title, description=description)
        return redirect('home')
    
    tasks = Task.objects.all()
    return render(request, 'home.html', {'tasks': tasks})
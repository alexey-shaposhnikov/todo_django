import json
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import render, get_object_or_404, get_list_or_404
from todo.forms import TodoForm
from todo.models import TodoItem
from todo.utils import json_response


@login_required
def home(request):
    todos = TodoItem.objects.filter(user=request.user).order_by('-id')
    return render(request, "home.html", {'todos': todos})

@login_required
def create_todo(request):
    if request.method == 'GET':
        form = TodoForm(user=request.user)
    elif request.method == 'POST':
        form = TodoForm(request.POST, user=request.user)
        if form.is_valid():
            form.save()
            return HttpResponseRedirect('/')
    return render(request, "todo_form.html", {'form': form})

@login_required
def edit_todo(request, todo_id):
    response = {}
    status = 400
    if request.method == 'POST':
        instance = TodoItem.objects.get(pk=todo_id)
        form = TodoForm(request.POST, user=request.user, instance=instance)
        if form.is_valid():
            form.save()
            status = 200
        else:
            print(form.errors.items())
            response['errors'] = dict(form.errors.items())
    if request.method == 'DELETE':
        model = TodoItem.objects.get(pk=todo_id)
        model.delete()
        status = 200
    return json_response(response, status)
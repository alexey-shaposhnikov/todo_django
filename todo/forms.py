from django import forms
from django.forms import ModelForm
from models import TodoItem


class TodoForm(ModelForm):
    class Meta:
        model = TodoItem
        fields = ['name', 'done']

    def __init__(self, *args, **kwargs):
        self._user = kwargs.pop('user')
        super(TodoForm, self).__init__(*args, **kwargs)

    def save(self, commit=True):
        inst = super(TodoForm, self).save(commit=False)
        inst.user = self._user
        if commit:
            inst.save()
            self.save_m2m()
        return inst
from django.conf.urls import patterns, include, url
from django.contrib import admin


urlpatterns = patterns('',
                       url(r'^$', 'todo.views.home', name='home'),
                       url(r'^create/', 'todo.views.create_todo', name='create_todo'),
                       url(r'^edit/(?P<todo_id>\d+)', 'todo.views.edit_todo', name='edit_todo'),
                       # url(r'^blog/', include('blog.urls')),
                       url(r'^user/password/reset/complete/$',
                           'django.contrib.auth.views.password_reset_complete'),
                       (r'^accounts/', include('registration.backends.default.urls')),
                       (r'^accounts/', include('django.contrib.auth.urls')),
                       url(r'^admin/', include(admin.site.urls)),
)

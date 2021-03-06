from django.conf.urls import patterns, url

from gmConflicts import views

urlpatterns = patterns('',
    # ex: /conflict/
    url(r'^$', views.index, name='index'),
    # ex: /conflict/new
    url(r'^new/$', views.newConflict, name='newConflict'),
    # ex: /conflict/5/
    url(r'^(?P<conf_id>\d+)/$', views.editor, name='editor'),
    # ex: /conflicts/5/network/
    url(r'^(?P<conf_id>\d+)/network/$', views.network, name='network'),
    # ex: /conflicts/5/tree/    
    url(r'^(?P<conf_id>\d+)/tree/$', views.tree, name='tree'),
)
from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
	url(r'^conflicts/', include('gmConflicts.urls',namespace='gmConflicts')),
    url(r'^admin/', include(admin.site.urls)),
)

from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from django.core.urlresolvers import reverse
import json

from gmConflicts.models import GM_conflict

def index(request):
    latest_conflicts = GM_conflict.objects.all().order_by('-pub_date')[:5]
    context = {'latest_conflicts': latest_conflicts}
    return render(request, 'gmConflicts/index.html', context)

@csrf_exempt
def newConflict(request):
    if request.method == "POST":
        conf = GM_conflict(
                title=request.POST['confTitle'],
                description = request.POST['confDescription'],
                pub_date = timezone.now(),
                json_rep = request.POST['conf'],
                json_stabilities = "{}")
        conf.save()
        return HttpResponse(reverse('gmConflicts:editor', args=[conf.id]))
    
    elif request.method == "GET":
        conf = {'json_rep':'{"options":[],"decisionMakers":[]}',
                'title':'New Conflict'}
        return render(request, 'gmConflicts/editor.html',{'conf':conf})

@csrf_exempt
def editor(request, conf_id):
    if request.method == "POST":
        conf = get_object_or_404(GM_conflict,pk=conf_id)
        conf.title = request.POST['confTitle']
        conf.description = request.POST['confDescription']
        conf.json_rep = request.POST['conf']
        conf.save()
        return HttpResponse("Ajax_save_success.")

    elif request.method == "GET":
        conf = get_object_or_404(GM_conflict, pk=conf_id) 
        return render(request, 'gmConflicts/editor.html', {'conf': conf})
    
def network(request, conf_id):
    return HttpResponse("You're looking at the network representation of conflict %s." % conf_id)
    
def tree(request, conf_id):
    return HttpResponse("You're looking at the tree representation of conflict %s." % conf_id)
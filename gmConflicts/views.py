from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from django.core.urlresolvers import reverse

from gmConflicts.models import GM_conflict

def index(request):
    latest_conflicts = GM_conflict.objects.all().order_by('-pub_date')[:5]
    context = {'latest_conflicts': latest_conflicts}
    return render(request, 'gmConflicts/index.html', context)

def newConflict(request):
	if 'msg' in request.POST :
		conf = GM_conflict(
				title="newConf",
				description = "A new conflict",
				pub_date = timezone.now(),
				json_rep = request.POST['msg'],
				json_stabilities = "{}")
		conf.save()
		return HttpResponseRedirect(reverse('gmConflicts:editor', args=[conf.id]))
	
	else:
		conf = {'json_rep':"{}"}
		return render(request, 'gmConflicts/editor.html',{'conf':conf})

	
def editor(request, conf_id):
    conf = get_object_or_404(GM_conflict, pk=conf_id) 
    return render(request, 'gmConflicts/editor.html', {'conf': conf})
	
@csrf_exempt
def save(request, conf_id):
    conf = get_object_or_404(GM_conflict,pk=conf_id)
    conf.json_rep = request.POST['msg']
    conf.save()
    return HttpResponse("Ajax save success.")

def network(request, conf_id):
    return HttpResponse("You're looking at the network representation of conflict %s." % conf_id)
	
def tree(request, conf_id):
    return HttpResponse("You're looking at the tree representation of conflict %s." % conf_id)
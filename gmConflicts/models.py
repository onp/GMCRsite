from django.db import models

# Create your models here.

class GM_conflict(models.Model):
    title = models.CharField(max_length=160)
    description = models.TextField()
    pub_date = models.DateTimeField('date published')
    json_rep = models.TextField()
    json_stabilities = models.TextField()

    def __str__(self):
        return self.title
import json
from django.http import HttpResponse


def json_response(data, status=200):
    return HttpResponse(
        json.dumps(data),
        status=status,
        content_type='application/javascript; charset=utf8'
    )
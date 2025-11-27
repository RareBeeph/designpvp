from django.urls import _AnyURL, path
from rest_framework.urlpatterns import format_suffix_patterns

from snippets import views

urlpatterns: list[_AnyURL] = [
    path("snippets/", views.snippet_list),
    path("snippets/<int:pk>/", views.snippet_detail),
]

urlpatterns = format_suffix_patterns(
    urlpatterns
)  # Not sure if this works with the include() in backend/urls.py? .json seems to work but any other format 404s

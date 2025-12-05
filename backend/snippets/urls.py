from django.urls import URLPattern, URLResolver, path
from rest_framework.urlpatterns import format_suffix_patterns

from snippets import views

type _AnyURL = URLPattern | URLResolver

urlpatterns: list[_AnyURL] = [
    path("snippets/", views.SnippetList.as_view()),
    path("snippets/<int:pk>/", views.SnippetDetail.as_view()),
]

urlpatterns = format_suffix_patterns(
    urlpatterns
)  # Not sure if this works with the include() in backend/urls.py? .json seems to work but any other format 404s

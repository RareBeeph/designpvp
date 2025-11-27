from rest_framework.decorators import api_view
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_201_CREATED,
    HTTP_204_NO_CONTENT,
    HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND,
    HTTP_405_METHOD_NOT_ALLOWED,
)

from snippets.models import Snippet
from snippets.serializers import SnippetSerializer


@api_view(["GET", "POST"])
def snippet_list(request: Request, format: (str | None) = None) -> Response:
    match request.method:
        case "GET":
            snippets = Snippet.objects.all()
            serializer = SnippetSerializer(snippets, many=True)
            return Response(serializer.data)

        case "POST":
            serializer = SnippetSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=HTTP_201_CREATED)
            return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

    return Response(status=HTTP_405_METHOD_NOT_ALLOWED)  # I added this bit to appease mypy


@api_view(["GET", "PUT", "DELETE"])
def snippet_detail(request: Request, pk: int, format: (str | None) = None) -> Response:
    try:
        snippet = Snippet.objects.get(pk=pk)
    except Snippet.DoesNotExist:
        return Response(status=HTTP_404_NOT_FOUND)

    match request.method:
        case "GET":
            serializer = SnippetSerializer(snippet)
            return Response(serializer.data)

        case "PUT":
            serializer = SnippetSerializer(snippet, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=HTTP_201_CREATED)
            return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

        case "DELETE":
            snippet.delete()
            return Response(status=HTTP_204_NO_CONTENT)

    return Response(status=HTTP_405_METHOD_NOT_ALLOWED)

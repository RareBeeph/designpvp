from django.conf import settings
from drf_spectacular.utils import extend_schema
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from config.serializers import ConfigSerializer


class ConfigView(APIView):
    @extend_schema(responses=ConfigSerializer)
    def get(self, request: Request) -> Response:
        config: dict[str, bool] = {}
        config["production"] = (bool)(settings.PRODUCTION)
        serializer = ConfigSerializer(config)
        return Response(serializer.data)

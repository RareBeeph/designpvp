from rest_framework import serializers


class ConfigSerializer(serializers.Serializer):
    production = serializers.BooleanField(default=False, read_only=True)

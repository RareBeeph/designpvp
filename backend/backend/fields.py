from collections.abc import Sequence
from typing import Any

from rest_framework import relations


class BulkPrimaryKeyRelatedField(relations.PrimaryKeyRelatedField):
    """
    `PrimaryKeyRelatedField`, except that `many=True` resolves the list in one query.

    DRF hands each item to the child field on its own, and `to_internal_value` is a
    `queryset.get(pk=...)`, so writing N related objects costs N queries. Reported in 2017
    as encode/django-rest-framework#4917; the issue is closed, the behaviour is not, and
    3.16 still does it.

    Nothing here reimplements DRF's own work: `BulkManyRelatedField` preloads the list,
    `super()` runs the real `to_internal_value` on both classes, and this field answers
    from the preloaded map only when it holds the item. Anything not in it - a missing
    row, a bool, a pk of the wrong type entirely - takes the ordinary per-item path, so
    every error message, code and `attr` stays DRF's own and `drf-standardized-errors`
    sees no difference. Those requests 400, so a query each on the way out is free.
    """

    @classmethod
    def many_init(cls, *args: Any, **kwargs: Any) -> relations.ManyRelatedField:
        # `RelatedField.many_init` hard-codes the class it builds and hands back a finished
        # object, so there is nothing to `super()` into. Only its split of the kwargs is
        # worth keeping, and that is read out of DRF at runtime rather than copied
        outer = {key: kwargs[key] for key in kwargs if key in relations.MANY_RELATION_KWARGS}
        return BulkManyRelatedField(child_relation=cls(*args, **kwargs), **outer)

    def preload(self, data: Any) -> dict[str, Any]:
        """
        Map every pk in `data` to its object, or nothing at all if it can't be batched.

        Keyed by `str` because a pk arrives as one under multipart/form-data, which
        flattens the body into a QueryDict of strings, and as an int under JSON. Profile
        carries an avatar, so `order_request_content_types` makes multipart its real path.
        """
        # `super().to_internal_value` is what rejects a non-list, and `pk_field` rewrites
        # values before they are used as pks, so neither is something `pk__in` can be given
        if not isinstance(data, (list, tuple)) or self.pk_field is not None:
            return {}
        try:
            return {str(obj.pk): obj for obj in self.get_queryset().filter(pk__in=data)}
        except (TypeError, ValueError):
            # One value that is not a pk at all ("abc" against an integer pk) makes the
            # whole filter raise, taking the valid pks with it. Preload nothing and let the
            # per-item path turn that value into the field error it deserves
            return {}

    def to_internal_value(self, data: Any) -> Any:
        preloaded = getattr(self.parent, "preloaded", {})
        if str(data) in preloaded:
            return preloaded[str(data)]
        return super().to_internal_value(data)


class BulkManyRelatedField(relations.ManyRelatedField):
    """The `many=True` half of `BulkPrimaryKeyRelatedField`; see that class for why."""

    child_relation: "BulkPrimaryKeyRelatedField"
    # Set for the duration of one `to_internal_value` and read by the child field. Keeping
    # it on the instance is safe because DRF deep-copies declared fields per serializer, so
    # this is never the class-level field object shared between requests
    preloaded: dict[str, Any]

    # `Sequence` rather than `list` to match the base signature drf-stubs declares
    def to_internal_value(self, data: Any) -> Sequence[Any]:
        self.preloaded = self.child_relation.preload(data)
        try:
            return super().to_internal_value(data)
        finally:
            self.preloaded = {}

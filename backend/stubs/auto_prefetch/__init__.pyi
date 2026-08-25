"""
Type stubs for django-auto-prefetch (1.14.0).

The package ships `py.typed`, but its public classes subclass Django's generic ones
without passing type parameters - `class ForeignKey(models.ForeignKey)`, not
`ForeignKey[_ST, _GT]`. django-stubs types those bases as generic in their set/get
descriptor types, and the django-stubs mypy plugin assumes any `Field` subclass it
hooks carries those two parameters. Given a non-generic subclass it writes the args
onto an Instance that has no type variables to receive them, so `team.event` resolves
to a bare, unsolved `_ST` instead of `Event`.

The same omission on `QuerySet` costs more quietly: `Event.objects.all()` comes back as
an unparameterized `auto_prefetch.QuerySet`, so iterating any queryset over these models
yields `Any` and every downstream check silently stops happening.

Re-declaring the classes with the parameters they should have had is enough to fix both.
Delete this package if upstream starts shipping parameterized definitions.
"""

from typing import Any, ClassVar, TypeVar

from django.db import models
from django.db.models.query import _Row

_ST = TypeVar("_ST", contravariant=True)
_GT = TypeVar("_GT", covariant=True, default=_ST)
_Model = TypeVar("_Model", bound=models.Model, covariant=True)

class ForeignKey(models.ForeignKey[_ST, _GT]): ...
class OneToOneField(models.OneToOneField[_ST, _GT]): ...
class QuerySet(models.QuerySet[_Model, _Row]): ...

# Really `models.Manager.from_queryset(QuerySet)` - a runtime-generated class, which a stub
# cannot express. Manager gains no methods from auto_prefetch's QuerySet, so the plain
# Manager shape is accurate
class Manager(models.Manager[_Model]): ...

class Model(models.Model):
    class Meta:
        abstract: ClassVar[bool]
        base_manager_name: ClassVar[str]

    objects: ClassVar[Manager[Any]]
    prefetch_manager: ClassVar[Manager[Any]]

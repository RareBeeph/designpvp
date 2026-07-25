"""
Regenerates the devsetup fixture from whatever is currently in the database.

Use this instead of a bare `dumpdata`. A plain dump also captures the rows Django
creates for itself during `migrate` - contenttypes, auth permissions, admin log
entries, sessions - and replaying those hard-coded primary keys onto a freshly
migrated database fails with an IntegrityError, because `migrate` has already
created the same rows under different PKs.
"""

import io
import json
from pathlib import Path
from typing import Any

from django.core.management import call_command
from django.core.management.base import BaseCommand, CommandParser

# Dump only what actually seeds a dev environment. This is an allowlist rather than
# a list of exclusions on purpose: a new app's data will be left out until someone
# adds it here, which is the safe direction to fail.
FIXTURE_MODELS = ["auth.User", "events", "profiles"]

# Churns every time someone logs in, and means nothing in a seed fixture.
NOISY_FIELDS = {"auth.user": ["last_login"]}

DEFAULT_OUTPUT = Path(__file__).resolve().parents[2] / "fixtures" / "devsetup.json"


class Command(BaseCommand):
    help = "Regenerates backend/fixtures/devsetup.json from the current database."

    def add_arguments(self, parser: CommandParser) -> None:
        parser.add_argument(
            "--output",
            type=Path,
            default=DEFAULT_OUTPUT,
            help=f"Where to write the fixture (default: {DEFAULT_OUTPUT}).",
        )

    def handle(self, *args: Any, **options: Any) -> None:
        output: Path = options["output"]

        buffer = io.StringIO()
        call_command("dumpdata", *FIXTURE_MODELS, format="json", stdout=buffer)
        objects = json.loads(buffer.getvalue())

        for obj in objects:
            for field in NOISY_FIELDS.get(obj["model"], []):
                obj["fields"].pop(field, None)

        output.parent.mkdir(parents=True, exist_ok=True)
        with output.open("w") as f:
            json.dump(objects, f, indent=2)
            f.write("\n")

        counts: dict[str, int] = {}
        for obj in objects:
            counts[obj["model"]] = counts.get(obj["model"], 0) + 1

        self.stdout.write(self.style.SUCCESS(f"Wrote {len(objects)} objects to {output}"))
        for model, count in sorted(counts.items()):
            self.stdout.write(f"  {model}: {count}")

## Development Fixtures

The default state of the database after loading the "devsetup.json" fixture should be as follows:

Users:
- \{username: admin, password: password\} - is superuser
- \{username: user, password: CorrectHorseBatteryStaple\} - is regular user

Profiles:
- \{user: \(admin\), teams: \[\(team1\)\]\}
- \{user: \(user\), teams: \[\(team2\)\]\}

Events:
- \{name: event, starts: May 26, 2026, ends: May 26, 2027\}

Teams:
- \{name: team1, event: event\}
- \{name: team2, event: event\}

### Loading and regenerating

```bash
docker compose exec backend poetry run python manage.py loaddata devsetup     # load
docker compose exec backend poetry run python manage.py dump_devsetup         # regenerate
```

To change the seed data, edit it (via the admin or a shell), then run `dump_devsetup`
and commit the result.

Use `dump_devsetup` rather than `dumpdata`. A plain dump also picks up the rows Django
creates during `migrate` - contenttypes, auth permissions, admin log entries, sessions -
and loading those hard-coded primary keys into a freshly migrated database fails with an
`IntegrityError`. The command dumps only `auth.User`, `events` and `profiles`, and drops
`last_login` so simply logging in doesn't produce a fixture diff. If you add an app whose
data belongs in the seed, add it to `FIXTURE_MODELS` in
`backend/backend/management/commands/dump_devsetup.py`.

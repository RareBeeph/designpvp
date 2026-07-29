## Editor setup (VS Code)

All tooling lives in the containers - there is no host-level dev setup. A host-side editor
cannot lint or type-check this project: the Poetry venv and `mypy.ini` are in the `backend`
container, and `node_modules` is an anonymous volume that only exists inside `frontend`.

With the [Dev Containers][devcontainers] extension installed, open the repo and run
**Dev Containers: Reopen in Container**. That builds one `devcontainer` service carrying both
toolchains, mounts the whole repo at `/workspace`, and brings the rest of the stack up
alongside it - so a single window covers backend and frontend, and closing it leaves the app
running.

The app is still served by the `backend` and `frontend` services on http://localhost:3000. The
dev container serves nothing; it only hosts the editor's language servers.

Its Node and Python are copied from the same base images the app services use, so versions
cannot drift.

[devcontainers]: https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers

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

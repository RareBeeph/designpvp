# Tooling-only image for the dev container. The editor needs Python and Node in the same
# place so one window can work on both halves of the repo; the app itself keeps running in
# the `backend` and `frontend` services exactly as before. Nothing here serves traffic.

FROM node:latest AS node

FROM python:3.14

# The same Node build frontend/Dockerfile.local uses. Copying it beats installing from
# NodeSource because it cannot drift from the frontend image, and both bases are Debian
# trixie so the binary runs as-is.
COPY --from=node /usr/local/bin/node /usr/local/bin/node
COPY --from=node /usr/local/lib/node_modules /usr/local/lib/node_modules
RUN ln -s /usr/local/lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npm \
    && ln -s /usr/local/lib/node_modules/npm/bin/npx-cli.js /usr/local/bin/npx

RUN pip install -U pip poetry pyyaml
RUN poetry self add poetry-types

# Install the backend toolchain into this image's own Python, with no virtualenv at all.
#
# This is load-bearing, not a shortcut. A venv must never land at backend/.venv: that path is
# inside the bind-mounted repo, so Docker creates it on the *host*, and the backend app
# container - which bind-mounts the same directory at /code - then finds an in-project .venv
# that Poetry 2.x prefers over its own environment. The symptom is
# `docker compose exec backend poetry run mypy` failing with "Command not found: mypy" for
# everyone on the project, including CI. Keep POETRY_VIRTUALENVS_CREATE=false set at runtime
# too, so running `poetry install` by hand cannot recreate the problem.
ENV POETRY_VIRTUALENVS_CREATE=false

COPY backend/pyproject.toml backend/poetry.lock /tmp/deps/
RUN cd /tmp/deps && poetry install && rm -rf /tmp/deps

WORKDIR /workspace

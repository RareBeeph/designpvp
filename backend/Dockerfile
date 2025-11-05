FROM python:3.14

RUN pip install -U pip poetry

COPY pyproject.toml poetry.lock ./
RUN poetry install --without dev

COPY . .

CMD poetry run python manage.py wait_for_db && \
  poetry run python manage.py collectstatic --noinput && \
  poetry run python manage.py migrate && \
  poetry run python manage.py createcachetable && \
  poetry run gunicorn -b 0.0.0.0:3000 backend.wsgi:application

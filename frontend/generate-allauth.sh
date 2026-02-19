#!/bin/bash
curl backend:3000/api/_allauth/openapi.yaml | sed "s/\/api//" > allauth-schema.yaml
python3 allauth-schema-script.py
npx prettier --write allauth-schema.yaml
npm run api:generate

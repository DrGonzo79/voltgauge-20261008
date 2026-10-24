FROM node:22.23.4-alpine AS frontend
# Refresh the system certificate store when rebuilding this image.
RUN apk add --no-cache --upgrade ca-certificates && update-ca-certificates
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM python:3.12-slim
# Refresh the system certificate store when rebuilding this image.
RUN apt-get update \
 && apt-get install -y --no-install-recommends ca-certificates \
 && update-ca-certificates \
 && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=frontend /app/out ./out
COPY api ./api
COPY data ./data
RUN pip install --no-cache-dir fastapi==0.118.0 pydantic==2.11.9 uvicorn==0.37.0 'certifi>=2026.10.19'
EXPOSE 8000
CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8000"]

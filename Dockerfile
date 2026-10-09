FROM node:22-alpine AS frontend
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM python:3.12-slim
WORKDIR /app
COPY --from=frontend /app/out ./out
COPY api ./api
COPY data ./data
RUN pip install --no-cache-dir fastapi==0.118.0 pydantic==2.11.9 uvicorn==0.37.0
EXPOSE 8000
CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8000"]

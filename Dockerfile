FROM python:3.11-slim

WORKDIR /app

RUN pip install --no-cache-dir fastapi uvicorn yt-dlp requests pydantic

COPY backend/main.py main.py
COPY extracted_ui/ /app/frontend/

EXPOSE 10000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "10000"]

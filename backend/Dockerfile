FROM python:2.7.15
WORKDIR /code
COPY . .
ENV PORT 8080
EXPOSE 8080
RUN apt-get update && apt-get install -y git-core && pip install -r requirements.txt
ENTRYPOINT python whatsapp_web_backend.py

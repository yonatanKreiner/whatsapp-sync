FROM python:2.7.15
WORKDIR /code
COPY . .
ENV PORT 80
EXPOSE 80
RUN apt-get update && apt-get install -y git-core && pip install -r requirements.txt
CMD ["python", "whatsapp_web_backend.py"]

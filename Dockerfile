FROM python:3.8.1-buster
WORKDIR /usr/src/app
COPY requirements.txt requirements.txt

RUN python -m pip install --upgrade pip setuptools wheel
RUN pip install -r requirements.txt
RUN python -m spacy download en_core_web_sm
COPY main.py main.py
ENTRYPOINT ["python"]

CMD ["main.py"]
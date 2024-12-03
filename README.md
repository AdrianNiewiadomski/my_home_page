To run the app locally

1. Install Virtualenvwrapper

2. Create virtualenv with Virtualenvwrapper with:
> mkvirtualenv my-website-with-algorithms --python=/usr/bin/python3.8

3. Enable virtualenv:
> workon my-website-with-algorithms

4. Install required packages:
> pip install -r requirements.txt 

5. Run the app:
> export FLASK_APP=app.py
> export FLASK_ENV=development
> flask run
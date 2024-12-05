import os
import pathlib
import random

from flask import Flask, render_template, url_for, request

app = Flask(__name__)
PATH = str(pathlib.Path(__file__).parent.resolve())


@app.route("/")
@app.route("/home")
def display_index():
    return render_template("index.html")


@app.route("/o_mnie")
def display_about():
    return render_template("o_mnie.html")


@app.route("/projekty")
def display_projects():
    number = request.args.get('number')
    if number is None:
        number = random.randint(1, 3)
    else:
        number = int(number)
    
    names = [
        'Tworzenie przekrojów obiektów 3D',
        'Korekta wektorów normalnych obiektów 3D',
        'Gra wąż napisana w JavaScript'
    ]
    
    files = [
        f'img/{number}/very_large.png',
        f'img/{number}/large.png',
        f'img/{number}/medium.png',
        f'img/{number}/small.png'
    ]
    
    urls = [url_for('static', filename=file) for file in files] 
    pictures = [
        f'<source media="(min-width: 800px)" srcset="{urls[0]}">',
        f'<source media="(min-width: 500px)" srcset="{urls[1]}">',
        f'<source media="(min-width: 400px)" srcset="{urls[2]}">',
        f'<img src="{urls[3]}">'
    ]
    
    links = ["cross_section", "model_corrector", "snake"]
    
    return render_template("projekty.html", number=number, names=names, 
        pictures=pictures, links=links)


@app.route("/kontakt")
def display_contact():
    return render_template("kontakt.html")


@app.route("/algorithms")
def display_algorithms():
    return render_template("algorithms_view.html")


@app.route("/cross_section")
def display_cross_section_view():
    models_path = PATH + url_for("static", filename='_models')
    files = os.listdir(models_path)
    return render_template("cross_section_view.html", files=files)


@app.route("/model_corrector")
@app.route("/model_corrector_view/<chosen_file>")
def display_corrector_view(chosen_file: str = "text.txt"):
    models_path = PATH + url_for("static", filename="_incorrect_models")
    files = os.listdir(models_path)
    return render_template("model_corrector_view.html", files=files,
        chosen_file=chosen_file)


@app.route("/snake")
def display_snake():
    return render_template("snake.html")

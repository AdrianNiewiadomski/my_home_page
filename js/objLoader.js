function getFileName(){
    var url = window.location.href;
    var path = url.substr(0, url.lastIndexOf('/'));
    var name = path + '/3d_models/litera_L.txt';
    return name;
}

function loadModel(){
    var name = getFileName();
    console.log(name);

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {

            var tekst = this.responseText;
            console.log(tekst);

            modele = wczytajObiekt(tekst, nazwa);
            // dodajdoSceny(modele);
        }
    };

    xhttp.open("GET", name, true);
    xhttp.send();
}

function wczytajObiekt(linia, nazwa){
    var linijki = linia.split("\n");

    var model;
    //-------------------------------------- ponizsze oproznia tabele i wpisuje nowe wartosci ---------------------------
    var wierzcholki = [];
    var sciany = [];
    var min=[];
    var max=[];
    min[0]=Number.POSITIVE_INFINITY;
    min[1]=Number.POSITIVE_INFINITY;
    min[2]=Number.POSITIVE_INFINITY;
    max[0]=Number.NEGATIVE_INFINITY;
    max[1]=Number.NEGATIVE_INFINITY;
    max[2]=Number.NEGATIVE_INFINITY;

    for(var i=0;i<linijki.length;i++){

        if((linijki[i].charAt(0) == 'v') && (linijki[i].charAt(1) == ' ')){

            var wierzcholek=[];
            var text = linijki[i].replace(/  /g,' ');

            wierzcholek[0]=parseFloat(text.split(" ")[1]);
            wierzcholek[1]=parseFloat(text.split(" ")[2]);
            wierzcholek[2]=parseFloat(text.split(" ")[3]);

            if(wierzcholek[0]>max[0]) max[0]=wierzcholek[0];
            if(wierzcholek[1]>max[1]) max[1]=wierzcholek[1];
            if(wierzcholek[2]>max[2]) max[2]=wierzcholek[2];
            if(wierzcholek[0]<min[0]) min[0]=wierzcholek[0];
            if(wierzcholek[1]<min[1]) min[1]=wierzcholek[1];
            if(wierzcholek[2]<min[2]) min[2]=wierzcholek[2];

            wierzcholki.push(wierzcholek);
        }
        if((linijki[i].charAt(0) == 'f') && (linijki[i].charAt(1) == ' ')){

            var text = linijki[i].replace(/  /g,' ');
            var sciana = [];

            sciana[0]=parseInt(text.split(" ")[1]);
            sciana[1]=parseInt(text.split(" ")[2]);
            sciana[2]=parseInt(text.split(" ")[3]);

            sciany.push(sciana);
        }
    }

    var model = [];
    model.push(new Model(nazwa, 999, "#ffffff", wierzcholki, sciany, min, max));
    return model;
}
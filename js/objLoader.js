// jshint esversion: 6

class OBJLoader {

    static getFileName(){
        var url = window.location.href;
        var path = url.substr(0, url.lastIndexOf('/'));
        var name = path + '/3d_models/litera_L.txt';
        return name;
    }
    
    static loadModel(scene) {
        var name = this.getFileName();
        console.log(name);
    
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
    
                var tekst = this.responseText;
                console.log(tekst);


                Model.createModelFromText(tekst);
                // modele = wczytajObiekt(tekst, nazwa);
                // dodajdoSceny(modele);
            }
        };
    
        xhttp.open("GET", name, true);
        xhttp.send();
    }    
}

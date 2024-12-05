var graWToku = false;
var kierunek = 'p';
var polozenie = [];
polozenie[0] = 44;
polozenie[1] = 43;
polozenie[2] = 42;
var polozenieOwocu = 0;
var timer = 0;
var punkty = 0;
var trudnosc = 2;

function ustawTrudnosc(){
    var trud;
    if(trudnosc == 1){
        trud = 'latwy';
    } else if (trudnosc = 2) {
        trud = 'sredni';
    } else {
        trud = 'trudny';
    }
    document.getElementById('trudnosc').value = trud;
}

function init(){
    var kod = "";
    var nr = 0;
    for(var i=0; i<10; i++){
        for(var j=0; j<10; j++){
            nr = 10*i + j +1;
            kod += '<div id="'+nr+'" class="pole"></div>'
        }
        kod +='<div class="clear"></div>';
    }
    document.getElementById('plansza').innerHTML = kod;

    ustawTrudnosc();

    for (var i=1; i<polozenie.length; i++){
        document.getElementById(polozenie[i]).classList.add("waz");
    }
    document.getElementById(polozenie[0]).classList.add("glowa");
}

function dodajOwoc(){
    polozenieOwocu = Math.floor(Math.random()*100)+1;
    while(polozenie.includes(polozenieOwocu)){
        polozenieOwocu = Math.floor(Math.random()*100)+1;
    }
    document.getElementById(polozenieOwocu).classList.add("owoc");
}

function zmienTrudnosc(){
    var trud = document.getElementById('trudnosc').value;
    if(trud=='latwy'){
        trudnosc = 1;
    } else if (trud=='sredni') {
        trudnosc = 2;
    } else {
        trudnosc = 3;
    }
}

function koniecGry(){
    clearTimeout(timer);
    alert("Koniec gry!");

    for (var i=1; i<polozenie.length; i++){
        document.getElementById(polozenie[i]).classList.remove("waz");
    }
    document.getElementById(polozenie[0]).classList.remove("glowa");

    document.getElementById(polozenieOwocu).classList.remove("owoc");
    polozenieOwocu = 0;
    graWToku = false;
    kierunek = 'p';
    polozenie = [];
    polozenie[0] = 44;
    polozenie[1] = 43;
    polozenie[2] = 42;
    for (var i=1; i<polozenie.length; i++){
        document.getElementById(polozenie[i]).classList.add("waz");
    }
    document.getElementById(polozenie[0]).classList.add("glowa");
    document.getElementById('start').innerHTML = 'Start';
    punkty = 0;
    document.getElementById('wynik').innerHTML = 'Wynik: 00';
    document.getElementById('trudnosc').disabled = false;
}

function sprawdzPozycje(){

    var koniec = false;

    if(polozenie[0]%10 == 0 && kierunek=='p'){
        koniec = true;
    } else if(polozenie[0]%10 == 1 && kierunek=='l'){
        koniec = true;
    } else if(polozenie[0]<=10 && kierunek=='g'){
        koniec = true;
    } else if(polozenie[0]>90 && kierunek=='d'){
        koniec = true;
    }

    if(koniec){
        koniecGry();
        return koniec;
    }
    return koniec;
}

function idz(){

    if(!sprawdzPozycje()){
        // console.log('dzialam');

        var nastepnaPozycja;
        if(kierunek=='p'){
            nastepnaPozycja = polozenie[0]+1;
        } else if(kierunek=='l'){
            nastepnaPozycja = polozenie[0]-1;
        } else if(kierunek=='g'){
            nastepnaPozycja = polozenie[0]-10;
        } else {
            nastepnaPozycja = polozenie[0]+10;
        }
        // if (polozenie[0] == polozenieOwocu) {
        if (nastepnaPozycja == polozenieOwocu) {
            // console.log("nastepnaPozycja == polozenieOwocu");
            polozenie.unshift(polozenieOwocu);
            document.getElementById(polozenieOwocu).classList.remove("owoc");
            document.getElementById(polozenieOwocu).classList.add("glowa");
            document.getElementById(polozenie[1]).classList.add("waz");
            document.getElementById(polozenie[1]).classList.remove("glowa");
            //document.getElementById(polozenie[polozenie.length-1]).classList.add("waz");
            punkty++;
            if(punkty<10){
                punkty = '0'+punkty;
            }
            document.getElementById('wynik').innerHTML = 'Wynik: '+ punkty;
            dodajOwoc();
            timer = setTimeout("idz()",1000/trudnosc);

        } else if (polozenie.includes(nastepnaPozycja)) {
            koniecGry();
        } else {
            document.getElementById(polozenie[polozenie.length-1]).classList.remove("waz");
            for (var i=polozenie.length-1; i>0; i--){
                polozenie[i]=polozenie[i-1];
            }
            // polozenie++;
            if(kierunek=='p'){
                polozenie[0]++;
            } else if (kierunek=='l') {
                polozenie[0]--;
            } else if (kierunek=='g') {
                polozenie[0] -= 10;
            } else if (kierunek=='d') {
                polozenie[0] += 10;
            }
            document.getElementById(polozenie[1]).classList.add("waz");
            document.getElementById(polozenie[1]).classList.remove("glowa");
            document.getElementById(polozenie[0]).classList.add("glowa");
            // setTimeout("idz()",1000);
            timer = setTimeout("idz()",1000/trudnosc);
        }
    }
}

function start(){
    // console.log('dzialam');
    graWToku = !graWToku;
    if(graWToku){

        if(polozenieOwocu == 0){
            dodajOwoc();
        }

        document.getElementById('start').innerHTML = 'Pauza';
        // document.getElementById(polozenie[0]).classList.add("waz");
        for (var i=0; i<polozenie.length; i++){
            document.getElementById(polozenie[i]).classList.add("waz");
        }
        document.getElementById(polozenie[0]).classList.add("glowa");
        // setTimeout("idz()",1000);
        timer = setTimeout("idz()",1000/trudnosc);
    } else {
        clearTimeout(timer);
        document.getElementById('start').innerHTML = 'Start';

    }
    document.getElementById('trudnosc').setAttribute("disabled", true);
}

function zmienKierunek(event) {
    // alert("zmienKierunek - dzialam");
    //console.log(event);
    var key = event.which || event.keyCode;
    if(key==38 && kierunek!='d'){
        kierunek = 'g';
    } else if (key==39 && kierunek!='l') {
        kierunek = 'p';
    } else if (key==40 && kierunek!='g') {
        kierunek = 'd';
    } else if (key==37 && kierunek!='p') {
        kierunek = 'l';
    }
    // console.log(kierunek);
}

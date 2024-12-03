function inicjujScene(){
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75,  window.innerWidth/window.innerHeight, 0.1, 1000);
    //renderer = new THREE.WebGLRenderer();
    renderer = new THREE.WebGLRenderer({canvas:document.getElementById("my_canvas"),antialias:true});
    renderer.localClippingEnabled = false;
    renderer.setClearColor(0x0f0f0f, 1);
    // renderer.setSize(window.innerWidth, window.innerHeight);
    // document.body.appendChild(renderer.domElement);
    canvas = document.getElementById("canvas");
    renderer.setSize(document.getElementById("canvas").offsetWidth, document.getElementById("canvas").offsetHeight);
    canvas.appendChild(renderer.domElement);

    dodajSwiatla();
    //wczytajDaneTekstowe('text.txt');
    camera.position.z = 3;

    controls = new THREE.TrackballControls( camera, renderer.domElement);

    //displayGUI();
}

function dodajSwiatla(){
    var light = new THREE.AmbientLight(0xffffff,0.5);
    scene.add(light);

    var light1 = new THREE.PointLight(0xff0000, 1);
    light1.position.set(10,10,-10);
    //model.scene.add(model.light1);
    camera.add( light1 );

    var light2 = new THREE.PointLight(0x00ff00, 1);
    light2.position.set(-10,10,-10);
    camera.add( light2 );

    var light3 = new THREE.PointLight(0x0000ff, 1);
    light3.position.set(-10,-10,-10);
    camera.add( light3 );

    var light4 = new THREE.PointLight(0xffff00, 1);
    light4.position.set(10,-10,-10);
    camera.add( light4 );

    scene.add(camera);
}

class Model{

    constructor(){                      //function Model(){
        this.nazwaModelu = "";
        //this.skrot = "";
        this.wierzcholki = [];
        this.max = [];
        this.min = [];
        this.sciany = [];
        this.wektoryNormalne = [];
        this.srodek = [0.0, 0.0, 0.0];
        this.srodkiScian = [];
        this.correction = true;
        //this.scene = new THREE.Scene();
        //this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
        //this.renderer = new THREE.WebGLRenderer({canvas:document.getElementById("my_canvas"),antialias:true});

        //this.controls = new THREE.TrackballControls( this.camera );
        //this.light1 = new THREE.PointLight(0xffffff, 1);
    }

    wczytajZServera(nazwa){    //this.wczytajZServera = function(nazwa) {
        // console.log("wczytajZServera()");
        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {

                model.usunZeSceny();

                model.nazwaModelu = nazwa.substring(nazwa.lastIndexOf("/")+1);
                // console.log("model.nazwaModelu = "+model.nazwaModelu);
                var tekst = this.responseText;
                model.wczytajObiekt(tekst);
                model.rysuj();
                model.wypiszWielkosci();
            }
        };
        xhttp.open("GET", nazwa, true);
        xhttp.send();
    }

    wczytajZServeraIPopraw(nazwa){    //this.wczytajZServera = function(nazwa) {
        // console.log("wczytajZServera()");
        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {

                model.usunZeSceny();

                model.nazwaModelu = nazwa.substring(nazwa.lastIndexOf("/")+1);
                // console.log("model.nazwaModelu = "+model.nazwaModelu);
                var tekst = this.responseText;
                model.wczytajObiekt(tekst);
                model.wyznaczPierwszyWektorNormalny();
                model.wyznaczReszteWektorow();
                model.poprawSciany();
                model.rysuj();
                model.wypiszWielkosci();
            }
        };
        xhttp.open("GET", nazwa, true);
        xhttp.send();
    }

    usunZeSceny(){
        model.nazwaModelu = "";
        model.skrot = "";
        model.wierzcholki = [];
        model.max = [];
        model.min = [];
        model.sciany = [];
        model.wektoryNormalne = [];
        model.srodek = [0.0, 0.0, 0.0];
        model.srodkiScian = [];

        //console.log(model.scene);
        for(var i=0; i<scene.children.length;i++){

            if(scene.children[i].type=="Mesh"){
                //console.log(model.scene.children[i]);
                var selectedObject = scene.children[i];//scene.getObjectByName(scene.children[i].name);
                //console.log(selectedObject);
                scene.remove( selectedObject );
            }

        }
        //console.log(model.scene);
    }

    wczytajObiekt(linia){    //function wczytajObiekt(linia){
        //console.log("wczytajObiekt(linia)");
            // console.log("linia");
            // console.log(linia);
        var linijki = linia.split("\n");

            //-------------------------------------- ponizsze oproznia tabele ---------------------------
        model.wierzcholki = [];
        model.max = [];
        model.max[0]=Number.NEGATIVE_INFINITY;
        model.max[1]=Number.NEGATIVE_INFINITY;
        model.max[2]=Number.NEGATIVE_INFINITY;
        model.min = [];
        model.min[0]=Number.POSITIVE_INFINITY;
        model.min[1]=Number.POSITIVE_INFINITY;
        model.min[2]=Number.POSITIVE_INFINITY;
        model.sciany = [];
        model.wektoryNormalne = [];

        for(var i=0;i<linijki.length;i++){
            //console.log(linijki[i]);

            if((linijki[i].charAt(0) == 'v') && (linijki[i].charAt(1) == ' ')){
                //var indeksPoczatku = linijki[i].indexOf("  ");
                var text = linijki[i].replace(/  /g,' ');

                var wierzcholek=[];
                // wierzcholek[0]=parseFloat(linijki[i].substr(indeksPoczatku+1).split("  ")[0]);
                // wierzcholek[1]=parseFloat(linijki[i].substr(indeksPoczatku+1).split("  ")[1]);
                // wierzcholek[2]=parseFloat(linijki[i].substr(indeksPoczatku+1).split("  ")[2]);
                wierzcholek[0]=parseFloat(text.split(" ")[1]);
                wierzcholek[1]=parseFloat(text.split(" ")[2]);
                wierzcholek[2]=parseFloat(text.split(" ")[3]);

                if(wierzcholek[0]>model.max[0]) model.max[0]=wierzcholek[0];
                if(wierzcholek[1]>model.max[1]) model.max[1]=wierzcholek[1];
                if(wierzcholek[2]>model.max[2]) model.max[2]=wierzcholek[2];
                if(wierzcholek[0]<model.min[0]) model.min[0]=wierzcholek[0];
                if(wierzcholek[1]<model.min[1]) model.min[1]=wierzcholek[1];
                if(wierzcholek[2]<model.min[2]) model.min[2]=wierzcholek[2];

                model.wierzcholki.push(wierzcholek);
            }
            if((linijki[i].charAt(0) == 'f') && (linijki[i].charAt(1) == ' ')){
                //var indeksPoczatku = linijki[i].indexOf("  ");
                var text = linijki[i].replace(/  /g,' ');
                var sciana = [];
                // sciana[0]=parseFloat(linijki[i].substr(indeksPoczatku+1).split("  ")[0]);
                // sciana[1]=parseFloat(linijki[i].substr(indeksPoczatku+1).split("  ")[1]);
                // sciana[2]=parseFloat(linijki[i].substr(indeksPoczatku+1).split("  ")[2]);
                sciana[0]=parseInt(text.split(" ")[1]);
                sciana[1]=parseInt(text.split(" ")[2]);
                sciana[2]=parseInt(text.split(" ")[3]);
                model.sciany.push(sciana);
            }
            if((linijki[i].charAt(0) == 'v') && (linijki[i].charAt(1) == 'n') && (linijki[i].charAt(2) == ' ')){
                var indeksPoczatku = linijki[i].indexOf("  ");

                var wektorNormalny = [];
                wektorNormalny[0]=parseFloat(linijki[i].substr(indeksPoczatku+1).split("  ")[0]);
                wektorNormalny[1]=parseFloat(linijki[i].substr(indeksPoczatku+1).split("  ")[1]);
                wektorNormalny[2]=parseFloat(linijki[i].substr(indeksPoczatku+1).split("  ")[2]);
                model.wektoryNormalne.push(wektorNormalny);
            }
        }

        // console.log("wierzcholki");
        // console.log(model.wierzcholki);
        //
        // console.log("sciany");
        // console.log(model.sciany);
        //
        // console.log("wektoryNormalne");
        // console.log(model.wektoryNormalne);
    }

    wyznaczPierwszyWektorNormalny(){    //function wyznaczPierwszyWektorNormalny(){
        model.zerujWektory();
        //console.log("wektory normalne po zerowaniu");console.log(model.wektoryNormalne);

        model.wyznaczSrodek(0);
        //console.log("srodek = "+model.srodek);
        //document.getElementById("Srodek").innerHTML = "<h2>Srodek obiektu</h2>" + srodek;

        model.wyznaczSrodkiScian();
        //console.log(model.srodkiScian);

        var najdalsza = model.wyznaczNajdalszaSciane(0);
        //console.log("Najdalsza sciana to "+najdalsza);
        // //document.getElementById("Najdalsza").innerHTML = "<h2>Najdalsza sciana</h2>" + najdalsza;
        var temp = model.sciany[0];
        model.sciany[0] = model.sciany[najdalsza];
        model.sciany[najdalsza] = temp;
        //console.log("sciany po zamianie");
        //console.log(model.sciany);

        temp = model.srodkiScian[0];
        model.srodkiScian[0] = model.srodkiScian[najdalsza];
        model.srodkiScian[najdalsza] = temp;


        model.wektoryNormalne[0] = model.wyznaczWektorNormalny(0);
        //console.log("model.wektoryNormalne[0]="+model.wektoryNormalne[0]);
        model.normujWektor(0);
        //console.log("model.wektoryNormalne[0] po unormowaniu="+model.wektoryNormalne[0]);

        model.wektoryNormalne[0] = model.sprawdzZwrotWektora(0);
        //console.log("model.wektoryNormalne[0] po unormowaniu i tescie zwrotu="+model.wektoryNormalne[0]);
    }

    zerujWektory(){
        var i;
        for(i=0; i<model.sciany.length; i++){
            model.wektoryNormalne[i]=[0, 0, 0];
            //wektoryNormalne[i]=[NaN, NaN, NaN];
        }
    }

    wyznaczSrodek(nr){      //function wyznaczSrodek(nr){
        //var i;
        for(var i=nr;i<model.wierzcholki.length;i++){
            //console.log(model.wierzcholki[i]);
            model.srodek[0]+=model.wierzcholki[i][0];
            model.srodek[1]+=model.wierzcholki[i][1];
            model.srodek[2]+=model.wierzcholki[i][2];
        }
        model.srodek[0]/=model.wierzcholki.length;
        model.srodek[1]/=model.wierzcholki.length;
        model.srodek[2]/=model.wierzcholki.length;
    }

    wyznaczSrodkiScian(){       //function wyznaczSrodkiScian(){
        var wierzcholek1;
        var wierzcholek2;
        var wierzcholek3;

        var i;
        for(i=0; i<model.sciany.length; i++){
            wierzcholek1 = model.sciany[i][0] -1;
            wierzcholek2 = model.sciany[i][1] -1;
            wierzcholek3 = model.sciany[i][2] -1;

            var srodekSciany = [0.0, 0.0, 0.0];
            srodekSciany[0] = (model.wierzcholki[wierzcholek1][0] + model.wierzcholki[wierzcholek2][0] + model.wierzcholki[wierzcholek3][0])/3;
            srodekSciany[1] = (model.wierzcholki[wierzcholek1][1] + model.wierzcholki[wierzcholek2][1] + model.wierzcholki[wierzcholek3][1])/3;
            srodekSciany[2] = (model.wierzcholki[wierzcholek1][2] + model.wierzcholki[wierzcholek2][2] + model.wierzcholki[wierzcholek3][2])/3;
            model.srodkiScian.push(srodekSciany);
        }
    }

    wyznaczNajdalszaSciane(nr){     //function wyznaczNajdalszaSciane(nr){
        var numer_najdalszej_sciany = nr;
        var odl = [0.0, 0.0, 0.0];
        var odlegloscOdSrodka = 0;
        var i;
        for(i=nr; i<model.sciany.length; i++){
                //if(wektoryNormalne[i][0]==0 && wektoryNormalne[i][1]==0 && wektoryNormalne[i][2]==0){
                    // if(typeof wektoryNormalne[i] !== 'undefined'){
                    //     if(isNaN(wektoryNormalne[i][0]) && isNaN(wektoryNormalne[i][1]) && isNaN(wektoryNormalne[i][2])){
                    odl[0] = model.srodkiScian[i][0] - model.srodek[0];
                    odl[1] = model.srodkiScian[i][1] - model.srodek[1];
                    odl[2] = model.srodkiScian[i][2] - model.srodek[2];

                    if(odlegloscOdSrodka < Math.sqrt((odl[0]*odl[0])+(odl[1]*odl[1])+(odl[2]*odl[2]))){

                        odlegloscOdSrodka = Math.sqrt((odl[0]*odl[0])+(odl[1]*odl[1])+(odl[2]*odl[2]));
                        numer_najdalszej_sciany = i;
                    }
                //}
            //}

        }
        return numer_najdalszej_sciany;    //--------------------------------------------- numer_najdalszej_sciany to int
    }

    wyznaczWektorNormalny(nrWektora){       //function wyznaczWektorNormalny(nrWektora){                        //modyfikowalem za wikipedia (artykul o plaszczyznie -> Płaszczyzna przechodząca przez trzy punkty)
        var wierzcholek1 = model.wierzcholki[model.sciany[nrWektora][0] -1];
        var wierzcholek2 = model.wierzcholki[model.sciany[nrWektora][1] -1];
        var wierzcholek3 = model.wierzcholki[model.sciany[nrWektora][2] -1];

        var u = [];
        var v = [];
        u[0] = wierzcholek2[0]-wierzcholek1[0];
        u[1] = wierzcholek2[1]-wierzcholek1[1];
        u[2] = wierzcholek2[2]-wierzcholek1[2];

        v[0] = wierzcholek3[0]-wierzcholek1[0];
        v[1] = wierzcholek3[1]-wierzcholek1[1];
        v[2] = wierzcholek3[2]-wierzcholek1[2];

        var n = [];
        n[0] = (u[1]*v[2])-(u[2]*v[1]);
        n[1] = (u[2]*v[0])-(u[0]*v[2]);
        n[2] = (u[0]*v[1])-(u[1]*v[0]);

        if(n[0]==0 && n[1]==0 && n[2]==0){
            // console.log("wyznaczWektorNormalny("+nrWektora+") - wektor = 0!");
            // console.log("sciana: ");
            // console.log("sciana wiercholek 1: " + model.sciany[nrWektora][0]-1);
            // console.log("sciana wiercholek 2: " + model.sciany[nrWektora][1]-1);
            // console.log("sciana wiercholek 3: " + model.sciany[nrWektora][2]-1);
            // console.log("wierzcholki: " + model.sciany[nrWektora]);
            // console.log("wierzcholki 1: " + model.wierzcholki[model.sciany[nrWektora][0] -1]);
            // console.log("wierzcholki 2: " + model.wierzcholki[model.sciany[nrWektora][1] -1]);
            // console.log("wierzcholki 3: " + model.wierzcholki[model.sciany[nrWektora][2] -1]);
            // console.log("____________________________________________________");
        }

        return n;
    }

    normujWektor(nrWektora){            //function normujWektor(nrWektora){

        var dlugosc = model.wyznaczDlugosc(model.wektoryNormalne[nrWektora]);

        model.wektoryNormalne[nrWektora][0] = model.wektoryNormalne[nrWektora][0]/dlugosc;
        model.wektoryNormalne[nrWektora][1] = model.wektoryNormalne[nrWektora][1]/dlugosc;
        model.wektoryNormalne[nrWektora][2] = model.wektoryNormalne[nrWektora][2]/dlugosc;
    }

    wyznaczDlugosc(wektor){             //function wyznaczDlugosc(wektor){

        var dlugosc;
        if(wektor[0]==0 && wektor[1]==0 && wektor[2]==0){
            //console.log("wyznaczDlugosc(wektor) - wektor = 0!");
            dlugosc =1;
        }
        else{
            dlugosc = Math.sqrt((wektor[0]*wektor[0]) + (wektor[1]*wektor[1]) + (wektor[2]*wektor[2]));
        }

        return dlugosc;
    }

    sprawdzZwrotWektora(nrWektora){            //function sprawdzOrientacjeWektora(nrWektora){
        var wektor = model.wektoryNormalne[nrWektora]

        var testZwrotu = [];
        testZwrotu[0] = model.srodkiScian[nrWektora][0] - model.srodek[0];
        testZwrotu[1] = model.srodkiScian[nrWektora][1] - model.srodek[1];
        testZwrotu[2] = model.srodkiScian[nrWektora][2] - model.srodek[2];

        if(((wektor[0]*testZwrotu[0])+(wektor[1]*testZwrotu[1])+(wektor[2]*testZwrotu[2])) < 0){
            wektor[0] = -wektor[0];
            wektor[1] = -wektor[1];
            wektor[2] = -wektor[2];
        }

        return wektor;
    }

    //wez sciane (poczynajac od poczatku) z policzonym wektorem i sprawdz czy sasiaduje z niepoliczonymi. Jesli tak to policz je. Powtarzaj az wszystkie beda policzone
    wyznaczReszteWektorow(){                    //function wyznaczReszteWektorow(){
        var wyznaczonychSasiadow = new Array(model.sciany.length).fill(0);//[];

        var i,j;
        // for(i=0;i<model.sciany.length;i++){
        //     wyznaczonychSasiadow[i] = 0;
        // }
        var iloscWyznaczonych = 1;

        while(iloscWyznaczonych<model.sciany.length){
            var flaga=0;

            for(i=0; i<model.sciany.length; i++){//for(i=iloscWyznaczonych-1; i<sciany.length; i++){
                while(wyznaczonychSasiadow[i]>2){
                    i++;
                }

                if(!(model.wektoryNormalne[i][0]==0 && model.wektoryNormalne[i][1]==0 && model.wektoryNormalne[i][2]==0)){
                //if(wyznaczone[i] == 1){
                    for(j=iloscWyznaczonych; j<model.sciany.length; j++){

                            if((model.sciany[i][0] == model.sciany[j][0])&&(model.sciany[i][1] == model.sciany[j][1])&&(model.sciany[i][2] == model.sciany[j][2])){
                            }else{
                                if((model.sciany[i][0] == model.sciany[j][0])||(model.sciany[i][0] == model.sciany[j][1])||(model.sciany[i][0] == model.sciany[j][2])){
                                    if((model.sciany[i][1] == model.sciany[j][0])||(model.sciany[i][1] == model.sciany[j][1])||(model.sciany[i][1] == model.sciany[j][2])){
                                        //if(isNaN(wektoryNormalne[j][0])){
                                        if(model.wektoryNormalne[j][0]==0 && model.wektoryNormalne[j][1]==0 && model.wektoryNormalne[j][2]==0){
                                        //if(wyznaczone[j]==0){
                                            //wektoryNormalne[j] = wyznaczWektorNormalny(j);
                                            model.wyznaczDrugiWektor(i, j);

                                            model.zamienKolejnosc(j, iloscWyznaczonych);

                                            //wyznaczone[j]=1;
                                            iloscWyznaczonych++;
                                            wyznaczonychSasiadow[i]++;
                                            flaga =1;
                                        }
                                    }
                                }

                                if((model.sciany[i][1] == model.sciany[j][0])||(model.sciany[i][1] == model.sciany[j][1])||(model.sciany[i][1] == model.sciany[j][2])){
                                    if((model.sciany[i][2] == model.sciany[j][0])||(model.sciany[i][2] == model.sciany[j][1])||(model.sciany[i][2] == model.sciany[j][2])){
                                        //if(isNaN(wektoryNormalne[j][0])){
                                        if(model.wektoryNormalne[j][0]==0 && model.wektoryNormalne[j][1]==0 && model.wektoryNormalne[j][2]==0){
                                        //if(wyznaczone[j]==0){
                                            //wektoryNormalne[j] = wyznaczWektorNormalny(j);
                                            model.wyznaczDrugiWektor(i, j);

                                            model.zamienKolejnosc(j, iloscWyznaczonych);

                                            //wyznaczone[j]=1;
                                            iloscWyznaczonych++;
                                            wyznaczonychSasiadow[i]++;
                                            flaga =1;
                                        }
                                    }
                                }

                                if((model.sciany[i][2] == model.sciany[j][0])||(model.sciany[i][2] == model.sciany[j][1])||(model.sciany[i][2] == model.sciany[j][2])){
                                    if((model.sciany[i][0] == model.sciany[j][0])||(model.sciany[i][0] == model.sciany[j][1])||(model.sciany[i][0] == model.sciany[j][2])){
                                        //if(isNaN(wektoryNormalne[j][0])){
                                        if(model.wektoryNormalne[j][0]==0 && model.wektoryNormalne[j][1]==0 && model.wektoryNormalne[j][2]==0){
                                        //if(wyznaczone[j]==0){
                                            //wektoryNormalne[j] = wyznaczWektorNormalny(j);
                                            model.wyznaczDrugiWektor(i, j);

                                            model.zamienKolejnosc(j, iloscWyznaczonych);

                                            //wyznaczone[j]=1;
                                            iloscWyznaczonych++;
                                            wyznaczonychSasiadow[i]++;
                                            flaga =1;
                                        }
                                    }
                                }
                            }
                    }
                }
            }

            if(flaga==0){
                model.wyznaczSrodek(iloscWyznaczonych);
                var najdalsza = model.wyznaczNajdalszaSciane(iloscWyznaczonych);
                //console.log("Wyznaczona najdalsza sciana:" + najdalsza);

                //console.log("numery wierzcholkow = ["+ sciany[najdalsza][0] -1+", "+sciany[najdalsza][1] -1+", "+sciany[najdalsza][2] -1+"]")
                //console.log("numery wierzcholkow:");
                //console.log(model.sciany[najdalsza][0] - 1);
                //console.log(model.sciany[najdalsza][1] - 1);
                //console.log(model.sciany[najdalsza][2] - 1);

                model.wektoryNormalne[najdalsza] = model.wyznaczWektorNormalny(najdalsza);
                //console.log("wektor normalny = " + model.wektoryNormalne[najdalsza]);
                model.normujWektor(najdalsza);
                //wektoryNormalne[najdalsza] = sprawdzOrientacjeWektora(wektoryNormalne[najdalsza]);
                model.wektoryNormalne[najdalsza] = model.sprawdzZwrotWektora(najdalsza);
                model.zamienKolejnosc(najdalsza, iloscWyznaczonych);

                //wyznaczone[najdalsza]=1;
                iloscWyznaczonych++;
                //flaga =1;

                //console.log("break");
                //break;

                //console.log("____________________________________________________");
            }
        }
        //console.log(model.wektoryNormalne);
    }

    wyznaczDrugiWektor(pierwszy, drugi){            //function wyznaczDrugiWektor(pierwszy, drugi){

        var plasczyzna1 = model.wyznaczPlaszczyzne(pierwszy);
        var plasczyzna2 = model.wyznaczPlaszczyzne(drugi);

        if((plasczyzna1[0] == plasczyzna2[0])&&(plasczyzna1[1] == plasczyzna2[1])&&(plasczyzna1[2] == plasczyzna2[2])){//&&(plasczyzna1[3] == plasczyzna2[3])){
            // console.log("sciany[pierwszy]: "+sciany[pierwszy]+", sciany[drugi]: "+sciany[drugi]);
            // console.log("sciany sa rownolegle");
            // console.log("____________________________________________________");
            model.wektoryNormalne[drugi] = model.wektoryNormalne[pierwszy];

        }else if((plasczyzna1[0] == -plasczyzna2[0])&&(plasczyzna1[1] == -plasczyzna2[1])&&(plasczyzna1[2] == -plasczyzna2[2])){//&&(plasczyzna1[3] == -plasczyzna2[3])){

                // console.log("sciany[pierwszy]: "+sciany[pierwszy]+", sciany[drugi]: "+sciany[drugi]);
                // console.log("sciany sa rownolegle");
                // console.log("____________________________________________________");
                model.wektoryNormalne[drugi] = model.wektoryNormalne[pierwszy];

        }else{
            // console.log("sciany[pierwszy]: "+sciany[pierwszy]+", sciany[drugi]: "+sciany[drugi]);
            // console.log("sciany nie sa rownolegle");
            // console.log("____________________________________________________");
            model.wektoryNormalne[drugi] = model.wyznaczWektorNormalny(drugi);
            model.normujWektor(drugi);
            model.wektoryNormalne[drugi] = model.wnioskujWektorZCzworoscianu(pierwszy,drugi);
        }
    }

    wyznaczPlaszczyzne(nr){                         //function wyznaczPlaszczyzne(nr){
        //console.log("wyznaczPlaszczyzne("+nr+")");

        var wektorNormalny = model.wyznaczWektorNormalny(nr);
        var dlugosc = model.wyznaczDlugosc(wektorNormalny);
        wektorNormalny[0] = wektorNormalny[0]/dlugosc;
        wektorNormalny[1] = wektorNormalny[1]/dlugosc;
        wektorNormalny[2] = wektorNormalny[2]/dlugosc;

        if(isNaN(wektorNormalny[2])){
            //console.log("Blad! - wyznaczPlaszczyzne(nr)");
            //console.log("wektor normalny: "+ wektorNormalny);
            //console.log("wierzcholek1: "+ model.wierzcholki[sciany[nr][0] -1]);
            //console.log("wierzcholek2: "+ model.wierzcholki[sciany[nr][1] -1]);
            //console.log("wierzcholek3: "+ model.wierzcholki[sciany[nr][2] -1]);

            //console.log("sciany1: "+ model.sciany[nr][0] -1);
            //console.log("sciany2: "+ model.sciany[nr][1] -1);
            //console.log("sciany3: "+ model.sciany[nr][2] -1);
        }

        return wektorNormalny;
    }

    wnioskujWektorZCzworoscianu(s1, s2){            //function wnioskujWektorZCzworoscianu(s1, s2){
        var drugiWektor = model.wyznaczWektorNormalny(s2);
        var dlugosc = model.wyznaczDlugosc(drugiWektor);
        drugiWektor[0] /= dlugosc;
        drugiWektor[1] /= dlugosc;
        drugiWektor[2] /= dlugosc;

        if(isNaN(drugiWektor[2])){
            //console.log("\tBlad! - wnioskujWektorZCzworoscianu");
            //console.log("\t"+drugiWektor);
        }

        var srodekSciany1 = model.srodkiScian[s1];
        var srodekSciany2 = model.srodkiScian[s2];

        // var srodekCzworoscianu1 = [];                                     //to nie jest srodek czworoscianu ale obliczenia są szybsze
        // srodekCzworoscianu1[0] = (srodekSciany1[0]+srodekSciany2[0])/2;
        // srodekCzworoscianu1[1] = (srodekSciany1[1]+srodekSciany2[1])/2;
        // srodekCzworoscianu1[2] = (srodekSciany1[2]+srodekSciany2[2])/2;
        // console.log("srodek1: " + srodekCzworoscianu1);

        var srodekCzworoscianu = [];
        var w1 = model.wierzcholki[model.sciany[s1][0]-1];
        var w2 = model.wierzcholki[model.sciany[s1][1]-1];
        var w3 = model.wierzcholki[model.sciany[s1][2]-1];

        var w4 = [];

        if((model.sciany[s1][0]!=model.sciany[s2][0])&&(model.sciany[s1][1]!=model.sciany[s2][0])&&(model.sciany[s1][2]!=model.sciany[s2][0])){
            w4 = model.wierzcholki[model.sciany[s2][0]-1];
        }else if((model.sciany[s1][0]!=model.sciany[s2][1])&&(model.sciany[s1][1]!=model.sciany[s2][1])&&(model.sciany[s1][2]!=model.sciany[s2][1])){
            w4 = model.wierzcholki[model.sciany[s2][1]-1];
        }else{
            w4 = model.wierzcholki[model.sciany[s2][2]-1];
        }

        srodekCzworoscianu[0] = (w1[0]+w2[0]+w3[0]+w4[0])/4;
        srodekCzworoscianu[1] = (w1[1]+w2[1]+w3[1]+w4[1])/4;
        srodekCzworoscianu[2] = (w1[2]+w2[2]+w3[2]+w4[2])/4;

        var test1 = [];
        test1[0] = srodekCzworoscianu[0] - srodekSciany1[0];
        test1[1] = srodekCzworoscianu[1] - srodekSciany1[1];
        test1[2] = srodekCzworoscianu[2] - srodekSciany1[2];
        var test2 = [];
        test2[0] = srodekCzworoscianu[0] - srodekSciany2[0];
        test2[1] = srodekCzworoscianu[1] - srodekSciany2[1];
        test2[2] = srodekCzworoscianu[2] - srodekSciany2[2];

        if( ( (test1[0]*model.wektoryNormalne[s1][0])+(test1[1]*model.wektoryNormalne[s1][1])+(test1[2]*model.wektoryNormalne[s1][2]) > 0)
        && ( (test2[0]*drugiWektor[0])+(test2[1]*drugiWektor[1])+(test2[2]*drugiWektor[2]) < 0) ){
            //console.log("odwracam 2 wektor do srodka");
            drugiWektor[0]=-drugiWektor[0];
            drugiWektor[1]=-drugiWektor[1];
            drugiWektor[2]=-drugiWektor[2];
        }else if( ( (test1[0]*model.wektoryNormalne[s1][0])+(test1[1]*model.wektoryNormalne[s1][1])+(test1[2]*model.wektoryNormalne[s1][2]) < 0)
        && ( (test2[0]*drugiWektor[0])+(test2[1]*drugiWektor[1])+(test2[2]*drugiWektor[2]) > 0) ){
            //console.log("odwracam 2 wektor na zewnatrz");
            drugiWektor[0]=-drugiWektor[0];
            drugiWektor[1]=-drugiWektor[1];
            drugiWektor[2]=-drugiWektor[2];
        }

        return drugiWektor;
    }

    zamienKolejnosc(wyznaczony, niewyznaczony){         //function zamienKolejnosc(wyznaczony, niewyznaczony){
        var temp = model.sciany[niewyznaczony];
        model.sciany[niewyznaczony] = model.sciany[wyznaczony];
        model.sciany[wyznaczony] = temp;
        //document.getElementById("ScianyPoZamianie").innerHTML = "<h2>Sciany po zamianie</h2>" + wypisz(sciany);

        temp = model.srodkiScian[niewyznaczony];
        model.srodkiScian[niewyznaczony] = model.srodkiScian[wyznaczony];
        model.srodkiScian[wyznaczony] = temp;
        //document.getElementById("SrodkiScian").innerHTML = "<h2>Srodki scian</h2>" + wypisz(srodkiScian);

        temp = model.wektoryNormalne[niewyznaczony];
        model.wektoryNormalne[niewyznaczony] = model.wektoryNormalne[wyznaczony];
        model.wektoryNormalne[wyznaczony] = temp;
        //**********//document.getElementById("wektoryNormalne").innerHTML = "<h2>Wektory Normalne</h2>" + wypisz(wektoryNormalne);
    }

    poprawSciany(){                                 //function poprawSciany(){
        //console.log("poprawSciany()")
        var i;
        for(i=0; i<model.sciany.length; i++){
            var wektor = [];

            wektor = model.wyznaczWektorNormalny(i);
            var dlugosc = model.wyznaczDlugosc(wektor);
            wektor[0] /= dlugosc;
            wektor[1] /= dlugosc;
            wektor[2] /= dlugosc;

            if((model.wektoryNormalne[i][0]!=wektor[0])||(model.wektoryNormalne[i][1]!=wektor[1])||(model.wektoryNormalne[i][2]!=wektor[2])){
                //console.log("sciana "+i+": "+sciany[i]+" jest bledna - poprawiam kolejnosc wierzcolkow");
                var temp = model.sciany[i][1];
                model.sciany[i][1] = model.sciany[i][2];
                model.sciany[i][2] = temp;
            }
        }

        //document.getElementById("poprawioneSciany").innerHTML = "<h2>Sciany poprawione</h2>" + wypisz(sciany);
    }

    wyznaczProporcje(){
        var proporcje = [];
        var x = model.max[0]-model.min[0];
        var y = model.max[1]-model.min[1];
        var z = model.max[2]-model.min[2];

        var max = x;
        if(y>max) max=y;
        if(z>max) max=z;

        proporcje[0] = x/max;
        proporcje[1] = y/max;
        proporcje[2] = z/max;

        return proporcje;
    }

    rysuj(){    //function rysuj(){

            //model.scene = new THREE.Scene();//<-to bylo w oryginale

          // ----------------------------------------------------USTAWIENIA KAMERY
          // model.camera = new THREE.PerspectiveCamera(
          //   75,
          //   window.innerWidth / window.innerHeight,
          //   0.1,
          //   1000
          // );
          //model.camera.position.z = 3;

          //model.renderer = new THREE.WebGLRenderer({canvas:document.getElementById("my_canvas"),antialias:true});
         // canvas = document.getElementById("canvas");
          //model.renderer.setSize(window.innerWidth, window.innerHeight);
         // model.renderer.setSize(document.getElementById("canvas").offsetWidth, document.getElementById("canvas").offsetHeight);
          //document.body.appendChild(model.renderer.domElement);
         // canvas.appendChild(model.renderer.domElement);

          // --------------------------------------------------------RESIZE OKNA
          window.addEventListener('resize', function ()
          {
            var width = window.innerWidth;
            var height = window.innerHeight;

            // model.renderer.setSize(width, height);
            //
            // model.camera.aspect = width / height;
            // model.camera.updateProjectionMatrix();

            renderer.setSize(width, height);

            camera.aspect = width / height;
            camera.updateProjectionMatrix();
          });

          // ------------------------------------------------------------KONTROLSY

          //model.controls = new THREE.TrackballControls( model.camera );

          // ----------------------------
          //dodajSwiatla();

          // -----------------------------------------------------TWORZYMY KSZTALT
            //var material = new THREE.MeshStandardMaterial( { color : 0x00cc00 } );
            var material = new THREE.MeshLambertMaterial();
            // var material = new THREE.MeshPhongMaterial({side:THREE.DoubleSide});
            var geometry = new THREE.Geometry();
            var proporcje = model.wyznaczProporcje();
            var srodek = [];
            srodek[0]= (model.max[0]+model.min[0])/2;
            srodek[1]= (model.max[1]+model.min[1])/2;
            srodek[2]= (model.max[2]+model.min[2])/2;

            for(var i=0; i<model.wierzcholki.length;i++) {
                var v1 = 2*proporcje[0]*(model.wierzcholki[i][0]-srodek[0])/(model.max[0]-model.min[0]);
                var v2 = 2*proporcje[1]*(model.wierzcholki[i][1]-srodek[1])/(model.max[1]-model.min[1]);
                var v3 = 2*proporcje[2]*(model.wierzcholki[i][2]-srodek[2])/(model.max[2]-model.min[2]);

                geometry.vertices.push(new THREE.Vector3(v1, v2, v3));
            }

            for(var i=0; i<model.sciany.length;i++) {
                var v1 = model.sciany[i][0]-1;
                var v2 = model.sciany[i][1]-1;
                var v3 = model.sciany[i][2]-1;
                // var normal = new THREE.Vector3(
                //     model.wektoryNormalne[i][0],
                //     model.wektoryNormalne[i][1],
                //     model.wektoryNormalne[i][2]
                // );

                geometry.faces.push(new THREE.Face3(v1, v2, v3));//, normal));
            }

            geometry.computeFaceNormals();
            geometry.computeVertexNormals();

            var obiekt = new THREE.Mesh( geometry, material );
            //obiekt.position.set(0,0,-500);
            scene.add( obiekt );

        GameLoop();
    }



         // ------------------------------------------------------RYSOWANIE SCENY
    render(){//var render = function (){
        renderer.render(scene, camera);
    }

    wypiszWielkosci(){//document.getElementById("saveFile").addEventListener('click', function(){
        //console.log('wypiszWielkosci()');
        //var blob = new Blob(["Hello world"], {type:"text/plain"});
        document.getElementById("nazwa").value = model.nazwaModelu;

        var text = "";
        var i;
        for(i=0; i<model.wierzcholki.length; i++){
            text += "v  " + model.wierzcholki[i][0] +"  " + model.wierzcholki[i][1] +"  "+ model.wierzcholki[i][2] +"\n";
        }
        document.getElementById("wierzcholki").value = text;

        //text += "\n \n";
        text = "";
        for(i=0; i<model.sciany.length; i++){
            text += "f  " + model.sciany[i][0] +"  "+ model.sciany[i][1] +"  "+ model.sciany[i][2] + "\n";
        }
        document.getElementById("sciany").value = text;

        //text += "\n \n";
        text = "";
        for(i=0; i<model.wektoryNormalne.length; i++){
            text += "vn  " + model.wektoryNormalne[i][0] +"  "+ model.wektoryNormalne[i][1] +"  "+ model.wektoryNormalne[i][2] +"  "+ "\n";
        }
        document.getElementById("wektoryNormalne").value = text;

        //var blob = new Blob([text], {type:"text/plain"});
        //saveAs(blob, "hello.txt");
    }

    zapisz(){
    //document.getElementById("saveFile").addEventListener('click', function(){
        //var blob = new Blob(["Hello world"], {type:"text/plain"});

        if(model.nazwaModelu == ""){
            document.getElementById("wiadomosc").value = "Nie wybrano pliku!";
        } else{
            var text = "";

            text += document.getElementById("wierzcholki").value;
            text += "\n\n";
            text += document.getElementById("sciany").value;
            text += "\n\n";
            text += document.getElementById("wektoryNormalne").value;
            var blob = new Blob([text], {type:"text/plain"});
            saveAs(blob, model.nazwaModelu);

            document.getElementById("wiadomosc").value = "Powodzenie";
        }
    }

}

// ----------------------URUCHAMIANIE PETLI GRY (UPDATE, RENDER, REPEAT)
var GameLoop = function (){
    controls.update();
    //model.light1.position.set(500,500,-600);
  requestAnimationFrame(GameLoop);

  //update();
  model.render();
};

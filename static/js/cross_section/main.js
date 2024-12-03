var modele, pozycja=1, creaseAngle=0;
var scene, camera, renderer, controls;

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

    var color = 0xaaaaaa;
    var brightness = 0.6;
    var position = 30;
    var distance = -5;
    addLight(0xffffff, 0.8, 0, 0, 10);
    addLight(color, brightness, position, position, distance);
    addLight(color, brightness, -position, position, distance);
    addLight(color, brightness, position, -position, distance);
    addLight(color, brightness, -position, -position, distance);

    // var geometry = new THREE.BoxGeometry(1,1,1);
    // var material = new THREE.MeshBasicMaterial({color:0x0000ff});
    // var mesh = new THREE.Mesh(geometry, material);
    // mesh.name = "mesh";
    // //mesh = new THREE.Mesh();
    // scene.add(mesh);
    // wczytajDaneTekstowe('text.txt');
    wczytajDaneTekstowe('Cube');
    camera.position.z = 3;

    controls = new THREE.TrackballControls( camera, renderer.domElement);

    //displayGUI();
}

function addLight(color, brightness, pos_x, pos_y, pos_z){
    var light = new THREE.PointLight(color, brightness);
    light.position.set(pos_x, pos_y, pos_z);
    camera.add(light);
    scene.add( camera );
}

function animate(){
    controls.update();

    requestAnimationFrame(animate);
    render();
}

function render(){
    renderer.clear();
    renderer.render(scene, camera);
}

function changeModel(varname){

    if(pliki.includes(varname)){
        if(varname.substring(varname.lastIndexOf(".")+1) === "g3d"){
            //console.log("pliki g3d jeszcze nie gotowe!");
            wczytajDaneBinarne(varname);
        } else {
            //console.log("include");
            wczytajDaneTekstowe(varname);
        }
    }
}

function wczytajDaneTekstowe(nazwa){

    var plik = sciezka+nazwa;
    //console.log(plik);
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {

                var tekst = this.responseText;
                modele = wczytajObiekt(tekst, nazwa);
                dodajdoSceny(modele);

        }
    };
    xhttp.open("GET", plik, true);
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

function dodajdoSceny(modele){

    var iloscObiektow = modele.length;
    //console.log("iloscObiektow");console.log(iloscObiektow);
    for (var j = 0; j < iloscObiektow; j++){

        var model = modele[j];
        var nazwa = model.getNazwaModelu();
        var rozszerzenie = gui.__controllers[2].object.a.split(".")[1];
        //console.log("rozszerzenie :"+rozszerzenie);
        var sciany = model.getSciany();
        var wierzcholki = model.getWierzcholki();
        var wektoryNormalne = model.getWektoryNormalne();

        var k;
        (model.getType()==999)?k=1:k=0;

        var normalneDoWierzcholkow; //= obliczNormalneDoWierzcholkow(sciany, wierzcholki, wektoryNormalne, k);
        var max = model.getMax();
        var min = model.getMin();
        var srodek = model.getSrodek();//[];
        var proporcje = model.getProporcje();
        var calaGeometria = new THREE.Geometry();

        if(rozszerzenie=='g3d'){
            //console.log("rozszerzenie :"+rozszerzenie);
            material = new THREE.MeshLambertMaterial({color : model.getKolor(), side : THREE.DoubleSide});
            normalneDoWierzcholkow = new Array(wierzcholki.length);
            for(var i=0; i<wierzcholki.length; i++){
                normalneDoWierzcholkow[i]=new Array(3);
                normalneDoWierzcholkow[i]=[null, null, null];
            }
        } else {
            material = new THREE.MeshLambertMaterial({color : model.getKolor(), side : THREE.DoubleSide});
            //material = new THREE.MeshPhongMaterial({color : model.getKolor(), side : THREE.DoubleSide});
            normalneDoWierzcholkow = obliczNormalneDoWierzcholkow(sciany, wierzcholki, wektoryNormalne, k);
        }



        var odcinki = [];

        for(var i=0;i<sciany.length;i++){

            var n1 = sciany[i][0]-k;
            var n2 = sciany[i][1]-k;
            var n3 = sciany[i][2]-k;
            var v1 = [];
            v1[0] = 2*proporcje[0]*(wierzcholki[n1][0]-srodek[0])/(max[0]-min[0]);
            v1[1] = 2*proporcje[1]*(wierzcholki[n1][1]-srodek[1])/(max[1]-min[1]);
            v1[2] = 2*proporcje[2]*(wierzcholki[n1][2]-srodek[2])/(max[2]-min[2]);
            var v2 = [];
            v2[0] = 2*proporcje[0]*(wierzcholki[n2][0]-srodek[0])/(max[0]-min[0]);
            v2[1] = 2*proporcje[1]*(wierzcholki[n2][1]-srodek[1])/(max[1]-min[1]);
            v2[2] = 2*proporcje[2]*(wierzcholki[n2][2]-srodek[2])/(max[2]-min[2]);
            var v3 = [];
            v3[0] = 2*proporcje[0]*(wierzcholki[n3][0]-srodek[0])/(max[0]-min[0]);
            v3[1] = 2*proporcje[1]*(wierzcholki[n3][1]-srodek[1])/(max[1]-min[1]);
            v3[2] = 2*proporcje[2]*(wierzcholki[n3][2]-srodek[2])/(max[2]-min[2]);

            var vn1 = [];
            vn1[0] = normalneDoWierzcholkow[n1][0];
            vn1[1] = normalneDoWierzcholkow[n1][1];
            vn1[2] = normalneDoWierzcholkow[n1][2];
            var vn2 = [];
            vn2[0] = normalneDoWierzcholkow[n2][0];
            vn2[1] = normalneDoWierzcholkow[n2][1];
            vn2[2] = normalneDoWierzcholkow[n2][2];
            var vn3 = [];
            vn3[0] = normalneDoWierzcholkow[n3][0];
            vn3[1] = normalneDoWierzcholkow[n3][1];
            vn3[2] = normalneDoWierzcholkow[n3][2];

            if((v1[0]<=pozycja)&&(v2[0]<=pozycja)&&(v3[0]<=pozycja)){
                //create a triangular geometry
                var geometry = utworzGeoetrie(v1, v2, v3, wektoryNormalne[i], vn1, vn2, vn3);

                var obiekt = new THREE.Mesh( geometry, material );
                //obiekt.updateMatrix();
                calaGeometria.merge(obiekt.geometry, obiekt.matrix);

            } else if((v1[0]>pozycja)&&(v2[0]<=pozycja)&&(v3[0]<=pozycja)){
            //} else if((v1[0]>pozycja)&&(v2[0]<pozycja)&&(v3[0]<pozycja)){
                //--------------------------------------------------------------nie wiadomo czy dobrze!
                var temp;
                var normalnyDoTemp;
                var geometry;
                var obiekt;

                if(v2[0]==pozycja){
                    temp=v2;
                    normalnyDoTemp=vn2;
                } else{
                    temp=wyznaczPrzeciecie(pozycja, v2, v1);
                    if(rozszerzenie=='g3d'){
                        normalnyDoTemp=[null, null, null];
                    } else {
                        normalnyDoTemp=wyznaczWektorNormalnyDoPrzeciecia(v2, v1, temp, vn2, vn1);
                    }

                    geometry = utworzGeoetrie( temp, v2, v3, wektoryNormalne[i], normalnyDoTemp, vn2, vn3);
                    obiekt = new THREE.Mesh( geometry, material );
                    //obiekt.updateMatrix();
                    calaGeometria.merge(obiekt.geometry, obiekt.matrix);
                }

//-----------------------------------------------------------------------------
                var temp2;
                var normalnyDoTemp2;
                if(v3[0]==pozycja){
                    temp2=v3;
                    normalnyDoTemp2=vn3;
                } else {
                    temp2 = wyznaczPrzeciecie(pozycja, v3, v1);
                    if(rozszerzenie=='g3d'){
                        normalnyDoTemp2=[null, null, null];
                    } else {
                        normalnyDoTemp2=wyznaczWektorNormalnyDoPrzeciecia(v3, v1, temp2, vn3, vn1);
                    }
                    geometry = utworzGeoetrie(temp2, temp, v3, wektoryNormalne[i], normalnyDoTemp2, normalnyDoTemp, vn3);//vn2, vn1, vn3);
                    obiekt = new THREE.Mesh( geometry, material );
                    //obiekt.updateMatrix();
                    calaGeometria.merge(obiekt.geometry, obiekt.matrix);
                }

                if(!((temp[0]==temp2[0])&&(temp[1]==temp2[1])&&(temp[2]==temp2[2]))){
                    var odcinek = new Odcinek(temp, temp2, wektoryNormalne[i], 1);
                    //console.log("odcinek");console.log(odcinek);
                    odcinki.push(odcinek);
                }

            } else if((v1[0]<=pozycja)&&(v2[0]>pozycja)&&(v3[0]<=pozycja)){
            //} else if((v1[0]<pozycja)&&(v2[0]>pozycja)&&(v3[0]<pozycja)){

                var temp;
                var normalnyDoTemp;
                var geometry;
                var obiekt;

                if(v1[0]==pozycja){
                    temp=v1;
                    normalnyDoTemp=vn1;
                } else {
                    temp = wyznaczPrzeciecie(pozycja, v1, v2);
                    if(rozszerzenie=='g3d'){
                        normalnyDoTemp=[null, null, null];
                    } else {
                        normalnyDoTemp = wyznaczWektorNormalnyDoPrzeciecia(v1, v2, temp, vn1, vn2);
                    }
                    geometry = utworzGeoetrie(v1, temp, v3, wektoryNormalne[i], vn1, normalnyDoTemp, vn3);
                    obiekt = new THREE.Mesh( geometry, material );
                    //obiekt.updateMatrix();
                    calaGeometria.merge(obiekt.geometry, obiekt.matrix);
                }

//-----------------------------------------------------------------------------
                var temp2;
                var normalnyDoTemp2;
                if(v3[0]==pozycja) {
                    temp2=v3;
                    normalnyDoTemp2=vn3;
                } else {
                    temp2 = wyznaczPrzeciecie(pozycja, v3, v2);
                    if(rozszerzenie=='g3d'){
                        normalnyDoTemp2=[null, null, null];
                    } else {
                        normalnyDoTemp2 = wyznaczWektorNormalnyDoPrzeciecia(v3, v2, temp2, vn3, vn2);
                    }
                    geometry = utworzGeoetrie(temp, temp2, v3, wektoryNormalne[i], normalnyDoTemp, normalnyDoTemp2, vn3);//null, null, null);//vn2, vn1, vn3);
                    obiekt = new THREE.Mesh( geometry, material );
                    //obiekt.updateMatrix();
                    calaGeometria.merge(obiekt.geometry, obiekt.matrix);
                }

                if(!((temp[0]==temp2[0])&&(temp[1]==temp2[1])&&(temp[2]==temp2[2]))){
                    var odcinek = new Odcinek(temp, temp2, wektoryNormalne[i], 1);
                    //console.log("odcinek");console.log(odcinek);
                    odcinki.push(odcinek);
                }

            } else if((v1[0]<=pozycja)&&(v2[0]<=pozycja)&&(v3[0]>pozycja)){
            //} else if((v1[0]<pozycja)&&(v2[0]<pozycja)&&(v3[0]>pozycja)){

                var temp;
                var normalnyDoTemp;
                var geometry;
                var obiekt;

                if(v1[0]==pozycja){
                    temp=v1;
                    normalnyDoTemp=vn1;
                } else {
                    temp= wyznaczPrzeciecie(pozycja, v1, v3);
                    if(rozszerzenie=='g3d'){
                        normalnyDoTemp=[null, null, null];
                    } else {
                        normalnyDoTemp = wyznaczWektorNormalnyDoPrzeciecia(v1, v3, temp, vn1, vn3);
                    }
                    geometry = utworzGeoetrie(v1, v2, temp, wektoryNormalne[i], vn1, vn2, normalnyDoTemp);
                    obiekt = new THREE.Mesh( geometry, material );
                    //obiekt.updateMatrix();
                    calaGeometria.merge(obiekt.geometry, obiekt.matrix);
                }
//-----------------------------------------------------------------------------
                var temp2;
                var normalnyDoTemp2;
                if(v2[0]==pozycja){
                    temp2=v2;
                    normalnyDoTemp2=vn2;
                } else {
                    temp2= wyznaczPrzeciecie(pozycja, v2, v3);
                    if(rozszerzenie=='g3d'){
                        normalnyDoTemp2=[null, null, null];
                    } else {
                        normalnyDoTemp2 = wyznaczWektorNormalnyDoPrzeciecia(v2, v3, temp2, vn2, vn3);
                    }
                    geometry = utworzGeoetrie( temp, v2, temp2, wektoryNormalne[i], normalnyDoTemp, vn2, normalnyDoTemp2);
                    obiekt = new THREE.Mesh( geometry, material );
                    //obiekt.updateMatrix();
                    calaGeometria.merge(obiekt.geometry, obiekt.matrix);
                }

                if(!((temp[0]==temp2[0])&&(temp[1]==temp2[1])&&(temp[2]==temp2[2]))){
                    var odcinek = new Odcinek(temp, temp2, wektoryNormalne[i], 1);
                    //console.log("odcinek");console.log(odcinek);
                    odcinki.push(odcinek);
                }

            } else if((v1[0]<=pozycja)&&(v2[0]>pozycja)&&(v3[0]>pozycja)){
            //} else if((v1[0]<pozycja)&&(v2[0]>pozycja)&&(v3[0]>pozycja)){

                var temp = wyznaczPrzeciecie(pozycja, v1, v2);
                var normalnyDoTemp;
                var temp2 = wyznaczPrzeciecie(pozycja, v1, v3);
                var normalnyDoTemp2;

                if(rozszerzenie=='g3d'){
                    normalnyDoTemp=[null, null, null];
                    normalnyDoTemp2=[null, null, null];
                } else {
                    normalnyDoTemp = wyznaczWektorNormalnyDoPrzeciecia(v1, v2, temp, vn1, vn2);
                    normalnyDoTemp2 = wyznaczWektorNormalnyDoPrzeciecia(v1, v3, temp2, vn1, vn3);
                }

                var geometry = utworzGeoetrie(v1, temp, temp2, wektoryNormalne[i], vn1, normalnyDoTemp, normalnyDoTemp2);//vn1, vn2, vn3);
                var obiekt = new THREE.Mesh( geometry, material );
                //obiekt.updateMatrix();
                calaGeometria.merge(obiekt.geometry, obiekt.matrix);

                if(!((temp[0]==temp2[0])&&(temp[1]==temp2[1])&&(temp[2]==temp2[2]))){
                    var odcinek = new Odcinek(temp, temp2, wektoryNormalne[i], 1);
                    //console.log("odcinek");console.log(odcinek);
                    odcinki.push(odcinek);
                }

            } else if((v1[0]>pozycja)&&(v2[0]<=pozycja)&&(v3[0]>pozycja)){
            //} else if((v1[0]>pozycja)&&(v2[0]<pozycja)&&(v3[0]>pozycja)){

                var temp = wyznaczPrzeciecie(pozycja, v2, v1);
                var normalnyDoTemp;
                var temp2 = wyznaczPrzeciecie(pozycja, v2, v3);
                var normalnyDoTemp2;

                if(rozszerzenie=='g3d'){
                    normalnyDoTemp=[null, null, null];
                    normalnyDoTemp2=[null, null, null];
                } else {
                    normalnyDoTemp = wyznaczWektorNormalnyDoPrzeciecia(v2, v1, temp, vn2, vn1);
                    normalnyDoTemp2 = wyznaczWektorNormalnyDoPrzeciecia(v2, v3, temp2, vn2, vn3);
                }

                var geometry = utworzGeoetrie( temp, v2, temp2, wektoryNormalne[i], normalnyDoTemp, vn2, normalnyDoTemp2);//vn1, vn2, vn3);
                var obiekt = new THREE.Mesh( geometry, material );
                obiekt.updateMatrix();
                calaGeometria.merge(obiekt.geometry, obiekt.matrix);

                if(!((temp[0]==temp2[0])&&(temp[1]==temp2[1])&&(temp[2]==temp2[2]))){
                    var odcinek = new Odcinek(temp, temp2, wektoryNormalne[i], 1);
                    //console.log("odcinek");console.log(odcinek);
                    odcinki.push(odcinek);
                }

            } else if((v1[0]>pozycja)&&(v2[0]>pozycja)&&(v3[0]<=pozycja)){
            //} else if((v1[0]>pozycja)&&(v2[0]>pozycja)&&(v3[0]<pozycja)){

                var temp = wyznaczPrzeciecie(pozycja, v3, v1);
                var normalnyDoTemp;
                var temp2 = wyznaczPrzeciecie(pozycja, v3, v2);
                var normalnyDoTemp2;

                if(rozszerzenie=='g3d'){
                    normalnyDoTemp=[null, null, null];
                    normalnyDoTemp2=[null, null, null];
                } else {
                    normalnyDoTemp = wyznaczWektorNormalnyDoPrzeciecia(v3, v1, temp, vn3, vn1);
                    normalnyDoTemp2 = wyznaczWektorNormalnyDoPrzeciecia(v3, v2, temp2, vn3, vn2);
                }

                var geometry = utworzGeoetrie( temp, temp2, v3, wektoryNormalne[i], normalnyDoTemp, normalnyDoTemp2, vn3);//vn1, vn2, vn3);
                var obiekt = new THREE.Mesh( geometry, material );
                obiekt.updateMatrix();
                calaGeometria.merge(obiekt.geometry, obiekt.matrix);

                if(!((temp[0]==temp2[0])&&(temp[1]==temp2[1])&&(temp[2]==temp2[2]))){
                    var odcinek = new Odcinek(temp, temp2, wektoryNormalne[i], 1);
                    //console.log("odcinek");console.log(odcinek);
                    odcinki.push(odcinek);
                }
            }

        }
        //console.log("model: "+model.getNazwaModelu());
        var minimum = 2*proporcje[0]*(min[0]-srodek[0])/(max[0]-min[0]);
        //console.log("pozycja = "+pozycja);//console.log(pozycja);
        if((odcinki.length>0)&&(model.getType()!=3)&&(minimum<pozycja)){//&&(model.getNazwaModelu()!="text.txt")){

            var lamane = znajdzLamane(odcinki);
            //console.log("lamane w dodajdoSceny()");
            //console.log(trojkaty);
            if(lamane != null){
                for(var i=0;i<lamane.length;i++){
                    // console.log("lamane["+i+"]:"); console.log(lamane[i]);
                    // wypiszOdcinkiIWektory(lamane[i]);
                    var odcinki = lamane[i];

                    var californiaPts = [];

                    for(var jj=0;jj<odcinki.length;jj++){
                        //console.log(odcinki[jj].v1[1]);
                        californiaPts.push( new THREE.Vector2( odcinki[jj].v1[1], odcinki[jj].v1[2] ) );
                    }

                    var californiaShape = new THREE.Shape( californiaPts );
                    var extrudeSettings = {
                        depth: 0,
                        bevelEnabled: false,
                        bevelSegments: 0,
                        steps: 2,
                        bevelSize: 0,
                        bevelThickness: 0.01
                    };
                    var geometry = new THREE.ExtrudeGeometry( californiaShape, extrudeSettings);
                    var obiekt = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial({color : model.getKolor()}) );
                    obiekt.position.set(0,0,0);
                    obiekt.rotation.y = 90*2*Math.PI/360;
                    obiekt.rotation.x = 90*2*Math.PI/360;
                    obiekt.position.set(pozycja,0,0);
                    obiekt.name = nazwa;
                    scene.add( obiekt );

                    //obiekt.updateMatrix();
                    //calaGeometria.merge(obiekt.geometry, obiekt.matrix);
                }
            }
        }

        //calaGeometria.computeVertexNormals();

        var calyObiekt = new THREE.Mesh( calaGeometria, material );


        calyObiekt.name = nazwa;
        dodajFolderGUI(nazwa, model.getKolor());

        //obiekt.position.set(0,0,-500);
        scene.add( calyObiekt );
        //console.log("scene");console.log(scene);
    }

}

function obliczNormalneDoWierzcholkow(sciany, wierzcholki, wektoryNormalne, k){

    var normalneDoWierzcholkow = new Array(wierzcholki.length);
    var scianyWierzcholkow = new Array(wierzcholki.length);

    for(var i=0;i<wierzcholki.length; i++){
        scianyWierzcholkow[i]=[];
        var nr = i+k;
        for(var j=0;j<sciany.length; j++){
            if(sciany[j].includes(nr)) scianyWierzcholkow[i].push(j);
        }
    }
    //console.log("wierzcholki");console.log(wierzcholki);
    //console.log("scianyWierzcholkow");console.log(scianyWierzcholkow);

    var wektoryWierzcholkow = new Array(wierzcholki.length);
    for(var i=0;i<wierzcholki.length; i++){
        wektoryWierzcholkow[i] = [];//new Array(scianyWierzcholkow[i].length);
        for(var j=0;j<scianyWierzcholkow[i].length;j++){
            if(!zawieraSieW(wektoryNormalne[scianyWierzcholkow[i][j]], wektoryWierzcholkow[i])){// wektoryWierzcholkow[i].includes(wektoryNormalne[scianyWierzcholkow[i][j]]) ) {
                wektoryWierzcholkow[i].push(wektoryNormalne[scianyWierzcholkow[i][j]]);
            }
        }
    }
    //console.log("wektoryWierzcholkow");console.log(wektoryWierzcholkow);

    for(var i=0;i<wierzcholki.length; i++){
        normalneDoWierzcholkow[i]=[0, 0, 0];

        for(var j=0;j<wektoryWierzcholkow[i].length;j++){
            normalneDoWierzcholkow[i][0] += wektoryWierzcholkow[i][j][0];
            normalneDoWierzcholkow[i][1] += wektoryWierzcholkow[i][j][1];
            normalneDoWierzcholkow[i][2] += wektoryWierzcholkow[i][j][2];
        }
        normalneDoWierzcholkow[i][0] /= wektoryWierzcholkow[i].length;
        normalneDoWierzcholkow[i][1] /= wektoryWierzcholkow[i].length;
        normalneDoWierzcholkow[i][2] /= wektoryWierzcholkow[i].length;
    }


    //console.log("normalneDoWierzcholkow");console.log(normalneDoWierzcholkow);
    return normalneDoWierzcholkow;

    // var normalneDoWierzcholkow = new Array(wierzcholki.length);
    // var scianyWierzcholkow = new Array(wierzcholki.length);
    //
    // for(var i=0;i<wierzcholki.length; i++){
    //     scianyWierzcholkow[i]=[];
    //     var nr = i+k;
    //     for(var j=0;j<sciany.length; j++){
    //         if(sciany[j].includes(nr)) scianyWierzcholkow[i].push(j);
    //     }
    // }
    // console.log("wierzcholki");console.log(wierzcholki);
    // console.log("sciany");console.log(sciany);
    // console.log("scianyWierzcholkow");console.log(scianyWierzcholkow);
    //
    // var normalny = new normalnyDoWierzcholka(0, k, sciany, scianyWierzcholkow[0], wektoryNormalne, creaseAngle);
    //
    // var wektoryWierzcholkow = new Array(wierzcholki.length);
    // for(var i=0;i<wierzcholki.length; i++){
    //     wektoryWierzcholkow[i] = [];//new Array(scianyWierzcholkow[i].length);
    //     for(var j=0;j<scianyWierzcholkow[i].length;j++){
    //         if(!zawieraSieW(wektoryNormalne[scianyWierzcholkow[i][j]], wektoryWierzcholkow[i])){// wektoryWierzcholkow[i].includes(wektoryNormalne[scianyWierzcholkow[i][j]]) ) {
    //             wektoryWierzcholkow[i].push(wektoryNormalne[scianyWierzcholkow[i][j]]);
    //         }
    //     }
    // }
    // //console.log("wektoryWierzcholkow");console.log(wektoryWierzcholkow);
    //
    // for(var i=0;i<wierzcholki.length; i++){
    //     normalneDoWierzcholkow[i]=[0, 0, 0];
    //
    //     for(var j=0;j<wektoryWierzcholkow[i].length;j++){
    //         normalneDoWierzcholkow[i][0] += wektoryWierzcholkow[i][j][0];
    //         normalneDoWierzcholkow[i][1] += wektoryWierzcholkow[i][j][1];
    //         normalneDoWierzcholkow[i][2] += wektoryWierzcholkow[i][j][2];
    //     }
    //     normalneDoWierzcholkow[i][0] /= wektoryWierzcholkow[i].length;
    //     normalneDoWierzcholkow[i][1] /= wektoryWierzcholkow[i].length;
    //     normalneDoWierzcholkow[i][2] /= wektoryWierzcholkow[i].length;
    // }
    //
    //
    // //console.log("normalneDoWierzcholkow");console.log(normalneDoWierzcholkow);
    // return normalneDoWierzcholkow;
}

function zawieraSieW(wektor, szereg){
    //console.log("zawieraSieW() szereg=");console.log(szereg);
    var temp=false;
    for(var i=0; i<szereg.length; i++){
        //console.log("szereg["+i+"]=");//console.log(szereg[i]);
        if((szereg[i][0]==wektor[0])&&(szereg[i][1]==wektor[1])&&(szereg[i][2]==wektor[2])){
            temp=true;
            break;
        }
    }
    return temp;
}

function removeModels(){

    for( var i = scene.children.length - 1; i >= 0; i--) {
        var selectedObject = scene.getObjectByName(scene.children[i].name);
        //console.log(selectedObject);
        scene.remove( selectedObject );
    }
}

function utworzGeoetrie(v1, v2, v3, wektorNormalny, vn1, vn2, vn3){
    var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(v1[0], v1[1], v1[2]));
    geometry.vertices.push(new THREE.Vector3(v2[0], v2[1], v2[2]));
    geometry.vertices.push(new THREE.Vector3(v3[0], v3[1], v3[2]));
    var normal = new THREE.Vector3(wektorNormalny[0], wektorNormalny[1], wektorNormalny[2]);
    var face = new THREE.Face3( 0, 1, 2, normal);//, color);//, materialIndex );
    geometry.faces.push( face );

    //console.log("vn1");console.log(vn1);

    if(vn1[0] != null){
        var normalnyDoWierzcholka = new THREE.Vector3(vn1[0], vn1[1], vn1[2]);
        geometry.faces[0].vertexNormals[ 0 ] = normalnyDoWierzcholka;

        normalnyDoWierzcholka = new THREE.Vector3(vn2[0], vn2[1], vn2[2]);
        geometry.faces[0].vertexNormals[ 1 ] = normalnyDoWierzcholka;

        normalnyDoWierzcholka = new THREE.Vector3(vn3[0], vn3[1], vn3[2]);
        geometry.faces[0].vertexNormals[ 2 ] = normalnyDoWierzcholka;
    }


    //add the face to the geometry's faces array

    //console.log("geometry");console.log(geometry);
    return geometry;
}

function wyznaczPrzeciecie(pozycja, v1, v2){
    var t = (pozycja-v1[0])/(v2[0]-v1[0]);
    var temp = [];
    temp[0] = pozycja;
    temp[1] = (t*(v2[1]-v1[1]))+v1[1];
    temp[2] = (t*(v2[2]-v1[2]))+v1[2];
    return temp;
}

function wyznaczWektorNormalnyDoPrzeciecia(zostaje, obcinany, przeciecie, normalnyDoZostaje, normalnyDoObcinany){
    //console.log("normalnyDoZostaje");console.log(normalnyDoZostaje);
    //console.log("normalnyDoObcinany");console.log(normalnyDoObcinany);

    var odleglosc = wyznaczOdleglosc(zostaje, obcinany);
    var wagaZostaje = wyznaczOdleglosc(przeciecie, obcinany)/odleglosc;
    var wagaObcinany = wyznaczOdleglosc(zostaje, przeciecie)/odleglosc;
    //console.log("wagaZostaje");console.log(wagaZostaje);
    //console.log("wagaObcinany");console.log(wagaObcinany);

    var temp = new Array(3);
    temp[0]=(wagaZostaje*normalnyDoZostaje[0])+(wagaObcinany*normalnyDoObcinany[0]);
    temp[1]=(wagaZostaje*normalnyDoZostaje[1])+(wagaObcinany*normalnyDoObcinany[1]);
    temp[2]=(wagaZostaje*normalnyDoZostaje[2])+(wagaObcinany*normalnyDoObcinany[2]);

    var dlugosc = Math.sqrt((temp[0]*temp[0])+(temp[1]*temp[1])+(temp[2]*temp[2]));
    temp[0]/=dlugosc;
    temp[1]/=dlugosc;
    temp[2]/=dlugosc;
    //console.log("temp");console.log(temp);
    return temp;
}

function wyznaczOdleglosc(v1, v2){
    var odl1 = (v1[0]-v2[0])*(v1[0]-v2[0]);
    var odl2 = (v1[1]-v2[1])*(v1[1]-v2[1]);
    var odl3 = (v1[2]-v2[2])*(v1[2]-v2[2]);
    return Math.sqrt(odl1+odl2+odl3);
}

function znajdzLamane(odcinki){

    var lamane=[];
    var sasiedziOdcinkow=[];
    // console.log("odcinki");
    // console.log(odcinki);
    // wypiszOdcinkiIWektory(odcinki);
    for(var i=0; i<odcinki.length; i++){
        sasiedziOdcinkow[i]=-1;
        for(var j=0; j<odcinki.length; j++){
            if((odcinki[i].v2[1]==odcinki[j].v1[1])&&(odcinki[i].v2[2]==odcinki[j].v1[2])){

                sasiedziOdcinkow[i]=j;
            }
        }
    }

    if(sasiedziOdcinkow.includes(-1)){
        //console.log("sasiedziOdcinkow zawiera -1");
        return null;

    } else {
        var zrobioneOdcinki = new Array(odcinki.length).fill(0);

        var k=0;
        while(zrobioneOdcinki.includes(0)){
            var indeks = zrobioneOdcinki.indexOf(0);
            //console.log("indeks: " + indeks);

            var doZrobienia =[];
            var wskaznik = sasiedziOdcinkow[indeks];
            //console.log("wskaznik: " + wskaznik);
            doZrobienia.push(odcinki[indeks]);
            zrobioneOdcinki[indeks]=1;

            while(wskaznik!=indeks){
                doZrobienia.push(odcinki[wskaznik]);
                zrobioneOdcinki[wskaznik]=1;
                wskaznik = sasiedziOdcinkow[wskaznik];
            }

            lamane[k]=doZrobienia;
            k++;
        }
    }
    return lamane;
}

function wypiszOdcinkiIWektory(odcinki){//, wektoryNorm){
    var string = "";
    var odcinek;
    for(i=0;i<odcinki.length;i++){
        odcinek = odcinki[i];
        //wekt = wektoryNorm[i];
        string += "{e"+i+": {["+Math.round(100*odcinek.v1[1])/100+", "+Math.round(100*odcinek.v1[2])/100+"], ";
        string += " ["+Math.round(100*odcinek.v2[1])/100+","+Math.round(100*odcinek.v2[2])/100+"]}, \t";
        string += " {V: ["+Math.round(100*odcinek.wektor[1])/100+","+Math.round(100*odcinek.wektor[2])/100+"]}}; \n";
        //string += " {Vn: ["+Math.round(100*wekt[1])/100+","+Math.round(100*wekt[2])/100+"]}}; \n";
    }
    console.log(string);
}

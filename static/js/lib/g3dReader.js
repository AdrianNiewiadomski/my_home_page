function wczytajDaneBinarne(nazwa){
    var plik = sciezka+nazwa;
    var tekstBinarny = load_binary_resource(plik);
    var czytnikBinarny = new BinaryReader(tekstBinarny);

    var naglowek = czytnikBinarny.readString(4);
    //console.log(naglowek);
    if (naglowek == "ZMKW"){
        // Odczyt profilu.
        var profil = czytnikBinarny.readInt8();
        //console.log("profil: "+profil);

        // Realny maks, min obiektu.
        var MIN = [];
        MIN[0] =czytnikBinarny.readDouble();
        MIN[1] = czytnikBinarny.readDouble();
        MIN[2] = czytnikBinarny.readDouble();
        //console.log("min:");console.log(MIN);
        var MAX = [];
        MAX[0] = czytnikBinarny.readDouble();
        MAX[1] = czytnikBinarny.readDouble();
        MAX[2] = czytnikBinarny.readDouble();
        //console.log("max:");console.log(MAX);

        // Znormalizowany maks, min obiektu [-10, 10].
        var nmaxX = czytnikBinarny.readDouble();
        var nmaxY = czytnikBinarny.readDouble();
        var nmaxZ = czytnikBinarny.readDouble();
        //console.log("znormalizowny maxX="+nmaxX); console.log("znormalizowny maxY="+nmaxY); console.log("znormalizowny maxZ="+nmaxZ);
        var nminX = czytnikBinarny.readDouble();
        var nminY = czytnikBinarny.readDouble();
        var nminZ = czytnikBinarny.readDouble();
        //console.log("znormalizowny minX="+nminX); console.log("znormalizowny minY="+nminY); console.log("znormalizowny minZ="+nminZ);

        // Dystants oraz obrót obiektu
        var dist = czytnikBinarny.readDouble();
        var rotate = czytnikBinarny.readDouble();
        //console.log("dystans="+dist); console.log("obrot="+rotate);

        // Dane macierzy kwaterionów.
        for (var j = 0; j < 128; j++){
            var _m1 = czytnikBinarny.readInt8();
            //console.log("_m1="+_m1);
        }

        for (var j = 0; j < 128; j++){
            var _m2 = czytnikBinarny.readInt8();
            //console.log("_m2="+_m2);
        }

        // Przesunięcie sceny.
        for (var j = 0; j < 3; j++){
            var offset = czytnikBinarny.readDouble();
            //console.log("offset="+offset);
        }

        // Liczba obiektów.
        modele = [];
        var iloscObiektow = czytnikBinarny.readInt32();
        //console.log("iloscObiektow="+iloscObiektow);
        for (var j = 0; j < iloscObiektow; j++) {
            // Dane obiektu. Nazwa
            var tempName = czytnikBinarny.readString(20);
            var name = extractName(tempName);
            console.log("name :" + name);

            if (name.includes("Warstwa")) {
                name = name.replace("Warstwa", "Layer");
            }

            if (name.includes("Uskok")) {
                name = name.replace("Uskok", "Fault");
            }

            // Typ obiektu: 1- Blok, 2- uskok.
            var typ = czytnikBinarny.readInt8();
            //console.log("typ :" + typ);

            // Is it visible?
            var widocznosc = czytnikBinarny.readInt8();
            //console.log("widocznosc :" + widocznosc);

            // Color: R,G,B.
            var r = czytnikBinarny.readInt32();
            var g = czytnikBinarny.readInt32();
            var b = czytnikBinarny.readInt32();
            if(r == 0 && g == 0 && b == 0){
              r = 1; g = 1; b = 1;
            }
            //console.log("kolor: ("+r+", "+g+", "+b+")");
            var kolor = rgbToHex(r, g, b);
            //console.log("kolor:" + kolor);

            // Number and data of vertices.
            var iloscWierzcholkow = czytnikBinarny.readInt32();
            //console.log("iloscWierzcholkow=" + iloscWierzcholkow);
            var wierzcholki = [];
            for (var i = 0; i < iloscWierzcholkow; i++){
                var wierzcholek =[];
                // wierzcholek[0] = czytnikBinarny.readDouble()/(MAX[0]-MIN[0]);
                // wierzcholek[1] = czytnikBinarny.readDouble()/(MAX[1]-MIN[1]);
                // wierzcholek[2] = czytnikBinarny.readDouble()/(MAX[2]-MIN[2]);

                wierzcholek[0] = czytnikBinarny.readDouble();
                wierzcholek[1] = czytnikBinarny.readDouble();
                wierzcholek[2] = czytnikBinarny.readDouble();

                wierzcholki.push(wierzcholek);
            }

            // Number and data of faces.
            var iloscScian = czytnikBinarny.readInt32();
            //console.log("iloscScian=" + iloscScian);
            var sciany = [];
            for (var i = 0; i < iloscScian ; i++){
                var sciana =[];
                sciana[0]=czytnikBinarny.readInt32();
                sciana[1]=czytnikBinarny.readInt32();
                sciana[2]=czytnikBinarny.readInt32();
                sciany.push(sciana);
            }
            modele.push(new Model(name, typ, kolor, wierzcholki, sciany, MIN, MAX));
        }

        //console.log(modele);
        //return modele;
        dodajdoSceny(modele);

    } else {
        console.log("File error.");
        return null;
    }
}

function extractName(tab) {
   var i = 0;
   var name = "";

   while ((i < tab.length) && (tab[i].charCodeAt() != 0))
   {
       var temp = tab[i];
       var code = tab[i].charCodeAt();

       if (code == 63434) temp = 'Ę';
       if (code == 63466) temp = 'ę';
       if (code == 63443) temp = 'Ó';
       if (code == 63475) temp = 'ó';
       if (code == 63397) temp = 'Ą';
       if (code == 63417) temp = 'ą';
       if (code == 63372) temp = 'Ś';
       if (code == 63388) temp = 'ś';
       if (code == 63395) temp = 'Ł';
       if (code == 63411) temp = 'ł';
       if (code == 63407) temp = 'Ż';
       if (code == 63423) temp = 'ż';
       if (code == 63375) temp = 'Ź';
       if (code == 63391) temp = 'ź';
       if (code == 63430) temp = 'Ć';
       if (code == 63462) temp = 'ć';
       if (code == 63441) temp = 'Ń';
       if (code == 63473) temp = 'ń';
       name = name + temp;
       i++;
   }
   return name;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function componentToHex(c) {
   var hex = c.toString(16);
   return hex.length == 1 ? "0" + hex : hex;
}

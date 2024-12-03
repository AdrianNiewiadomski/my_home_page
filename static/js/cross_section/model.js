class Model{

    constructor(nazwa, typ, kolor, wierzcholki, sciany, min, max){
        this.nazwaModelu = nazwa;
        this.skrot = nazwa;
        this.typ = typ;
        this.kolor = kolor;
        this.wierzcholki = wierzcholki;
        this.sciany = sciany;

        this.wektoryNormalne = [];
        this.wyznaczWektoryNormalne();
        // var i;
        // for(i=0;i<sciany.length;i++){
        //     this.wektoryNormalne[i]=this.wyznaczWektorNormalny(i);
        // }

        this.min = min;
        this.max = max;

        this.wyznaczSrodek();
        this.wyznaczProporcje();
    }

    getNazwaModelu(){
        return this.nazwaModelu;
    }

    setNazwaModelu(nazwa){
        this.nazwaModelu = nazwa;
    }

    getType(){
        return this.typ;
    }

    getKolor(){
        return this.kolor;
    }

    getWierzcholki(){
        return this.wierzcholki;
    }

    getSciany(){
        return this.sciany;
    }

    getMax(){
      return this.max;
    }

    getMin(){
      return this.min;
    }

    getSrodek(){
      return this.srodek;
    }

    getProporcje(){
      return this.proporcje;
    }

    wyznaczSrodek(){
        var srodek = [];
        srodek[0]=(this.max[0]+this.min[0])/2;
        srodek[1]=(this.max[1]+this.min[1])/2;
        srodek[2]=(this.max[2]+this.min[2])/2;
        this.srodek = srodek;
    }

    wyznaczProporcje(){
        var proporcje = [];
        var x = this.max[0]-this.min[0];
        var y = this.max[1]-this.min[1];
        var z = this.max[2]-this.min[2];

        var max = x;
        if(y>max) max=y;
        if(z>max) max=z;

        proporcje[0] = x/max;
        proporcje[1] = y/max;
        proporcje[2] = z/max;

        this.proporcje = proporcje;
    }

    getWektoryNormalne(){
        return this.wektoryNormalne;
    }

    wyznaczWektoryNormalne(){
        for(var i=0;i<this.sciany.length;i++){
            this.wektoryNormalne[i]=this.wyznaczWektorNormalny(i);
        }
    }

    wyznaczWektorNormalny(nrWektora){                    //modyfikowalem za wikipedia (artykul o plaszczyznie -> Płaszczyzna przechodząca przez trzy punkty)
        var t;
        (this.getType()==999)?t=1:t=0;

        var sciany = this.getSciany();
        var wierzcholki = this.getWierzcholki();
        var wierzcholek1 = wierzcholki[sciany[nrWektora][0]-t];// -1];
        var wierzcholek2 = wierzcholki[sciany[nrWektora][1]-t];// -1];
        var wierzcholek3 = wierzcholki[sciany[nrWektora][2]-t];// -1];

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

        return n;
    }
}

class normalnyDoWierzcholka{

    constructor(nr, k, sciany, scianyWierzcholkow, wektoryNormalne, creaseAngle){

        console.log("---------------------------  constructor");
        var nr=nr+k;
        console.log("dla "+nr+" mamy:");
        for(var i=0; i<scianyWierzcholkow.length; i++){
            console.log(sciany[scianyWierzcholkow[i]]);
        }

        var sasiedzi = this.znajdzSasiadow(sciany, scianyWierzcholkow, nr);
        // this.v1 = v1;
        // this.v2 = v2;
        // this.wektor = wektor;
        // if (poprawiac==1){
        //     this.poprawWierzcholki();
        // }
        //
        // this.srodek=[];
        // this.wyznaczSrodek();
    }

    znajdzSasiadow(sciany, scianyWierzcholkow, nr){
        var temp = [];
        temp.push(scianyWierzcholkow[0]);

        var pierwszaSciana = sciany[scianyWierzcholkow[0]];
        var drugiWierzcholek;
        if(pierwszaSciana[0]==nr){
            drugiWierzcholek=pierwszaSciana[1];
        } else {
            drugiWierzcholek=pierwszaSciana[0];
        }

        //console.log("drugiWierzcholek");console.log(drugiWierzcholek);
        var k=1;
        //while(temp.length<scianyWierzcholkow.length){
            for(var i=1;i<scianyWierzcholkow.length;i++){
                if(sciany[scianyWierzcholkow[i]].includes(drugiWierzcholek) ){
                    if(!temp.includes(scianyWierzcholkow[i])){
                        temp.push(scianyWierzcholkow[i]);
                        var sciana = sciany[scianyWierzcholkow[i]];
                        var indeks = sciana.indexOf(nr);
                        //sciana.splice(indeks, 1);
                        indeks = sciana.indexOf(drugiWierzcholek);
                        //sciana.splice(indeks, 1);
                        drugiWierzcholek=sciana[0];
                        break;
                    }
                }
            }
            //console.log("temp");console.log(temp);
        //}
        console.log("temp");console.log(temp);
    }

    // getV1(){
    //     return this.v1;
    // }
    //
    // getV2(){
    //     return this.v2;
    // }
    //
    // getWektor(){
    //     return this.wektor;
    // }
    //
    // getSrodek(){
    //     return this.srodek;
    // }
    //
    // //---------------------------------------------------------------------------
    //
    // poprawWierzcholki(){
    //     var A = this.wektor;
    //     var B = [];
    //
    //     B[0] = this.v2[0] - this.v1[0];
    //     B[1] = this.v2[1] - this.v1[1];
    //     B[2] = this.v2[2] - this.v1[2];
    //
    //     var iloczyn = (A[1]*B[2])-(A[2]*B[1]);
    //     if(iloczyn<0){
    //         // console.log("zamieniam");
    //         // console.log(this.v1);
    //         // console.log("i");
    //         // console.log(this.v2);
    //         var temp = this.v1;
    //         this.v1=this.v2;
    //         this.v2=temp;
    //         // console.log("na");
    //         // console.log(this.v1);
    //         // console.log("i");
    //         // console.log(this.v2);
    //     }
    // }
    //
    // wyznaczSrodek(){
    //     var srodek = [];
    //     srodek[0]=(this.v1[0]+this.v2[0])/2;
    //     srodek[1]=(this.v1[1]+this.v2[1])/2;
    //     srodek[2]=(this.v1[2]+this.v2[2])/2;
    //     this.srodek = srodek;
    // }
}

function sprawdzKat(wektor1, wektor2){
    var kosinus = iloczynSkalarny(wektor1, wektor2);
    iloczyn /=(dlugosc(wektor1)*dlugosc(wektor2));
    return kosinus;
}

function iloczynSkalarny(wektor1, wektor2){
    return (wektor1[0]*wektor2[0])+(wektor1[1]*wektor2[1])+(wektor1[2]*wektor2[2]);
}

function dlugosc(wektor){
    return Math.sqrt( (wektor[0]*wektor[0]) + (wektor[1]*wektor[1]) + (wektor[2]*wektor[2]) );
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

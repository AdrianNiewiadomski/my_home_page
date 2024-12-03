class Odcinek{

    constructor(v1, v2, wektor, poprawiac){

        this.v1 = v1;
        this.v2 = v2;
        this.wektor = wektor;
        if (poprawiac==1){
            this.poprawWierzcholki();
        }

        this.srodek=[];
        this.wyznaczSrodek();
    }

    getV1(){
        return this.v1;
    }

    getV2(){
        return this.v2;
    }

    getWektor(){
        return this.wektor;
    }

    getSrodek(){
        return this.srodek;
    }

    //---------------------------------------------------------------------------

    poprawWierzcholki(){
        var A = this.wektor;
        var B = [];

        B[0] = this.v2[0] - this.v1[0];
        B[1] = this.v2[1] - this.v1[1];
        B[2] = this.v2[2] - this.v1[2];

        var iloczyn = (A[1]*B[2])-(A[2]*B[1]);
        if(iloczyn<0){
            // console.log("zamieniam");
            // console.log(this.v1);
            // console.log("i");
            // console.log(this.v2);
            var temp = this.v1;
            this.v1=this.v2;
            this.v2=temp;
            // console.log("na");
            // console.log(this.v1);
            // console.log("i");
            // console.log(this.v2);
        }
    }

    wyznaczSrodek(){
        var srodek = [];
        srodek[0]=(this.v1[0]+this.v2[0])/2;
        srodek[1]=(this.v1[1]+this.v2[1])/2;
        srodek[2]=(this.v1[2]+this.v2[2])/2;
        this.srodek = srodek;
    }
}

// jshint esversion: 6

class Model{

    constructor(){        
        this.vertices = [];
        this.faces = [];
    }

    getVertices(){
        return this.vertices;
    }

    getFaces(){
        return this.faces;
    }

    addVertice(line) {        
        this.vertices.push([
            parseFloat(line.split(' ')[1]), 
            parseFloat(line.split(' ')[2]), 
            parseFloat(line.split(' ')[3])
        ]);
    }

    addFace(line) {
        this.faces.push([
            parseInt(line.split(' ')[1]), 
            parseInt(line.split(' ')[2]), 
            parseInt(line.split(' ')[3])
        ]);
    }

    static createModelFromText(text) {
    // wczytajObiekt(linia, nazwa){
        var model = new Model();    
    
        text = text.replace(/  /g, ' ')
        var lines = text.split("\n");

        lines.forEach(element => {
            if(element.startsWith('v ')) {
                model.addVertice(element);
            }
            if(element.startsWith('f ')) {
                model.addFace(element);
            }
        });  
        
        console.log(model);

        // for(var i=0; i<lines.length; i++){
    
        //     if((linijki[i].charAt(0) == 'v') && (linijki[i].charAt(1) == ' ')){
    
        //         var wierzcholek=[];
        //         var text = linijki[i].replace(/  /g,' ');
    
        //         wierzcholek[0]=parseFloat(text.split(" ")[1]);
        //         wierzcholek[1]=parseFloat(text.split(" ")[2]);
        //         wierzcholek[2]=parseFloat(text.split(" ")[3]);
    
        //         if(wierzcholek[0]>max[0]) max[0]=wierzcholek[0];
        //         if(wierzcholek[1]>max[1]) max[1]=wierzcholek[1];
        //         if(wierzcholek[2]>max[2]) max[2]=wierzcholek[2];
        //         if(wierzcholek[0]<min[0]) min[0]=wierzcholek[0];
        //         if(wierzcholek[1]<min[1]) min[1]=wierzcholek[1];
        //         if(wierzcholek[2]<min[2]) min[2]=wierzcholek[2];
    
        //         wierzcholki.push(wierzcholek);
        //     }
        //     if((linijki[i].charAt(0) == 'f') && (linijki[i].charAt(1) == ' ')){
    
        //         var text = linijki[i].replace(/  /g,' ');
        //         var sciana = [];
    
        //         sciana[0]=parseInt(text.split(" ")[1]);
        //         sciana[1]=parseInt(text.split(" ")[2]);
        //         sciana[2]=parseInt(text.split(" ")[3]);
    
        //         sciany.push(sciana);
        //     }
        // }
    
        // var model = [];
        // model.push(new Model(nazwa, 999, "#ffffff", wierzcholki, sciany, min, max));
        // return model;
    }
}

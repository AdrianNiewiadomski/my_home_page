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

        var model = new Model();    
    
        text = text.replace(/  /g, ' ');
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
        return model;
    }
}

// jshint esversion: 6

class OBJLoader {

    static getFileName(){
        var url = window.location.href;
        var path = url.substr(0, url.lastIndexOf('/'));
        var name = path + '/3d_models/litera_L.txt';
        return name;
    }

    static addModelToScene(scene, model) {
        var geom = new THREE.Geometry(); 

        geom.vertices = model.vertices;
        geom.faces = model.faces;
        // var v1 = new THREE.Vector3(0,0,0);
        // var v2 = new THREE.Vector3(0,50,0);
        // var v3 = new THREE.Vector3(0,50,50);

        // geom.vertices.push(v1);
        // geom.vertices.push(v2);
        // geom.vertices.push(v3);

        // geom.faces.push( new THREE.Face3( 0, 1, 2 ) );
        geom.computeFaceNormals();

        var object = new THREE.Mesh( geom, new THREE.MeshNormalMaterial() );
        
        object.position.z = -10;//move a bit back - size of 500 is a bit big
        // object.rotation.y = -Math.PI * .5;//triangle is pointing in depth, rotate it -90 degrees on Y
        
        scene.add(object);
    }
    
    static loadModel(scene) {
        var name = this.getFileName();
        console.log(name);
    
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
    
                var tekst = this.responseText;
                console.log(tekst);


                var model = Model.createModelFromText(tekst);
                OBJLoader.addModelToScene(scene, model);
            }
        };
    
        xhttp.open("GET", name, true);
        xhttp.send();
    }    
}

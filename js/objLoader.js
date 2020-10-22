// jshint esversion: 6

class OBJLoader {

    static getFileName(){
        var url = window.location.href;
        var path = url.substr(0, url.lastIndexOf('/'));
        // var name = path + '/3d_models/litera_L.txt';
        var name = path + '/3d_models/name.obj';
        return name;
    }

    static addModelToScene(scene, model) {
        var geom = new THREE.Geometry(); 

        geom.vertices = model.vertices;
        geom.faces = model.faces;
        geom.computeFaceNormals();

        var object = new THREE.Mesh( geom, new THREE.MeshNormalMaterial() );
        
        object.position.z = -10;
        object.rotation.x = Math.PI * 0.5;
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

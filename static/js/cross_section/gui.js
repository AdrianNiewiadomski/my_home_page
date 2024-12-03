var gui;

function displayGUI(){
    gui = new dat.GUI();

    var speed =0.1;
    var jar;            //jar przetrzymuje wartosc

    //console.log(pliki);

    parameters = {
        a: "Cube",
        b: "",
        c: false,
        d: 1,
        e: true,
        f: "#ffffff",
    };

    var name = gui.add(parameters, 'a').name('Name');
    var geometr = gui.add(parameters, 'b', pliki).name('Model');
    geometr.onChange(function(jar){
        // parameters.a = jar;
        // console.log(parameters.a);
        //name.name(jar);
        //name = gui.add(parameters, 'a');
        //console.log(jar);
        name.setValue(jar);

        //scene.remove(mesh);
        usunFolderyGUI();
        removeModels();
        changeModel(jar);
    });


    //var dimen = gui.addFolder('Przekrój');
    //var model = gui.add(parameters, 'c').name('Przekrój');


    var xdimen = gui.add(parameters, 'd').min(-1).max(1).step(speed).name('Sectiion (X axis)');
    xdimen.onChange(function(jar){
        // mesh.visible = jar;
        pozycja = jar;
        usunFolderyGUI();
        removeModels();
        dodajdoSceny(modele);
        //console.log(modele);
        // selectedObject = scene.getObjectByName('szescian.txt');//this.name);
        // selectedObject.visible = jar;
    });

    //gui.close();
    gui.open();
}

//  ----------------------------------------- funkcja removeFolder zostala dodana do dat.gui.min.js
function usunFolderyGUI(){
    // console.log("usunFolderyGUI()");
    // var obj = gui.__folders;
    // console.log(obj);
    //
    // var result = Object.keys(obj).map(function(key) {
    //     return [key, obj[key]];
    // });
    //
    // console.log(result);

    //console.log(scene.children);
    var iloscFolderow = scene.children.length;
    for(var i=0;i<iloscFolderow;i++){
        //console.log(scene.children[i].name);
        if(scene.children[i].name != ""){
            gui.removeFolder(scene.children[i].name);
        }
    }
}

function dodajFolderGUI(nazwa, kolor){
    // //console.log(gui);
    // //console.log(gui.__folders);
    // var ilosc = parseInt(gui.__controllers[0].object.a);
    // for(var i=0; i<ilosc;i++){
    //
    //
    //     gui.removeFolder(models[i]);
    // }
    //
    // var folder;
    // var selectedObject;//=scene.children;//[];
    // var model;
    // //console.log(selectedObject);
    // //ilosc = parseInt(jar);

    //for(var i=0;i<ilosc;i++){//models.length;i++ ){//model in models){
        //var nazwa = models[i];
        //console.log(nazwa);
        var folder = gui.addFolder(nazwa);
        //console.log(folder);
        //selectedObject = scene.getObjectByName(nazwa);
        //console.log(selectedObject);

        model = folder.add(parameters, 'e').name('Show');
        model.name = nazwa;
        model.onChange(function(jar){
        //     mesh.visible = jar;
            // console.log("model");
            // console.log(this);
            //console.log("scene.children");console.log(scene.children);
            var children = scene.children;
            for(var i=0; i<scene.children.length;i++){
                //console.log(scene.children[i].name);
                if(scene.children[i].name==this.name){
                    scene.children[i].visible = jar;
                }
            }
            // selectedObject = scene.getObjectByName(this.name);
            // console.log(selectedObject);
            // selectedObject.visible = jar;
        });

        parameters.f = kolor;
        var color = folder.addColor(parameters, 'f').name('Color');
        //var color = folder.addColor("#0000ff").name('Color');                 //nie dziala
        color.name = nazwa;
        color.onChange(function(jar){

            //selectedObject = scene.getObjectByName(this.name);
            //selectedObject.material.color.setHex(jar.replace("#", "0x"));

            var children = scene.children;
            for(var i=0; i<scene.children.length;i++){
                //console.log(scene.children[i].name);
                if(scene.children[i].name==this.name){
                    scene.children[i].material.color.setHex(jar.replace("#", "0x"));
                }
            }
        });


    //}
    // console.log("ilosc="+gui.__controllers[0].object.a);
    // console.log("gui.__folders");
    // console.log(gui.__folders);
}

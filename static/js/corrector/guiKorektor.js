var gui;
var featuresObj = {
    downloadModel:function(){
        //console.log("clicked")
        model.zapisz();
    },

    toggleCorrection:function(){
        if (model.correction==true) {
            model.correction=false;
            model.wczytajZServera(sciezka2+model.nazwaModelu);
        } else {
            model.correction=true;
            model.wczytajZServeraIPopraw(sciezka2+model.nazwaModelu);
        }
    }
};



function displayGUI(nazwa){
    gui = new dat.GUI();

    var speed =0.1;
    var jar; //jar przetrzymuje wartosc

    parameters = {
        a: "text.txt",
        b: "",
        c: "explode",

    };

    // console.log(this.parameters);
    if(nazwa!=""){
        this.parameters.a=nazwa;
        model.wczytajZServeraIPopraw(sciezka2+nazwa);
    }

    var name = gui.add(parameters, 'a').name('Name');
    var geometr = gui.add(parameters, 'b', pliki).name('Model');
    geometr.onChange(function(jar){
        // parameters.a = jar;
        // console.log(parameters.a);
        //name.name(jar);
        //name = gui.add(parameters, 'a');
        //console.log(jar);
        name.setValue(jar);
        // model.wczytajZServera(sciezka2+jar);
        model.wczytajZServeraIPopraw(sciezka2+jar);
        model.correction=true;
    });

    gui.add(featuresObj,'downloadModel').name('Download model');
    gui.add(featuresObj,'toggleCorrection').name('Toggle correction');

    //gui.close();
    gui.open();
}

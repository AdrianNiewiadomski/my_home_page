function ustawTytul(){
    document.getElementById("check").checked = false;
}

function przelaczTytul(){

    if(document.getElementById("check").checked){
        document.getElementById('tytul').style.display = "none";
    }else{
        document.getElementById('tytul').style.display = "";
    }
}

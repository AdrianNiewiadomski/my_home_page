var tytulWidoczny = true;

function przelaczTytul(){
    console.log('przelaczTytul wywolane!');
    console.log(tytulWidoczny);
    tytulWidoczny = !tytulWidoczny;
    if(tytulWidoczny){
        document.getElementById('tytul').style.display = "none";
    }else{
        document.getElementById('tytul').style.display = "";
    }
}

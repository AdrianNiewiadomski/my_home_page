var wyswietlajZew = false;
var wyswietlajWew = false;

function przelaczMenu(){
    // console.log(window.innerWidth);
    var szerkoscOkna = window.innerWidth;

    if(szerkoscOkna <= 850){

        // console.log(szerkoscOkna);
        wyswietlajWew = !wyswietlajWew;
        if(wyswietlajWew){
            document.getElementById('menu-inside').classList.remove('menu-inside');
            document.getElementById('menu-inside').classList.add('menu-inside-visible');
        } else {
            document.getElementById('menu-inside').classList.remove('menu-inside-visible');
            document.getElementById('menu-inside').classList.add('menu-inside');
        }

    } else {
        wyswietlajZew = !wyswietlajZew;
        if(wyswietlajZew){
            document.getElementById('menu-outside').classList.remove('menu-outside');
            document.getElementById('menu-outside').classList.add('menu-outside-visible');
            var height = document.getElementsByTagName('header')[0].clientHeight;
            document.getElementById('menu-outside').style.top = height+"px";

        } else {
            document.getElementById('menu-outside').classList.remove('menu-outside-visible');
            document.getElementById('menu-outside').classList.add('menu-outside');
        }
    }
}

function ukryjMenu(){
    document.getElementById('check').checked = false;
}
function ukryjMenuZewnetrzne(){
    document.getElementById('menu-outside').classList.remove('menu-outside-visible');
    document.getElementById('menu-outside').classList.add('menu-outside');
    wyswietlajZew = !wyswietlajZew;
}

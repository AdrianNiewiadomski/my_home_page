var timer1 = 0;
var timer2 = 0;

function schowajSlajd(){
    $("#slajder").fadeOut(500);
}

function zamienAktywnePrzyciski(poprzedni, numer){
    document.getElementById(poprzedni).classList.remove('activeButton');
    document.getElementById(numer).classList.add('activeButton');
}

function zmienSlajd(numer){
    $("#slajder").fadeIn(500);
    var nowyHtml = window.html.join(numer);
    document.getElementById("slajder").innerHTML = nowyHtml;
}

function podmienLinkINazwe(numer){
    document.getElementById("link").href = linki[numer-1];
    document.getElementById("nazwa").innerHTML = nazwy[numer-1];
}

function slajderDzialaj(numer){
    var poprzedni = numer;
    numer +=1;
    if (numer > 3) {
        numer = 1;
    }

    zmienSlajd(numer);
    zamienAktywnePrzyciski(poprzedni, numer);
    podmienLinkINazwe(numer);

    window.timer1 = setTimeout("schowajSlajd()",4500);
    window.timer2 = setTimeout("slajderDzialaj(" +numer+")",5000);
}

function uruchomSlajder(numer){
    clearTimeout(window.timer1);
    clearTimeout(window.timer2);

    schowajSlajd();

    setTimeout("slajderDzialaj("+numer+")",500);
}

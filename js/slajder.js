var timer1 = 0;
var timer2 = 0;

function schowajSlajd() {
    $("#slajder").fadeOut(500);
}

function zamienAktywnePrzyciski() {
    document.getElementById(poprzedni).classList.remove('activeButton');
    document.getElementById(numer).classList.add('activeButton');
}

function zmienSlajd() {

    $("#slajder").fadeIn(500);
    var slajderInnerHtml = document.getElementById('slajder').innerHTML;
    slajderInnerHtml = slajderInnerHtml.replaceAll(/slajd\d/g, 'slajd'+numer);
    document.getElementById("slajder").innerHTML = slajderInnerHtml;
}

function podmienLinkINazwe() {
    document.getElementById("link").href = linki[numer-1];
    document.getElementById("nazwa").innerHTML = nazwy[numer-1];
}

function slajderDzialaj() {
    poprzedni = numer;
    numer++;
    if (numer > 3) {
        numer = 1;
    }

    zmienSlajd();
    zamienAktywnePrzyciski();
    podmienLinkINazwe();

    timer1 = setTimeout("schowajSlajd()",4500);
    timer2 = setTimeout("slajderDzialaj()",5000);
}

function ustawSlajd() {
    clearTimeout(timer1);
    clearTimeout(timer2);

    schowajSlajd();

    setTimeout("slajderDzialaj()",500);
}

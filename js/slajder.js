var timer1 = 0;
var timer2 = 0;

function schowajSlajd() {
    $("#slajder").fadeOut(500);
}

function zamienAktywnePrzyciski(poprzedni, numer) {
    document.getElementById(poprzedni).classList.remove('activeButton');
    document.getElementById(numer).classList.add('activeButton');
}

function zmienSlajd(numer) {
    $("#slajder").fadeIn(500);
    var slajderInnerHtml = document.getElementById('slajder').innerHTML;
    slajderInnerHtml = slajderInnerHtml.replaceAll(/slajd\d/g, 'slajd'+numer);
    document.getElementById("slajder").innerHTML = slajderInnerHtml;
}

function podmienLinkINazwe(numer) {
    document.getElementById("link").href = linki[numer-1];
    document.getElementById("nazwa").innerHTML = nazwy[numer-1];
}

function slajderDzialaj(numer) {
    poprzedni = numer;
    numer++;
    if (numer > 3) {
        numer = 1;
    }

    zmienSlajd(numer);
    zamienAktywnePrzyciski(poprzedni, numer);
    podmienLinkINazwe(numer);

    timer1 = setTimeout("schowajSlajd()",4500);
    timer2 = setTimeout("slajderDzialaj("+numer+")",5000);
}

function ustawSlajd(numer) {
    clearTimeout(timer1);
    clearTimeout(timer2);

    schowajSlajd();

    setTimeout("slajderDzialaj("+numer+")",500);
}

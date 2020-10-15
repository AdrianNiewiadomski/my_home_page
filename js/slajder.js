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

    var html = [
        '<picture><source media="(min-width: 800px)" srcset="img/slajd',
        '_very_large.png"><source media="(min-width: 500px)" srcset="img/slajd',
        '_large.png"><source media="(min-width: 400px)" srcset="img/slajd',
        '_medium.png"><img src="img/slajd',
        '_small.png"></picture>'
    ];

    var nowyHtml = html.join(numer);
    document.getElementById("slajder").innerHTML = nowyHtml;
}

function podmienLinkINazwe(numer) {
    document.getElementById("link").href = linki[numer-1];
    document.getElementById("nazwa").innerHTML = nazwy[numer-1];
}

function slajderDzialaj(numer) {
    var numer = parseInt(numer, 10)
    var poprzedni = numer;
    numer +=1;
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

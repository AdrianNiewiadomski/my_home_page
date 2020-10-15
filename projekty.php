<!DOCTYPE html>
<html lang="pl-PL">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="description" content="Strona domowa Adriana Niewiadomskiego">
        <meta name="keywords" content="Adrian Niewiadomski, Niewiadomski, Adrian Niewiadomski homepage">
        <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'>
        <link rel="stylesheet" href="css/style.css">
        <link rel="stylesheet" href="css/mediaQueries.css">
        <link href="img/favicon.ico" rel="shortcut icon" type="image/x-icon" />
        <link rel="icon" href="img/favicon.ico" sizes="16x16">
        <script src="https://kit.fontawesome.com/64f7cfc6e1.js" crossorigin="anonymous"></script>
        <script src="js/jquery-3.5.1.min.js"></script>
        <script src="js/slajder.js" charset="utf-8"></script>
        <title>Adrian Niewiadomski | Projekty</title>
    </head>
    <body>
        <header>
            <div class="container">
                <h2><a href="index.html">&lt;<span>AN</span>&gt;</a></h2>
                <nav>
                    <label id="ham" for="check">
                        <span>&nbsp;</span>
                        <span>&nbsp;</span>
                        <span>&nbsp;</span>
                    </label>
                    <input type="checkbox" id="check">
                    <ul id="glowne-menu">
                        <li><a href="index.html">Home</a></li>
                        <li><a href="o_mnie.html">O mnie</a></li>
                        <li class="active"><a href="projekty.php">Projekty</a></li>
                        <li><a href="kontakt.html">Kontakt</a></li>
                    </ul>
                </nav>

            </div>
        </header>

        <section id="sekcja-projekty">
            <div class="container">
                <?php
                    $a = isset($_GET['a'])?intval($_GET['a']):rand(1,3);

                    $names = array('Tworzenie przekrojów obiektów 3D',
                                   'Korekta wektorów normalnych obiektów 3D',
                                   'Gra wąż napisana w JavaScript');

                    echo '<h1 id="nazwa">'.$names[$a-1].'</h1>';
                 ?>

                <div id="slajder">
                    <picture>
                        <?php
                            echo '<source media="(min-width: 800px)" srcset="img/slajd'.$a.'_very_large.png">';
                            echo '<source media="(min-width: 500px)" srcset="img/slajd'.$a.'_large.png">';
                            echo '<source media="(min-width: 400px)" srcset="img/slajd'.$a.'_medium.png">';
                            echo '<img src="img/slajd'.$a.'_small.png">';
                        ?>
                    </picture>
                </div>
                <div class="menu">
                    <?php
                        for ($x=1; $x<=3; $x++){
                            echo '<a id="'.$x.'" class="dot ';
                            if ($x==$a)
                                echo 'activeButton';
                            echo '" href="projekty.php?a='.$x.'"></a>';
                        }
                     ?>
                </div>
            </div>
            <?php
                $links = array('http://155.158.112.56/~PracaInzAN/index.php?action=viewModels',
                               'http://155.158.112.56/~PracaInzAN/index.php?action=edit',
                               'http://adrianniewiadomski.pl/Snake/');

                echo '<a id="link" href="'.$links[$a-1].'" class="button" target="_blank">Zobacz</a>';
             ?>

        </section>

        <footer>
            <div class="container">

                <a class="icon-big" href="mailto:kontakt@adrianniewiadomski.pl"><i class="far fa-envelope fa-3x"></i></a>
                <a class="icon-big" href="https://github.com/AdrianNiewiadomski" target="_blank"><i class="fab fa-github fa-3x"></i></a>
                <a class="icon-big" href="https://pl.linkedin.com/in/adrian-niewiadomski-84589356" target="_blank">
                    <i class="fab fa-linkedin-in fa-3x"></i></a>
                <a class="icon-big" href="https://www.researchgate.net/profile/A_Niewiadomski" target="_blank"><i class="fab fa-researchgate fa-3x"></i></a>

                <a class="icon-small" href="mailto:kontakt@adrianniewiadomski.pl"><i class="far fa-envelope fa-2x"></i></a>
                <a class="icon-small" href="https://github.com/AdrianNiewiadomski" target="_blank"><i class="fab fa-github fa-2x"></i></a>
                <a class="icon-small" href="https://pl.linkedin.com/in/adrian-niewiadomski-84589356" target="_blank">
                    <i class="fab fa-linkedin-in fa-2x"></i></a>
                <a class="icon-small" href="https://www.researchgate.net/profile/A_Niewiadomski" target="_blank"><i class="fab fa-researchgate fa-2x"></i></a>

                <p>2019 &copy; Adrian Niewiadomski</p>
            </div>
        </footer>

        <script type="text/javascript">
            <?php
                echo 'var nazwy = ["'.implode('","', $names).'"];';
                echo 'var linki = ["'.implode('","', $links).'"];';
                echo 'setTimeout("ustawSlajd('.$a.')",4500);';
             ?>
        </script>
    </body>
</html>

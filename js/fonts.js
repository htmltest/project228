var html = document.documentElement;

var fontsfile = document.createElement('link');
fontsfile.href = pathTemplate + 'css/fonts.css';
fontsfile.rel = 'stylesheet';
document.head.appendChild(fontsfile);

if (sessionStorage.fontsLoaded) {
    html.classList.add('fonts-loaded');
} else {
    var script = document.createElement('script');
    script.src = pathTemplate + 'js/fontfaceobserver.js';
    script.async = true;

    script.onload = function () {
        var Gilroy400 = new FontFaceObserver('Gilroy', {
            weight: 'normal'
        });
        var Gilroy500 = new FontFaceObserver('Gilroy', {
            weight: '500'
        });
        var Gilroy500i = new FontFaceObserver('Gilroy', {
            style: 'italic',
            weight: '500'
        });
        var Gilroy600 = new FontFaceObserver('Gilroy', {
            weight: '600'
        });
        var Gilroy700 = new FontFaceObserver('Gilroy', {
            weight: 'bold'
        });
        var FiraSansCondensed600 = new FontFaceObserver('FiraSansCondensed', {
            weight: '600'
        });
        var FiraSansCondensed700 = new FontFaceObserver('FiraSansCondensed', {
            weight: 'bold'
        });
        var FiraSansCondensed700i = new FontFaceObserver('FiraSansCondensed', {
            style: 'italic',
            weight: 'bold'
        });

        Promise.all([
            Gilroy400.load(),
            Gilroy500.load(),
            Gilroy500i.load(),
            Gilroy600.load(),
            Gilroy700.load(),
            FiraSansCondensed600.load(),
            FiraSansCondensed700.load(),
            FiraSansCondensed700i.load()
        ]).then(function () {
            html.classList.add('fonts-loaded');
            sessionStorage.fontsLoaded = true;
        });
    };
    document.head.appendChild(script);
}
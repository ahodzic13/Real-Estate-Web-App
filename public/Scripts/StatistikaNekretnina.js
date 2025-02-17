let StatistikaNekretnina = function () {
    let spisakNekretnina = SpisakNekretnina();

    let init = function (listaNekretnina, listaKorisnika) {
        spisakNekretnina.init(listaNekretnina, listaKorisnika);
    };

    let prosjecnaKvadratura = function (kriterij) {
        let filtrirane = spisakNekretnina.filtrirajNekretnine(kriterij);
        if (filtrirane.length === 0) return 0;
        let ukupnaKvadratura = filtrirane.reduce((sum, nekretnina) => sum + nekretnina.kvadratura, 0);
        return ukupnaKvadratura / filtrirane.length;
    };

    let outlier = function (kriterij, nazivSvojstva) {
        let filtriraneNekretnine = spisakNekretnina.filtrirajNekretnine(kriterij);
        console.log(filtriraneNekretnine);
        if (filtriraneNekretnine.length === 0) return null;

        let ukupno = 0;
        for (let i = 0; i < filtriraneNekretnine.length; i++) {
            ukupno += filtriraneNekretnine[i][nazivSvojstva];
        }
        let prosjek = ukupno / listaNekretnina.length; //sve nekretnine


        let maxOdstupanje = -1;
        let outlierNekretnina = null;
        filtriraneNekretnine.forEach(nekretnina => {
            let odstupanje = Math.abs(nekretnina[nazivSvojstva] - prosjek);
            if (odstupanje > maxOdstupanje) {
                maxOdstupanje = odstupanje;
                outlierNekretnina = nekretnina;
            }
        });
        return outlierNekretnina;
    };

    let mojeNekretnine = function (korisnik) {
        let nekretnineSaUpitima = spisakNekretnina.listaNekretnina.filter(nekretnina => 
            nekretnina.upiti.some(upit => upit.korisnik_id === korisnik.id)
        );

        return nekretnineSaUpitima.sort((a, b) => b.upiti.length - a.upiti.length);
    };

    let histogramCijena = function (periodi, rasponiCijena) {
        let rezultat = [];

        periodi.forEach((period, indeksPerioda) => {
            /*let nekretnineUPeriodu = nekretnine.listaNekretnina.filter(nekretnina => {
                let godina = new Date(nekretnina.datum_objave).getFullYear();
                return godina >= period.od && godina <= period.do;*/
                let nekretnineUPeriodu = listaNekretnina.filter(nekretnina => {
                    // Konvertovanje datuma iz formata DD.MM.YYYY. u format YYYY-MM-DD
                    let datumParts = nekretnina.datum_objave.split('.');
                    let godina = parseInt(datumParts[2]);
                    let mjesec = parseInt(datumParts[1]) - 1; 
                    let dan = parseInt(datumParts[0]);
                    let datumObjave = new Date(godina, mjesec, dan);
                
                    console.log(datumObjave); 
                    return datumObjave.getFullYear() >= period.od && datumObjave.getFullYear() <= period.do;
                
            });

            rasponiCijena.forEach((raspon, indeksRasponaCijena) => {
                let nekretnineURasponu = nekretnineUPeriodu.filter(nekretnina => 
                    nekretnina.cijena >= raspon.od && nekretnina.cijena <= raspon.do
                );

                rezultat.push({
                    indeksPerioda,
                    indeksRasponaCijena,
                    brojNekretnina: nekretnineURasponu.length
                });
            });
        });

        return rezultat;
    };

    return {
        init,
        prosjecnaKvadratura,
        outlier,
        mojeNekretnine,
        histogramCijena
    };
};

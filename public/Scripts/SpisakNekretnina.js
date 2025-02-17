let SpisakNekretnina = function () {
    //privatni atributi modula
    let listaNekretnina = [];
    let listaKorisnika = [];


    //implementacija metoda
    let init = function (listaNekretnina, listaKorisnika) {
        this.listaNekretnina = listaNekretnina;
        this.listaKorisnika = listaKorisnika;
    }

    let filtrirajNekretnine = function (kriterij) {
        return this.listaNekretnina.filter(nekretnina => {
            // Filtriranje po tipu nekretnine
            if (kriterij.tip_nekretnine && nekretnina.tip_nekretnine !== kriterij.tip_nekretnine) {
                return false;
            }

            // Filtriranje po minimalnoj kvadraturi
            if (kriterij.min_kvadratura && nekretnina.kvadratura < kriterij.min_kvadratura) {
                return false;
            }

            // Filtriranje po maksimalnoj kvadraturi
            if (kriterij.max_kvadratura && nekretnina.kvadratura > kriterij.max_kvadratura) {
                return false;
            }

            // Filtriranje po minimalnoj cijeni
            if (kriterij.min_cijena && nekretnina.cijena < kriterij.min_cijena) {
                return false;
            }

            // Filtriranje po maksimalnoj cijeni
            if (kriterij.max_cijena && nekretnina.cijena > kriterij.max_cijena) {
                return false;
            }
            
            //KOD ISPOD DODAO JA ZA STATISTIKA.HTML, IAKO JE NA PIAZZI RECENO DA NIJE OBAVEZNO 

            if (kriterij.cijena && Number(nekretnina.cijena) !== Number(kriterij.cijena)) {
                return false;
            }
            //Filtriranje po tipu girjanja
    
            if (kriterij.tip_grijanja && nekretnina.tip_grijanja !== kriterij.tip_grijanja) {
                return false;
            }
    
            // Filtriranje po kvadraturi
            if (kriterij.kvadratura && Number(nekretnina.kvadratura) !== Number(kriterij.kvadratura)) {
                return false;
            }

            // Filtriranje po lokaciji
            if (kriterij.lokacija && !nekretnina.lokacija.toLowerCase().includes(kriterij.lokacija.toLowerCase())) {
                return false;
            }

            // Filtriranje po godini izgradnje
            if (kriterij.godina_izgradnje && Number(nekretnina.godina_izgradnje) !== Number(kriterij.godina_izgradnje)) {
                return false;
            }

            // Filtriranje po datumu objave
            if (kriterij.datum_objave && nekretnina.datum_objave !== kriterij.datum_objave) {
                return false;
            }

            if (kriterij.naziv && !nekretnina.naziv.toLowerCase().includes(kriterij.naziv.toLowerCase())) {
                return false;
            }
            
            if (kriterij.datum_objave) {
                // Parsiranje datuma nekretnine (DD.MM.YYYY)
                let datumParts = nekretnina.datum_objave.split('.'); // "DD.MM.YYYY"
                let godina = parseInt(datumParts[2], 10);
                let mjesec = parseInt(datumParts[1], 10) - 1; // Mjeseci su 0-indeksirani
                let dan = parseInt(datumParts[0], 10);
            
                let datumNekretnine = new Date(godina, mjesec, dan);
            
                // Izvlačenje godine, mjeseca i dana iz kriterij.datum_objave
                let godinaKriterija = kriterij.datum_objave.getFullYear();
                let mjesecKriterija = kriterij.datum_objave.getMonth(); // Već 0-indeksiran
                let danKriterija = kriterij.datum_objave.getDate();
            
                // Upoređivanje godina, mjeseci i dana
                if (
                    godina !== godinaKriterija ||
                    mjesec !== mjesecKriterija ||
                    dan !== danKriterija
                ) {
                    return false;
                }
            }
                        

            return true;
        });
    }

    let ucitajDetaljeNekretnine = function (id) {
        return listaNekretnina.find(nekretnina => nekretnina.id === id) || null;
    }


    return {
        init: init,
        filtrirajNekretnine: filtrirajNekretnine,
        ucitajDetaljeNekretnine: ucitajDetaljeNekretnine
    }
};
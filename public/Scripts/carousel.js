/*function postaviCarousel(glavniElement, sviElementi, indeks = 0) {
    // Validacija parametara
    if (!glavniElement || !Array.isArray(sviElementi) || sviElementi.length === 0 || indeks < 0 || indeks >= sviElementi.length) {
        return null;
    }

    // Funkcija za prikaz trenutnog elementa
    function prikaziElement(index) {
        sviElementi.forEach((el, i) => {
            el.style.display = i === index ? 'block' : 'none';
        });
    }

    prikaziElement(indeks);  // Prikaz inicijalnog elementa

    // Funkcije za navigaciju
    function fnLijevo() {
        indeks = (indeks - 1 + sviElementi.length) % sviElementi.length;
        prikaziElement(indeks);
    }

    function fnDesno() {
        indeks = (indeks + 1) % sviElementi.length;
        prikaziElement(indeks);
    }

    // Vraćanje funkcija
    return { fnLijevo, fnDesno };
}*/

function postaviCarousel(glavniElement, sviElementi, indeks = 0) {
    if (!glavniElement || !Array.isArray(sviElementi) || sviElementi.length === 0 || indeks < 0 || indeks >= sviElementi.length) {
        return null;
    }

    function prikaziElement(index) {
        glavniElement.innerHTML = sviElementi[index].innerHTML;
    }
    
    prikaziElement(indeks);  

    function fnLijevo() {
        indeks = (indeks - 1 + sviElementi.length) % sviElementi.length;
        prikaziElement(indeks);
    }

    function fnDesno() {
        indeks = (indeks + 1) % sviElementi.length;
        prikaziElement(indeks);
    }

    return { fnLijevo, fnDesno };
}



let statistika = StatistikaNekretnina();
const listaNekretnina = [{
    id: 1,
    tip_nekretnine: "Stan",
    naziv: "Useljiv stan Sarajevo",
    kvadratura: 58,
    cijena: 232000,
    tip_grijanja: "plin",
    lokacija: "Novo Sarajevo",
    godina_izgradnje: 2019,
    datum_objave: "01.10.2023.",
    opis: "Sociis natoque penatibus.",
    upiti: [{
        korisnik_id: 1,
        tekst_upita: "Nullam eu pede mollis pretium."
    },
    {
        korisnik_id: 2,
        tekst_upita: "Phasellus viverra nulla."
    }]
},{
    id: 1,
    tip_nekretnine: "Stan",
    naziv: "Useljiv stan Sarajevo",
    kvadratura: 58,
    cijena: 32000,
    tip_grijanja: "plin",
    lokacija: "Novo Sarajevo",
    godina_izgradnje: 2019,
    datum_objave: "01.10.2009.",
    opis: "Sociis natoque penatibus.",
    upiti: [{
        korisnik_id: 1,
        tekst_upita: "Nullam eu pede mollis pretium."
    },
    {
        korisnik_id: 2,
        tekst_upita: "Phasellus viverra nulla."
    }]
},{
    id: 1,
    tip_nekretnine: "Stan",
    naziv: "Useljiv stan Sarajevo",
    kvadratura: 58,
    cijena: 232000,
    tip_grijanja: "plin",
    lokacija: "Novo Sarajevo",
    godina_izgradnje: 2019,
    datum_objave: "01.10.2003.",
    opis: "Sociis natoque penatibus.",
    upiti: [{
        korisnik_id: 1,
        tekst_upita: "Nullam eu pede mollis pretium."
    },
    {
        korisnik_id: 2,
        tekst_upita: "Phasellus viverra nulla."
    }]
},
{
    id: 2,
    tip_nekretnine: "Kuća",
    naziv: "Mali poslovni prostor",
    kvadratura: 20,
    cijena: 70000,
    tip_grijanja: "struja",
    lokacija: "Centar",
    godina_izgradnje: 2005,
    datum_objave: "20.08.2023.",
    opis: "Magnis dis parturient montes.",
    upiti: [{
        korisnik_id: 2,
        tekst_upita: "Integer tincidunt."
    }
    ]
},
{
    id: 3,
    tip_nekretnine: "Kuća",
    naziv: "Mali poslovni prostor",
    kvadratura: 20,
    cijena: 70000,
    tip_grijanja: "struja",
    lokacija: "Centar",
    godina_izgradnje: 2005,
    datum_objave: "20.08.2023.",
    opis: "Magnis dis parturient montes.",
    upiti: [{
        korisnik_id: 2,
        tekst_upita: "Integer tincidunt."
    }
    ]
},
{
    id: 4,
    tip_nekretnine: "Kuća",
    naziv: "Mali poslovni prostor",
    kvadratura: 20,
    cijena: 70000,
    tip_grijanja: "struja",
    lokacija: "Centar",
    godina_izgradnje: 2005,
    datum_objave: "20.08.2023.",
    opis: "Magnis dis parturient montes.",
    upiti: [{
        korisnik_id: 2,
        tekst_upita: "Integer tincidunt."
    }
    ]
}]

const listaKorisnika = [{
    id: 1,
    ime: "Neko",
    prezime: "Nekic",
    username: "username1",
},
{
    id: 2,
    ime: "Neko2",
    prezime: "Nekic2",
    username: "username2",
}]

statistika.init(listaNekretnina, listaKorisnika);


function onKriterijChange() {
    const kriterij = document.getElementById("kriterij-select").value;
    const container = document.getElementById("kriterij-value-container");

    let inputField = "";
    switch (kriterij) {
        case "tip_nekretnine":
            inputField = `
                <select id="kriterij-value">
                    <option value="Stan">Stan</option>
                    <option value="Kuća">Kuća</option>
                    <option value="Poslovni prostor">Poslovni prostor</option>
                </select>`;
            break;
        case "tip_grijanja":
            inputField = `
                <select id="kriterij-value">
                    <option value="plin">Plin</option>
                    <option value="struja">Struja</option>
                </select>`;
            break;
        case "lokacija":
            inputField = `<input type="text" id="kriterij-value" placeholder="Unesite lokaciju" />`;
            break;
        case "naziv":
            inputField = `<input type="text" id="kriterij-value" placeholder="Unesite naziv" />`;
            break;
        case "datum_objave":
            inputField = `<input type="date" id="kriterij-value" placeholder="Unesite datum objave" />`;
            break;
       case "godina_izgradnje":
        case "kvadratura":
        case "cijena":
            inputField = `<input type="number" id="kriterij-value" placeholder="${kriterij}" />`;
            break;
        default:
            inputField = "";
    }
    container.innerHTML = inputField;
}

function onOutlierKriterijChange() {
    const kriterij = document.getElementById("kriterij-outlier-select").value;
    const container = document.getElementById("outlier-kriterij-value-container");

    let inputField = "";
    switch (kriterij) {
        case "tip_nekretnine":
            inputField = `
                <select id="kriterij-outlier-value">
                    <option value="Stan">Stan</option>
                    <option value="Kuća">Kuća</option>
                    <option value="Poslovni prostor">Poslovni prostor</option>
                </select>`;
            break;
        case "tip_grijanja":
            inputField = `
                <select id="kriterij-outlier-value">
                    <option value="plin">Plin</option>
                    <option value="struja">Struja</option>
                </select>`;
            break;
        case "lokacija":
            inputField = `<input type="text" id="kriterij-outlier-value" placeholder="Unesite lokaciju" />`;
            break;
        case "naziv":
            inputField = `<input type="text" id="kriterij-outlier-value" placeholder="Unesite naziv" />`;
            break;
        case "datum_objave":
        inputField = `<input type="date" id="kriterij-outlier-value" placeholder="Unesite datum objave" />`;
        break;
        case "godina_izgradnje":
        case "kvadratura":
        case "cijena":
            inputField = `<input type="number" id="kriterij-outlier-value" placeholder="Unesite ${kriterij}" />`;
            break;
        default:
            inputField = "";
    }
    container.innerHTML = inputField;
}

function prikaziProsjecnuKvadraturu() {
    const kriterij = document.getElementById("kriterij-select").value;
    const vrijednost = document.getElementById("kriterij-value").value;

    const kriterijObjekat = { [kriterij]: vrijednost };

    const prosjecnaKvadratura = statistika.prosjecnaKvadratura(kriterijObjekat);

    const container = document.getElementById("prosjecna-kvadratura-container");
    if (prosjecnaKvadratura > 0) {
        container.innerHTML = `<p>Prosječna kvadratura za zadani kriterij je: ${prosjecnaKvadratura.toFixed(2)} m²</p>`;
    } else {
        container.innerHTML = `<p>Nema dostupnih podataka za zadani kriterij.</p>`;
    }
}

function prikaziOutlier() {
    const kriterij = document.getElementById("kriterij-outlier-select").value;
    const vrijednost = document.getElementById("kriterij-outlier-value").value;
    const nazivSvojstva = document.getElementById("svojstvo-outlier").value;

    const kriterijObjekat = { [kriterij]: vrijednost };

    const outlier = statistika.outlier(kriterijObjekat, nazivSvojstva);

    const container = document.getElementById("outlier-container");
    if (outlier) {
        container.innerHTML = `<p>Outlier za '${nazivSvojstva}' je: ${JSON.stringify(outlier)}</p>`;
    } else {
        container.innerHTML = `<p>Nema podataka za zadati kriterij i svojstvo.</p>`;
    }
}



function prikaziMojeNekretnine() {
    const korisnikId = parseInt(document.getElementById("korisnik-id").value);
    const korisnik = { id: korisnikId }; // Simulacija korisnika
    const mojeNekretnine = statistika.mojeNekretnine(korisnik);
    const container = document.getElementById("moje-nekretnine-container");

    if (mojeNekretnine.length > 0) {
        container.innerHTML = mojeNekretnine.map(n => `<p>${JSON.stringify(n)}</p>`).join('');
    } else {
        container.innerHTML = `<p>Korisnik nema nijednu nekretninu.</p>`;
    }
}


function dodajPeriod() {
    const periodContainer = document.getElementById("period-container");
    const newPeriod = document.createElement("div");
    newPeriod.className = "period";
    newPeriod.innerHTML = `
        <input type="number" name="odGodina" placeholder="Od Godine" />
        <input type="number" name="doGodina" placeholder="Do Godine" />
    `;
    periodContainer.appendChild(newPeriod);
}

function dodajRaspon() {
    const priceContainer = document.getElementById("price-container");
    const newPrice = document.createElement("div");
    newPrice.className = "price";
    newPrice.innerHTML = `
        <input type="number" name="odCijena" placeholder="Od Cijene" />
        <input type="number" name="doCijena" placeholder="Do Cijene" />
    `;
    priceContainer.appendChild(newPrice);
}

function unosPodataka() {
    const periodi = Array.from(document.getElementsByClassName("period")).map(div => {
        const odGodina = div.querySelector('[name="odGodina"]').value;
        const doGodina = div.querySelector('[name="doGodina"]').value;
        return { od: parseInt(odGodina), do: parseInt(doGodina) };
    });

    const rasponiCijena = Array.from(document.getElementsByClassName("price")).map(div => {
        const odCijena = div.querySelector('[name="odCijena"]').value;
        const doCijena = div.querySelector('[name="doCijena"]').value;
        return { od: parseFloat(odCijena), do: parseFloat(doCijena) };
    });

    return { periodi, rasponiCijena };
}

function iscrtajHistogram() {
    const { periodi, rasponiCijena } = unosPodataka();

    if (!periodi.length || !rasponiCijena.length) {
        alert("Molimo unesite barem jedan period i jedan raspon cijena.");
        return;
    }

    const podaci = statistika.histogramCijena(periodi, rasponiCijena);

    const histogramContainer = document.getElementById("histogram-container");
    histogramContainer.innerHTML = "";

    periodi.forEach((period, index) => {
        const canvas = document.createElement("canvas");
        histogramContainer.appendChild(canvas);

        const ctx = canvas.getContext("2d");
        const periodPodaci = podaci.filter(pod => pod.indeksPerioda === index);

        const labels = rasponiCijena.map((raspon, i) => 
            `Cijena ${raspon.od} - ${raspon.do}`
        );
        const values = periodPodaci.map(pod => pod.brojNekretnina || 0);

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: `Period ${period.od} - ${period.do}`,
                    data: values,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Broj Nekretnina'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Raspon Cijena'
                        }
                    }
                }
            }
        });
    });
}

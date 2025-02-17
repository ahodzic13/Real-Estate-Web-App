const PoziviAjax = (() => {

    // fnCallback se u svim metodama poziva kada stigne
    // odgovor sa servera putem Ajax-a
    // svaki callback kao parametre ima error i data,
    // error je null ako je status 200 i data je tijelo odgovora
    // ako postoji greška, poruka se prosljeđuje u error parametru
    // callback-a, a data je tada null

    function ajaxRequest(method, url, data, callback) {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    callback(null, xhr.responseText);
                } else {
                    callback({ status: xhr.status, statusText: xhr.statusText }, null);
                }
            }
        };
        xhr.send(data ? JSON.stringify(data) : null);
    }

    // vraća korisnika koji je trenutno prijavljen na sistem
    function impl_getKorisnik(fnCallback) {
        let ajax = new XMLHttpRequest();

        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4) {
                if (ajax.status == 200) {
                    console.log('Uspješan zahtjev, status 200');
                    fnCallback(null, JSON.parse(ajax.responseText));
                } else if (ajax.status == 401) {
                    console.log('Neuspješan zahtjev, status 401');
                    fnCallback("error", null);
                } else {
                    console.log('Nepoznat status:', ajax.status);
                }
            }
        };

        ajax.open("GET", "http://localhost:3000/korisnik/", true);
        ajax.setRequestHeader("Content-Type", "application/json");
        ajax.send();
    }

    // ažurira podatke loginovanog korisnika
    function impl_putKorisnik(noviPodaci, fnCallback) {
        // Check if user is authenticated
        if (!req.session.username) {
            // User is not logged in
            return fnCallback({ status: 401, statusText: 'Neautorizovan pristup' }, null);
        }

        // Get data from request body
        const { ime, prezime, username, password } = noviPodaci;

        // Read user data from the JSON file
        const users = readJsonFile('korisnici');

        // Find the user by username
        const loggedInUser = users.find((user) => user.username === req.session.username);

        if (!loggedInUser) {
            // User not found (should not happen if users are correctly managed)
            return fnCallback({ status: 401, statusText: 'Neautorizovan pristup' }, null);
        }

        // Update user data with the provided values
        if (ime) loggedInUser.ime = ime;
        if (prezime) loggedInUser.prezime = prezime;
        if (username) loggedInUser.adresa = adresa;
        if (password) loggedInUser.brojTelefona = brojTelefona;

        // Save the updated user data back to the JSON file
        saveJsonFile('korisnici', users);

        fnCallback(null, { poruka: 'Podaci su uspješno ažurirani' });
    }

    // dodaje novi upit za trenutno loginovanog korisnika
    function impl_postUpit(nekretnina_id, tekst_upita, fnCallback) {
        var ajax = new XMLHttpRequest();
    
        ajax.onreadystatechange = function () {
            if (ajax.readyState === 4) {
                if (ajax.status === 200 || ajax.status === 201) {
                    try {
                        const responseJSON = JSON.parse(ajax.responseText);
                        fnCallback({ status: ajax.status, data: responseJSON }); 
                    } catch (error) {
                        console.error("Greška pri parsiranju JSON odgovora:", error);
                        fnCallback(null); 
                    }
                } else {
                    console.error("Greška u AJAX odgovoru:", ajax.statusText);
                    fnCallback({ status: ajax.status, data: null });
                }
            }
        };
    
        ajax.open("POST", "http://localhost:3000/upit", true);
        ajax.setRequestHeader("Content-Type", "application/json");
    
        var objekat = {
            nekretnina_id: nekretnina_id,
            tekst_upita: tekst_upita,
        };
    
        console.log("Slanje podataka na server:", objekat);
        ajax.send(JSON.stringify(objekat));
    }
    

    function impl_getNekretnine(fnCallback) {
        // Koristimo AJAX poziv da bismo dohvatili podatke s servera
        ajaxRequest('GET', '/nekretnine', null, (error, data) => {
            // Ako se dogodi greška pri dohvaćanju podataka, proslijedi grešku kroz callback
            if (error) {
                fnCallback(error, null);
            } else {
                // Ako su podaci uspješno dohvaćeni, parsiraj JSON i proslijedi ih kroz callback
                try {
                    const nekretnine = JSON.parse(data);
                    fnCallback(null, nekretnine);
                } catch (parseError) {
                    // Ako se dogodi greška pri parsiranju JSON-a, proslijedi grešku kroz callback
                    fnCallback(parseError, null);
                }
            }
        });
    }

    function impl_postLogin(username, password, fnCallback) {
        var ajax = new XMLHttpRequest()

        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4 && ajax.status == 200) {
                fnCallback(null, ajax.response)
            }
            else if (ajax.readyState == 4) {
                //desio se neki error
                fnCallback(ajax.statusText, null)
            }
        }
        ajax.open("POST", "http://localhost:3000/login", true)
        ajax.setRequestHeader("Content-Type", "application/json")
        var objekat = {
            "username": username,
            "password": password
        }
        forSend = JSON.stringify(objekat)
        ajax.send(forSend)
    }

    function impl_postLogout(fnCallback) {
        let ajax = new XMLHttpRequest()

        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4 && ajax.status == 200) {
                fnCallback(null, ajax.response)
            }
            else if (ajax.readyState == 4) {
                //desio se neki error
                fnCallback(ajax.statusText, null)
            }
        }
        ajax.open("POST", "http://localhost:3000/logout", true)
        ajax.send()
    }

    function impl_getTop5Nekretnina(lokacija, fnCallback) {
        try {
            if (!lokacija) {
                throw new Error("Lokacija je obavezna.");
            }
    
            ajaxRequest("GET", `/nekretnine/top5?lokacija=${encodeURIComponent(lokacija)}`, null, (error, data) => {
                if (error) {
                    fnCallback(error, null);
                } else {
                    try {
                        const top5Nekretnina = JSON.parse(data);
                        fnCallback(null, top5Nekretnina);
                    } catch (parseError) {
                        fnCallback({ status: 500, statusText: 'Greška u parsiranju podataka' }, null);
                    }
                }
            });
        } catch (error) {
            fnCallback({ status: 400, statusText: error.message }, null);
        }
    }

    function impl_getMojiUpiti(fnCallback) {
        ajaxRequest('GET', '/upiti/moji', null, (error, data) => {
            if (error) {
                console.error("Greška u AJAX pozivu:", error);
                fnCallback(error, null);
            } else {
                console.log("Podaci sa servera:", JSON.parse(data));
                fnCallback(null, JSON.parse(data));
            }
        });
    }
    

    function impl_getNekretnina(nekretnina_id, fnCallback) {
        try {
            if (!nekretnina_id) {
                throw new Error("ID nekretnine je obavezan.");
            }
    
            ajaxRequest("GET", `/nekretnina/${nekretnina_id}`, null, (error, data) => {
                if (error) {
                    fnCallback(error, null);
                } else {
                    try {
                        const nekretnina = typeof data === "string" ? JSON.parse(data) : data;
                        fnCallback(null, nekretnina);
                    } catch (parseError) {
                        console.error("Greška prilikom parsiranja podataka:", data);
                        fnCallback({ status: 500, statusText: "Greška u parsiranju podataka" }, null);
                    }
                }
            });
        } catch (error) {
            fnCallback({ status: 400, statusText: error.message }, null);
        }
    }
    
    
    

    function impl_getNextUpiti(nekretnina_id, page, fnCallback) {
        ajaxRequest('GET', `/next/upiti/nekretnina/${nekretnina_id}?page=${page}`, null, (error, data) => {
            if (error) {
                fnCallback(error, null);
            } else {
                try {
                    const upiti = JSON.parse(data);
                    fnCallback(null, upiti);
                } catch (parseError) {
                    fnCallback({ status: 500, statusText: "Greška u parsiranju podataka" }, null);
                }
            }
        });
    }
    
    /*function impl_getInteresovanja(nekretnina_id, fnCallback) {
        ajaxRequest('GET', `/nekretnina/${nekretnina_id}/interesovanja`, null, (error, data) => {
            if (error) {
                fnCallback(error, null);
            } else {
                try {
                    const interesovanja = typeof data === "string" ? JSON.parse(data) : data;
                    fnCallback(null, interesovanja);
                } catch (parseError) {
                    fnCallback({ status: 500, statusText: "Greška u parsiranju podataka" }, null);
                }
            }
        });
    }*/

        function impl_getInteresovanja(nekretnina_id, fnCallback) {
            ajaxRequest('GET', `/nekretnina/${nekretnina_id}/interesovanja`, null, (error, data) => {
                if (error) {
                    fnCallback(error, null);
                } else {
                    console.log("Odgovor sa servera: ", data); // Dodaj log za prikaz podataka
                    // Provjeri da li su podaci objekat ili niz
                    const interesovanja =  JSON.parse(data);
                    console.log("Interesovanja kao niz: ", interesovanja); // Logiraj interesovanja kao niz
                    fnCallback(null, interesovanja);
                }
            });
        }
        
        function impl_postPonuda(nekretnina_id, tekst, ponudaCijene, datumPonude, idVezanePonude, odbijenaPonuda, fnCallback = () => {}) {
            const ajax = new XMLHttpRequest();
        
            ajax.onreadystatechange = function () {
                if (ajax.readyState === 4) {
                    if (ajax.status === 200 || ajax.status === 201) {
                        try {
                            const responseJSON = JSON.parse(ajax.responseText);
                            fnCallback({ status: ajax.status, data: responseJSON });
                        } catch (error) {
                            console.error("Greška pri parsiranju JSON odgovora:", error);
                            fnCallback(null);
                        }
                    } else {
                        console.error("Greška u AJAX odgovoru:", ajax.statusText);
                        fnCallback({ status: ajax.status, data: null });
                    }
                }
            };
        
            ajax.open("POST", `http://localhost:3000/nekretnina/${nekretnina_id}/ponuda`, true);
            ajax.setRequestHeader("Content-Type", "application/json");
        
            const objekat = {
                tekst,
                ponudaCijene,
                datumPonude,
                idVezanePonude,
                odbijenaPonuda,
            };
        
            ajax.send(JSON.stringify(objekat));
        }
        
        
        
    
    /*function impl_postPonuda(nekretnina_id, ponudaData, fnCallback) {
        ajaxRequest('POST', `/nekretnina/${nekretnina_id}/ponuda`, JSON.stringify(ponudaData), (error, data) => {
            if (error) {
                fnCallback(error, null);
            } else {
                try {
                    const ponuda = JSON.parse(data);
                    fnCallback(null, ponuda);
                } catch (parseError) {
                    fnCallback({ status: 500, statusText: "Greška u parsiranju podataka" }, null);
                }
            }
        });
    }*/

    function impl_postZahtjev(nekretnina_id, tekst, trazeniDatum, fnCallback) {
        var ajax = new XMLHttpRequest();
    
        ajax.onreadystatechange = function () {
            if (ajax.readyState === 4) {
                if (ajax.status === 200 || ajax.status === 201) {
                    try {
                        const responseJSON = JSON.parse(ajax.responseText);
                        fnCallback({ status: ajax.status, data: responseJSON });
                    } catch (error) {
                        console.error("Greška pri parsiranju JSON odgovora:", error);
                        fnCallback(null);
                    }
                } else {
                    console.error("Greška u AJAX odgovoru:", ajax.statusText);
                    fnCallback({ status: ajax.status, data: null });
                }
            }
        };
    
        ajax.open("POST", `http://localhost:3000/nekretnina/${nekretnina_id}/zahtjev`, true);
        ajax.setRequestHeader("Content-Type", "application/json");
    
        var objekat = {
            tekst: tekst,
            trazeniDatum: trazeniDatum,
        };
    
        ajax.send(JSON.stringify(objekat));
    }
    

    /*function impl_postZahtjev(nekretnina_id, tekst, trazeniDatum, fnCallback) {
        var ajax = new XMLHttpRequest();
    
        ajax.onreadystatechange = function () {
            if (ajax.readyState === 4) {
                if (ajax.status === 200 || ajax.status === 201) {
                    try {
                        const responseJSON = JSON.parse(ajax.responseText);
                        fnCallback({ status: ajax.status, data: responseJSON });
                    } catch (error) {
                        console.error("Greška pri parsiranju JSON odgovora:", error);
                        fnCallback(null);
                    }
                } else {
                    console.error("Greška u AJAX odgovoru:", ajax.statusText);
                    fnCallback({ status: ajax.status, data: null });
                }
            }
        };
    
        ajax.open("POST", `http://localhost:3000/nekretnina/${nekretnina_id}/zahtjev`, true);
        ajax.setRequestHeader("Content-Type", "application/json");
    
        const objekat = {
            tekst: tekst,
            trazeniDatum: trazeniDatum,
        };
    
        console.log("Slanje podataka na server:", objekat);
        ajax.send(JSON.stringify(objekat)); // Jedan `JSON.stringify` je dovoljan
    }*/
    

    function impl_updateZahtjev(nekretnina_id, zahtjev_id, zahtjevUpdateData, fnCallback) {
        ajaxRequest('PUT', `/nekretnina/${nekretnina_id}/zahtjev/${zahtjev_id}`, JSON.stringify(zahtjevUpdateData), (error, data) => {
            if (error) {
                fnCallback(error, null);
            } else {
                try {
                    const updatedZahtjev = JSON.parse(data);
                    fnCallback(null, updatedZahtjev);
                } catch (parseError) {
                    fnCallback({ status: 500, statusText: "Greška u parsiranju podataka" }, null);
                }
            }
        });
    }

    /*DODANO*/
    function impl_updatePonuda(ponuda_id, fnCallback = () => {}) {
        const ajax = new XMLHttpRequest();
    
        ajax.onreadystatechange = function () {
            if (ajax.readyState === 4) {
                if (ajax.status === 200) {
                    try {
                        const responseJSON = JSON.parse(ajax.responseText);
                        fnCallback({ status: ajax.status, data: responseJSON });
                    } catch (error) {
                        console.error("Greška pri parsiranju JSON odgovora:", error);
                        fnCallback(null);
                    }
                } else {
                    console.error("Greška u AJAX odgovoru:", ajax.statusText);
                    fnCallback({ status: ajax.status, data: null });
                }
            }
        };
    
        ajax.open("PUT", `http://localhost:3000/ponuda/${ponuda_id}/odbij`, true);
        ajax.setRequestHeader("Content-Type", "application/json");
    
        ajax.send();
    }
    
    

    return {
        postLogin: impl_postLogin,
        postLogout: impl_postLogout,
        getKorisnik: impl_getKorisnik,
        putKorisnik: impl_putKorisnik,
        postUpit: impl_postUpit,
        getNekretnine: impl_getNekretnine,
        getTop5Nekretnina: impl_getTop5Nekretnina,
        getMojiUpiti: impl_getMojiUpiti,
        getNekretnina: impl_getNekretnina,
        getNextUpiti: impl_getNextUpiti,
        getInteresovanja: impl_getInteresovanja,
        postPonuda: impl_postPonuda,
        postZahtjev: impl_postZahtjev,
        updatedZahtjev: impl_updateZahtjev,
        updatePonuda: impl_updatePonuda
    };
})();
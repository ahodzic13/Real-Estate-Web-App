document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const idNekretnine = urlParams.get("id");

    let allUpiti = []; // Svi dohvaćeni upiti
    let currentIndex = 0;
    let currentPage = 1;
    let isAllFetched = false; 
    let k = 2;

    let allZahtjevi = [];
    let allPonude = [];
    let indexZahtjeva = 0;
    let indexPonude = 0; 

PoziviAjax.getInteresovanja(idNekretnine, function(error, interesovanja) {
            if (error) {
                console.log("Greška prilikom dohvatanja interesovanja:", error);
            } else {
                allZahtjevi = interesovanja.zahtjevi;
                allPonude = interesovanja.ponude;
            }
        });

        
    function renderUpit(index) {
        if (index >= 0 && index < allUpiti.length) {
            const upit = allUpiti[index];
            const upitiHTML = `
                <div class="upit">
                    <p><strong>ID Korisnika: ${upit.korisnik_id}</strong></p>
                    <p><strong>ID Upita: ${upit.id}</strong></p>
                    <p>${upit.tekst}</p>
                </div>
            `;
            document.getElementById("upiti").innerHTML = upitiHTML;
        }
    }

   

    

    let korisnikData;

    PoziviAjax.getKorisnik(function(error, korisnik) {
        if (error) {
            console.log("Došlo je do greške:", error);
        } else {
            korisnikData = korisnik;
            console.log(korisnikData);  
        }
    }); 
    
    
       
    
        
    
    function renderZahtjevBezLogina (index){
        if(index >=0 && index < allZahtjevi.length) {
            const zahtjev = allZahtjevi[index];
            let status = "";
            if(zahtjev.odobren){
                status = "odobren";
            }else{
                status = "odbijen";
            }
            const zahtjeviHTML = `
                <div class="zahtjev">
                    <p><strong>ID zahtjeva: ${zahtjev.id}</strong></p>
                    <p>${zahtjev.tekst}</p>
                    <p><strong>Status: </strong>${status}</p>
                    <p><strong>Traženi datum: </strong>${zahtjev.trazeniDatum}</p>
                </div>
            `;
            document.getElementById("zahtjevi").innerHTML = zahtjeviHTML;
        }
    }

    function renderZahtjevAdminIliLogin (index){
        if(index >=0 && index < allZahtjevi.length) {
            const zahtjev = allZahtjevi[index];
            let status = "";
            if(zahtjev.odobren){
                status = "odobren";
            }else{
                status = "odbijen";
            }
            const zahtjeviHTML = `
                <div class="zahtjev">
                    <p><strong>ID zahtjeva: ${zahtjev.id}</strong></p>
                    <p>${zahtjev.tekst}</p>
                    <p><strong>Status: </strong>${status}</p>
                    <p><strong>Traženi datum: </strong>${zahtjev.trazeniDatum}</p>
                    <p><strong>Kreirano: </strong>${zahtjev.createdAt}</p>
                            <p><strong>Ažurirano: </strong>${zahtjev.updatedAt}</p>
                            <p><strong>Korisnik ID: </strong>${zahtjev.KorisnikId}</p>
                            <p><strong>Nekretnina ID: </strong>${zahtjev.NekretninaId}</p>
                </div>
            `;
            document.getElementById("zahtjevi").innerHTML = zahtjeviHTML;
        }
    }

    function renderPonudaAdminILogovan (index){
        if(index >=0 && index < allPonude.length) {
            const ponuda = allPonude[index];
            let status = "";
            if(!ponuda.odbijenaPonuda){
                status = "odobrena";
            }else {
                status = "odbijena";
            }
            const ponudeHTML = `
                <div class="ponuda">
                    <p><strong>ID ponude:</strong> ${ponuda.id}</p>
                    <p><strong>Tekst ponude:</strong> ${ponuda.tekst}</p>
                    <p><strong>Cijena ponude:</strong> ${ponuda.cijenaPonude}</p>
                    <p><strong>Datum ponude:</strong> ${ponuda.datumPonude}</p>
                    <p><strong>Odbijena ponuda:</strong> ${ponuda.odbijenaPonuda}</p>
                    <p><strong>Datum kreiranja:</strong> ${ponuda.createdAt}</p>
                    <p><strong>Datum ažuriranja:</strong> ${ponuda.updatedAt}</p>
                    <p><strong>ID korisnika:</strong> ${ponuda.KorisnikId}</p>
                    <p><strong>ID nekretnine:</strong> ${ponuda.NekretninaId}</p>
                    <p><strong>ID vezane ponude:</strong> ${ponuda.idVezanePonude}</p>
                </div>
            `;
            document.getElementById("ponude").innerHTML = ponudeHTML;
        }
    }
        


    function renderPonuda (index){
        if(index >=0 && index < allPonude.length) {
            const ponuda = allPonude[index];
            let status = "";
            if(!ponuda.odbijenaPonuda){
                status = "odobrena";
            }else {
                status = "odbijena";
            }
            const ponudeHTML = `
                <div class="ponuda">
                    <p><strong>ID ponude: ${ponuda.id}</strong></p>
                    <p>${ponuda.tekst}</p>
                    <p><strong>Status: </strong>${status}</p>
                </div>
            `;
            document.getElementById("ponude").innerHTML = ponudeHTML;
        }
    }

    if (idNekretnine) {
        PoziviAjax.getNekretnina(idNekretnine, function (error, nekretnina) {
            if (error) {
                console.error("Greška prilikom dohvatanja detalja nekretnine:", error);
            } else {
                const osnovnoHTML = `
                    <img src="../resources/${nekretnina.id}.jpg" alt="Nekretnina">
                    <p><strong>Naziv:</strong> ${nekretnina.naziv}</p>
                    <p><strong>Kvadratura:</strong> ${nekretnina.kvadratura} m²</p>
                    <p><strong>Cijena:</strong> ${nekretnina.cijena.toLocaleString()} KM</p>
                `;
                document.getElementById("osnovno").innerHTML = osnovnoHTML;

                const detaljiHTML = `
                    <div id="kolona1">
                        <p><strong>Tip grijanja:</strong> ${nekretnina.tip_grijanja}</p>
                        <p>
                            <strong>Lokacija:</strong>
                            <a href="#" id="lokacijaLink">${nekretnina.lokacija}</a>
                        </p>
                    </div>
                    <div id="kolona2">
                        <p><strong>Godina izgradnje:</strong> ${nekretnina.godina_izgradnje}</p>
                        <p><strong>Datum objave oglasa:</strong> ${nekretnina.datum_objave}</p>
                    </div>
                    <div id="opis">
                        <p><strong>Opis:</strong> ${nekretnina.opis}</p>
                    </div>
                `;
                document.getElementById("detalji").innerHTML = detaljiHTML;

                const formContainer = document.getElementById("form-container");
                const formHTML = `
                    <h3>Dodajte novo interesovanje</h3>
                    <form id="interesovanjeForm">
                        <label for="tip">Tip interesovanja:</label>
                        <select id="tip" name="tip">
                            <option value="upit">Upit</option>
                            <option value="zahtjev">Zahtjev</option>
                            <option value="ponuda">Ponuda</option>
                        </select>

                        <div id="ponudaDetails" style="display:none;">
                            <div>
                                <label for="ponudaCijene">Ponuda cijene:</label>
                                <input type="number" id="ponudaCijene" name="ponudaCijene" min="0">
                            </div>
                            <div>
                            <label for="datumPonude">Datum ponude:</label>
                            <input type="date" id="datumPonude" name="datumPonude">
                            </div>
                            <div>
                            <label for="idVezanePonude">ID vezane ponude:</label>
                            <select id="idVezanePonude" name="idVezanePonude">
                                <!-- Dropdown će biti popunjen ovde -->
                            </select>
                            </div>
                            <div>
                            <label for="odbijenaPonuda">Odbijena ponuda:</label>
                            <select id="odbijenaPonuda" name="odbijenaPonuda">
                                <option value="false">Ne</option>
                                <option value="true">Da</option>
                            </select>
                            </div>
                            
                        </div>

                        <div id="zahtjevDetails" style="display:none;">
                            <label for="trazeniDatum">Traženi datum:</label>
                            <input type="date" id="trazeniDatum" name="trazeniDatum">
                        </div>

                        <div id="tekstDetails">
                            <label for="tekst">Tekst interesovanja:</label>
                            <textarea id="tekst" name="tekst"></textarea>
                        </div>

                        <button type="submit" id="submitButton">Pošaljite upit</button>
                    </form>
                `;
                
                formContainer.innerHTML = formHTML;

                // Dodavanje vezanih ponuda na osnovu korisnika
                const idVezanePonudeSelect = document.getElementById('idVezanePonude');
                if (korisnikData && korisnikData.admin) {
                    PoziviAjax.getInteresovanja(idNekretnine, function(error, interesovanja) {
                        if (error) {
                            console.log("Greška prilikom dohvatanja interesovanja:", error);
                        } else {
                            console.log(interesovanja);
                            const filteredPonude = interesovanja.ponude;
                            if (filteredPonude.length > 0) {
                                filteredPonude.forEach(function(ponuda) {
                                    if(!ponuda.odbijenaPonuda){
                                        const option = document.createElement('option');
                                        option.value = ponuda.id;
                                        option.textContent = `Ponuda s ID-jem ${ponuda.id}`;
                                        idVezanePonudeSelect.appendChild(option);
                                    }
                                    
                                });
                            } else {
                                idVezanePonudeSelect.disabled = true; 
                            }
                        }
                    });
                } else if (korisnikData) {
                    PoziviAjax.getInteresovanja(idNekretnine, function(error, interesovanja) {
                        if (error) {
                            console.log("Greška prilikom dohvatanja interesovanja:", error);
                        } else {
                            console.log(interesovanja);
                            const filteredPonude = interesovanja.ponude.filter(ponuda => ponuda.KorisnikId === korisnikData.id);
                            if (filteredPonude.length > 0) {
                                filteredPonude.forEach(function(ponuda) {
                                    if(!ponuda.odbijenaPonuda){
                                        const option = document.createElement('option');
                                        option.value = ponuda.id;
                                        option.textContent = `Ponuda ${ponuda.id}`;
                                        idVezanePonudeSelect.appendChild(option);
                                    }
                                    
                                });
                            } else {
                                idVezanePonudeSelect.disabled = true; 
                            }
                        }
                    });
                } else {
                    idVezanePonudeSelect.disabled = true; 
                }

                const lokacijaLink = document.getElementById('lokacijaLink');
                if (lokacijaLink) {
                    lokacijaLink.addEventListener('click', function (event) {
                        event.preventDefault();
                        const lokacija = nekretnina.lokacija.trim();
                        PoziviAjax.getTop5Nekretnina(lokacija, function (error, topNekretnine) {
                            if (error) {
                                console.error("Greška prilikom dohvatanja top 5 nekretnina:", error);
                            } else {
                                console.log(topNekretnine);
                                localStorage.setItem('top5', JSON.stringify(topNekretnine));
                                window.location.href = `nekretnine.html`;
                            }
                        });
                    });
                }

                const tipSelect = document.getElementById("tip");
                const submitButton = document.getElementById("submitButton");

                tipSelect.addEventListener("change", function () {
                    const selectedType = tipSelect.value;
                    const ponudaDetails = document.getElementById("ponudaDetails");
                    const zahtjevDetails = document.getElementById("zahtjevDetails");

                    if (selectedType === "ponuda") {
                        ponudaDetails.style.display = "block";
                        zahtjevDetails.style.display = "none";
                        submitButton.textContent = "Pošaljite ponudu";
                    } else if (selectedType === "zahtjev") {
                        ponudaDetails.style.display = "none";
                        zahtjevDetails.style.display = "block";
                        submitButton.textContent = "Pošaljite zahtjev";
                    } else {
                        ponudaDetails.style.display = "none";
                        zahtjevDetails.style.display = "none";
                        submitButton.textContent = "Pošaljite upit";
                    }
                });

                let ponudaPoslanaKaoOdbijena = false;

                document.getElementById("interesovanjeForm").addEventListener("submit", function (e) {
                    e.preventDefault();

                    const tip = tipSelect.value;
                    const tekst = document.getElementById("tekst")?.value || null;
                    const trazeniDatum = document.getElementById("trazeniDatum")?.value || null;
                    const ponudaCijene = document.getElementById("ponudaCijene")?.value || null;
                    const datumPonude = document.getElementById("datumPonude")?.value || null;
                    const idVezanePonude = document.getElementById("idVezanePonude")?.value || null;
                    const odbijenaPonuda = document.getElementById("odbijenaPonuda")?.value === "true";

                    if (tip === "upit") {
                        PoziviAjax.postUpit(idNekretnine, tekst, function (response) {
                            if (response && response.status === 201) {
                                alert("Upit je uspješno poslan.");
                            } else {
                                alert("Greška prilikom slanja upita.");
                            }
                        });
                    } else if (tip === "zahtjev") {
                        PoziviAjax.postZahtjev(idNekretnine, tekst, trazeniDatum, function (response) {
                            if (response && response.status === 201) {
                                alert("Zahtjev je uspješno poslan.");
                            } else {
                                alert("Greška prilikom slanja zahtjeva.");
                            }
                        });
                    } else if (tip === "ponuda") {
                        PoziviAjax.postPonuda(idNekretnine, tekst, ponudaCijene, datumPonude, idVezanePonude, odbijenaPonuda, function (response) {
                            if (response && response.status === 201) {
                                if (odbijenaPonuda) {
                                    PoziviAjax.getInteresovanja(idNekretnine, function (error, interesovanja) {
                                        if (error) {
                                            console.log("Greška prilikom dohvatanja interesovanja:", error);
                                        } else {
                                            const filtriranePonude = interesovanja.ponude;
                                            console.log(`ISPISUJEM SAMO PRVU INTERESOVANJE: `);
                                            console.log(filtriranePonude);
                                            let trenutnaPonuda = filtriranePonude.find(
                                                (ponuda) => ponuda.id == idVezanePonude
                                            );
                                            console.log(trenutnaPonuda);
                                            do {
                                                const trenutniId = trenutnaPonuda.id;
                                
                                                console.log(`Ažuriram ponudu s ID-jem: ${trenutniId}`);
                                
                                                PoziviAjax.updatePonuda(trenutniId, function (updateResponse) {
                                                    if (updateResponse && updateResponse.status === 200) {
                                                        console.log(
                                                            `Ponuda s ID-jem ${trenutniId} uspešno ažurirana.`
                                                        );
                                                    } else {
                                                        console.error(
                                                            `Greška prilikom ažuriranja ponude s ID-jem ${trenutniId}.`
                                                        );
                                                    }
                                                });
                                
                                                trenutnaPonuda = filtriranePonude.find(
                                                    (ponuda) =>
                                                        ponuda.id === trenutnaPonuda.idVezanePonude
                                                );
                                
                                                if (trenutnaPonuda) {
                                                    console.log(
                                                        `Prelazim na sljedeću povezanu ponudu s ID-jem: ${trenutnaPonuda.id}`
                                                    );
                                                } else {
                                                    console.log("Nema više povezanih ponuda.");
                                                }
                                            }while(trenutnaPonuda)
                                
                                            console.log("Sve povezane ponude su završene.");
                                        }
                                    });
                                }                                                               
                            
                                alert("Ponuda je uspješno poslana.");
                            }                            
                            else {
                                alert("Greška prilikom slanja ponude.");
                            }
                        });
                        
                    }
                });
            
                    /*PoziviAjax.getInteresovanja(idNekretnine, function(error, interesovanja) {
                        if (error) {
                            console.log("Greška prilikom dohvatanja interesovanja:", error);
                        } else {
                            allZahtjevi = interesovanja.zahtjevi;
                            allPonude = interesovanja.ponude;
                        }
                    }); 
                    console.log(`ZAHTJEVIIIIIII`);
                    console.log(allZahtjevi);

                    if(allZahtjevi.length > 0){
                        if(!korisnikData){
                            renderZahtjevBezLogina(0);
                        }else if(korisnikData.admin || allZahtjevi[indexZahtjeva].KorisnikId == korisnikData.id){
                            renderZahtjevAdminIliLogin(0)
                        }else{
                            renderZahtjevBezLogina(0);
                        }
                    }
                    
                    //renderZahtjev(indexZahtjeva);

                    if(allPonude.length > 0){
                        if(!korisnikData){
                            renderPonuda(indexPonude);
                        }else if(korisnikData.admin || allPonude[indexPonude].KorisnikId == korisnikData.id){
                            renderPonudaAdminILogovan(indexPonude)
                        }else{
                            renderPonuda(indexPonude);
                        }
                    }*/

                allUpiti = nekretnina.upiti; 
                renderUpit(currentIndex); 

                setTimeout(function() {
                    console.log(`ZAHTJEVIIII`);
                    console.log(allZahtjevi);
                
                    if(allZahtjevi.length > 0){
                        if(!korisnikData){
                            renderZahtjevBezLogina(0);
                        } else if(korisnikData.admin || allZahtjevi[indexZahtjeva].KorisnikId == korisnikData.id){
                            renderZahtjevAdminIliLogin(0);
                        } else {
                            renderZahtjevBezLogina(0);
                        }
                    }
                
                    //renderZahtjev(indexZahtjeva);
                
                    if(allPonude.length > 0){
                        if(!korisnikData){
                            renderPonuda(indexPonude);
                        } else if(korisnikData.admin || allPonude[indexPonude].KorisnikId == korisnikData.id){
                            renderPonudaAdminILogovan(indexPonude);
                        } else {
                            renderPonuda(indexPonude);
                        }
                    }
                }, 1000); 
                
                
                
            }
        });
        
        
    }




    // Dugme "Sljedeći"
    document.getElementById("sljedeci").addEventListener("click", function () {
        if (currentIndex >= allUpiti.length - 1) {
            if (!isAllFetched) {
                PoziviAjax.getNextUpiti(idNekretnine, currentPage, function (error, nextUpiti) {
                    if (error) {
                        console.error("Greška prilikom dohvatanja sljedeće stranice:", error);
                        isAllFetched = true; 
                        currentIndex = 0; 
                        renderUpit(currentIndex);
                    } else if (nextUpiti.length === 0) {
                        isAllFetched = true; 
                        console.log("Nema više upita za učitavanje.");
                        currentIndex = 0; 
                        renderUpit(currentIndex);
                    } else {
                        allUpiti = allUpiti.concat(nextUpiti);
                        currentPage++; 
                        currentIndex++; 
                        renderUpit(currentIndex);
                    }
                });
            } else {
                currentIndex = 0; 
                renderUpit(currentIndex);
            }
        } else {
            currentIndex++;
            renderUpit(currentIndex);
        }
    });

    // Dugme "Prethodni"
    document.getElementById("prethodni").addEventListener("click", function () {
        currentIndex--;
        if (currentIndex < 0) {
            currentIndex = allUpiti.length - 1; 
        }
        renderUpit(currentIndex);
    });

    document.getElementById("sljedeciZahtjev").addEventListener("click", function(){
        indexZahtjeva++;
        if(indexZahtjeva > allZahtjevi.length - 1){
            indexZahtjeva = 0;
        }
        //renderZahtjev(indexZahtjeva);
        if(allZahtjevi.length > 0){
            if(!korisnikData){
            renderZahtjevBezLogina(indexZahtjeva);
            }else if(korisnikData.admin || allZahtjevi[indexZahtjeva].KorisnikId == korisnikData.id){
                renderZahtjevAdminIliLogin(indexZahtjeva)
            }else{
                renderZahtjevBezLogina(indexZahtjeva);
            }
        }
        
    });

    document.getElementById("prethodniZahtjev").addEventListener("click", function (){
        indexZahtjeva--;
        if(indexZahtjeva < 0){
            indexZahtjeva = allZahtjevi.length - 1;
        }
        //renderZahtjev(indexZahtjeva);
        if(allZahtjevi.length > 0){
            if(!korisnikData){
            renderZahtjevBezLogina(indexZahtjeva);
            }else if(korisnikData.admin || allZahtjevi[indexZahtjeva].KorisnikId == korisnikData.id){
                renderZahtjevAdminIliLogin(indexZahtjeva)
            }else{
                renderZahtjevBezLogina(indexZahtjeva);
            }
        }
        
    })

    document.getElementById("sljedecaPonuda").addEventListener("click", function(){
        indexPonude++;
        if(indexPonude > allPonude.length - 1){
            indexPonude = 0;
        }
        if(allPonude.length > 0){
            if(!korisnikData){
            renderPonuda(indexPonude);
            }else if(korisnikData.admin || allPonude[indexPonude].KorisnikId == korisnikData.id){
                renderPonudaAdminILogovan(indexPonude)
            }else{
                renderPonuda(indexPonude);
            }
        }
        
    });

    document.getElementById("prethodnaPonuda").addEventListener("click", function (){
        indexPonude--;
        if(indexPonude < 0){
            indexPonude = allPonude.length - 1;
        }
        if(allPonude.length>0){
            if(!korisnikData){
            renderPonuda(indexPonude);
            }else if(korisnikData.admin || allPonude[indexPonude].KorisnikId == korisnikData.id){
                renderPonudaAdminILogovan(indexPonude)
            }else{
                renderPonuda(indexPonude);
            }
        }
        
    })

});

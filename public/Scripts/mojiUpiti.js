document.addEventListener('DOMContentLoaded', () => {
    const upitiContainer = document.getElementById('upitiContainer');

    PoziviAjax.getMojiUpiti((error, upiti) => {
        if (error) {
            console.error("Greška pri dohvatanju upita:", error);
            upitiContainer.innerHTML = `<p>Greška pri dohvatanju upita: ${error.statusText}</p>`;
            return;
        }

        console.log("Dohvaćeni upiti:", upiti);

        if (!upiti || upiti.length === 0) {
            upitiContainer.innerHTML = `<p>Nemate upita.</p>`;
            return;
        }

        upiti.forEach(upit => {
            console.log("Renderujem upit:", upit);

            const upitElement = document.createElement('div');
            upitElement.classList.add('upit');
            upitElement.innerHTML = `
                <p><strong>ID Nekretnine:</strong> ${upit.id_nekretnine || 'N/A'}</p>
                <p><strong>Upit:</strong> ${upit.tekst_upita || 'N/A'}</p>
            `;
            upitiContainer.appendChild(upitElement);
        });
    });
});

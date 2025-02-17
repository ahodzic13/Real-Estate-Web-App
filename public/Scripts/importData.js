const { Korisnik, Nekretnina, Upit } = require('../database/modeli.js');
const korisnici = require('../../data/korisnici.json');
const nekretnine = require('../../data/nekretnine.json');

const importData = async () => {
    try {
        // Ubacivanje korisnika
        await Promise.all(
            korisnici.map(async (korisnik) => {
                await Korisnik.create({
                    id: korisnik.id,
                    ime: korisnik.ime,
                    prezime: korisnik.prezime,
                    username: korisnik.username,
                    password: korisnik.password,
                    admin: korisnik.admin || false, 
                });
            })
        );
        console.log('Korisnici su uspješno ubačeni u bazu.');

        // Ubacivanje nekretnina i upita
        for (const nekretnina of nekretnine) {
            const novaNekretnina = await Nekretnina.create({
                id: nekretnina.id,
                tip_nekretnine: nekretnina.tip_nekretnine,
                naziv: nekretnina.naziv,
                kvadratura: nekretnina.kvadratura,
                cijena: nekretnina.cijena,
                tip_grijanja: nekretnina.tip_grijanja,
                lokacija: nekretnina.lokacija,
                godina_izgradnje: nekretnina.godina_izgradnje,
                datum_objave: nekretnina.datum_objave,
                opis: nekretnina.opis,
            });

            // Ubacivanje upita vezanih za nekretninu
            for (const upit of nekretnina.upiti) {
                await Upit.create({
                    tekst: upit.tekst_upita,
                    KorisnikId: upit.korisnik_id, // Relacija prema korisniku
                    NekretninaId: novaNekretnina.id, // Relacija prema nekretnini
                });
            }
        }
        console.log('Nekretnine i upiti su uspješno ubačeni u bazu.');
        process.exit();
    } catch (error) {
        console.error('Greška prilikom migracije podataka:', error);
        process.exit(1);
    }
};

importData();

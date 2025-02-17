const express = require('express');
const session = require("express-session");
const path = require('path');
const fs = require('fs').promises; // Using asynchronus API for file read and write
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3000;

const { Nekretnina, Upit, Zahtjev, Ponuda, Korisnik } = require('./public/database/modeli');


app.use(session({
  secret: 'tajna sifra',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(express.static(__dirname + '/public'));

// Enable JSON parsing without body-parser
app.use(express.json());

/* ---------------- SERVING HTML -------------------- */

// Async function for serving html files
async function serveHTMLFile(req, res, fileName) {
  const htmlPath = path.join(__dirname, 'public/html', fileName);
  try {
    const content = await fs.readFile(htmlPath, 'utf-8');
    res.send(content);
  } catch (error) {
    console.error('Error serving HTML file:', error);
    res.status(500).json({ greska: 'Internal Server Error' });
  }
}

// Array of HTML files and their routes
const routes = [
  { route: '/nekretnine.html', file: 'nekretnine.html' },
  { route: '/detalji.html', file: 'detalji.html' },
  { route: '/meni.html', file: 'meni.html' },
  { route: '/prijava.html', file: 'prijava.html' },
  { route: '/profil.html', file: 'profil.html' },
  { route: '/mojiUpiti.html', file: 'mojiUpiti.html' }
  // Practical for adding more .html files as the project grows
];

// Loop through the array so HTML can be served
routes.forEach(({ route, file }) => {
  app.get(route, async (req, res) => {
    await serveHTMLFile(req, res, file);
  });
});

/* ----------- SERVING OTHER ROUTES --------------- */

// Async function for reading json data from data folder 
async function readJsonFile(filename) {
  const filePath = path.join(__dirname, 'data', `${filename}.json`);
  try {
    const rawdata = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(rawdata);
  } catch (error) {
    throw error;
  }
}

// Async function for reading json data from data folder 
async function saveJsonFile(filename, data) {
  const filePath = path.join(__dirname, 'data', `${filename}.json`);
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    throw error;
  }
}


// Route for '/'
app.get('/', (req, res) => {
  res.send('Welcome');
});

const LOGIN_ATTEMPTS_LIMIT = 3;
const LOGIN_BLOCK_TIME = 60000; // 1 minute in milliseconds
const loginAttempts = {};
//let podaciOgranicenja = {};



async function logToFile(fileName, logMessage) {
  const filePath = path.join(__dirname, fileName);
  const logEntry = `${new Date().toISOString()} - ${logMessage}\n`;
  await fs.appendFile(filePath, logEntry, 'utf8');
}



app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const now = Date.now();

  loginAttempts[username] = loginAttempts[username] || { count: 0, lastAttempt: 0, blockedUntil: 0 };
  const userAttempts = loginAttempts[username];

  if (userAttempts.blockedUntil > now) {
    return res.status(429).json({ greska: "Previše neuspješnih pokušaja. Pokušajte ponovo za 1 minutu." });
  }

  try {
    const korisnik = await Korisnik.findOne({ where: { username } });

    if (korisnik && await bcrypt.compare(password, korisnik.password)) {
      req.session.username = username;
      userAttempts.count = 0;
      console.log(`Prijava uspješna: ${username}`);
      return res.json({ poruka: 'Uspješna prijava' });
    } else {
      userAttempts.count++;
      userAttempts.lastAttempt = now;

      if (userAttempts.count >= LOGIN_ATTEMPTS_LIMIT) {
        userAttempts.blockedUntil = now + LOGIN_BLOCK_TIME;
      }

      console.log(`Neuspješna prijava: ${username}`);
      return res.json({ poruka: 'Neuspješna prijava' });
    }
  } catch (error) {
    console.error('Greška prilikom prijave:', error);
    res.status(500).json({ greska: 'Greška na serveru.' });
  }
});



app.post('/logout', (req, res) => {
  // Check if the user is authenticated
  if (!req.session.username) {
    // User is not logged in
    return res.status(401).json({ greska: 'Neautorizovan pristup' });
  }

  // Clear all information from the session
  req.session.destroy((err) => {
    if (err) {
      console.error('Error during logout:', err);
      res.status(500).json({ greska: 'Internal Server Error' });
    } else {
      res.status(200).json({ poruka: 'Uspješno ste se odjavili' });
    }
  });
});



app.get('/korisnik', async (req, res) => {
  if (!req.session.username) {
    return res.status(401).json({ greska: 'Neautorizovan pristup.' });
  }

  try {
    const korisnik = await Korisnik.findOne({ where: { username: req.session.username } });

    if (!korisnik) {
      return res.status(404).json({ greska: 'Korisnik nije pronađen.' });
    }

    res.status(200).json({
      id: korisnik.id,
      ime: korisnik.ime,
      prezime: korisnik.prezime,
      username: korisnik.username,
      admin: korisnik.admin
    });
  } catch (error) {
    console.error('Greška prilikom dohvaćanja korisničkih podataka:', error);
    res.status(500).json({ greska: 'Greška na serveru.' });
  }
});


/*
Updates any user field
*/
app.put('/korisnik', async (req, res) => {
  if (!req.session.username) {
    return res.status(401).json({ greska: 'Neautorizovan pristup.' });
  }

  const { ime, prezime, username, password } = req.body;

  try {
    const korisnik = await Korisnik.findOne({ where: { username: req.session.username } });

    if (!korisnik) {
      return res.status(404).json({ greska: 'Korisnik nije pronađen.' });
    }

    if (ime) korisnik.ime = ime;
    if (prezime) korisnik.prezime = prezime;
    if (username) korisnik.username = username;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      korisnik.password = hashedPassword;
    }

    await korisnik.save();

    res.status(200).json({ poruka: 'Podaci su uspješno ažurirani.' });
  } catch (error) {
    console.error('Greška prilikom ažuriranja korisnika:', error);
    res.status(500).json({ greska: 'Greška na serveru.' });
  }
});


app.get('/nekretnine/top5', async (req, res) => {
  const lokacija = req.query.lokacija;

  if (!lokacija) {
    return res.status(400).json({ greska: "Parametar 'lokacija' je obavezan." });
  }

  try {
    const nekretnine = await Nekretnina.findAll({
      where: { lokacija },
      order: [['datum_objave', 'DESC']],
      limit: 5,
    });

    if (nekretnine.length === 0) {
      return res.status(404).json({ greska: 'Nema nekretnina na traženoj lokaciji.' });
    }

    res.status(200).json(nekretnine);
  } catch (error) {
    console.error('Greška prilikom dohvaćanja nekretnina:', error);
    res.status(500).json({ greska: 'Greška na serveru.' });
  }
});



app.post('/upit', async (req, res) => {
  if (!req.session.username) {
      console.log('Korisnik nije prijavljen');
      return res.status(401).json({ greska: 'Neautorizovan pristup.' });
  }

  const { nekretnina_id, tekst_upita } = req.body;

  // Logovanje podataka koji dolaze u POST zahtev
  console.log('Primljeni podaci:', req.body);

  try {
      const korisnik = await Korisnik.findOne({ where: { username: req.session.username } });
      if (!korisnik) {
          console.log('Korisnik nije pronađen');
          return res.status(404).json({ greska: 'Korisnik nije pronađen.' });
      }

      const nekretnina = await Nekretnina.findByPk(nekretnina_id);
      console.log('Nekretnina:', nekretnina);

      if (!nekretnina) {
          console.log('Nekretnina nije pronađena');
          return res.status(404).json({ greska: 'Nekretnina nije pronađena.' });
      }

      const brojUpita = await Upit.count({
          where: { KorisnikId: korisnik.id, NekretninaId: nekretnina_id },
      });
      console.log('Broj upita:', brojUpita);

      if (brojUpita >= 3) {
          console.log('Previše upita za ovu nekretninu');
          return res.status(429).json({ greska: 'Previše upita za istu nekretninu.' });
      }

      const noviUpit = await Upit.create({
          tekst: tekst_upita,
          KorisnikId: korisnik.id,
          NekretninaId: nekretnina.id,
      });

      console.log('Novi upit:', noviUpit);

      res.status(201).json({ poruka: 'Upit je uspješno dodan.', upit: noviUpit });
  } catch (error) {
      console.error('Greška prilikom dodavanja upita:', error);
      res.status(500).json({ greska: 'Greška na serveru.' });
  }
});


app.get('/upiti/moji', async (req, res) => {
  if (!req.session.username) {
      return res.status(401).json({ greska: 'Neautorizovan pristup.' });
  }

  try {
      const korisnik = await Korisnik.findOne({ where: { username: req.session.username } });

      if (!korisnik) {
          return res.status(404).json({ greska: 'Korisnik nije pronađen.' });
      }

      const upiti = await Upit.findAll({
          where: { KorisnikId: korisnik.id },
          include: [
              {
                  model: Nekretnina,
                  as: 'Nekretnina',
                  attributes: ['id', 'naziv']
              }
          ]
      });

      const response = upiti.map(upit => ({
          id_nekretnine: upit.Nekretnina ? upit.Nekretnina.id : null,
          tekst_upita: upit.tekst
      }));

      res.status(200).json(response);
  } catch (error) {
      console.error('Greška prilikom dohvaćanja upita:', error);
      res.status(500).json({ greska: 'Greška na serveru.' });
  }
});


app.get('/nekretnine', async (req, res) => {
  try {
    const nekretnine = await Nekretnina.findAll();
    res.json(nekretnine);
  } catch (error) {
    console.error('Greška prilikom dohvaćanja nekretnina:', error);
    res.status(500).json({ greska: 'Greška na serveru.' });
  }
});


app.get('/nekretnina/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const nekretnina = await Nekretnina.findByPk(id);

    if (!nekretnina) {
      return res.status(404).json({ error: 'Nekretnina nije pronađena.' });
    }

    const upiti = await Upit.findAll({
      where: { NekretninaId: id },
      limit: 3,
      order: [['createdAt', 'DESC']],
    });

    const odgovor = {
      id: nekretnina.id,
      naziv: nekretnina.naziv,
      kvadratura: nekretnina.kvadratura,
      cijena: nekretnina.cijena,
      tip_grijanja: nekretnina.tip_grijanja,
      lokacija: nekretnina.lokacija,
      godina_izgradnje: nekretnina.godina_izgradnje,
      datum_objave: nekretnina.datum_objave,
      opis: nekretnina.opis,
      upiti: upiti.map(upit => ({
        id: upit.id,
        tekst: upit.tekst,
        korisnik_id: upit.KorisnikId,
      })),
    };

    res.status(200).json(odgovor);
  } catch (error) {
    console.error('Greška prilikom dohvaćanja detalja nekretnine:', error);
    res.status(500).json({ greska: 'Greška na serveru.' });
  }
});





/*
NAPOMENA!: Zbog konfuzije sa rasporedom kako se upiti trebaju vracati, kako i u kojem page-u,
a na Piazzi nismo dobili odgovor do 13.1., moja logika je da se pri vracanju nekretnine vrate 
zadja 3 upita, zatim page=1 vraca naredna 3(ako ima 9 upita, page 1 ce vratiti 4. 5. i 6.),
page=2 1. 2. i 3.
*/
/*app.get('/next/upiti/nekretnina:id', async (req, res) => {
  const nekretninaId = parseInt(req.params.id, 10);
  const stranica = parseInt(req.query.page, 10);

  if (stranica < 1) {
    return res.status(400).json({ greska: "Page mora biti veći ili jednak 1" });
  }

  try {
    const nekretnine = await readJsonFile('nekretnine');
    const nekretnina = nekretnine.find((property) => property.id === nekretninaId);

    if (!nekretnina) {
      return res.status(404).json([]);
    }

    const ukupnoUpita = nekretnina.upiti.length;
    const upitiPoStranici = 3;

    if (ukupnoUpita <= 3) {
      return res.status(404).json([]);
    }

    const obrnutiUpiti = [...nekretnina.upiti].reverse();

    const validniUpiti = obrnutiUpiti.slice(3);

    const ukupnoStranica = Math.ceil(validniUpiti.length / upitiPoStranici);

    if (stranica > ukupnoStranica) {
      return res.status(404).json([]);
    }

    const pocetak = (stranica - 1) * upitiPoStranici;
    const kraj = pocetak + upitiPoStranici;

    const nextUpiti = validniUpiti.slice(pocetak, kraj);

    if (nextUpiti.length === 0) {
      return res.status(404).json([]);
    }

    res.status(200).json(nextUpiti.map(upit => ({
      korisnik_id: upit.korisnik_id,
      tekst_upita: upit.tekst_upita,
    })));
  } catch (error) {
    console.error('Greška prilikom dohvaćanja upita:', error);
    res.status(500).json({ greska: 'Internal Server Error' });
  }
});*/

app.get('/next/upiti/nekretnina/:id', async (req, res) => {
  const nekretninaId = parseInt(req.params.id, 10);
  const stranica = parseInt(req.query.page, 10) || 1;
  const upitiPoStranici = 3;

  if (stranica < 1) {
    return res.status(400).json({ greska: "Page mora biti veći ili jednak 1." });
  }

  try {
    const sviUpiti = await Upit.findAll({
      where: { NekretninaId: nekretninaId },
      order: [['createdAt', 'DESC']],
    });

    const ukupnoUpita = sviUpiti.length;

    if (ukupnoUpita <= 3) {
      return res.status(404).json([]); // Nema dovoljno upita za paginaciju
    }

    const posljednjaTri = sviUpiti.slice(0, 3);
    const validniUpiti = sviUpiti.slice(3); // Upiti za paginaciju

    const ukupnoStranica = Math.ceil(validniUpiti.length / upitiPoStranici);

    if (stranica > ukupnoStranica) {
      return res.status(404).json([]); // Stranica izvan opsega
    }

    const pocetak = (stranica - 1) * upitiPoStranici;
    const kraj = pocetak + upitiPoStranici;
    const nextUpiti = validniUpiti.slice(pocetak, kraj);

    const formiraniUpiti = nextUpiti.map(upit => ({
      id: upit.id,
      tekst: upit.tekst,
      korisnik_id: upit.KorisnikId,
    }));

    res.status(200).json(formiraniUpiti);
  } catch (error) {
    console.error('Greška prilikom dohvaćanja upita:', error);
    res.status(500).json({ greska: 'Greška na serveru.' });
  }
});





/* ----------------- MARKETING ROUTES ----------------- */

// Route that increments value of pretrage for one based on list of ids in nizNekretnina
app.post('/marketing/nekretnine', async (req, res) => {
  const { nizNekretnina } = req.body;

  try {
    // Load JSON data
    let preferencije = await readJsonFile('preferencije');

    // Check format
    if (!preferencije || !Array.isArray(preferencije)) {
      console.error('Neispravan format podataka u preferencije.json.');
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    // Init object for search
    preferencije = preferencije.map((nekretnina) => {
      nekretnina.pretrage = nekretnina.pretrage || 0;
      return nekretnina;
    });

    // Update atribute pretraga
    nizNekretnina.forEach((id) => {
      const nekretnina = preferencije.find((item) => item.id === id);
      if (nekretnina) {
        nekretnina.pretrage += 1;
      }
    });

    // Save JSON file
    await saveJsonFile('preferencije', preferencije);

    res.status(200).json({});
  } catch (error) {
    console.error('Greška prilikom čitanja ili pisanja JSON datoteke:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/marketing/nekretnina/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Read JSON 
    const preferencije = await readJsonFile('preferencije');

    // Finding the needed objects based on id
    const nekretninaData = preferencije.find((item) => item.id === parseInt(id, 10));

    if (nekretninaData) {
      // Update clicks
      nekretninaData.klikovi = (nekretninaData.klikovi || 0) + 1;

      // Save JSON file
      await saveJsonFile('preferencije', preferencije);

      res.status(200).json({ success: true, message: 'Broj klikova ažuriran.' });
    } else {
      res.status(404).json({ error: 'Nekretnina nije pronađena.' });
    }
  } catch (error) {
    console.error('Greška prilikom čitanja ili pisanja JSON datoteke:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/marketing/osvjezi/pretrage', async (req, res) => {
  const { nizNekretnina } = req.body || { nizNekretnina: [] };

  try {
    // Read JSON 
    const preferencije = await readJsonFile('preferencije');

    // Finding the needed objects based on id
    const promjene = nizNekretnina.map((id) => {
      const nekretninaData = preferencije.find((item) => item.id === id);
      return { id, pretrage: nekretninaData ? nekretninaData.pretrage : 0 };
    });

    res.status(200).json({ nizNekretnina: promjene });
  } catch (error) {
    console.error('Greška prilikom čitanja ili pisanja JSON datoteke:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/marketing/osvjezi/klikovi', async (req, res) => {
  const { nizNekretnina } = req.body || { nizNekretnina: [] };

  try {
    // Read JSON 
    const preferencije = await readJsonFile('preferencije');

    // Finding the needed objects based on id
    const promjene = nizNekretnina.map((id) => {
      const nekretninaData = preferencije.find((item) => item.id === id);
      return { id, klikovi: nekretninaData ? nekretninaData.klikovi : 0 };
    });

    res.status(200).json({ nizNekretnina: promjene });
  } catch (error) {
    console.error('Greška prilikom čitanja ili pisanja JSON datoteke:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});




/* ----------------- Spirala 4 ROUTES ----------------- */

app.get('/nekretnina/:id/interesovanja', async (req, res) => {
  try {
      const nekretnina = await Nekretnina.findByPk(req.params.id, {
          include: [
              { model: Upit, as: 'Upiti' },
              { model: Zahtjev, as: 'Zahtjevi' },
              { model: Ponuda, as: 'Ponude' }
          ]
      });

      if (!nekretnina) {
          return res.status(404).json({ error: 'Nekretnina nije pronađena.' });
      }

      let interesovanja = {
          upiti: nekretnina.Upiti.map((upit) => upit.toJSON()),
          zahtjevi: nekretnina.Zahtjevi.map((zahtjev) => zahtjev.toJSON()),
          ponude: nekretnina.Ponude.map((ponuda) => ponuda.toJSON())
      };

      if (req.session.username) {
          const korisnik = await Korisnik.findOne({ where: { username: req.session.username } });
          const isAdmin = korisnik.admin;

          if (!isAdmin) {
              interesovanja.ponude = interesovanja.ponude.map((ponuda) => {
                  if (ponuda.KorisnikId !== korisnik.id && !ponuda.idVezanePonude) {
                      const { cijenaPonude, ...rest } = ponuda;
                      return rest;
                  }
                  return ponuda;
              });
          }
      } else {
          interesovanja.ponude = interesovanja.ponude.map(({ cijenaPonude, ...rest }) => rest);
      }

      res.json(interesovanja);
  } catch (error) {
      console.error('Greška:', error);
      res.status(500).json({ error: 'Greška na serveru.' });
  }
});


app.post('/nekretnina/:id/ponuda', async (req, res) => {
  const { tekst, ponudaCijene, datumPonude, idVezanePonude, odbijenaPonuda } = req.body;
  const nekretninaId = req.params.id;

  try {
    const nekretnina = await Nekretnina.findByPk(nekretninaId);
    if (!nekretnina) {
      return res.status(404).json({ greska: 'Nekretnina nije pronađena.' });
    }

    if (!req.session.username) {
      return res.status(401).json({ greska: 'Neautorizovan pristup.' });
    }

    const korisnik = await Korisnik.findOne({ where: { username: req.session.username } });
    if (!korisnik) {
      return res.status(401).json({ greska: 'Neautorizovan pristup.' });
    }

    const isAdmin = korisnik.admin;

    let vezanaPonuda = null;
    if (idVezanePonude) {
      vezanaPonuda = await Ponuda.findByPk(idVezanePonude);

      if (!vezanaPonuda) {
        return res.status(400).json({ greska: 'Vezana ponuda nije pronađena.' });
      }

      if (vezanaPonuda.odbijenaPonuda) {
        return res.status(400).json({ greska: 'Niz ponuda je već završen jer je ponuda odbijena.' });
      }

      if (!isAdmin && vezanaPonuda.KorisnikId !== korisnik.id) {
        return res.status(403).json({ greska: 'Nemate pravo odgovoriti na ovu ponudu.' });
      }
    }

    const novaPonuda = await Ponuda.create({
      tekst,
      cijenaPonude: ponudaCijene,
      datumPonude,
      odbijenaPonuda: !!odbijenaPonuda,
      NekretninaId: nekretninaId,
      KorisnikId: korisnik.id,
      idVezanePonude: idVezanePonude || null,
    });

    res.status(201).json({ poruka: 'Ponuda je uspješno kreirana.', ponuda: novaPonuda });
  } catch (error) {
    console.error('Greška prilikom kreiranja ponude:', error);
    res.status(500).json({ greska: 'Greška na serveru.' });
  }
});



app.post('/nekretnina/:id/zahtjev', async (req, res) => {
  const { tekst, trazeniDatum } = req.body;
  
  try {
      const nekretnina = await Nekretnina.findByPk(req.params.id);
      if (!nekretnina) {
          return res.status(404).json({ error: 'Nekretnina nije pronađena.' });
      }

      if (new Date(trazeniDatum) < new Date() || !trazeniDatum) {
          return res.status(404).json({ error: 'Neispravan datum.' });
      }

      const korisnik = await Korisnik.findOne({ where: { username: req.session.username } });
      if (!korisnik) {
          return res.status(401).json({ error: 'Neautorizovan pristup.' });
      }

      await Zahtjev.create({
          tekst,
          trazeniDatum,
          NekretninaId: nekretnina.id,
          KorisnikId: korisnik.id
      });

      res.status(201).json({ message: 'Zahtjev uspješno kreiran.' });
  } catch (error) {
      console.error('Greška:', error);
      res.status(500).json({ error: 'Greška na serveru.' });
  }
});

app.put('/nekretnina/:id/zahtjev/:zid', async (req, res) => {
  const { id, zid } = req.params;
  const { odobren, addToTekst } = req.body;

  try {
    if (!req.session.username) {
      return res.status(401).json({ greska: 'Neautorizovan pristup.' });
    }

    const korisnik = await Korisnik.findOne({ where: { username: req.session.username } });
    if (!korisnik || !korisnik.admin) {
      return res.status(403).json({ greska: 'Samo admin može odgovoriti na zahtjev.' });
    }

    const nekretnina = await Nekretnina.findByPk(id);
    if (!nekretnina) {
      return res.status(404).json({ greska: 'Nekretnina nije pronađena.' });
    }

    const zahtjev = await Zahtjev.findByPk(zid);
    if (!zahtjev) {
      return res.status(404).json({ greska: 'Zahtjev nije pronađen.' });
    }

    if (odobren === false && (!addToTekst || addToTekst.trim() === '')) {
      return res.status(400).json({ greska: 'Ako odobren=false, addToTekst je obavezan.' });
    }

    zahtjev.odobren = odobren;
    if (addToTekst) {
      zahtjev.tekst += ` ODGOVOR ADMINA: ${addToTekst}`;
    }

    await zahtjev.save();

    res.status(200).json({ poruka: 'Zahtjev je uspješno ažuriran.', zahtjev });
  } catch (error) {
    console.error('Greška prilikom obrade zahtjeva:', error);
    res.status(500).json({ greska: 'Greška na serveru.' });
  }
});


/*DODAO JA ZBOG ODBIJANJA PONUDA U NIZU*/
app.put('/ponuda/:id/odbij', async (req, res) => {
  const ponudaId = req.params.id;

  try {
    // Pronađi ponudu prema ID-ju
    const ponuda = await Ponuda.findByPk(ponudaId);

    if (!ponuda) {
      return res.status(404).json({ greska: 'Ponuda nije pronađena.' });
    }

    ponuda.odbijenaPonuda = true;
    await ponuda.save();

    res.status(200).json({ poruka: 'Ponuda je uspješno ažurirana.', ponuda });
  } catch (error) {
    console.error('Greška prilikom ažuriranja ponude:', error);
    res.status(500).json({ greska: 'Greška na serveru.' });
  }
});



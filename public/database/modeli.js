const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./db'); // Konekcija sa bazom

// Korisnik model
const Korisnik = sequelize.define('Korisnik', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    ime: { type: DataTypes.STRING, allowNull: false },
    prezime: { type: DataTypes.STRING, allowNull: false },
    username: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    admin: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
    freezeTableName: true, // Sprječava dodavanje sufiksa "s"
    tableName: 'Korisnik'

});

const Nekretnina = sequelize.define('Nekretnina', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    tip_nekretnine: { type: DataTypes.STRING, allowNull: false },
    naziv: { type: DataTypes.STRING, allowNull: false },
    kvadratura: { type: DataTypes.INTEGER, allowNull: false },
    cijena: { type: DataTypes.FLOAT, allowNull: false },
    tip_grijanja: { type: DataTypes.STRING },
    lokacija: { type: DataTypes.STRING, allowNull: false },
    godina_izgradnje: { type: DataTypes.INTEGER },
    datum_objave: { type: DataTypes.DATEONLY },
    opis: { type: DataTypes.TEXT },
}, {
    freezeTableName: true, // Sprječava dodavanje sufiksa "s"
    tableName: 'Nekretnina'

});

const Upit = sequelize.define('Upit', {
    tekst: { type: DataTypes.TEXT, allowNull: false },
}, {
    freezeTableName: true,
    tableName: 'Upit'

});

const Zahtjev = sequelize.define('Zahtjev', {
    tekst: { type: DataTypes.TEXT, allowNull: false },
    trazeniDatum: { type: DataTypes.DATEONLY, allowNull: false },
    odobren: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
    freezeTableName: true,
    tableName: 'Zahtjev'

});

const Ponuda = sequelize.define('Ponuda', {
    tekst: { type: DataTypes.TEXT, allowNull: false },
    cijenaPonude: { type: DataTypes.FLOAT, allowNull: false },
    datumPonude: { type: DataTypes.DATEONLY, allowNull: false },
    odbijenaPonuda: { type: DataTypes.BOOLEAN, defaultValue: false },
    idVezanePonude: { type: DataTypes.INTEGER, allowNull: true }, // Referenca na roditeljsku ponudu
}, {
    freezeTableName: true,
    tableName: 'Ponuda'
});


// Definisanje relacija
Korisnik.hasMany(Upit, { as: 'Upiti' });
Upit.belongsTo(Korisnik);

Korisnik.hasMany(Zahtjev, { as: 'Zahtjevi' });
Zahtjev.belongsTo(Korisnik);

Korisnik.hasMany(Ponuda, { as: 'Ponude' });
Ponuda.belongsTo(Korisnik);

Nekretnina.hasMany(Upit, { as: 'Upiti' });
Upit.belongsTo(Nekretnina);

Nekretnina.hasMany(Zahtjev, { as: 'Zahtjevi' });
Zahtjev.belongsTo(Nekretnina);

Nekretnina.hasMany(Ponuda, { as: 'Ponude' });
Ponuda.belongsTo(Nekretnina);

Ponuda.hasMany(Ponuda, { as: 'VezanePonude', foreignKey: 'idVezanePonude' });
Ponuda.belongsTo(Ponuda, { as: 'RoditeljskaPonuda', foreignKey: 'idVezanePonude' });

// Sinhronizacija modela sa bazom
(async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log('Modeli su sinhronizovani sa bazom.');
    } catch (error) {
        console.error('Greška prilikom sinhronizacije modela:', error);
    }
})();

module.exports = {
    sequelize,
    Korisnik,
    Nekretnina,
    Upit,
    Zahtjev,
    Ponuda,
};

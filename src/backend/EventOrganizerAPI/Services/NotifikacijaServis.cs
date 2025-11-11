using EventOrganizerAPI.DTOs;
using EventOrganizerAPI.Models;
using EventOrganizerAPI.Services.Interfaces;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EventOrganizerAPI.Services
{
    public class NotifikacijaServis : INotifikacijeServis
    {
        private readonly IMongoCollection<Notifikacija> _notifikacije;
        private readonly IMongoCollection<Dogadjaj> _dogadjaji;
        private readonly IMongoCollection<Korisnik> _korisnici;

        public NotifikacijaServis(IMongoDatabase db)
        {
            _notifikacije = db.GetCollection<Notifikacija>("Notifikacije");
            _dogadjaji = db.GetCollection<Dogadjaj>("Dogadjaji");
            _korisnici = db.GetCollection<Korisnik>("Korisnici");
        }

        // Sada pravi jednu notifikaciju sa listom korisnickih ID-jeva
        public async Task PosaljiNotifikacijuSvimPrijavljenima(KreirajNotifikacijuDto dto)
        {
            var dogadjaj = await _dogadjaji.Find(d => d.Id == dto.DogadjajId).FirstOrDefaultAsync();
            if (dogadjaj == null || dogadjaj.Prijavljeni == null) return;

            var notifikacija = new Notifikacija
            {
                Naziv = dto.Naziv,
                Sadrzaj = dto.Sadrzaj,
                Tip = dto.Tip,
                DogadjajId = dto.DogadjajId,
                DatumSlanja = DateTime.Now,
                KorisniciIds = dogadjaj.Prijavljeni
            };
            await _notifikacije.InsertOneAsync(notifikacija);

            // Dodavanje ID-ja notifikacije u dogadjaj
            var filterDogadjaj = Builders<Dogadjaj>.Filter.Eq(d => d.Id, dto.DogadjajId);
            var updateDogadjaj = Builders<Dogadjaj>.Update.Push(d => d.Notifikacije, notifikacija.Id);
            await _dogadjaji.UpdateOneAsync(filterDogadjaj, updateDogadjaj);

            // Dodavanje ID-ja notifikacije svakom korisniku
            foreach (var korisnikId in notifikacija.KorisniciIds)
            {
                var filterKorisnik = Builders<Korisnik>.Filter.Eq(k => k.Id, korisnikId);
                var updateKorisnik = Builders<Korisnik>.Update.Push(k => k.Notifikacije, notifikacija.Id);
                await _korisnici.UpdateOneAsync(filterKorisnik, updateKorisnik);
            }
        }

        public async Task<List<Notifikacija>> VratiNotifikacijeZaDogadjaj(string dogadjajId)
        {
            return await _notifikacije
                .Find(n => n.DogadjajId == dogadjajId)
                .SortByDescending(n => n.DatumSlanja)
                .ToListAsync();
        }

        // Traži po nizu korisnickih ID-jeva
        public async Task<List<Notifikacija>> VratiNotifikacijeZaDogadjajIKorisnika(string dogadjajId, string korisnikId)
        {
            return await _notifikacije
                .Find(n => n.DogadjajId == dogadjajId && n.KorisniciIds.Contains(korisnikId))
                .SortByDescending(n => n.DatumSlanja)
                .ToListAsync();
        }

        public async Task ObrisiNotifikaciju(string id)
        {
            await _notifikacije.DeleteOneAsync(n => n.Id == id);
        }
        public async Task<List<Notifikacija>> VratiNotifikacijeZaKorisnika(string korisnikId)
        {
            var filter = Builders<Notifikacija>.Filter.AnyEq(n => n.KorisniciIds, korisnikId);
            var notifikacije = await _notifikacije.Find(filter).ToListAsync();

            return notifikacije;
        }
    }
}
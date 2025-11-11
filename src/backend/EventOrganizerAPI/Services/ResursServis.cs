using EventOrganizerAPI.DTOs.Resurs;
using EventOrganizerAPI.Models;
using EventOrganizerAPI.Models.Enums;
using EventOrganizerAPI.Services.Interfaces;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EventOrganizerAPI.Services
{
    public class ResursServis : IResursServis
    {
        private readonly IMongoCollection<Resurs> _resursi;

        public ResursServis(IMongoDatabase db)
        {
            _resursi = db.GetCollection<Resurs>("Resursi");
        }

        public async Task<Resurs> Kreiraj(KreirajResursDto dto)
        {
            var resurs = new Resurs
            {
                Naziv = dto.Naziv,
                Opis = dto.Opis,
                Tip = dto.Tip,
                UkupnoKolicina = dto.UkupnoKolicina,
                Dobavljac = dto.Dobavljac,
                Lokacija = dto.Lokacija,
                Aktivnost = dto.Aktivnost,
                Rezervacije = new List<RezervacijaResursa>()
            };

            await _resursi.InsertOneAsync(resurs);

            var db = _resursi.Database;
            var dobavljaci = db.GetCollection<Dobavljac>("Dobavljaci");
            var filter = Builders<Dobavljac>.Filter.Eq("_id", MongoDB.Bson.ObjectId.Parse(resurs.Dobavljac));
            var update = Builders<Dobavljac>.Update.Push(d => d.Resursi, resurs.Id);
            await dobavljaci.UpdateOneAsync(filter, update);

            return resurs;
        }

        public async Task<List<Resurs>> VratiSve() =>
            await _resursi.Find(_ => true).ToListAsync();

        public async Task<Resurs> VratiPoId(string id) =>
            await _resursi.Find(x => x.Id == id).FirstOrDefaultAsync();

        public async Task Azuriraj(string id, AzurirajResursDto dto)
        {
            var update = Builders<Resurs>.Update.Combine();

            if (dto.Naziv != null)
                update = update.Set(x => x.Naziv, dto.Naziv);
            if (dto.Opis != null)
                update = update.Set(x => x.Opis, dto.Opis);
            if (dto.Tip != null)
                update = update.Set(x => x.Tip, dto.Tip);
            if (dto.UkupnoKolicina.HasValue)
                update = update.Set(x => x.UkupnoKolicina, dto.UkupnoKolicina.Value);
            if (dto.Lokacija != null)
                update = update.Set(x => x.Lokacija, dto.Lokacija);
            if (dto.Aktivnost != null)
                update = update.Set(x => x.Aktivnost, dto.Aktivnost);

            await _resursi.UpdateOneAsync(x => x.Id == id, update);
        }

        public async Task Obrisi(string id)
        {
            // Prvo pronađi resurs da znaš čiji je
            var resurs = await _resursi.Find(x => x.Id == id).FirstOrDefaultAsync();

            // Obrisati iz baze resursa
            await _resursi.DeleteOneAsync(x => x.Id == id);

            // Ako je resurs pronađen i ima dobavljača, obriši referencu kod dobavljača
            if (resurs != null && !string.IsNullOrEmpty(resurs.Dobavljac))
            {
                var dobavljaci = _resursi.Database.GetCollection<Dobavljac>("Dobavljaci");
                var filter = Builders<Dobavljac>.Filter.Eq("_id", MongoDB.Bson.ObjectId.Parse(resurs.Dobavljac));
                var update = Builders<Dobavljac>.Update.Pull(d => d.Resursi, id);
                await dobavljaci.UpdateOneAsync(filter, update);
            }
        }

        public async Task<List<Resurs>> VratiSlobodne() =>
            await _resursi.Find(x => x.Status == StatusResursa.Slobodan).ToListAsync();

        public async Task RezervisiResurs(string resursId, string dogadjajId, int? kolicina = null)
        {
            var resurs = await _resursi.Find(x => x.Id == resursId).FirstOrDefaultAsync();

            if (resurs != null && kolicina.HasValue)
            {
                // Izračunaj ukupno rezervisano za sve događaje, izuzmi ovu rezervaciju ako već postoji za ovaj događaj
                var rezervacijeBezOve = resurs.Rezervacije.Where(r => r.DogadjajId != dogadjajId).ToList();
                int trenutnoRezervisano = rezervacijeBezOve.Sum(r => r.Kolicina);
                int preostalo = resurs.UkupnoKolicina - trenutnoRezervisano;

                if (kolicina.Value > preostalo)
                {
                    throw new System.Exception($"Nema dovoljno resursa! Na stanju je još {preostalo}.");
                }

                // Update ili dodaj rezervaciju za ovaj dogadjaj
                var rez = resurs.Rezervacije.FirstOrDefault(r => r.DogadjajId == dogadjajId);
                if (rez != null)
                    rez.Kolicina = kolicina.Value;
                else
                    resurs.Rezervacije.Add(new RezervacijaResursa { DogadjajId = dogadjajId, Kolicina = kolicina.Value });

                // Update status
                resurs.Status = resurs.Rezervacije.Any() ? StatusResursa.Rezervisan : StatusResursa.Slobodan;

                var update = Builders<Resurs>.Update
                    .Set(x => x.Rezervacije, resurs.Rezervacije)
                    .Set(x => x.Status, resurs.Status);

                await _resursi.UpdateOneAsync(x => x.Id == resursId, update);

                // Dodaj resurs dogadjaju (ako već nije dodat)
                var db = _resursi.Database;
                var dogadjaji = db.GetCollection<Dogadjaj>("Dogadjaji");
                var filterDog = Builders<Dogadjaj>.Filter.Eq(d => d.Id, dogadjajId);
                var updateDog = Builders<Dogadjaj>.Update.AddToSet(d => d.Resursi, resursId);
                await dogadjaji.UpdateOneAsync(filterDog, updateDog);
            }
        }

        public async Task<List<Resurs>> VratiZaDogadjaj(string dogadjajId)
        {
            // Vrati resurse koji imaju rezervaciju za dati dogadjaj
            return await _resursi.Find(x => x.Rezervacije.Any(r => r.DogadjajId == dogadjajId)).ToListAsync();
        }

        public async Task PonistiRezervaciju(string resursId, string dogadjajId)
        {
            var resurs = await _resursi.Find(x => x.Id == resursId).FirstOrDefaultAsync();

            if (resurs != null)
            {
                // Ukloni rezervaciju za dati dogadjaj
                resurs.Rezervacije = resurs.Rezervacije.Where(r => r.DogadjajId != dogadjajId).ToList();

                // Ako nema više rezervacija, status = Slobodan
                var status = resurs.Rezervacije.Any() ? StatusResursa.Rezervisan : StatusResursa.Slobodan;

                var update = Builders<Resurs>.Update
                    .Set(x => x.Rezervacije, resurs.Rezervacije)
                    .Set(x => x.Status, status);

                await _resursi.UpdateOneAsync(x => x.Id == resursId, update);

                // (Opcionalno) Ukloni resurs iz dogadjaja
                var db = _resursi.Database;
                var dogadjaji = db.GetCollection<Dogadjaj>("Dogadjaji");
                var filterDog = Builders<Dogadjaj>.Filter.Eq(d => d.Id, dogadjajId);
                var updateDog = Builders<Dogadjaj>.Update.Pull(d => d.Resursi, resursId);
                await dogadjaji.UpdateOneAsync(filterDog, updateDog);
            }
        }
    }
}
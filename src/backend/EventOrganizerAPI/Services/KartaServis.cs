using EventOrganizerAPI.Dtos.Karta;
using EventOrganizerAPI.DTOs.Karta;
using EventOrganizerAPI.Models;
using EventOrganizerAPI.Models.Enums;
using EventOrganizerAPI.Services.Interfaces;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EventOrganizerAPI.Services
{
    public class KartaServis : IKartaServis
    {
        private readonly IMongoCollection<Karta> _karte;
        private readonly IMongoCollection<Dogadjaj> _dogadjaji;
        private readonly IMongoCollection<KupljenaKarta> _kupljeneKarte;
        public KartaServis(IMongoDatabase db)
        {
            _karte = db.GetCollection<Karta>("Karte");
            _dogadjaji = db.GetCollection<Dogadjaj>("Dogadjaji");
            _kupljeneKarte = db.GetCollection<KupljenaKarta>("KupljeneKarte");
        }

        public async Task<Karta> KreirajKartu(KreirajKartuDto dto)
        {
            var karta = new Karta
            {
                Naziv = dto.Naziv,
                Opis = dto.Opis,
                HEXboja = dto.HEXboja,
                Tip = (TipKarte)System.Enum.Parse(typeof(TipKarte), dto.Tip),
                URLslike = dto.URLslike,
                Cena = dto.Cena,
                BrojKarata = dto.BrojKarata,
                DogadjajId = dto.DogadjajId,
                DanId = dto.DanId,
                BrojDana = dto.BrojDana

            };

            await _karte.InsertOneAsync(karta);

            var filter = Builders<Dogadjaj>.Filter.Eq(d => d.Id, dto.DogadjajId);
            var update = Builders<Dogadjaj>.Update.Push(d => d.Karte, karta.Id);

            await _dogadjaji.UpdateOneAsync(filter, update);

            return karta;
        }

        public async Task<Karta> VratiBesplatnuKartu(string dogadjajId)
        {
            var karte = await _karte.Find(k => k.DogadjajId == dogadjajId).ToListAsync();

            return karte.Count == 0
                ? new Karta { Naziv = "Besplatna", Tip = TipKarte.Besplatna, Cena = 0, BrojKarata = int.MaxValue }
                : karte[0];
        }
        public async Task<KupljenaKarta> VratiKupljenuKartuPoId(string id)
        {
            var filter = Builders<KupljenaKarta>.Filter.Eq(k => k.Id, id);
            var karta = await _kupljeneKarte.Find(filter).FirstOrDefaultAsync();
            return karta;
        }
        public async Task<List<PrikazKartaDto>> VratiSveKarte()
        {
            var karte = await _karte.Find(_ => true).ToListAsync();

            var dto = karte.Select(k => new PrikazKartaDto
            {
                Id = k.Id,
                Naziv = k.Naziv,
                Opis = k.Opis,
                HEXboja = k.HEXboja,
                Tip = k.Tip.ToString(),
                URLslike = k.URLslike,
                Cena = k.Cena,
                BrojKarata = k.BrojKarata,
                DogadjajId = k.DogadjajId,
                DanId = k.DanId

            }).ToList();

            return dto;
        }

        public async Task<Karta> VratiKartuPoId(string id) =>
            await _karte.Find(k => k.Id == id).FirstOrDefaultAsync();

        public async Task AzurirajKartu(AzurirajKartuDto dto)
        {
            var update = Builders<Karta>.Update
                .Set(k => k.Naziv, dto.Naziv)
                .Set(k => k.Opis, dto.Opis)
                .Set(k => k.Cena, dto.Cena)
                .Set(k => k.BrojKarata, dto.BrojKarata);

            await _karte.UpdateOneAsync(k => k.Id == dto.Id, update);
        }

        public async Task ObrisiKartu(string id) =>
            await _karte.DeleteOneAsync(k => k.Id == id);

        public async Task<KupljenaKarta> KreirajKupljenuKartuAsync(string kartaId, string korisnikId, int brojDana)
        {
            var kupljena = new KupljenaKarta
            {
                KartaId = kartaId,
                KorisnikId = korisnikId,
                DatumVremeKupovine = DateTime.UtcNow,
                BrojDana = brojDana
            };
            await _kupljeneKarte.InsertOneAsync(kupljena);

            // NOVO: Dodaj korisnika u prijavljene na događaj!
            var karta = await _karte.Find(k => k.Id == kartaId).FirstOrDefaultAsync();
            if (karta != null)
            {
                var dogadjaj = await _dogadjaji.Find(d => d.Id == karta.DogadjajId).FirstOrDefaultAsync();
                if (dogadjaj != null && !dogadjaj.Prijavljeni.Contains(korisnikId))
                {
                    dogadjaj.Prijavljeni.Add(korisnikId);
                    await _dogadjaji.ReplaceOneAsync(d => d.Id == dogadjaj.Id, dogadjaj);
                }
            }

            return kupljena;
        }
        public async Task OznaciKartuIskoriscenom(string id)
        {
            var filter = Builders<KupljenaKarta>.Filter.Eq(k => k.Id, id);
            var update = Builders<KupljenaKarta>.Update.Inc(k => k.BrojDana, -1);
            await _kupljeneKarte.UpdateOneAsync(filter, update);
        }
    }
}
using EventOrganizerAPI.Dtos.Dogadjaj;
using EventOrganizerAPI.DTOs.Dogadjaj;
using EventOrganizerAPI.DTOs.Korisnik;
using EventOrganizerAPI.Models;
using EventOrganizerAPI.Services.Interfaces;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace EventOrganizerAPI.Services
{
    public class DogadjajServis : IDogadjajServis
    {
        private readonly IMongoCollection<Dogadjaj> _dogadjaji;
        private readonly IMongoCollection<Lokacija> _lokacije;
        private readonly IMongoCollection<Organizator> _organizatori;
        private readonly IWebHostEnvironment _env;
        private readonly IMongoCollection<Resurs> _resursi;
        private readonly IMongoCollection<Korisnik> _korisnici;
        private readonly IMongoCollection<Karta> _karte;
        private readonly IMongoCollection<KupljenaKarta> _kupljeneKarte;

        public DogadjajServis(IMongoDatabase db, IWebHostEnvironment env)
        {
            _dogadjaji = db.GetCollection<Dogadjaj>("Dogadjaji");
            _lokacije = db.GetCollection<Lokacija>("Lokacije");
            _organizatori = db.GetCollection<Organizator>("Organizatori");
            _env = env;
            _resursi = db.GetCollection<Resurs>("Resursi");
            _korisnici = db.GetCollection<Korisnik>("Korisnici");
            _karte = db.GetCollection<Karta>("Karte");
            _kupljeneKarte = db.GetCollection<KupljenaKarta>("KupljeneKarte");
        }

        public async Task<Dogadjaj> KreirajDogadjaj(KreirajDogadjajDto dto)
        {
            var dogadjaj = new Dogadjaj
            {
                Naziv = dto.Naziv,
                Lokacija = dto.Lokacija,
                DatumPocetka = dto.DatumPocetka,
                DatumKraja = dto.DatumKraja,
                URLalbuma = dto.URLalbuma,
                Opis = dto.Opis,
                Kapacitet = dto.Kapacitet,
                Karte = new List<string>(),
                Dani = new List<string>(),
                Prijavljeni = new List<string>(),
                Tagovi = dto.Tagovi,
                Notifikacije = new List<string>(),
                Napomene = dto.Napomene ?? new List<string>(),
                Organizator = dto.OrganizatorId,
                Status = dto.Status,
                Kategorija = dto.Kategorija
            };

            await _dogadjaji.InsertOneAsync(dogadjaj);

            var filter = Builders<Organizator>.Filter.Eq(o => o.Id, dto.OrganizatorId);
            var update = Builders<Organizator>.Update.Push(o => o.Dogadjaji, dogadjaj.Id);

            await _organizatori.UpdateOneAsync(filter, update);

            return dogadjaj;
        }

        public async Task<List<PrikazDogadjajDto>> VratiSveDogadjaje()
        {
            var dogadjaji = await _dogadjaji.Find(_ => true).ToListAsync();

            var dtoLista = dogadjaji.Select(d => new PrikazDogadjajDto
            {
                Id = d.Id,
                Naziv = d.Naziv,
                Lokacija = d.Lokacija,
                DatumPocetka = d.DatumPocetka,
                DatumKraja = d.DatumKraja,
                URLalbuma = GetDogadjajImageUrl(d),
                Opis = d.Opis,
                Kapacitet = d.Kapacitet,
                Karte = d.Karte,
                Dani = d.Dani,
                Prijavljeni = d.Prijavljeni,
                Tagovi = d.Tagovi,
                Notifikacije = d.Notifikacije,
                Napomene = d.Napomene,
                Organizator = d.Organizator,
                Status = d.Status,
                Kategorija = d.Kategorija
            }).ToList();

            return dtoLista;
        }

        public async Task<Dogadjaj> VratiPoId(string id) =>
            await _dogadjaji.Find(x => x.Id == id).FirstOrDefaultAsync();

        public async Task AzurirajDogadjaj(AzurirajDogadjajDto dto)
        {
            var filter = Builders<Dogadjaj>.Filter.Eq(d => d.Id, dto.Id);
            var update = Builders<Dogadjaj>.Update
                .Set(d => d.Naziv, dto.Naziv)
                .Set(d => d.Opis, dto.Opis)
                .Set(d => d.Status, dto.Status)
                .Set(d => d.Tagovi, dto.Tagovi);

            if (dto.DatumPocetka.HasValue)
                update = update.Set(d => d.DatumPocetka, dto.DatumPocetka.Value);
            if (dto.DatumKraja.HasValue)
                update = update.Set(d => d.DatumKraja, dto.DatumKraja.Value);
            if (!string.IsNullOrEmpty(dto.Lokacija))
                update = update.Set(d => d.Lokacija, dto.Lokacija);
            if (!string.IsNullOrEmpty(dto.Kategorija))
                update = update.Set(d => d.Kategorija, dto.Kategorija);
            if (dto.Napomene != null)
                update = update.Set(d => d.Napomene, dto.Napomene);

            await _dogadjaji.UpdateOneAsync(filter, update);
        }

        public async Task ObrisiDogadjaj(string id)
        {
            // 1. Pronađi sve resurse koji imaju rezervaciju za ovaj događaj
            var resursiSaRezervacijom = await _resursi.Find(r => r.Rezervacije.Any(rv => rv.DogadjajId == id)).ToListAsync();

            foreach (var resurs in resursiSaRezervacijom)
            {
                // Ukloni rezervaciju za ovaj događaj
                resurs.Rezervacije = resurs.Rezervacije.Where(r => r.DogadjajId != id).ToList();

                // Ako nema više rezervacija, status = Slobodan
                var status = resurs.Rezervacije.Any() ? resurs.Status : EventOrganizerAPI.Models.Enums.StatusResursa.Slobodan;

                var update = Builders<Resurs>.Update
                    .Set(x => x.Rezervacije, resurs.Rezervacije)
                    .Set(x => x.Status, status);

                await _resursi.UpdateOneAsync(x => x.Id == resurs.Id, update);

                // (opciono) možeš ovde i da skineš referencu iz samog događaja (ako čuvaš id resursa u Dogadjaj.Resursi)
            }

            // 2. Obriši događaj iz baze
            await _dogadjaji.DeleteOneAsync(d => d.Id == id);
        }
        public async Task<List<Dogadjaj>> Pretrazi(PretraziDogadjajDto dto)
        {
            var filter = Builders<Dogadjaj>.Filter.Empty;

            if (!string.IsNullOrWhiteSpace(dto.Naziv))
                filter &= Builders<Dogadjaj>.Filter.Regex("Naziv", new BsonRegularExpression(dto.Naziv, "i"));

            if (dto.Tagovi != null && dto.Tagovi.Any())
                filter &= Builders<Dogadjaj>.Filter.AnyIn(d => d.Tagovi, dto.Tagovi);

            if (dto.VremeOd.HasValue)
                filter &= Builders<Dogadjaj>.Filter.Gte(d => d.DatumPocetka, dto.VremeOd.Value);
            if (dto.VremeDo.HasValue)
                filter &= Builders<Dogadjaj>.Filter.Lte(d => d.DatumKraja, dto.VremeDo.Value);

            var svi = await _dogadjaji.Find(filter).ToListAsync();

            if (!string.IsNullOrEmpty(dto.Lokacija))
            {
                svi = svi.Where(d => !string.IsNullOrEmpty(d.Lokacija) &&
                    d.Lokacija.IndexOf(dto.Lokacija, StringComparison.OrdinalIgnoreCase) >= 0).ToList();
            }

            if (!string.IsNullOrEmpty(dto.Grad) || !string.IsNullOrEmpty(dto.Drzava))
            {
                var lokacijeFilter = Builders<Lokacija>.Filter.Empty;

                if (!string.IsNullOrEmpty(dto.Grad))
                    lokacijeFilter &= Builders<Lokacija>.Filter.Regex("Grad", new BsonRegularExpression(dto.Grad, "i"));
                if (!string.IsNullOrEmpty(dto.Drzava))
                    lokacijeFilter &= Builders<Lokacija>.Filter.Regex("Drzava", new BsonRegularExpression(dto.Drzava, "i"));

                var lokacije = await _lokacije.Find(lokacijeFilter).ToListAsync();
                var lokacijeIds = lokacije.Select(l => l.Id).ToHashSet();

                svi = svi.Where(d => !string.IsNullOrEmpty(d.Lokacija) && lokacijeIds.Contains(d.Lokacija)).ToList();
            }

            if (dto.SortirajPoDatumu == true)
                svi = svi.OrderBy(d => d.DatumPocetka).ToList();
            else if (dto.SortirajPoDatumu == false)
                svi = svi.OrderByDescending(d => d.DatumPocetka).ToList();

            if (dto.SortirajPoPrijavljenima == true)
                svi = svi.OrderBy(d => d.Prijavljeni.Count).ToList();
            else if (dto.SortirajPoPrijavljenima == false)
                svi = svi.OrderByDescending(d => d.Prijavljeni.Count).ToList();

            return svi;
        }

        public async Task<string> SacuvajSliku(IFormFile slika, string dogadjajId)
        {
            var folder = "images";
            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(slika.FileName);
            var fullPath = Path.Combine(_env.WebRootPath, folder, fileName);

            Directory.CreateDirectory(Path.GetDirectoryName(fullPath)!);

            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                await slika.CopyToAsync(stream);
            }
            var relativePath = $"/{folder}/{fileName}";

            var filter = Builders<Dogadjaj>.Filter.Eq(d => d.Id, dogadjajId);
            var update = Builders<Dogadjaj>.Update.Set(d => d.URLalbuma, relativePath);

            await _dogadjaji.UpdateOneAsync(filter, update);

            return relativePath;
        }

        public async Task DodajResurseDogadjaju(DodajResurseDogadjajuDto dto)
        {
            var filterDog = Builders<Dogadjaj>.Filter.Eq(d => d.Id, dto.DogadjajId);
            var updateDog = Builders<Dogadjaj>.Update.AddToSetEach(d => d.Resursi, dto.ResursiIds);
            await _dogadjaji.UpdateOneAsync(filterDog, updateDog);

            foreach (var resursId in dto.ResursiIds)
            {
                var resurs = await _resursi.Find(r => r.Id == resursId).FirstOrDefaultAsync();
                if (resurs == null)
                    continue;

                if (resurs.Rezervacije == null)
                    resurs.Rezervacije = new List<RezervacijaResursa>();

                if (!resurs.Rezervacije.Any(r => r.DogadjajId == dto.DogadjajId))
                {
                    resurs.Rezervacije.Add(new RezervacijaResursa
                    {
                        DogadjajId = dto.DogadjajId,
                        Kolicina = 0
                    });

                    var update = Builders<Resurs>.Update.Set(r => r.Rezervacije, resurs.Rezervacije);
                    await _resursi.UpdateOneAsync(r => r.Id == resursId, update);
                }
            }
        }

        // Servis za detalje prijavljenih na dogadjaj na osnovu tvoje baze (Karte, KupljeneKarte, Korisnici)
        public async Task<List<EventParticipantDto>> VratiDetaljePrijavljenihZaDogadjaj(string dogadjajId)
        {
            var dogadjaj = await _dogadjaji.Find(x => x.Id == dogadjajId).FirstOrDefaultAsync();
            if (dogadjaj == null || dogadjaj.Prijavljeni == null || dogadjaj.Prijavljeni.Count == 0)
                return new List<EventParticipantDto>();

            var korisnici = await _korisnici.Find(k => dogadjaj.Prijavljeni.Contains(k.Id)).ToListAsync();
            var karte = await _karte.Find(k => k.DogadjajId == dogadjajId).ToListAsync();
            var kartaIds = karte.Select(k => k.Id).ToHashSet();
            var kupljeneKarte = await _kupljeneKarte
                .Find(kk => kartaIds.Contains(kk.KartaId) && dogadjaj.Prijavljeni.Contains(kk.KorisnikId))
                .ToListAsync();

            var result = new List<EventParticipantDto>();
            foreach (var korisnik in korisnici)
            {
                var kupljenaKarta = kupljeneKarte.FirstOrDefault(kk => kk.KorisnikId == korisnik.Id);
                Karta karta = null;
                if (kupljenaKarta != null)
                    karta = karte.FirstOrDefault(k => k.Id == kupljenaKarta.KartaId);

                result.Add(new EventParticipantDto
                {
                    Id = korisnik.Id,
                    korisnickoIme = korisnik.KorisnickoIme,
                    Email = korisnik.Email,
                    BrojTelefona = korisnik.BrojTelefona ?? "",
                    TipUlaznice = karta?.Tip.ToString() ?? ""
                    // možeš dodati i status ako želiš, npr. Status = ...
                });
            }
            return result;
        }

        private string GetDogadjajImageUrl(Dogadjaj d)
        {
            if (!string.IsNullOrEmpty(d.URLalbuma))
                return d.URLalbuma;

            var map = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
            {
                { "festival", "/images/event-defaults/festival.jpg" },
                { "konferencija", "/images/event-defaults/konferencija.webp" },
                { "protest", "/images/event-defaults/protest.webp" },
                { "utakmica", "/images/event-defaults/utakmica.jpg" },
                { "vasar", "/images/event-defaults/vasar.jpg" },
                { "zurka", "/images/event-defaults/zurka.jpeg" }
            };

            if (!string.IsNullOrEmpty(d.Kategorija) && map.TryGetValue(d.Kategorija, out var path))
                return path;

            return "/images/event-defaults/festival.jpg";
        }

        public async Task ZapratiDogadjaj(OmiljeniDogadjajDto dto)
        {
            var filter = Builders<Korisnik>.Filter.Eq(k => k.Id, dto.KorisnikId);
            var korisnik = await _korisnici.Find(filter).FirstOrDefaultAsync();
            if (korisnik.OmiljeniDogadjaji.Contains(dto.DogadjajId)) return;
            var update = Builders<Korisnik>.Update.AddToSet(k => k.OmiljeniDogadjaji, dto.DogadjajId);
            await _korisnici.UpdateOneAsync(filter, update);
            return;
        }
    }
}
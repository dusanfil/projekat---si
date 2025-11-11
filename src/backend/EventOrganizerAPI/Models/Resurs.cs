using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using EventOrganizerAPI.Models.Enums;
using System.Collections.Generic;

namespace EventOrganizerAPI.Models
{
    public class Resurs
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        public string Naziv { get; set; }
        public string Opis { get; set; }
        [BsonRepresentation(BsonType.String)]
        public TipResursa Tip { get; set; }

        public int UkupnoKolicina { get; set; }

        [BsonRepresentation(BsonType.ObjectId)]
        public string Dobavljac { get; set; }

        public string Lokacija { get; set; }
        public string? Aktivnost { get; set; }

        public StatusResursa Status { get; set; } = StatusResursa.Slobodan;

        // NOVO
        public List<RezervacijaResursa> Rezervacije { get; set; } = new List<RezervacijaResursa>();
    }
}
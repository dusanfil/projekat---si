using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace EventOrganizerAPI.Models
{
    public class Korisnik
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string KorisnickoIme { get; set; }
        public string Email { get; set; }
        public string Sifra { get; set; }
        public string BrojTelefona { get; set; }

        [BsonRepresentation(BsonType.ObjectId)]
        public List<string> Karte { get; set; } = new List<string>();

        [BsonRepresentation(BsonType.ObjectId)]
        public List<string> OmiljeniDogadjaji { get; set; } = new List<string>();

        public string Uloga { get; set; }
        public bool VerifikovanEmail { get; set; }
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Kartica { get; set; }

        [BsonRepresentation(BsonType.ObjectId)]
        public List<string> Notifikacije { get; set; } = new List<string>();

        [BsonRepresentation(BsonType.ObjectId)]
        public List<string> IstorijaTransakcija { get; set; } = new List<string>();
        public decimal Balans { get; set; }
        public string ResetPasswordToken { get; set; }
        public DateTime? ResetPasswordTokenExpiration { get; set; }
    }
}
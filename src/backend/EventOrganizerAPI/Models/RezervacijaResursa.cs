using MongoDB.Bson.Serialization.Attributes;

namespace EventOrganizerAPI.Models
{
    public class RezervacijaResursa
    {
        [BsonElement("dogadjajId")]
        public string DogadjajId { get; set; }

        [BsonElement("kolicina")]
        public int Kolicina { get; set; }
    }
}
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace krud.Models
{
    public class Zadatak
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("naslov")]
        public string Naslov { get; set; } = string.Empty;

        [BsonElement("opis")]
        public string Opis { get; set; } = string.Empty;

        [BsonElement("uradjeno")]
        public bool Uradjeno { get; set; } = false;
    }
}

using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace backend.Models
{
    public class Dogadjaj
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string? Naziv { get; set; }
        public string? Lokacija { get; set; }
        public DateTime Datum { get; set; }
        public string? Tip { get; set; }
    }
}

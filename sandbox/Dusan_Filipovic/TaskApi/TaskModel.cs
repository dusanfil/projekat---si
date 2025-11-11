using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace TaskApi.Models
{
    public class TaskModel
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]  // Automatski konvertuje ObjectId <-> string
        public string? Id { get; set; }  // Oznaka ? znači da može biti null

        [BsonElement("name")]
        public string Name { get; set; }

        [BsonElement("description")]
        public string Description { get; set; }
    }
}

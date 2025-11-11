using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class Ucesnik
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    public string? Ime { get; set; }  

    public string? Email { get; set; }

    public string? DogadjajId { get; set; }


}

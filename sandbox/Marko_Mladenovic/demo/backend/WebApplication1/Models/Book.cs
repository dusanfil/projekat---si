using MongoDB.Bson.Serialization.Attributes;
namespace WebApplication1.Models
{
    public class Book
    {
        [BsonId]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string Id { get; set; }
        public string Title { get; set; }
        public string Author { get; set; }
        public Book()
        {

        }
    }
}

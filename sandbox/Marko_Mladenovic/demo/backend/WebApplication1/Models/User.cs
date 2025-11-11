using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Security.Cryptography.X509Certificates;
namespace WebApplication1.Models;
public class User
{
    [BsonId]
    [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
    public string Id { get; set; }
    public string Username { get; set; }
    public string HashedPassword { get; set; }
    public User()
	{

    }
}

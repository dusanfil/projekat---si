using MongoDB.Driver;
using CrudBackend.Models;

namespace CrudBackend.Services;

public class UserService
{
    private readonly IMongoCollection<User> _users;

    public UserService(IConfiguration config)
    {
        var client = new MongoClient(config.GetConnectionString("MongoDb"));
        var database = client.GetDatabase("CrudDemoDb");
        _users = database.GetCollection<User>("Users");
    }

    public List<User> Get() => _users.Find(_ => true).ToList();

    public void Create(User user) => _users.InsertOne(user);

    public void Update(string id, User user) => _users.ReplaceOne(u => u.Id == id, user);

    public void Delete(string id) => _users.DeleteOne(u => u.Id == id);
}


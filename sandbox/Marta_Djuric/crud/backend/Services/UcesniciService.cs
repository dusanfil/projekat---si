using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;

public class UcesniciService
{
    private readonly IMongoCollection<Ucesnik> _ucesnici;

    public UcesniciService(IMongoClient mongoClient)
    {
        var database = mongoClient.GetDatabase("OrganizacijaDogadjaja");
        _ucesnici = database.GetCollection<Ucesnik>("ucesnici");
    }

    public async Task KreirajUcesnikaAsync(Ucesnik ucesnik)
    {
        await _ucesnici.InsertOneAsync(ucesnik);
    }

    public async Task<List<Ucesnik>> VratiUcesnikeZaDogadjajAsync(string dogadjajId)
    {
        var filter = Builders<Ucesnik>.Filter.Eq(u => u.DogadjajId, dogadjajId);
        return await _ucesnici.Find(filter).ToListAsync();
    }
}

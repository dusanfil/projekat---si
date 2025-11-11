using krud.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace krud.Services
{
    public class ZadatakService
    {
        private readonly IMongoCollection<Zadatak> _zadatakCollection;

        public ZadatakService(IOptions<DatabaseSettings> databaseSettings)
        {
            var mongoClient = new MongoClient(databaseSettings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(databaseSettings.Value.DatabaseName);
            _zadatakCollection = mongoDatabase.GetCollection<Zadatak>("Zadaci");
        }

        public async Task<List<Zadatak>> GetAllAsync() =>
            await _zadatakCollection.Find(_ => true).ToListAsync();

        public async Task<Zadatak> GetByIdAsync(string id) =>
            await _zadatakCollection.Find(z => z.Id == id).FirstOrDefaultAsync();

        public async Task CreateAsync(Zadatak zadatak) =>
            await _zadatakCollection.InsertOneAsync(zadatak);

        public async Task UpdateAsync(string id, Zadatak zadatak) =>
            await _zadatakCollection.ReplaceOneAsync(z => z.Id == id, zadatak);

        public async Task DeleteAsync(string id) =>
            await _zadatakCollection.DeleteOneAsync(z => z.Id == id);
    }
}

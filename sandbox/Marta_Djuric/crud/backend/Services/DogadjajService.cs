using backend.Models;
using MongoDB.Driver;
using System.Collections.Generic;

namespace backend.Services
{
    public class DogadjajService
    {
        private readonly IMongoCollection<Dogadjaj> _collection;

        public DogadjajService(IMongoClient client)
        {
            var database = client.GetDatabase("OrganizacijaDogadjaja");
            _collection = database.GetCollection<Dogadjaj>("dogadjaji");
        }

        public List<Dogadjaj> Get() =>
            _collection.Find(d => true).ToList();

        public Dogadjaj? Get(string id) =>
            _collection.Find(d => d.Id == id).FirstOrDefault();

        public Dogadjaj Create(Dogadjaj d)
        {
            _collection.InsertOne(d);
            return d;
        }

        public Dogadjaj? Update(string id, Dogadjaj d)
        {
            var existing = Get(id);
            if (existing == null) return null;

            d.Id = id;  // važno da ostane isti ID
            _collection.ReplaceOne(doc => doc.Id == id, d);
            return d;
        }

        public void Remove(string id) =>
            _collection.DeleteOne(d => d.Id == id);
    }
}

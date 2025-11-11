using EventOrganizerAPI.Models;
using MongoDB.Driver;
using System;
using System.Threading.Tasks;

namespace EventOrganizerAPI.Services
{
    public class ResetPasswordCodeServis
    {
        private readonly IMongoCollection<ResetPasswordCode> _codes;

        public ResetPasswordCodeServis(IMongoDatabase db)
        {
            _codes = db.GetCollection<ResetPasswordCode>("ResetPasswordCodes");
        }

        public async Task InsertAsync(ResetPasswordCode code) =>
            await _codes.InsertOneAsync(code);

        public async Task<ResetPasswordCode> GetValidCode(string email, string code) =>
            await _codes.Find(x => x.Email == email && x.Code == code && !x.IsUsed && x.ExpireAt > DateTime.UtcNow).FirstOrDefaultAsync();

        public async Task SetUsed(string id)
        {
            var update = Builders<ResetPasswordCode>.Update.Set(x => x.IsUsed, true);
            await _codes.UpdateOneAsync(x => x.Id == id, update);
        }
    }
}
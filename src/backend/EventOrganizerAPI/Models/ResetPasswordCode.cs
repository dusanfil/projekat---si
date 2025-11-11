using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace EventOrganizerAPI.Models
{
    public class ResetPasswordCode
    {
        [BsonId]
        public string Id { get; set; } = ObjectId.GenerateNewId().ToString();
        public string Email { get; set; }
        public string Code { get; set; }
        public DateTime ExpireAt { get; set; }
        public bool IsUsed { get; set; } = false;
    }
}
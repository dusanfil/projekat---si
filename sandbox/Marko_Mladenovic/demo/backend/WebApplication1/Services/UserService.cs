using MongoDB.Driver;
using WebApplication1.Models;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using System;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
namespace WebApplication1.Services
{
    public class UserService
    {
        public User CurrentUser { get; set; }
        private readonly IMongoCollection<User> _userCollection;
        public UserService(IMongoDatabase database)
        {
            _userCollection = database.GetCollection<User>("Users");
        }
        public async Task<bool> UserExists(string username)
        {
            var filter = Builders<User>.Filter.Eq(u => u.Username, username);
            var user = await _userCollection.Find(filter).FirstOrDefaultAsync();
            return user != null;
        }
        public async Task<User> CreateUserAsync(string username, string password)
        {

            if (UserExists(username).Result) return null;

            var passwordHash = HashPassword(password);

            var user = new User
            {
                Username = username,
                HashedPassword = passwordHash,
            };

            await _userCollection.InsertOneAsync(user);

            return user;    
        }
        public async Task<bool> CheckLogIn(string username, string password)
        {
            string hashedPassword = HashPassword(password);
            var user = await _userCollection.Find(u => u.Username == username && u.HashedPassword == hashedPassword).FirstOrDefaultAsync();
            if (user == null) return false;
            Console.WriteLine(user.Username);
            
            CurrentUser = user;
            return true;
        }
        private string HashPassword(string password)
        {
            using var sha = SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(password);
            var hash = sha.ComputeHash(bytes);
            return Convert.ToBase64String(hash);
        }
        public async Task<User> getUserByUsername(string username)
        {
            var user = await _userCollection.Find(u => u.Username == username).FirstOrDefaultAsync();
            return user;
        }
        public User CheckUserLog() {
            return CurrentUser;
        }
        public void LogOut()
        {
            CurrentUser = null;
        }
    }
}

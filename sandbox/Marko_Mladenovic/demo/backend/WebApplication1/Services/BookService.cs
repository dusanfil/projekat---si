using MongoDB.Driver;
using WebApplication1.Models;
using System.Security.Cryptography;
using System.Text;
namespace WebApplication1.Services
{
    public class BookService
    {
        private readonly IMongoCollection<Book> _bookCollection;
        public BookService(IMongoDatabase database)
        {
            _bookCollection = database.GetCollection<Book>("Books");
        }
        public async Task<bool> BookExists(string title, string author)
        {
            //var filter = Builders<Book>.Filter.Eq(u => u.Title, title);
            var user = await _bookCollection.Find(b => b.Title == title && b.Author == author).FirstOrDefaultAsync();
            return user != null;
        }
        public async Task<Book> CreateBookAsync(string title, string author)
        {
            if (await BookExists(title, author)) return null;
            var book = new Book
            {
                Title = title,
                Author = author
            };
            await _bookCollection.InsertOneAsync(book);

            return book;
        }
        public async Task<List<Book>> GetBooks()
        {
            var books = await _bookCollection.Find(FilterDefinition<Book>.Empty).ToListAsync();
            return books;
        }
        public async Task<bool> DeleteBook(string id)
        {
            var deleted = await _bookCollection.DeleteOneAsync(book => book.Id == id);
            return deleted.DeletedCount > 0;
        }
    }
}

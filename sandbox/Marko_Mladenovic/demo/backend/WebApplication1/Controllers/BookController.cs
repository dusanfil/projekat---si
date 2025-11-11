using Microsoft.AspNetCore.Mvc;
using WebApplication1.Services;
namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/Book")]
    public class BookController : ControllerBase
    {
        BookService _bookService;
        public BookController(BookService bookService)
        {
            _bookService = bookService;
        }
        [HttpGet("getAll")]
        public async Task<IActionResult> GetAll()
        {
            var books = await _bookService.GetBooks();
            return Ok(books);
        }
        [HttpPost("addBook")]
        public async Task<IActionResult> AddBook([FromBody] BookDto dto)
        {
            Console.WriteLine("add book");
            var book = await _bookService.CreateBookAsync(dto.Title, dto.Author);
            Console.WriteLine(book.Author);
            if (book != null) return Ok(new { message = "success" });
            return Unauthorized("Knjiga vec postoji");
        }
        [HttpDelete("deleteBook/{id}")]
        public async Task<IActionResult> DeleteBook(string id)
        {
            bool deleted = await _bookService.DeleteBook(id);
            return deleted ? Ok(new { message = "Knjiga obrisana" }) : NotFound(new { message = "Knjiga nije pronadjena" });
        }
    }
    public class BookDto
    {
        public string Title { get; set; }
        public string Author { get; set; }
    }
}

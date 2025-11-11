using Microsoft.AspNetCore.Mvc;
using WebApplication1.Services;
using System;
namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;
        public UserController(UserService userService)
        {
            _userService = userService;
        }
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            var userExists = await _userService.UserExists(dto.Username);
            if (userExists) return Conflict("Username je zauzet");

            var user = await _userService.CreateUserAsync(dto.Username, dto.Password);

            return Ok(new { Message = "success" });
        }
        [HttpPost("checkLogin")]
        public async Task<IActionResult> CheckLogIn([FromBody] LoginDto dto)
        {
            bool exists = await _userService.CheckLogIn(dto.Username, dto.Password);

            if (exists) { 
                HttpContext.Session.SetString("Username", dto.Username);
                string u1 = HttpContext.Session.GetString("Username");
                Console.WriteLine(u1);
                return Ok(new { Message = "success" });
            } 
            return Unauthorized("Pogresni kredencijali");
           
        }
        [HttpGet("getLoginDetails")]
        public async Task<IActionResult> GetLoginDetails()
        {
            string username = HttpContext.Session.GetString("Username");
            if (username != "" && username != null)
            {
                var user =  await _userService.getUserByUsername(username);
                Console.WriteLine(user.Username);
                return Ok(user);
            }
            else return Unauthorized();
        }
        [HttpGet("logout")]
        public IActionResult LogOut()
        {
            HttpContext.Session.Clear();
            return Ok(new { Message = "success" });
        }
    }
    public class RegisterDto
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
    public class LoginDto
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}

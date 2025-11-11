using Microsoft.AspNetCore.Mvc;
using CrudBackend.Models;
using CrudBackend.Services;

namespace CrudBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly UserService _service;

    public UsersController(UserService service)
    {
        _service = service;
    }

    [HttpGet]
    public ActionResult<List<User>> Get() => _service.Get();

    [HttpPost]
    public IActionResult Create(User user)
    {
        _service.Create(user);
        return CreatedAtAction(nameof(Get), new { id = user.Id }, user);
    }

    [HttpPut("{id}")]
    public IActionResult Update(string id, User updatedUser)
    {
        updatedUser.Id = id;
        _service.Update(id, updatedUser);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(string id)
    {
        _service.Delete(id);
        return NoContent();
    }
}
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DogadjajiController : ControllerBase
    {
        private readonly DogadjajService _service;

        public DogadjajiController(DogadjajService service)
        {
            _service = service;
        }

        [HttpGet]
        public ActionResult<List<Dogadjaj>> Get() => _service.Get();

        [HttpGet("{id}")]
        public ActionResult<Dogadjaj> Get(string id)
        {
            var dogadjaj = _service.Get(id);
            if (dogadjaj == null) return NotFound();
            return dogadjaj;
        }

        [HttpPost]
        public ActionResult<Dogadjaj> Post(Dogadjaj d)
        {
            _service.Create(d);
            return CreatedAtAction(nameof(Get), new { id = d.Id }, d);
        }

        [HttpPut("{id}")]
        public IActionResult Put(string id, Dogadjaj d)
        {
            var updated = _service.Update(id, d);
            if (updated == null) return NotFound();
            return Ok(updated);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(string id)
        {
            var existing = _service.Get(id);
            if (existing == null) return NotFound();
            _service.Remove(id);
            return NoContent();
        }
    }
}

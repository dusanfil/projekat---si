using Microsoft.AspNetCore.Mvc;
using krud.Models;
using krud.Services;

namespace krud.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ZadatakController : ControllerBase
    {
        private readonly ZadatakService _zadatakService;

        public ZadatakController(ZadatakService zadatakService)
        {
            _zadatakService = zadatakService;
        }

        [HttpGet]
        public async Task<ActionResult<List<Zadatak>>> Get() =>
            await _zadatakService.GetAllAsync();

        [HttpGet("{id:length(24)}")]
        public async Task<ActionResult<Zadatak>> Get(string id)
        {
            var zadatak = await _zadatakService.GetByIdAsync(id);
            if (zadatak == null)
                return NotFound();

            return zadatak;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ZadatakCreateDto zadatak)
        {
            await _zadatakService.CreateAsync(new Zadatak { Naslov = zadatak.Naslov, Opis=zadatak.Opis, Uradjeno=zadatak.Uradjeno});
            return Ok();
        }

        [HttpPut("{id:length(24)}")]
        public async Task<IActionResult> Update(string id, [FromBody] Zadatak zadatak)
        {
            var postojeci = await _zadatakService.GetByIdAsync(id);
            if (postojeci == null)
                return NotFound();

            zadatak.Id = id;
            await _zadatakService.UpdateAsync(id, zadatak);
            return NoContent();
        }

        [HttpDelete("{id:length(24)}")]
        public async Task<IActionResult> Delete(string id)
        {
            var postojeci = await _zadatakService.GetByIdAsync(id);
            if (postojeci == null)
                return NotFound();

            await _zadatakService.DeleteAsync(id);
            return NoContent();
        }
    }
    public class ZadatakCreateDto
    {
        public string Naslov { get; set; } = string.Empty;
        public string Opis { get; set; } = string.Empty;
        public bool Uradjeno { get; set; } = false;
    }
}

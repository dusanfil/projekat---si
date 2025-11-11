using EventOrganizerAPI.DTOs.RasporedAktivnosti;
using EventOrganizerAPI.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace EventOrganizerAPI.Controllers
{
    [ApiController]
    [Route("api/rasporedi")]
    public class RasporedController : ControllerBase
    {
        private readonly IRasporedServis _servis;

        public RasporedController(IRasporedServis servis)
        {
            _servis = servis;
        }

        [HttpPost("kreiraj")]
        public async Task<IActionResult> Kreiraj([FromBody] KreirajRasporedDto dto)
        {
            var rezultat = await _servis.Kreiraj(dto);
            return Ok(rezultat);
        }

        [HttpGet]
        public async Task<IActionResult> VratiSve()
        {
            var rezultat = await _servis.VratiSve();
            return Ok(rezultat);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> VratiPoId(string id)
        {
            var rezultat = await _servis.VratiPoId(id);
            if (rezultat == null) return NotFound();
            return Ok(rezultat);
        }

        [HttpPut]
        public async Task<IActionResult> Azuriraj([FromBody] AzurirajRasporedDto dto)
        {
            await _servis.Azuriraj(dto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Obrisi(string id)
        {
            await _servis.Obrisi(id);
            return NoContent();
        }
    }
}

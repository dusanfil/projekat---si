using EventOrganizerAPI.DTOs.Cenovnik;
using EventOrganizerAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace EventOrganizerAPI.Controllers
{
    [ApiController]
    [Route("api/cenovnici")]
    public class CenovnikController : ControllerBase
    {
        private readonly CenovnikServis _cenovnikServis;

        public CenovnikController(CenovnikServis cenovnikServis)
        {
            _cenovnikServis = cenovnikServis;
        }

        [HttpPost]
        [Authorize(Roles = "Organizator")]
        public async Task<IActionResult> Kreiraj([FromBody] KreirajCenovnikDto dto)
        {
            var cenovnik = await _cenovnikServis.KreirajCenovnikAsync(dto);
            return Ok(cenovnik);
        }

        [HttpGet]
        public async Task<IActionResult> VratiSve()
        {
            var lista = await _cenovnikServis.VratiSveCenovnikeAsync();
            return Ok(lista);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> VratiPoId(string id)
        {
            var cenovnik = await _cenovnikServis.VratiCenovnikPoIdAsync(id);
            if (cenovnik == null) return NotFound();
            return Ok(cenovnik);
        }
        [HttpGet("dogadjaj/{id}")]
        public async Task<IActionResult> VratiPoDogadjajId(string id)
        {
            var cenovnik = await _cenovnikServis.VratiCenovnikPoDogadjajId(id);
            if (cenovnik == null) return NotFound();
            return Ok(cenovnik);
        }
        [HttpPut]
        [Authorize(Roles = "Organizator")]
        public async Task<IActionResult> Azuriraj([FromBody] AzurirajCenovnikDto dto)
        {
            var result = await _cenovnikServis.AzurirajCenovnikAsync(dto);
            if (!result) return NotFound();
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Organizator")]
        public async Task<IActionResult> Obrisi(string id)
        {
            var success = await _cenovnikServis.ObrisiCenovnikAsync(id);
            if (!success) return NotFound();
            return NoContent();
        }

        [HttpPost("{cenovnikId}/stavke/{stavkaId}")]
        [Authorize(Roles = "Organizator")]
        public async Task<IActionResult> DodajStavku(string cenovnikId, string stavkaId)
        {
            var result = await _cenovnikServis.DodajStavkuAsync(cenovnikId, stavkaId);
            if (!result) return BadRequest();
            return Ok();
        }

        [HttpDelete("{cenovnikId}/stavke/{stavkaId}")]
        [Authorize(Roles = "Organizator")]
        public async Task<IActionResult> UkloniStavku(string cenovnikId, string stavkaId)
        {
            var result = await _cenovnikServis.UkloniStavkuAsync(cenovnikId, stavkaId);
            if (!result) return BadRequest();
            return Ok();
        }
    }
}
using EventOrganizerAPI.DTOs;
using EventOrganizerAPI.Models;
using EventOrganizerAPI.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EventOrganizerAPI.Controllers
{
    [ApiController]
    [Route("api/notifikacija")]
    public class NotifikacijaController : ControllerBase
    {
        private readonly INotifikacijeServis _notifikacijaServis;

        public NotifikacijaController(INotifikacijeServis notifikacijaServis)
        {
            _notifikacijaServis = notifikacijaServis;
        }

        [HttpPost("dogadjaj/{dogadjajId}")]
        public async Task<IActionResult> PosaljiNotifikaciju(string dogadjajId, [FromBody] KreirajNotifikacijuDto dto)
        {
            if (!Enum.IsDefined(typeof(EventOrganizerAPI.Models.Enums.TipNotifikacije), dto.Tip))
                return BadRequest("Nevažeći tip notifikacije");

            if (string.IsNullOrWhiteSpace(dto.Naziv) || string.IsNullOrWhiteSpace(dto.Sadrzaj))
                return BadRequest("Naziv i sadržaj su obavezni");

            dto.DogadjajId = dogadjajId;
            await _notifikacijaServis.PosaljiNotifikacijuSvimPrijavljenima(dto);
            return Ok();
        }

        // Endpoint za sve notifikacije za događaj (za admina/organizatora)
        [HttpGet("dogadjaj/{dogadjajId}")]
        public async Task<ActionResult<List<Notifikacija>>> VratiNotifikacijeZaDogadjaj(string dogadjajId)
        {
            var notifikacije = await _notifikacijaServis.VratiNotifikacijeZaDogadjaj(dogadjajId);
            return Ok(notifikacije);
        }

        // Endpoint za notifikacije za jednog korisnika za dogadjaj
        [HttpGet("dogadjaj/{dogadjajId}/korisnik/{korisnikId}")]
        public async Task<ActionResult<List<Notifikacija>>> VratiNotifikacijeZaDogadjajIKorisnika(string dogadjajId, string korisnikId)
        {
            var notifikacije = await _notifikacijaServis.VratiNotifikacijeZaDogadjajIKorisnika(dogadjajId, korisnikId);
            return Ok(notifikacije);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> ObrisiNotifikaciju(string id)
        {
            await _notifikacijaServis.ObrisiNotifikaciju(id);
            return NoContent();
        }
        [HttpGet("korisnik/{korisnikId}")]
        public async Task<IActionResult> DajNotifikacijeZaKorisnika(string korisnikId)
        {


            var notifikacije = await _notifikacijaServis.VratiNotifikacijeZaKorisnika(korisnikId);
            return Ok(notifikacije);
        }
    }
}
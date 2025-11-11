using EventOrganizerAPI.Dtos.Dogadjaj;
using EventOrganizerAPI.DTOs.Dogadjaj;
using EventOrganizerAPI.DTOs.Korisnik;
using EventOrganizerAPI.Models;
using EventOrganizerAPI.Services;
using EventOrganizerAPI.Services.Interfaces;
using EventOrganizerAPI.Utils;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EventOrganizerAPI.Controllers
{
    [ApiController]
    [Route("api/dogadjaj")]
    public class DogadjajController : ControllerBase
    {
        private readonly IDogadjajServis _servis;

        public DogadjajController(IDogadjajServis servis)
        {
            _servis = servis;
        }

        [HttpPost("kreiraj")]
        public async Task<IActionResult> KreirajDogadjaj([FromBody] KreirajDogadjajDto dto)
        {
            var rezultat = await _servis.KreirajDogadjaj(dto);
            return Ok(rezultat);
        }

        [HttpPost("zaprati")]
        public async Task<IActionResult> ZapratiDogadjaj([FromBody] OmiljeniDogadjajDto dto)
        {
            await _servis.ZapratiDogadjaj(dto);
            return Ok();
        }
        [HttpPut("azuriraj")]
        public async Task<IActionResult> AzurirajDogadjaj([FromBody] AzurirajDogadjajDto dto)
        {
            await _servis.AzurirajDogadjaj(dto);
            return NoContent();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> AzurirajDogadjaj(string id, [FromBody] AzurirajDogadjajDto dto)
        {
            dto.Id = id;
            await _servis.AzurirajDogadjaj(dto);
            return NoContent();
        }

        [HttpGet("prikaz")]
        public async Task<ActionResult<List<PrikazDogadjajDto>>> VratiSve()
        {
            var dogadjaji = await _servis.VratiSveDogadjaje();
            return Ok(dogadjaji);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> VratiPoId(string id)
        {
            var dogadjaj = await _servis.VratiPoId(id);
            if (dogadjaj == null) return NotFound();
            return Ok(dogadjaj);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Obrisi(string id)
        {
            await _servis.ObrisiDogadjaj(id);
            return NoContent();
        }

        [HttpPost("pretrazi")]
        public async Task<IActionResult> Pretrazi([FromBody] PretraziDogadjajDto dto)
        {
            var rezultat = await _servis.Pretrazi(dto);
            return Ok(rezultat);
        }
        [HttpPost("slika")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> DodajSliku([FromForm] FileUploadDto dto)
        {
            if (dto.Slika == null || dto.Slika.Length == 0)
                return BadRequest("Nema fajla.");
            var relativePath = await _servis.SacuvajSliku(dto.Slika, dto.DogadjajId);

            return Ok(new { path = relativePath });
        }
        [HttpPost("dodaj-resurse")]
        public async Task<IActionResult> DodajResurseDogadjaju([FromBody] DodajResurseDogadjajuDto dto)
        {
            await _servis.DodajResurseDogadjaju(dto);
            return NoContent();
        }

       
        [HttpGet("prijavljeni/{id}")]
        public async Task<IActionResult> VratiPrijavljeneZaDogadjaj(string id)
        {
            var lista = await _servis.VratiDetaljePrijavljenihZaDogadjaj(id);
            return Ok(lista);
        }
    }
}
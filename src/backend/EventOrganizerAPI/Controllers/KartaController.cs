using EventOrganizerAPI.Dtos.Karta;
using EventOrganizerAPI.DTOs.Karta;
using EventOrganizerAPI.Models;
using EventOrganizerAPI.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EventOrganizerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class KartaController : ControllerBase
    {
        private readonly IKartaServis _kartaServis;

        public KartaController(IKartaServis kartaServis)
        {
            _kartaServis = kartaServis;
        }

        [HttpPost]
        public async Task<ActionResult<Karta>> KreirajKartu(KreirajKartuDto dto)
        {
            var karta = await _kartaServis.KreirajKartu(dto);
            return CreatedAtAction(nameof(VratiKartuPoId), new { id = karta.Id }, karta);
        }

        [HttpGet("dogadjaj/{dogadjajId}")]
        public async Task<ActionResult<Karta>> VratiKartuZaDogadjaj(string dogadjajId)
        {
            return Ok(await _kartaServis.VratiBesplatnuKartu(dogadjajId));
        }


        [HttpGet("prikaz")]
        public async Task<ActionResult<List<PrikazKartaDto>>> VratiSve()
        {
            var karte = await _kartaServis.VratiSveKarte();
            return Ok(karte);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Karta>> VratiKartuPoId(string id)
        {
            var karta = await _kartaServis.VratiKartuPoId(id);
            return karta != null ? Ok(karta) : NotFound();
        }

        [HttpPut]
        public async Task<IActionResult> AzurirajKartu(AzurirajKartuDto dto)
        {
            await _kartaServis.AzurirajKartu(dto);
            return NoContent();
        }
        [HttpGet("kupljene/{id}")]
        public async Task<ActionResult<KupljenaKarta>> VratiKupljenuKartuPoId(string id)
        {
            var karta = await _kartaServis.VratiKupljenuKartuPoId(id);
            return Ok(karta);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> ObrisiKartu(string id)
        {
            await _kartaServis.ObrisiKartu(id);
            return NoContent();
        }

        [HttpPost("kupljene")]
        public async Task<ActionResult<KupljenaKarta>> KreirajKupljenuKartu([FromBody] KreirajKupljenaKartaDto dto)
        {
            var kupljena = await _kartaServis.KreirajKupljenuKartuAsync(dto.IdKarte, dto.KorisnikId, dto.BrojDana);
            return CreatedAtAction(nameof(VratiKupljenuKartuPoId), new { id = kupljena.Id }, kupljena);
        }

    }
}
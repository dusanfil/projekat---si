using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.Collections.Generic;

[ApiController]
[Route("api/[controller]")]
public class UcesniciController : ControllerBase
{
    private readonly UcesniciService _ucesniciService;

    public UcesniciController(UcesniciService service)
    {
        _ucesniciService = service;
    }

    [HttpPost]
    public async Task<IActionResult> DodajUcesnika([FromBody] Ucesnik ucesnik)
    {
        await _ucesniciService.KreirajUcesnikaAsync(ucesnik);
        return Ok(new { poruka = "Uspešno prijavljen." }); 
    }

    [HttpGet("poDogadjaju/{dogadjajId}")]
    public async Task<ActionResult<List<Ucesnik>>> VratiUcesnikeZaDogadjaj(string dogadjajId)
    {
        var ucesnici = await _ucesniciService.VratiUcesnikeZaDogadjajAsync(dogadjajId);
        return Ok(ucesnici);
    }
}

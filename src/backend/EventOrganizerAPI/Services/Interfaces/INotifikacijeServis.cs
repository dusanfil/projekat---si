using EventOrganizerAPI.DTOs;
using EventOrganizerAPI.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EventOrganizerAPI.Services.Interfaces
{
    public interface INotifikacijeServis
    {
        Task PosaljiNotifikacijuSvimPrijavljenima(KreirajNotifikacijuDto dto);
        Task<List<Notifikacija>> VratiNotifikacijeZaDogadjaj(string dogadjajId);
        Task ObrisiNotifikaciju(string id);
        Task<List<Notifikacija>> VratiNotifikacijeZaDogadjajIKorisnika(string dogadjajId, string korisnikId);
        Task<List<Notifikacija>> VratiNotifikacijeZaKorisnika(string korisnikId);
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using Models;

namespace TasKing.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class OrganizacijaController : ControllerBase
    {
        public TasKingContext Context { get; set; }

        public OrganizacijaController(TasKingContext context)
        {
            Context = context;
        }

        [Route("KreirajOrganizaciju")]
        [HttpPost]
        public async Task<ActionResult> KreirajOrganizaciju([FromBody] OrganizacijaDTO organizacija)
        {
            var org = Context.Organizacije.Where(o => o.ime == organizacija.ime).FirstOrDefault();
            if(org == null)
            {
                 if(string.IsNullOrWhiteSpace(organizacija.ime) || organizacija.ime.Length > 50)
                        {
                           return BadRequest("Ime je prazno ili je duze od 50!");
                        }

                        try
                        {
                            Organizacija organizacija1 = new Organizacija
                            {
                                ime = organizacija.ime,
                                datumOsnivanja = DateTime.Now,
                                aktivna = true,
                                slika = organizacija.slika,
                                kod = organizacija.kod
                            };

                            Context.Organizacije.Add(organizacija1);
                            await Context.SaveChangesAsync();
                            return Ok("Sve je OK!");
                        }

                        catch(Exception e)
                        {
                             return BadRequest("Doslo je do greske:" + e.Message);
                        }
            }
            else
            {
                return BadRequest("Organizacija sa unetim imenom vec postoji!");
            }
        }

        [Route("UclaniUOrganizaciju/{korisnikID}/{OrganizacijaID}/{administrator}")]
        [HttpPost]
        public async Task<ActionResult> UclaniUOrganizaciju(int korisnikID, int OrganizacijaID, bool administrator)
        {     
                Korisnik korisnik = await Context.Korisnici.Where(p => p.ID == korisnikID).FirstOrDefaultAsync();
                if(korisnik==null)
                    return BadRequest("Korisnik ne postoji u bazi");

                Organizacija organizacija = await Context.Organizacije.Where(p => p.ID == OrganizacijaID).FirstOrDefaultAsync();
                if(organizacija==null)
                    return BadRequest("Organizacija ne postoji u bazi");

                ClanOrganizacije clan =  await Context.ClanoviOrganizacije.Where(p => p.korisnik.ID == korisnikID && p.organizacija.ID == OrganizacijaID).FirstOrDefaultAsync();
                if(clan==null)
                {
                    try
                    {
                        {
                            ClanOrganizacije clan1 = new ClanOrganizacije()
                            {
                                administrator=administrator,
                                izbacen = false,
                                korisnik = korisnik,
                                organizacija = organizacija
                            };

                            Context.ClanoviOrganizacije.Add(clan1);
                            await Context.SaveChangesAsync(); 
                            var clanInfo = await Context.ClanoviOrganizacije
                            .Include(p=>p.organizacija)
                            .Where(p=>p.korisnik.ID==korisnikID && p.organizacija.ID==OrganizacijaID && p.izbacen==false).ToArrayAsync();
                        
                            return Ok(clanInfo);
                        }
                    }
                    catch(Exception e)
                    {
                        return BadRequest(e.Message);
                    }
                }
                else
                {
                    return BadRequest("Korisnik je vec uclanjen u organizaciju");
                }
        }
    }
}
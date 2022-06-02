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
                            return Ok(organizacija1.ID);
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

        [Route("UclaniUOrganizaciju")]
        [HttpPost]
        public async Task<ActionResult> UclaniUOrganizaciju([FromBody] ClanOrganizacijeDTO clanorganizacije)
        {     
                Korisnik korisnik = await Context.Korisnici.Where(p => p.ID == clanorganizacije.idKorisnika).FirstOrDefaultAsync();
                if(korisnik==null)
                    return BadRequest("Korisnik ne postoji u bazi");

                Organizacija organizacija = await Context.Organizacije.Where(p => p.ID == clanorganizacije.idOrganizacije).FirstOrDefaultAsync();
                if(organizacija==null)
                    return BadRequest("Organizacija ne postoji u bazi");

                ClanOrganizacije clan =  await Context.ClanoviOrganizacije.Where(p => p.korisnik.ID == clanorganizacije.idKorisnika && p.organizacija.ID == clanorganizacije.idOrganizacije).FirstOrDefaultAsync();
                if(clan==null)
                {
                    try
                    {
                        {
                            ClanOrganizacije clan1 = new ClanOrganizacije()
                            {
                                administrator= clanorganizacije.admin,
                                izbacen = false,
                                korisnik = korisnik,
                                organizacija = organizacija
                            };

                            Context.ClanoviOrganizacije.Add(clan1);
                            await Context.SaveChangesAsync(); 
                            var clanInfo = await Context.ClanoviOrganizacije
                            .Include(p=>p.organizacija)
                            .Where(p=>p.korisnik.ID==clanorganizacije.idKorisnika && p.organizacija.ID==clanorganizacije.idOrganizacije && p.izbacen==false).ToArrayAsync();
                        
                            return Ok(clan1.ID);
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

        [Route("VratiClanoveTima/{clanID}")]
        [HttpGet]
        public async Task<ActionResult> VratiClanoveTima(int clanID)
        {     
                 try
                {
                    ClanOrganizacije clanOrg = await Context.ClanoviOrganizacije.Where(c => c.ID == clanID).FirstOrDefaultAsync();
                    if(clanOrg==null)
                        {
                            return BadRequest("ne postoji dato clanstvo");
                        }

                    var clanInfo = await Context.ClanoviTima
                            .Include(p=>p.tim)
                            .Where(p=>p.clanOgranizacije==clanOrg && p.izbacen==false)
                            .Select(p=>
                            new{
                                idClan = p.ID,
                                idTima = p.tim.ID,
                                imeTima = p.tim.ime,
                                vodja = p.vodjaTima,
                                vremePosecivanja = p.vremePosecivanja
                            }).ToArrayAsync();
                        
                            return Ok(clanInfo);
                }
                catch(Exception e)
                {
                    return BadRequest(e.Message);
                }
        }
        
        
        [Route("VratiOrganizacijeKorisnika/{userID}")]
        [HttpGet]
        public async Task<ActionResult> VratiOrganizacijeKorisnika(int userID)
        {
            try
            {
                var korisnik = await Context.Korisnici.Where(k => k.ID == userID)
                .Include(k => k.clanoviOrganizacije.Where(c => c.izbacen == false))
                .ThenInclude(c => c.organizacija)
                .Select(kor => 
                  kor.clanoviOrganizacije.Select(clan => new {
                      id = clan.organizacija.ID,
                      ime = clan.organizacija.ime,
                      slika = clan.organizacija.slika
                  })
                ).FirstOrDefaultAsync();
                return Ok(korisnik);
            }
            catch(Exception e)
            {
                return BadRequest("Doslo je do greske" + e.Message);
            }
        }

        [Route("VratiOrganizaciju/{kod}")]
        [HttpGet]
        public async Task<ActionResult> VratiOrganizaciju(string kod)
        {
            try
            {
                var organizacija = await Context.Organizacije.Where(k => k.kod == kod).FirstOrDefaultAsync();

                return Ok(organizacija.ID);
            }
            catch(Exception e)
            {
                return BadRequest("Doslo je do greske" + e.Message);
            }
        }

        [Route("VratiOrganizacijuClana/{idClanaOrg}")]
        [HttpGet]
        public async Task<ActionResult> VratiOrganizacijuClana(int idClanaOrg)
        {
            try
            {
                var clan = await Context.ClanoviOrganizacije.Where(c => c.ID == idClanaOrg)
                .Include(o => o.organizacija)
                .FirstOrDefaultAsync();

                return Ok(clan.organizacija.ID);
            }
            catch(Exception e)
            {
                return BadRequest("Doslo je do greske" + e.Message);
            }
        }

        [Route("VratiOrganizacijuTim/{timID}")]
        [HttpGet]
        public async Task<ActionResult> VratiOrganizaciju(int timID)
        {
            try
            {
                var tim = await Context.Timovi.Where(k => k.ID == timID)
                .Include(p => p.organizacija)
                .FirstOrDefaultAsync();

                //var organizacija = tim.organizacija ;


                return Ok(tim.organizacija.ID);
            }
            catch(Exception e)
            {
                return BadRequest("Doslo je do greske" + e.Message);
            }
        }

        [Route("VratiPoziveIzOrganizacije/{userID}")]
        [HttpGet]
        public async Task<ActionResult> VratiPoziveIzOrganizacije(int userID)
        {
            try
            {
                var korisnik = await Context.Korisnici.Where(k => k.ID == userID)
                .Include(k => k.primljeniPoziviIzOrganizacije.Where(p => p.prihvacen == false))
                .ThenInclude(p => p.organizacija)
                .ToListAsync();

                var organizacije = korisnik[0].primljeniPoziviIzOrganizacije
                    .Select(p => new
                    {
                        id = p.organizacija.ID,
                        ime = p.organizacija.ime,
                        slika = p.organizacija.slika,
                        vremepoziva = p.vremePoziva
                    }).ToList();
                return Ok(organizacije);
            }
            catch(Exception e)
            {
                return BadRequest("Doslo je do greske:" + e.Message);
            }
        }
    }
}
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
    public class TimController : ControllerBase
    {
        public TasKingContext Context { get; set; }

        public TimController(TasKingContext context)
        {
            Context = context;
        }

        [Route("KreirajTim")]
        [HttpPost]
        public async Task<ActionResult> KreirajTim([FromBody] TimDTO tim)
        {
            var org = Context.Organizacije.Where(p=> p.ID == tim.idOrganizacije).FirstOrDefault();

            var t = Context.Timovi.Where(p => p.ime == tim.ime).FirstOrDefault();
            if(t == null)
            {
                 if(string.IsNullOrWhiteSpace(tim.ime) || tim.ime.Length > 50)
                        {
                           return BadRequest("Ime je prazno ili je duze od 50!");
                        }

                        try
                        {
                            Tim tim1 = new Tim
                            {
                                ime = tim.ime,
                                datumOsnivanja = DateTime.Now,
                                aktivan = true,
                                slika = tim.slika,
                                kod = tim.kod,
                                organizacija = org         
                            };

                            Context.Timovi.Add(tim1);
                            await Context.SaveChangesAsync();
                            return Ok(tim1.ID);
                        }

                        catch(Exception e)
                        {
                             return BadRequest("Doslo je do greske:" + e.Message);
                        }
            }
            else
            {
                return Ok(0);
            }
        }


        [Route("UclaniUTim")]
        [HttpPost]
        public async Task<ActionResult> UclaniUTim([FromBody] ClanTimaDTO clantima)
        {     
                ClanOrganizacije clanOrganizacije = await Context.ClanoviOrganizacije.Where(p => p.ID == clantima.idClanaOrganizacije).FirstOrDefaultAsync();
                if(clanOrganizacije==null)
                    return BadRequest("Clan organizacije ne postoji u bazi");

                Tim tim = await Context.Timovi.Where(p => p.ID == clantima.idtima).FirstOrDefaultAsync();
                if(tim==null)
                    return BadRequest("Tim ne postoji u bazi");

                ClanTima clan =  await Context.ClanoviTima.Where(p => p.clanOgranizacije.ID == clantima.idClanaOrganizacije && p.tim.ID == clantima.idtima).FirstOrDefaultAsync();
                if(clan==null)
                {
                    try
                    {
                        {
                            ClanTima clan1 = new ClanTima
                            {
                                vodjaTima= clantima.vodja,
                                izbacen = false,
                                clanOgranizacije = clanOrganizacije,
                                tim = tim
                            };

                            Context.ClanoviTima.Add(clan1);
                            await Context.SaveChangesAsync(); 
                            var clanInfo = await Context.ClanoviTima
                            .Include(p=>p.tim)
                            .Where(p=>p.clanOgranizacije.ID==clantima.idClanaOrganizacije && p.tim.ID==clantima.idtima && p.izbacen==false).ToArrayAsync();
                        
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
                    return BadRequest("Korisnik je vec uclanjen u tim");
                }
        }

        [Route("VratiProjekteTima/{timID}")]
        [HttpGet]
        public async Task<ActionResult> VratiProjekteTima(int timID)
        {     
                 try
                {
                    Tim tim = await Context.Timovi.Where(t => t.ID == timID).FirstOrDefaultAsync();
                    if(tim==null)
                        {
                            return BadRequest("ne postoji dati tim");
                        }

                    var projektiInfo = await Context.Projekti
                            .Where(p=>p.tim==tim && p.aktivan==true)
                            .Select(p=>
                            new{
                                idProj = p.ID,
                                imeProj = p.naziv,
                            }).ToArrayAsync();
                        
                            return Ok(projektiInfo);
                }
                catch(Exception e)
                {
                    return BadRequest(e.Message);
                }
        }

        [Route("vratiProjekat/{projID}")]
        [HttpGet]
        public async Task<ActionResult> vratiProjekat(int projID)
        {     
                 try
                {
                    var projekatInfo = await Context.Projekti
                            .Include(p=>p.taskovi)
                            .Where(p=>p.ID==projID && p.aktivan==true)
                            .Select(p=>
                            new{
                                imeProj = p.naziv,
                                opisProj = p.opis,
                                Taskovi = p.taskovi.Select(t=>new{
                                taskID = t.ID,
                                naziv = t.naziv,
                                opisTaska = t.opis,
                                vrednost = t.vrednost,
                                status = t.status,
                                tip = t.tip,
                       }),
                            }).FirstOrDefaultAsync();
                        
                            return Ok(projekatInfo);
                }
                catch(Exception e)
                {
                    return BadRequest(e.Message);
                }
        }
        
        [Route("VratiTimoveKorisnika/{clanorgID}")]
        [HttpGet]
        public async Task<ActionResult> VratiTimoveKorisnika(int clanorgID)
        {
            try
            {
                var clan = await Context.ClanoviOrganizacije.Where(clan => clan.ID == clanorgID)
                    .Include(clan => clan.clanoviTima.Where(c => c.izbacen == false))
                    .ThenInclude(clantima => clantima.tim)
                    .ThenInclude(tim => tim.organizacija)
                    .ToListAsync();

                var timovi = clan[0].clanoviTima.Select(clantima => new
                {
                    id = clantima.tim.ID,
                    ime = clantima.tim.ime,
                    slika = clantima.tim.slika,
                    organizacijaID = clantima.tim.organizacija.ID
                }).ToList();
                    
                return Ok(timovi);
            }
           catch(Exception e)
            {
                return BadRequest("Doslo je do greske" + e.Message);
            }
        }


        [Route("VratiTim/{kod}")]
        [HttpGet]
        public async Task<ActionResult> VratiTim(string kod)
        {
            try
            {
                var tim = await Context.Timovi.Where(k => k.kod == kod).FirstOrDefaultAsync();

                return Ok(tim.ID);
            }
            catch(Exception e)
            {
                return Ok(0);
            }
        }


        [Route("VratiTimIME/{ime}")]
        [HttpGet]
        public async Task<ActionResult> VratiTimIME(string ime)
        {
            try
            {
                var tim = await Context.Timovi.Where(k => k.ime == ime).FirstOrDefaultAsync();

                return Ok(tim.ID);
            }
            catch(Exception e)
            {
                return Ok(0);
            }
        }

        [Route("VratiTimClana/{clanTimaID}")]
        [HttpGet]
        public async Task<ActionResult> VratiTimClana(int clanTimaID)
        {
            try
            {
                var clan = await Context.ClanoviTima.Where(c => c.ID == clanTimaID)
                .Include(k =>k.tim)
                .FirstOrDefaultAsync();

                return Ok(clan.tim.ID);
            }
            catch(Exception e)
            {
                return BadRequest("Doslo je do greske" + e.Message);
            }
        }

        [Route("VratiPoziveIzTima/{userID}")]
        [HttpGet]
        public async Task<ActionResult> VratiPoziveIzTima(int userID)
        {
            try
            {
                var korisnik = await Context.Korisnici.Where(k => k.ID == userID)
                .Include(k => k.primljeniPoziviIzTima.Where(p => p.prihvacen == false))
                .ThenInclude(p => p.tim)
                .ThenInclude(t => t.organizacija)
                .ToListAsync();

                var timovi = korisnik[0].primljeniPoziviIzTima
                    .Select(p => new
                    {
                        id = p.tim.ID,
                        ime = p.tim.ime,
                        slika = p.tim.slika,
                        organizacijaID = p.tim.organizacija.ID,
                        vremepoziva = p.vremePoziva
                    }).ToList();
                return Ok(timovi);
            }
            catch(Exception e)
            {
                return BadRequest("Doslo je do greske:" + e.Message);
            }
        }

        [Route("PrihvatiPozivUTim/{userID}/{timID}")]
        [HttpPut]
        public async Task<ActionResult> PrihvatiPozivUTim(int userID, int timID)
        {
            try
            {
                var poziv = await Context.PoziviUTim.Where(p => p.pozvaniKorisnik.ID == userID && p.tim.ID == timID)
                    .FirstOrDefaultAsync();

                if(poziv == null)
                {
                    return BadRequest("Clan tima ne postoji!");
                }

                poziv.prihvacen = true;
                await Context.SaveChangesAsync();
                return Ok(poziv);
            }
             catch(Exception e)
            {
                return BadRequest("Doslo je do greske:" + e.Message);
            }
        }

        [Route("OdbijPozivUTim/{userID}/{timID}")]
        [HttpDelete]
        public async Task<ActionResult> OdbijPozivUTim(int userID, int timID)
        {
            try
            {
                var poziv = await Context.PoziviUTim.Where(p => p.pozvaniKorisnik.ID == userID && p.tim.ID == timID)
                    .FirstOrDefaultAsync();

                if(poziv == null)
                {
                    return BadRequest("Poziv ne postoji!");
                }

                Context.PoziviUTim.Remove(poziv);
                await Context.SaveChangesAsync();
                return Ok("Poziv je uspesno obrisan!");
            }
            catch(Exception e)
            {
                return BadRequest("Doslo je do greske:" + e.Message);
            }
        }

        [Route("IzbaciKorisnikaIzTima/{timID}/{clanorgID}")]
        [HttpPut]
        public async Task<ActionResult> IzbaciKorisnikaIzTima(int timID, int clanorgID)
        {
            try
            {
                var clantima = await Context.ClanoviTima.Where(c => c.tim.ID == timID && c.clanOgranizacije.ID == clanorgID)
                    .FirstOrDefaultAsync();

                if(clantima== null)
                {
                    return BadRequest("Clan organizacije ne postoji!");
                }

                clantima.izbacen = true;
                await Context.SaveChangesAsync();
                return Ok(clantima);
            }
             catch(Exception e)
            {
                return BadRequest("Doslo je do greske:" + e.Message);
            }
        }
    }
}
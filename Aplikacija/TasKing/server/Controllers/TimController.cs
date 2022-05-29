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
                                kod = tim.kod
                            };

                            Context.Timovi.Add(tim1);
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
                return BadRequest("Tim sa unetim imenom vec postoji!");
            }
        }

        [Route("UclaniUTim/{clanOrganizacijeID}/{TimID}/{vodjaTima}")]
        [HttpPost]
        public async Task<ActionResult> UclaniUTim(int clanOrganizacijeID, int TimID, bool vodjaTima)
        {     
                ClanOrganizacije clanOrganizacije = await Context.ClanoviOrganizacije.Where(p => p.ID == clanOrganizacijeID).FirstOrDefaultAsync();
                if(clanOrganizacije==null)
                    return BadRequest("Clan organizacije ne postoji u bazi");

                Tim tim = await Context.Timovi.Where(p => p.ID == TimID).FirstOrDefaultAsync();
                if(tim==null)
                    return BadRequest("Tim ne postoji u bazi");

                ClanTima clan =  await Context.ClanoviTima.Where(p => p.clanOgranizacije.ID == clanOrganizacijeID && p.tim.ID == TimID).FirstOrDefaultAsync();
                if(clan==null)
                {
                    try
                    {
                        {
                            ClanTima clan1 = new ClanTima
                            {
                                vodjaTima=vodjaTima,
                                izbacen = false,
                                clanOgranizacije = clanOrganizacije,
                                tim = tim
                            };

                            Context.ClanoviTima.Add(clan1);
                            await Context.SaveChangesAsync(); 
                            var clanInfo = await Context.ClanoviTima
                            .Include(p=>p.tim)
                            .Where(p=>p.clanOgranizacije.ID==clanOrganizacijeID && p.tim.ID==TimID && p.izbacen==false).ToArrayAsync();
                        
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
                    return BadRequest("Korisnik je vec uclanjen u tim");
                }
        }
    }
}
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
    public class ProjekatController : ControllerBase
    {
        public TasKingContext Context { get; set; }

        public ProjekatController(TasKingContext context)
        {
            Context = context;
        }

        [Route("KreirajProjekat")]
        [HttpPost]
        public async Task<ActionResult> KreirajProjekat(string naziv, string opis, int timID)
        {
            var proj = Context.Projekti.Where(p => p.naziv == naziv).FirstOrDefault();
            if(proj == null)
            {
                 if(string.IsNullOrWhiteSpace(naziv) || naziv.Length > 50)
                        {
                           return BadRequest("Ime je prazno ili je duze od 50!");
                        }

                        try
                        {
                            Tim tim = Context.Timovi.Where(t => t.ID == timID).FirstOrDefault();
                            Projekat projekat1 = new Projekat
                            {
                                naziv = naziv,
                                opis = opis,
                                status = false,
                                tim = tim
                            };

                            Context.Projekti.Add(projekat1);
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
                return BadRequest("Projekat sa unetim imenom vec postoji!");
            }
        }

       [Route("VratiProjekteSaTaskovima/{userID}")]
       [HttpGet]
       public async Task<ActionResult> VratiProjekteSaTaskovima(int userID)
       {
           try
           {
               var clan = await Context.Korisnici.Where(k => k.ID == userID)
               .Include(k => k.clanoviOrganizacije)
               .ThenInclude(c => c.clanoviTima)
               .ThenInclude(c => c.tim)
               .ThenInclude(t => t.projekti)
               .Select(kor => 
               kor.clanoviOrganizacije
               .Select(clan => 
               clan.clanoviTima
               .Select(c => 
               c.tim.projekti
               .Select(p => new
               {
                   id = p.ID,
                   naziv = p.naziv,
                   opis = p.opis,
                   taskoviUkupni = p.taskovi.Select(task => new
                    {
                        naziv = task.naziv,
                        opis = task.opis,
                        vrednost = task.vrednost
                    }),
                    taskoviUradjeni = p.taskovi.Where(t => t.clanTima.clanOgranizacije.korisnik.ID == userID).Select(p => new
                    {
                        id = p.ID,
                        naziv = p.naziv,
                        opis = p.opis,
                        vrednost = p.vrednost,
                        tip = p.tip
                    })    
               })))).FirstOrDefaultAsync();

                var c1 = clan.FirstOrDefault();
                var c2 = c1.FirstOrDefault();

                return Ok(c2);
           }
           catch(Exception e)
           {
               return BadRequest("Doslo je do greske" + e.Message);
           }
       }
    }
}
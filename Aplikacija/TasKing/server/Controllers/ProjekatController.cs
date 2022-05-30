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


        [Route("VratiProjekte/{userID}")]
        [HttpGet]
        public async Task<ActionResult> VratiProjekteSaTaskovima(int userID)
        {
            try
            {
                var projekti = await Context.Projekti
                .Include(p => p.taskovi)
                .Include(p => p.tim)
                .ThenInclude(t => t.clanoviTima.Where(clan => clan.ID == userID))
                .ThenInclude(clan => clan.taskovi)
                .Select(proj => new
                {
                    id = proj.ID,
                    naziv = proj.naziv,
                    opis = proj.opis,
                    taskoviUkupni = proj.taskovi.Select(task => new
                    {
                        naziv = task.naziv,
                        opis = task.opis,
                        vrednost = task.vrednost
                    }),
                    taskoviUradjeni = proj.taskovi.Where(t => t.clanTima.ID == userID).Select(p => new
                    {
                        id = p.ID,
                        naziv = p.naziv,
                        opis = p.opis,
                        vrednost = p.vrednost
                    })
                }).ToListAsync();
                 return Ok(projekti);
            }

            catch(Exception e)
            {
                 return BadRequest("Doslo je do greske:" + e.Message);
            }
        }
    }
}
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

       /*[Route("VratiProjekteSaTaskovima/{userID}")]
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
               .ToListAsync();
               return Ok(clan);
           }
           catch(Exception e)
           {
               return BadRequest("Doslo je do greske" + e.Message);
           }
       }*/

        [Route("VratiProjekteSaTaskovima/{userID}")]
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
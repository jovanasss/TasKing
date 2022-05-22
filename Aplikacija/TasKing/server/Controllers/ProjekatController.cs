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

        [Route("VratiProjekte/{userID}")]
        [HttpGet]
        public async Task<ActionResult> VratiProjekte(int userID)
        {
            try
            {
                var projekti = await Context.Projekti
                .Include(p => p.taskovi)
                .Include(p => p.tim)
                .ThenInclude(t => t.clanoviTima.Where(clan => clan.ID == userID))
                .Select(proj => new
                {
                    naziv = proj.naziv,
                    opis = proj.opis,
                    taskovi = proj.taskovi.Select(task => new
                    {
                        naziv = task.naziv,
                        opis = task.opis
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
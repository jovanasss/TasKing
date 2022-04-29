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
    public class KorisnikController : ControllerBase
    {

        public TasKingContext Context { get; set; }

        public KorisnikController(TasKingContext context)
        {
            Context = context;
        }

        [Route("PreuzetiKorisnike")]
        [HttpGet]
        public async Task<ActionResult> PreuzmiKorisnike()
        {
            try
            {
                var korisnici = await Context.Korisnici.ToListAsync();
                return Ok(korisnici);
            }
            catch(Exception e)
            {
                return BadRequest("Doslo je do greske:" + e.Message);
            }
        }
    }
}

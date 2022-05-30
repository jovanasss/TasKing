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
    public class TaskController : ControllerBase
    {
        public TasKingContext Context { get; set; }

        public TaskController(TasKingContext context)
        {
            Context = context;
        }

        [Route("KreirajTask")]
        [HttpPost]
        public async Task<ActionResult> KreirajTask(string naziv, string opis, int projekatID, string vrednost, string tip)
        {
            var task = Context.Taskovi.Where(t => t.naziv == naziv).FirstOrDefault();
            if(task == null)
            {
                 if(string.IsNullOrWhiteSpace(naziv) || naziv.Length > 50)
                        {
                           return BadRequest("Ime je prazno ili je duze od 50!");
                        }

                        try
                        {
                            Projekat proj = Context.Projekti.Where(p => p.ID == projekatID).FirstOrDefault();
                            Models.Task task1 = new Models.Task
                            {
                                naziv = naziv,
                                opis = opis,
                                status = false,
                                projekat = proj,
                                vrednost = vrednost,
                                tip =tip
                            };

                            Context.Taskovi.Add(task1);
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
                return BadRequest("Task sa unetim imenom vec postoji!");
            }
        }
    }
}
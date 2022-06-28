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

        private readonly JwtService jwtService ;

        public TaskController(TasKingContext context , JwtService JwtService)
        {
            Context = context;
            jwtService = JwtService;
        }

        [Route("KreirajTask/{jwt}")]
        [HttpPost]
        public async Task<ActionResult> KreirajTask([FromBody] TaskDTO Task, string jwt)
        {   
            var token = jwtService.Verify(jwt);
            int userID = int.Parse(token.Claims.First(x => x.Type == "id").Value);

            var vodja = await Context.ClanoviTima.Where(k => k.ID == userID).FirstOrDefaultAsync(); 
            if(vodja.vodjaTima == false)
            {
                return BadRequest("Nisi vodja");
            }

            var projekat = Context.Projekti.Where(p  => p.ID == Task.projekatID).FirstOrDefault();
            var task = Context.Taskovi.Where( t => t.naziv == Task.naziv && t.projekat == projekat).FirstOrDefault();
            if(task == null)
            {
                 if(string.IsNullOrWhiteSpace(Task.naziv) || Task.naziv.Length > 50)
                        {
                           return BadRequest("Ime je prazno ili je duze od 50!");
                        }

                        try
                        {
                            Projekat proj = Context.Projekti.Where(p => p.ID == Task.projekatID).FirstOrDefault();
                            Models.Task task1 = new Models.Task
                            {
                                naziv = Task.naziv,
                                tip = Task.tip,
                                opis = Task.opis,
                                status = 0,
                                projekat = proj,
                                vrednost = Task.bodovi.ToString(),
                               // tip = "wtf je tip"
                            };

                            Context.Taskovi.Add(task1);
                            await Context.SaveChangesAsync();
                            return Ok(task1.ID);
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

        [Route("PrijaviZaTask/{jwt}/{taskID}")]
        [HttpPost]
        public async Task<ActionResult> PrijaviSeZaTask(string jwt, int taskID)
        {     
                
                var token = jwtService.Verify(jwt);
                int clanTimaID = int.Parse(token.Claims.First(x => x.Type == "id").Value);


                ClanTima clan = await Context.ClanoviTima.Where(c => c.ID == clanTimaID && c.vodjaTima == false).FirstOrDefaultAsync();
                Models.Task task = await Context.Taskovi.Where(t => t.ID == taskID).FirstOrDefaultAsync();
                if(clan==null)
                    return BadRequest("Clan tima ne postoji u bazi");

                if(task==null)
                    return BadRequest("task ne postoji u bazi");

                PrijavaZaTask prijava =  await Context.PrijaveZaTask.Where(p => p.clanTima == clan && p.task == task).FirstOrDefaultAsync();
                if(prijava==null)
                {
                    try
                    {
                        {
                            PrijavaZaTask prijava1 = new PrijavaZaTask
                            {
                                pregledan = false,
                                clanTima = clan,
                                task = task
                            };

                            Context.PrijaveZaTask.Add(prijava1);
                            await Context.SaveChangesAsync(); 
                            //var svePrijave = await Context.PrijaveZaTask
                            //.Where(p=>p.task==task).ToArrayAsync();
                        
                            return Ok();
                        }
                    }
                    catch(Exception e)
                    {
                        return BadRequest(e.Message);
                    }
                }
                else
                {
                    return BadRequest("Korisnik je vec prijavljen za task");
                }
        }

        [Route("PonistiPrijavuZaTask/{jwt}/{taskID}")]
        [HttpDelete]
        public async Task<ActionResult> PonistiPrijavuZaTask(string jwt, int taskID)
        {
            try
            {
                var token = jwtService.Verify(jwt);
                int clanTimaID = int.Parse(token.Claims.First(x => x.Type == "id").Value);

                PrijavaZaTask prijava =  await Context.PrijaveZaTask.Where(p => p.clanTima.ID == clanTimaID && p.task.ID == taskID && p.clanTima.vodjaTima == false).FirstOrDefaultAsync();

                if(prijava == null)
                {
                    return BadRequest("Prijava ne postoji!");
                }

                Context.PrijaveZaTask.Remove(prijava);
                await Context.SaveChangesAsync();
                return Ok("Prijava je uspesno obrisana!");
            }
            catch(Exception e)
            {
                return BadRequest("Doslo je do greske:" + e.Message);
            }
        }

        [Route("VratiPrijaveZaTask/{taskID}")]
        [HttpGet]
        public async Task<ActionResult> VratiPrijaveZaTask(int taskID)
        {     
                 try
                {
                    var prijave = await Context.PrijaveZaTask.Where(p => p.task.ID == taskID)
                    .Include(p=>p.clanTima)
                    .ThenInclude(c =>c.clanOgranizacije)
                    .ThenInclude(c =>c.korisnik)
                    .Select(prijava => new{
                        clanTimaID = prijava.clanTima.ID,
                        clanOrgID = prijava.clanTima.clanOgranizacije.ID,
                        Korisnik = prijava.clanTima.clanOgranizacije.korisnik
                    })
                    .ToListAsync();

                     return Ok(prijave);
                }
                catch(Exception e)
                {
                    return BadRequest(e.Message);
                }
        }

        [Route("DodeliTask/{clanTimaID}/{taskID}/{jwt}")]
        [HttpPut]
        public async Task<ActionResult> DodeliTask(int clanTimaID, int taskID, string jwt)
        {

             var token = jwtService.Verify(jwt);
            int userID = int.Parse(token.Claims.First(x => x.Type == "id").Value);

            var vodja = await Context.ClanoviTima.Where(k => k.ID == userID).FirstOrDefaultAsync(); 
            if(vodja.vodjaTima == false)
            {
                return BadRequest("Nisi vodja");
            }
                try
                {
                    var task =  Context.Taskovi.Where(t=>t.ID==taskID).FirstOrDefault();  
                    var clanTima =  Context.ClanoviTima.Where(c=>c.ID==clanTimaID).FirstOrDefault();  
                    if(task!=null && clanTima!=null)
                    {
                        task.clanTima = clanTima;
                        task.status = 1;
                        await Context.SaveChangesAsync(); 
                    }
                    return Ok();
                }
                catch(Exception e)
                {
                    return BadRequest(e.Message);
                }
        }

        [Route("PromeniStatus/{taskID}/{status}")]
        [HttpPut]
        public async Task<ActionResult> PromeniStatus(int taskID, int status)
        {
                try
                {
                    var task =  Context.Taskovi.Where(t=>t.ID==taskID).FirstOrDefault();  
                    if(task!=null)
                    {
                        task.status = status;
                        await Context.SaveChangesAsync(); 
                    }
                    return Ok();
                }
                catch(Exception e)
                {
                    return BadRequest(e.Message);
                }
        }

        [Route("IzmeniTask/{taskID}/{naziv}/{opis}/{tip}/{vrednost}/{jwt}")]
        [HttpPut]
        public async Task<ActionResult> IzmeniTask(int taskID, string naziv, string opis, string tip, string vrednost, string jwt)
        {
             var token = jwtService.Verify(jwt);
            int userID = int.Parse(token.Claims.First(x => x.Type == "id").Value);

            var vodja = await Context.ClanoviTima.Where(k => k.ID == userID).FirstOrDefaultAsync(); 
            if(vodja.vodjaTima == false)
            {
                return BadRequest("Nisi vodja");
            }
            var task = await Context.Taskovi.Where(t => t.ID == taskID).FirstOrDefaultAsync();

            if(task == null)
            {
                return BadRequest("Task ne postoji!");
            }

            try
            {
                task.naziv = naziv;
                task.opis = opis;
                task.tip = tip;
                task.vrednost = vrednost;

                var prijave =  await Context.PrijaveZaTask.Where(p => p.task.ID == taskID).ToListAsync();

                foreach(var prijava in prijave)
                {
                    Context.PrijaveZaTask.Remove(prijava);
                }

                await Context.SaveChangesAsync();
                
                return Ok("Task je uspesno izmenjen");
            }
             catch(Exception e)
            {
                return BadRequest("Doslo je do greske:" + e.Message);
            }
        }

        [Route("VratiTask/{taskID}")]
        [HttpGet]
        public async Task<ActionResult> VratiTask(int taskID)
        {
            var task = await Context.Taskovi.Where(t => t.ID == taskID).FirstOrDefaultAsync();

            if(task == null)
            {
                return BadRequest("Task ne postoji!");
            }

            return Ok(task);
        }
    }
}
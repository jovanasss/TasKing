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

            // verifikujemo token

            var token = jwtService.Verify(jwt);

            if ( token == null)
            {
                return BadRequest(-2);
            }
            int clanID = int.Parse(token.Claims.First(x => x.Type == "id").Value);

            // verifikujemo vodju 

            var vodja = await Context.ClanoviTima.Where(k => k.ID == clanID).FirstOrDefaultAsync(); 
            if(vodja == null)
            {
                return BadRequest(-4);
            }

            if(vodja.vodjaTima == false)
            {
                return BadRequest(-1);
            }

            // verifikujemo projekat 

            var projekat = Context.Projekti.Where(p  => p.ID == Task.projekatID).Include(p=>p.tim).FirstOrDefault();
            if (projekat == null)
            {
                return BadRequest(-3);
            }

            var clanTima = await Context.ClanoviTima.Where(c => c.tim.ID == projekat.tim.ID && c.ID == clanID).FirstOrDefaultAsync();
            if(clanTima == null)
            {
                return BadRequest("Korisnik nije clan tima");
            }

            var task = Context.Taskovi.Where( t => t.naziv == Task.naziv && t.projekat == projekat && t.status!=-1).FirstOrDefault();
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
                
                // verifikujemo token

                var token = jwtService.Verify(jwt);

                if ( token == null)
                {
                    return BadRequest(-2);
                }
                int clanTimaID = int.Parse(token.Claims.First(x => x.Type == "id").Value);


                // verifikovanje clana i njegove uloge 

                ClanTima clan = await Context.ClanoviTima.Where(c => c.ID == clanTimaID ).Include(c => c.tim).FirstOrDefaultAsync();

                if(clan==null){
                 return BadRequest("Clan tima ne postoji u bazi ");
                }

                if (clan.vodjaTima == true){
                    return BadRequest("Clan je vodja !");
                }

                // verifikovanje taska 

                Models.Task task = await Context.Taskovi.Where(t => t.ID == taskID).Include(t=> t.projekat).ThenInclude(p => p.tim).FirstOrDefaultAsync();

                if(task==null)
                    return BadRequest("task ne postoji u bazi");

                if(task.status!=0)
                    return BadRequest("task nije odgovarajuceg statusa");

                if(clan.tim.ID != task.projekat.tim.ID)
                {
                    return BadRequest("Niste clan tog tima");
                }

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
                // verifikujemo token

                var token = jwtService.Verify(jwt);

                if ( token == null)
                {
                    return BadRequest(-2);
                }
                int clanTimaID = int.Parse(token.Claims.First(x => x.Type == "id").Value);
                

                // verifikovanje clana i njegove uloge 

                ClanTima clan = await Context.ClanoviTima.Where(c => c.ID == clanTimaID ).FirstOrDefaultAsync();

                if(clan == null){
                    return BadRequest("Clan tima ne postoji u bazi ");
                }

                if (clan.vodjaTima == true){
                    return BadRequest("Clan je vodja !");
                }

                // verifikovanje taska 

                Models.Task task = await Context.Taskovi.Where(t => t.ID == taskID).FirstOrDefaultAsync();
                if(task==null)
                {
                    return BadRequest("task ne postoji u bazi");
                }

                // verifikovanje prijave 

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

        [Route("VratiPrijaveZaTask/{taskID}/{jwt}")]
        [HttpGet]
        public async Task<ActionResult> VratiPrijaveZaTask(int taskID, string jwt)
        {     
                 try
                {
                   var token = jwtService.Verify(jwt);

                    if ( token == null)
                    {
                        return BadRequest(-2);
                    }
                    int clanTimaID = int.Parse(token.Claims.First(x => x.Type == "id").Value);
                    

                    // verifikovanje clana i njegove uloge 

                    ClanTima clan = await Context.ClanoviTima.Where(c => c.ID == clanTimaID ).Include(c=> c.tim).FirstOrDefaultAsync();

                    if(clan == null){
                        return BadRequest("Clan tima ne postoji u bazi ");
                    }

                    if (clan.vodjaTima == false){
                        return Ok("Clan nije vodja !");
                    }


                    Models.Task task = await Context.Taskovi.Where(t => t.ID == taskID).Include(t=> t.projekat).ThenInclude(p => p.tim).FirstOrDefaultAsync();
                    
                    if(task==null)
                    {
                        return BadRequest("task ne postoji u bazi");
                    }

                    if(clan.tim.ID != task.projekat.tim.ID)
                    {
                        return BadRequest("Niste clan tog tima");
                    }



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

            // verifikujemo token

            var token = jwtService.Verify(jwt);

            if ( token == null)
            {
                return BadRequest(-2);
            }
            int clanID = int.Parse(token.Claims.First(x => x.Type == "id").Value);

            // verifikujemo vodju 

            var vodja = await Context.ClanoviTima.Where(k => k.ID == clanID).Include(c => c.tim).FirstOrDefaultAsync(); 

            if(vodja == null)
            {
                return BadRequest(-3);
            }

            if(vodja.vodjaTima == false)
            {
                return BadRequest(-1);
            }

            // verifikovanje taska 

            var task1 = await Context.Taskovi.Where(t => t.ID == taskID).Include(t=> t.projekat).ThenInclude(p => p.tim).FirstOrDefaultAsync();
            if(task1 == null)
            {
                 return BadRequest("task ne postoji u bazi");
            }

            // verifikovanje clana 

            var clan1 = await Context.ClanoviTima.Where( c => c.ID == clanTimaID).FirstOrDefaultAsync();
            if (clan1 == null)
            {
                return BadRequest("Nepostojeci korisnik !");
            }
            if (clan1 != null && clan1.vodjaTima == true)
            {
                return BadRequest("Clan je vodja tima !");
            }

            if(vodja.tim.ID != task1.projekat.tim.ID)
            {
                return BadRequest("Niste clan tog tima");
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


        [Route("PromeniStatus/{taskID}/{status}/{jwt}")]
        [HttpPut]
        public async Task<ActionResult> PromeniStatus(int taskID, int status, string jwt)
        {
                // verifikujemo token

                var token = jwtService.Verify(jwt);

                if ( token == null)
                {
                    return BadRequest(-2);
                }
                int userID = int.Parse(token.Claims.First(x => x.Type == "id").Value);

                // verifikovanje vodje 

                var vodja = await Context.ClanoviTima.Where(k => k.ID == userID).Include(c => c.tim).FirstOrDefaultAsync();
                if( vodja == null)
                {
                    return BadRequest("Nepostojeci korisnik !");
                } 
                if(status!=2 && vodja.vodjaTima == false)
                {
                    return BadRequest("Korisnik nije vodja");
                }


                // verifikovanje taska 

                var task1 = await Context.Taskovi.Where(t => t.ID == taskID).Include(t=> t.projekat).ThenInclude(p => p.tim).FirstOrDefaultAsync();

                if((task1.status==0 && status==1) || (task1.status==0 && status==-1)|| (task1.status==1 && status==2)
                || (task1.status==2 && status==3)|| (task1.status==2 && status==4)|| (task1.status==4 && status==2))
                {

                }
                else{
                    return BadRequest("Nedozvoljena promena statusa");
                }

                if(task1 == null)
                {
                    return BadRequest("task ne postoji u bazi");
                }      

                if(vodja.tim.ID != task1.projekat.tim.ID)
                {
                    return BadRequest("Niste clan tog tima");
                } 



                try
                {
                    var task =  Context.Taskovi.Where(t=>t.ID==taskID)
                    .Include(t=>t.projekat).FirstOrDefault(); 

                    if(task.projekat.tim!=vodja.tim)
                        return BadRequest("Korisnik nije clan tog tima");

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


        [Route("IzmeniTask/{taskID}/{naziv}/{opis}/{tip}/{vrednost}/{jwt}/{projID}")]
        [HttpPut]
        public async Task<ActionResult> IzmeniTask(int taskID, string naziv, string opis, string tip, string vrednost, string jwt, int projID)
        {

             // verifikujemo token

             var token = jwtService.Verify(jwt);

             if ( token == null)
             {
                return BadRequest(-2);
             }
            int userID = int.Parse(token.Claims.First(x => x.Type == "id").Value);

            // verifikovanje vodje 

            var vodja = await Context.ClanoviTima.Where(k => k.ID == userID).Include(c => c.tim).FirstOrDefaultAsync();
            if( vodja == null)
            {
                return BadRequest("Nepostojeci korisnik !");
            } 
            if(vodja.vodjaTima == false)
            {
                 return BadRequest("Korisnik nije vodja");
            }

            // verifikovanje taska

            var task = await Context.Taskovi.Where(t => t.ID == taskID).Include(t=> t.projekat).ThenInclude(p => p.tim).FirstOrDefaultAsync();
            if(task == null)
            {
                return BadRequest(1);
            }

            if(vodja.tim.ID != task.projekat.tim.ID)
            {
                return BadRequest("Niste clan tog tima");
            } 

            var taskstari = await Context.Taskovi.Where(t => t.naziv == naziv && t.ID!=task.ID && t.projekat.ID == projID && t.status!=-1).FirstOrDefaultAsync();

            if(taskstari != null)
            {
                return BadRequest(0);
            }

            // provera dal su prazne vrednosti ?

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
                return Ok(2);
            }
             catch(Exception e)
            {
                return BadRequest("Doslo je do greske:" + e.Message);
            }
        }

        [Route("VratiTask/{taskID}/{jwt}")]
        [HttpGet]
        public async Task<ActionResult> VratiTask(int taskID , string jwt)
        {

           // verifikujemo token

             var token = jwtService.Verify(jwt);

             if ( token == null)
             {
                return BadRequest(-2);
             }
            int userID = int.Parse(token.Claims.First(x => x.Type == "id").Value);

            // verifikovanje vodje 

            var vodja = await Context.ClanoviTima.Where(k => k.ID == userID).Include(c => c.tim).FirstOrDefaultAsync();
            if( vodja == null)
            {
                return BadRequest("Nepostojeci korisnik !");
            } 
            if(vodja.vodjaTima == false)
            {
                 return BadRequest("Korisnik nije vodja");
            }


            var task = await Context.Taskovi.Where(t => t.ID == taskID).Include(t=> t.projekat).ThenInclude(p => p.tim).FirstOrDefaultAsync();
            if(task == null)
            {
                return BadRequest("Task ne postoji!");
            }

            if(vodja.tim.ID != task.projekat.tim.ID)
            {
                return BadRequest("Niste clan tog tima");
            } 

            return Ok(task);
        }
    }
}
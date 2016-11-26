using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Modulos.Logic;
using Modulos.ViewModel;
using System.Web.Script.Serialization;
namespace Modulos.Controllers
{
    public class EstadoTanquesController : Controller
    {
        EstadoTanquesLogic estadoTanquesLogic;

        public EstadoTanquesController()
        {
            estadoTanquesLogic = new EstadoTanquesLogic();
        }
        protected override void Dispose(bool disposing)
        {
            base.Dispose(disposing);
        }
        [HttpGet]
        // GET: EstadoTanques
        public ActionResult Index()
        {
            return View();
        }
        public string Listar()
        {
            List<EstadoTanquesViewModel> estado_tanques = new List<EstadoTanquesViewModel>();
            estado_tanques = estadoTanquesLogic.EstadoTanques();
            var jsonSerialiser = new JavaScriptSerializer();
            return jsonSerialiser.Serialize(estado_tanques);
        }

        [HttpPost]
        public string AddVolume()
        {
            var volumen = Request["volumen"];
            var id_tanque = Request["id"];
            return estadoTanquesLogic.UpdateVolume(Convert.ToDouble(volumen), Convert.ToInt32(id_tanque));
        }
    }
}
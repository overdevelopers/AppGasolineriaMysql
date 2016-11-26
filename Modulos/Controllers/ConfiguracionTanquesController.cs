using Modulos.Logic;
using Modulos.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace Modulos.Controllers
{
    public class ConfiguracionTanquesController : Controller
    {
        ConfiguracionColoresTanqueLogic configuracionColoresTanqueLogin;
        public ConfiguracionTanquesController()
        {
            configuracionColoresTanqueLogin = new ConfiguracionColoresTanqueLogic();
        }
        protected override void Dispose(bool disposing)
        {
            base.Dispose(disposing);
        }

        // GET: ConfiguracionTanques
        public ActionResult Index()
        {
            return View();
        }
        public string Listar()
        {
            List<ConfiguracionTanquesViewModel> configuracion_tanque = new List<ConfiguracionTanquesViewModel>();
            configuracion_tanque = configuracionColoresTanqueLogin.ConfiguracionColoresTanques();
            var jsonSerialiser = new JavaScriptSerializer();
            return jsonSerialiser.Serialize(configuracion_tanque);
        }

        [HttpPost]
        public string Guardar()
        {
            var color = Request["color"];
            var id = Request["id"];
            return configuracionColoresTanqueLogin.Guardar(color, Convert.ToInt32(id));
        }
    }
}
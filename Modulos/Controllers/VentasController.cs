using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Modulos.ViewModel;
using Modulos.Logic;
using System.Data;
using System.Web.Script.Serialization;
namespace Modulos.Controllers
{
    public class VentasController : Controller
    {
        ListadoVentasLogic listadoVentasLogic;
        public VentasController()
        {
            listadoVentasLogic = new ListadoVentasLogic();
        }
        protected override void Dispose(bool disposing)
        {
            base.Dispose(disposing);
        }
        // GET: Ventas
        public ActionResult Index()
        {
            return View();
        }

        // POST: Listado_Ventas
        [HttpPost]
        public string Listado_Ventas()
        {
            var surtidor = Request["surtidor"];
            var manguera = Request["manguera"];
            var ultimas = Request["ultimas"];

            List<ListadoVentasViewModel> ultimas_ventas = new List<ListadoVentasViewModel>();
            ultimas_ventas = listadoVentasLogic.listado_ventas(Convert.ToInt32(surtidor), Convert.ToInt32(manguera), Convert.ToInt32(ultimas));
            var jsonSerialiser = new JavaScriptSerializer();
            return jsonSerialiser.Serialize(ultimas_ventas);

        }
        //POST :Impresion normal
        [HttpPost]
        public string ImprimirVenta()
        {
            var id_venta = Request["id_venta"];
            return listadoVentasLogic.ImprimirVenta(Convert.ToInt32(id_venta));
        }
    }
}
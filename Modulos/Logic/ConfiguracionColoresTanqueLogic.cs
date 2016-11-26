using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Modulos.ViewModel;
using MySql.Data;
using System.Data;
using MySql.Data.MySqlClient;
namespace Modulos.Logic
{

    public class ConfiguracionColoresTanqueLogic
    {
        string connectionString = Conexion.ConexionString;
        public List<ConfiguracionTanquesViewModel> ConfiguracionColoresTanques()
        {
            List<ConfiguracionTanquesViewModel> configuracion_tanques = new List<ConfiguracionTanquesViewModel>();

            using (MySqlConnection con = new MySqlConnection(connectionString))
            {
                using (MySqlCommand command=new MySqlCommand("SELECT cc.id,t.TankName,cc.color from configuracion_colores_tanque cc INNER JOIN tanks t ON cc.id_tanks = t.Id", con))
                {
                    con.Open();
                    MySqlDataReader dr = command.ExecuteReader();
                    while (dr.Read())
                    {
                        ConfiguracionTanquesViewModel ConfiguracionTanquesViewModel = new ConfiguracionTanquesViewModel
                        {
                            Id=Convert.ToInt32(dr["id"].ToString()),
                            Tanque=dr["TankName"].ToString(),
                            Color=dr["color"].ToString()
                        };
                        configuracion_tanques.Add(ConfiguracionTanquesViewModel);
                    }
                }
            }
            return configuracion_tanques;
        }
        public string Guardar(string color, int id)
        {
            string rpta = "";
            try
            {
                using (MySqlConnection con = new MySqlConnection(connectionString))
                {
                    using (MySqlCommand command = new MySqlCommand("UPDATE configuracion_colores_tanque SET color=@color WHERE id=@id", con))
                    {
                        con.Open();
                        command.Parameters.AddWithValue("@color", color);
                        command.Parameters.AddWithValue("@id", id);
                        if (command.ExecuteNonQuery() == 1)
                        {
                            rpta = "SI";
                        }
                        else
                        {
                            rpta = "NO";
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                rpta = ex.Message;
            }

            return rpta;
        }
    }

}
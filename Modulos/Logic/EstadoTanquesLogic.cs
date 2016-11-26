using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MySql.Data;
using MySql.Data.MySqlClient;
using System.Data;
using Modulos.ViewModel;
using System.Text;

namespace Modulos.Logic
{
    public class EstadoTanquesLogic
    {
        string connectionString = Conexion.ConexionString;
        public List<EstadoTanquesViewModel> EstadoTanques()
        {
            List<EstadoTanquesViewModel> estado_tanques= new List<EstadoTanquesViewModel>();
            using(MySqlConnection con=new MySqlConnection(connectionString))
            {
                StringBuilder consulta = new StringBuilder();
                consulta.Append("SELECT t.Id,t.TankName,p.Name,t.Capacity,t.CurrentCapacity,cc.color");
                consulta.Append(" FROM tanks t");
                consulta.Append(" INNER JOIN products p ON t.ProductId = p.Id");
                consulta.Append(" LEFT JOIN configuracion_colores_tanque cc ON cc.id_tanks = t.Id");
                

                using (MySqlCommand command=new MySqlCommand(consulta.ToString(), con))
                {
                    con.Open();
                    MySqlDataReader dr = command.ExecuteReader();
                    while (dr.Read())
                    {
                        decimal capacidad = Convert.ToDecimal(dr["Capacity"]);
                        decimal actual = Math.Round(Convert.ToDecimal(dr["CurrentCapacity"]), 3);
                        decimal lleno = Math.Round(Convert.ToDecimal(actual / capacidad) * 100, 2);
                        EstadoTanquesViewModel estadoTanquesViewModel = new EstadoTanquesViewModel
                        {
                            Id=Convert.ToInt32(dr["Id"]),
                            Combustible=dr["Name"].ToString(),
                            Capacidad=capacidad,
                            Actual=actual,
                            Lleno=lleno,
                            Color=dr["color"].ToString()
                        };
                        estado_tanques.Add(estadoTanquesViewModel);
                    }
                }
            }
            return estado_tanques;
        }     
        
        public string UpdateVolume(double volumen,int id_tanque)
        {
            string rpta = "";
            try
            {
                using(MySqlConnection con=new MySqlConnection(connectionString))
                {
                    string consulta = "UPDATE tanks SET CurrentCapacity=CurrentCapacity+@volumen WHERE Id = @id";
                    using (MySqlCommand command = new MySqlCommand(consulta, con))
                    {
                        con.Open();
                        command.Parameters.AddWithValue("@volumen", volumen);
                        command.Parameters.AddWithValue("@id", id_tanque);
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
            catch(Exception ex)
            {
                rpta = ex.Message;
            }
            return rpta;
        }   
    }

}
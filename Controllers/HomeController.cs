using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using TapTapTapGame.Models;
using Microsoft.Data.SqlClient;

namespace TapTapTapGame.Controllers
{
    public class HomeController(ILogger<HomeController> logger) : Controller
    {
        private readonly ILogger<HomeController> _logger = logger;
        private readonly string connectionString = "Server=DESKTOP-TDJOFMS; Database=TapTapGame; Integrated Security=True; TrustServerCertificate=True;";
        public class Player
        {
            public required string UserName { get; set; }
            public int Score { get; set; }
        }

        [HttpPost]
        public IActionResult SaveScore([FromBody] Player scoreModel)
        {
            using (SqlConnection connection = new(connectionString))
            {
                string query = "INSERT INTO PlayerStats (UserName, Score) VALUES (@UserName, @Score)";
                using (SqlCommand command = new(query, connection))
                {
                    command.Parameters.AddWithValue("@UserName", scoreModel.UserName);
                    command.Parameters.AddWithValue("@Score", scoreModel.Score);

                    try
                    {
                        connection.Open();
                        command.ExecuteNonQuery();
                    }
                    catch (SqlException ex)
                    {
                        return BadRequest($"Ошибка при сохранении данных: {ex.Message}");
                    }
                }
            }

            return Ok();
        }


        public IActionResult Index() // вывод топ-10 статистики
        {
            List<Player> topPlayers = [];

            using (SqlConnection connection = new(connectionString))
            {
                string query = "SELECT TOP 10 UserName, Score FROM PlayerStats ORDER BY Score DESC";

                SqlCommand command = new(query, connection);
                try
                {
                    connection.Open();
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            topPlayers.Add(new Player
                            {
                                UserName = reader.GetString(0),
                                Score = reader.GetInt16(1)
                            });
                        }
                    }
                }
                catch (SqlException ex)
                {
                    ViewData["Message"] = $"Ошибка подключения к базе данных: {ex.Message}";
                }
            }

            ViewData["TopPlayers"] = topPlayers;
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}

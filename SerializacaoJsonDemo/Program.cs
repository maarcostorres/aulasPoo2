using System;
using System.Text.Json;
using System.IO;

class Program
{
    static void Main()
    {
        // Criando um objeto Veiculo
        Veiculo veiculo = new Veiculo { Marca = "Volkswagen", Modelo = "Nivus", Cor = "Cinza" };

        // Serialização: Convertendo o objeto Veiculo para JSON
        string jsonString = JsonSerializer.Serialize(veiculo);

        // Salvando o JSON em um arquivo
        File.WriteAllText("veiculo.json", jsonString);
        Console.WriteLine("Objeto serializado para JSON e salvo em 'veiculo.json'.");

        // Leitura do JSON do arquivo
        string jsonFromFile = File.ReadAllText("veiculo.json");

        // Deserialização: Convertendo o JSON de volta para um objeto Veiculo
        Veiculo deserializedVeiculo = JsonSerializer.Deserialize<Veiculo>(jsonFromFile);

        // Exibindo os dados do objeto deserializado
        Console.WriteLine($"Marca: {deserializedVeiculo.Marca}, Modelo: {deserializedVeiculo.Modelo}, Cor: {deserializedVeiculo.Cor}");
    }
}

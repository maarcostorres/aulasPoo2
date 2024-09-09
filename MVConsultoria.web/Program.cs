using Microsoft.EntityFrameworkCore;
using MVConsultoria.Web.Data;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Configuração da conexão com o banco de dados MySQL
builder.Services.AddDbContext<MVConsultoriaContext>(options =>
    options.UseMySQL(builder.Configuration.GetConnectionString("DefaultConnection")));

// Adiciona os serviços de controle e configura JSON para lidar com ciclos de referência
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve; // Lida com ciclos de referência
        options.JsonSerializerOptions.WriteIndented = true; // Formata o JSON com indentação para leitura mais fácil
    });

// Adiciona o Swagger, se necessário
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configuração do pipeline de requisições HTTP
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();

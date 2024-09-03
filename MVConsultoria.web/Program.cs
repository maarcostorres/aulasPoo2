using Microsoft.EntityFrameworkCore;
using MVConsultoria.Web.Data;

var builder = WebApplication.CreateBuilder(args);

// Configuração da conexão com o banco de dados MySQL
builder.Services.AddDbContext<MVConsultoriaContext>(options =>
    options.UseMySQL(builder.Configuration.GetConnectionString("DefaultConnection")));

// Adiciona os serviços de controle
builder.Services.AddControllers();

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

//app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();

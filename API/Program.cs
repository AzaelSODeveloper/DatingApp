using API.Data;
using Microsoft.Build.Framework;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddDbContext<AppDbContext>(opt =>
{
    opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddCors();
builder.Services.AddControllers();

var app = builder.Build();
//Configure the http request pipeline
app.UseCors(options => options.AllowAnyHeader().AllowAnyMethod()
.WithOrigins("http://localhost:4200", "https://localhost:4200"));

app.MapControllers();

app.Run();
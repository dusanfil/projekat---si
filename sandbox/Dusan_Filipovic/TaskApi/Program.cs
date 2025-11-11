using TaskApi.Models;
using TaskApi.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.Configure<TaskDatabaseSettings>(
    builder.Configuration.GetSection("TaskDatabase"));
builder.Services.AddSingleton<TaskService>();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ?? CORS konfiguracija
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins(
                "http://localhost:3000",           // ? za web frontend (React)
                "http://192.168.0.133:8081"        // ? za Expo mobilnu aplikaciju
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// ?? Aktiviraj CORS pre autorizacije
app.UseCors("AllowFrontend");

app.UseAuthorization();

app.MapControllers();

app.Run();

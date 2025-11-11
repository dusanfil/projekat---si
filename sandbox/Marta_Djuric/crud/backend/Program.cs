using backend.Services;
using MongoDB.Driver;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddSingleton<IMongoClient>(sp =>
{
    var connectionString = builder.Configuration.GetConnectionString("MongoDb");
    return new MongoClient(connectionString);
});


builder.Services.AddSingleton<DogadjajService>();

builder.Services.AddSingleton<UcesniciService>();




builder.Services.AddControllers();


builder.Services.AddCors();

var app = builder.Build();

app.UseCors(policy => 
    policy.AllowAnyOrigin()
          .AllowAnyMethod()
          .AllowAnyHeader());


app.MapControllers();

app.Run();

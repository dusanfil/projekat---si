
using krud.Models;
using krud.Services;
using MongoDB.Driver;

namespace krud
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);


            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            builder.Services.AddSingleton<IMongoClient>(sp => new MongoClient(builder.Configuration.GetConnectionString("MongoDb")));

            builder.Services.AddScoped<IMongoDatabase>(sp =>
            {
                var client = sp.GetRequiredService<IMongoClient>();
                var dbName = builder.Configuration["DatabaseName"];
                return client.GetDatabase(dbName);
            });

            builder.Services.AddControllers();
            builder.Services.AddSingleton<ZadatakService>();

            builder.Services.AddSingleton<krud.Services.ZadatakService>();

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowReact",
                    builder => builder
                        .WithOrigins("http://localhost:3000")
                        .AllowAnyHeader()
                        .AllowAnyMethod());
            });

            builder.Services.Configure<DatabaseSettings>(
            builder.Configuration.GetSection("DatabaseSettings"));

            builder.Services.AddSingleton<ZadatakService>();


            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();
            app.UseCors("AllowReact");

            app.MapControllers();

            app.Run();
        }
    }
}

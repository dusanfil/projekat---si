using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using System.Threading.Tasks;
using TaskApi.Models;
using System;
using System.Collections.Generic;

namespace TaskApi.Services
{
    public class TaskService
    {
        private readonly IMongoCollection<TaskModel> _tasksCollection;

        public TaskService(IConfiguration config)
        {
            var connectionString = config.GetSection("MongoDB:ConnectionString").Value;
            if (string.IsNullOrEmpty(connectionString))
            {
                throw new ArgumentNullException("connectionString", "MongoDB connection string is not provided in the configuration.");
            }

            var mongoClient = new MongoClient(connectionString);
            var mongoDatabase = mongoClient.GetDatabase(config["MongoDB:DatabaseName"]);
            _tasksCollection = mongoDatabase.GetCollection<TaskModel>(config["MongoDB:TaskCollectionName"]);
        }

        // GET: Returns all tasks from the database
        public async Task<List<TaskModel>> GetAsync()
        {
            return await _tasksCollection.Find(_ => true).ToListAsync();
        }

        // GET by ID: Fetches a single task based on the task's ID
        public async Task<TaskModel?> GetAsync(string id)
        {
            // Pretvaranje stringa u ObjectId pre upita
            if (ObjectId.TryParse(id, out var objectId))
            {
                return await _tasksCollection.Find(t => t.Id == id).FirstOrDefaultAsync();  // Koristimo string ID u upitu
            }
            else
            {
                throw new FormatException("Invalid ObjectId format.");
            }
        }

        // POST: Inserts a new task into the database
        public async Task CreateAsync(TaskModel task)
        {
            if (task == null)
                throw new ArgumentNullException(nameof(task), "Task cannot be null");

            // Automatski dodeljujemo ID pri unosu nove stavke
            task.Id = ObjectId.GenerateNewId().ToString();  // Generišemo novi ID ako nije dodeljen

            await _tasksCollection.InsertOneAsync(task);
        }

        // PUT: Updates an existing task by its ID
        public async Task UpdateAsync(string id, TaskModel updatedTask)
        {
            if (updatedTask == null)
                throw new ArgumentNullException(nameof(updatedTask), "Updated task cannot be null");

            // Pretvaranje stringa u ObjectId pre upita
            if (ObjectId.TryParse(id, out var objectId))
            {
                // Pronalazi zadatak sa datim ID-em
                var task = await _tasksCollection.Find(t => t.Id == id).FirstOrDefaultAsync();  // Koristimo string ID

                if (task == null)
                {
                    throw new KeyNotFoundException($"Task with ID: {id} not found.");
                }

                updatedTask.Id = task.Id; // Osiguraj da novi zadatak ima isti ID kao prethodni

                await _tasksCollection.ReplaceOneAsync(t => t.Id == id, updatedTask); // Koristimo string ID u upitu
            }
            else
            {
                throw new FormatException("Invalid ObjectId format.");
            }
        }

        // DELETE: Deletes a task by its ID
        public async Task DeleteAsync(string id)
        {
            // Pretvaranje stringa u ObjectId pre upita
            if (ObjectId.TryParse(id, out var objectId))
            {
                var task = await _tasksCollection.Find(t => t.Id == id).FirstOrDefaultAsync();  // Koristimo string ID

                if (task == null)
                {
                    throw new KeyNotFoundException($"Task with ID: {id} not found.");
                }

                await _tasksCollection.DeleteOneAsync(t => t.Id == id); // Koristimo string ID u upitu
            }
            else
            {
                throw new FormatException("Invalid ObjectId format.");
            }
        }
    }
}

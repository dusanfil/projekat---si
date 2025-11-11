namespace TaskApi.Models
{
    public class TaskDatabaseSettings
    {
        public string ConnectionString { get; set; } = null!;
        public string DatabaseName { get; set; } = null!;
        public string TaskCollectionName { get; set; } = null!;
    }
}

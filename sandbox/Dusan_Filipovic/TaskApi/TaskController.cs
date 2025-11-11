using Microsoft.AspNetCore.Mvc;
using TaskApi.Models;
using TaskApi.Services;

namespace TaskApi.Controllers
{
    [Route("api/task")]
    [ApiController]
    public class TaskController : ControllerBase
    {
        private readonly TaskService _taskService;

        public TaskController(TaskService taskService)
        {
            _taskService = taskService;
        }

        // GET api/task
        [HttpGet]
        public async Task<ActionResult<List<TaskModel>>> GetTasks()
        {
            var tasks = await _taskService.GetAsync();
            return Ok(tasks);
        }

        // POST api/task
        [HttpPost]
        public async Task<ActionResult<TaskModel>> CreateTask([FromBody] TaskModel task)
        {
            await _taskService.CreateAsync(task);
            return CreatedAtAction(nameof(GetTasks), new { id = task.Id }, task);
        }

        // PUT api/task/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateTask(string id, [FromBody] TaskModel task)
        {
            var existingTask = await _taskService.GetAsync(id);
            if (existingTask == null)
            {
                return NotFound();
            }

            await _taskService.UpdateAsync(id, task);
            return NoContent();
        }

        // DELETE api/task/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteTask(string id)
        {
            var existingTask = await _taskService.GetAsync(id);
            if (existingTask == null)
            {
                return NotFound();
            }

            await _taskService.DeleteAsync(id);
            return NoContent();
        }
    }
}

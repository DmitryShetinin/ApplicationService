using Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/departments")]
public class DepartmentsController : ControllerBase
{
    private readonly AppDbContext _db;

    public DepartmentsController(AppDbContext db)
    {
        _db = db;
    }


    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var departments = await _db.Departments
            .Select(x => new
            {
                x.Id,
                x.Name
            }).AsNoTracking()
            .ToListAsync();

        return Ok(departments);
    }
}
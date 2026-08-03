using Application.Features.Employees;
using Application.Features.Employees.Requests;
using Microsoft.AspNetCore.Mvc;

namespace ApplicationService.Controllers;


[ApiController]
[Route("api/employees")]
public sealed class EmployeesController : ControllerBase
{
    private readonly IEmployeeService _employeeService;


    public EmployeesController(
        IEmployeeService employeeService)
    {
        _employeeService = employeeService;
    }



    [HttpPost]
    public async Task<IActionResult> Create(
        CreateEmployeeRequest request,
        CancellationToken cancellationToken)
    {
        var id = await _employeeService.CreateAsync(
            request,
            cancellationToken);


        return CreatedAtAction(
            nameof(GetById),
            new { id },
            new { id });
    }



    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(
        Guid id,
        CancellationToken cancellationToken)
    {
        var employee =
            await _employeeService.GetByIdAsync(
                id,
                cancellationToken);


        if (employee is null)
        {
            return NotFound();
        }


        return Ok(employee);
    }



    [HttpGet]
    public async Task<IActionResult> Get(
        CancellationToken cancellationToken)
    {
        var employees =
            await _employeeService.GetEmployeesAsync(
                cancellationToken);


        return Ok(employees);
    }
}
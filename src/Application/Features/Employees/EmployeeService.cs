using Application.Abstractions.Persistence;
using Application.Common.Extensions;
using Application.Features.Employees.Requests;
using Application.Features.Employees.Responses;
using Core.Models; 
 


namespace Application.Features.Employees;


public sealed class EmployeeService : IEmployeeService
{
    private readonly IEmployeeRepository _employeeRepository;


    public EmployeeService(
        IEmployeeRepository employeeRepository)
    {
        _employeeRepository = employeeRepository;
    }


    public async Task<Guid> CreateAsync(
    CreateEmployeeRequest request,
    CancellationToken cancellationToken)
{
    var employee = Employee.Create(
        request.FullName,
        request.Department,
        request.Position);


    await _employeeRepository.AddAsync(
        employee,
        cancellationToken);


    return employee.Id;
}


    public async Task<EmployeeResponse?> GetByIdAsync(
        Guid employeeId,
        CancellationToken cancellationToken)
    {
        var employee = await _employeeRepository.GetByIdAsync(
            employeeId,
            cancellationToken);


        if (employee is null)
            return null;


        return employee.ToResponse();
    }


    public async Task<IReadOnlyCollection<EmployeeResponse>> GetAsync(
        CancellationToken cancellationToken)
    {
        var employees = await _employeeRepository.GetAllAsync(
            cancellationToken);


        return employees
                .Select(x => x.ToResponse())
                .ToArray();
    }


  
}
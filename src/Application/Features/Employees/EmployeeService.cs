using Application.Abstractions.Persistence;
 
using Application.Features.Employees.Requests;
using Application.Features.Employees.Responses;
using Core.Models;
using Mapster;



namespace Application.Features.Employees;


public sealed class EmployeeService : IEmployeeService
{
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IDepartmentRepository _departmentRepository;
    private readonly IPositionRepository _positionRepository;

    public EmployeeService(
        IEmployeeRepository employeeRepository, 
        IDepartmentRepository departmentRepository, 
        IPositionRepository positionRepository)
    {
        _employeeRepository = employeeRepository;
        _departmentRepository = departmentRepository; 
        _positionRepository = positionRepository; 
    }


   public async Task<Guid> CreateAsync(
    CreateEmployeeRequest request,
    CancellationToken cancellationToken)
{
    var department =
        await _departmentRepository.GetByIdAsync(
            request.DepartmentId,
            cancellationToken);


    if (department is null)
    {
        throw new InvalidOperationException(
            "Department not found");
    }


    var position =
        await _positionRepository.GetByIdAsync(
            request.PositionId,
            cancellationToken);


    if (position is null)
    {
        throw new InvalidOperationException(
            "Position not found");
    }


    var employee = Employee.Create(
        request.FullName,
        department,
        position);


    await _employeeRepository.AddAsync(
        employee,
        cancellationToken);


    await _employeeRepository.SaveChangesAsync(employee, 
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


        return employee.Adapt<EmployeeResponse>();
    }


    public async Task<IReadOnlyCollection<EmployeeResponse>> GetAsync(
        CancellationToken cancellationToken)
    {
        var employees = await _employeeRepository.GetAllAsync(
            cancellationToken);


        return employees
                .Select(x => x.Adapt<EmployeeResponse>())
                .ToArray();
    }


  
}
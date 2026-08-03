using Application.Abstractions.Persistence;
using Application.Common;
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
    private readonly IUnitOfWork _unitOfWork;


    public EmployeeService(
        IEmployeeRepository employeeRepository,
        IDepartmentRepository departmentRepository,
        IPositionRepository positionRepository,
        IUnitOfWork unitOfWork)
    {
        _employeeRepository = employeeRepository;
        _departmentRepository = departmentRepository;
        _positionRepository = positionRepository;
        _unitOfWork = unitOfWork;
    }


    public async Task<Result<Guid>> CreateAsync(
        CreateEmployeeRequest request,
        CancellationToken cancellationToken)
    {
        var department =
            await _departmentRepository.GetByIdAsync(
                request.DepartmentId,
                cancellationToken);


        if (department is null)
        {
            return Result<Guid>.Failure(
                "Department not found");
        }


        var position =
            await _positionRepository.GetByIdAsync(
                request.PositionId,
                cancellationToken);


        if (position is null)
        {
            return Result<Guid>.Failure(
                "Position not found");
        }


        var employee = Employee.Create(
            request.FirstName,
            request.LastName,
            request.MiddleName,
            department,
            position);


        await _employeeRepository.AddAsync(
            employee,
            cancellationToken);


        await _unitOfWork.SaveChangesAsync(
            cancellationToken);


        return Result<Guid>.Success(
            employee.Id);
    }


    public async Task<EmployeeResponse?> GetByIdAsync(
        Guid employeeId,
        CancellationToken cancellationToken)
    {
        var employee =
            await _employeeRepository.GetByIdAsync(
                employeeId,
                cancellationToken);


        if (employee is null)
        {
            return null;
        }


        return employee.Adapt<EmployeeResponse>();
    }


    public async Task<IReadOnlyCollection<EmployeeResponse>> GetEmployeesAsync(
        CancellationToken cancellationToken)
    {
        var employees =
            await _employeeRepository.GetAllAsync(
                cancellationToken);


        return employees.Adapt<IReadOnlyCollection<EmployeeResponse>>();
    }
}
using Application.Features.Employees.Requests;
using Application.Features.Employees.Responses;

namespace Application.Features.Employees;

public interface IEmployeeService
{
    Task<Guid> CreateAsync(
        CreateEmployeeRequest request,
        CancellationToken cancellationToken);


    Task<EmployeeResponse?> GetByIdAsync(
        Guid employeeId,
        CancellationToken cancellationToken);


    Task<IReadOnlyCollection<EmployeeResponse>> GetAsync(
        CancellationToken cancellationToken);
}
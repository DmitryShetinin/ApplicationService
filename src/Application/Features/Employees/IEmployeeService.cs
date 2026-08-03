using Application.Common;
using Application.Features.Employees.Requests;
using Application.Features.Employees.Responses;

namespace Application.Features.Employees;

public interface IEmployeeService
{
   Task<Result<Guid>> CreateAsync(
        CreateEmployeeRequest request,
        CancellationToken cancellationToken);


    Task<EmployeeResponse?> GetByIdAsync(
        Guid employeeId,
        CancellationToken cancellationToken);


    Task<IReadOnlyCollection<EmployeeResponse>> GetEmployeesAsync(
        CancellationToken cancellationToken);
}
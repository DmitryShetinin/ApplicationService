using Application.Receipts.Requests;
using Application.Receipts.Responses;




namespace Application.Features.Application;

public interface IApplicationService
{
  Task<Guid> CreateAsync(
      CreateApplicationRequest request,
      CancellationToken cancellationToken);

  Task ChangeStatusAsync(
      Guid applicationId,
      ApplicationStatus newStatus,
      CancellationToken cancellationToken);

  Task AssignExecutorAsync(
      Guid applicationId,
      Guid executorId,
      CancellationToken cancellationToken);

  Task<ApplicationResponse?> GetByIdAsync(
      Guid applicationId,
      CancellationToken cancellationToken);

  Task<IReadOnlyCollection<ApplicationResponse>> GetAsync(
      ApplicationFilterRequest filter,
      CancellationToken cancellationToken);
}

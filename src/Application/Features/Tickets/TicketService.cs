
using Application.Features.Application;
using Application.Features.Application.Requests;
using Application.Features.Application.Responses;
using Application.Interfaces;
using Core.Enums;
using Core.Models;








namespace Application.Receipts;


public sealed class TicketService : ITicketService
{
  private readonly ITicketService _ticketService;
  private readonly IEmployeeRepository _employeeRepository;


  public TicketService(
      ITicketService employeeRepository)
  {
    _ticketService = employeeRepository;
 
  }

 
  public async Task<Guid> CreateAsync(
      CreateTicketRequest request,
      CancellationToken cancellationToken)
  {
    var author = await _employeeRepository
        .GetByIdAsync(request.AuthorId, cancellationToken);

    if (author is null)
      throw new Exception("Author not found");


    Employee? executor = null;

    if (request.ExecutorId.HasValue)
    {
      executor = await _employeeRepository
          .GetByIdAsync(
              request.ExecutorId.Value,
              cancellationToken);

      if (executor is null)
        throw new Exception("Executor not found");
    }


    var application = Ticket.Create (
        Guid.NewGuid(),
        request.Number,
        author,
        request.Description,
        request.Deadline);


    if (executor != null)
      application.AssignExecutor(executor);


    await _employeeApplicationRepository
        .AddAsync(application, cancellationToken);


    return application.Id;
  }


  public async Task ChangeStatusAsync(
      Guid applicationId,
      TicketStatus newStatus,
      CancellationToken cancellationToken)
  {
    var application = await _applicationRepository
        .GetByIdAsync(applicationId, cancellationToken);

    if (application is null)
      throw new Exception("Application not found");


    application.ChangeStatus(newStatus);


    await _applicationRepository
        .SaveChangesAsync(cancellationToken);
  }


  public async Task AssignExecutorAsync(
      Guid applicationId,
      Guid executorId,
      CancellationToken cancellationToken)
  {
    var application = await _applicationRepository
        .GetByIdAsync(applicationId, cancellationToken);

    var executor = await _employeeRepository
        .GetByIdAsync(executorId, cancellationToken);


    if (application is null)
      throw new Exception("Application not found");

    if (executor is null)
      throw new Exception("Employee not found");


    application.AssignExecutor(executor);


    await _applicationRepository
        .SaveChangesAsync(cancellationToken);
  }

  public Task<TicketResponse?> GetByIdAsync(Guid applicationId, CancellationToken cancellationToken)
  {
    throw new NotImplementedException();
  }

  public Task<IReadOnlyCollection<TicketResponse>> GetAsync(TicketFilterRequest filter, CancellationToken cancellationToken)
  {
    throw new NotImplementedException();
  }
}

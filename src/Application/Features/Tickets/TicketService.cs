
using Application.Abstractions.Persistence;
using Application.Features.Application;
using Application.Features.Application.Requests;
using Application.Features.Application.Responses;
using Application.Features.Ticket.Requests;
using Application.Interfaces;
using Core.Enums;
using Core.Models;








namespace Application.Receipts;


public sealed class TicketService : ITicketService
{
  private readonly ITicketRepository _ticketRepository;
  private readonly IEmployeeRepository _employeeRepository;


  public TicketService(
      ITicketRepository ticketRepository, IEmployeeRepository employeeRepository)
  {
    _ticketRepository = ticketRepository;
    _employeeRepository = employeeRepository; 
 
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


    var ticket = Ticket.Create (
        Guid.NewGuid(),
        request.Number,
        author,
        request.Description,
        request.Deadline);


    if (executor != null)
      application.AssignExecutor(executor);


    await  _ticketRepository
        .AddAsync(ticket, cancellationToken);


    return application.Id;
  }


  public async Task ChangeStatusAsync(
      Guid TaskId,
      TicketStatus newStatus,
      CancellationToken cancellationToken)
  {
    var application = await _ticketRepository
        .GetByIdAsync(TaskId, cancellationToken);

    if (application is null)
      throw new Exception("Application not found");


    application.ChangeStatus(newStatus);


    await _ticketRepository
        .SaveChangesAsync(cancellationToken);
  }

   
  public async Task AssignExecutorAsync(
      Guid applicationId,
      Guid executorId,
      CancellationToken cancellationToken)
  {
    var application = await _ticketRepository
        .GetByIdAsync(applicationId, cancellationToken);

    var executor = await _employeeRepository
        .GetByIdAsync(executorId, cancellationToken);


    if (application is null)
      throw new Exception("Application not found");

    if (executor is null)
      throw new Exception("Employee not found");


    application.AssignExecutor(executor);


    await _ticketRepository
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

using Application.Abstractions.Persistence;
using Application.Common;


using Application.Features.Tickets.Requests;
using Core.Enums;
using Core.Models;
using Microsoft.AspNetCore.SignalR;
using WebApi.Hubs;

namespace Application.Features.Tickets;

public sealed class TicketService : ITicketService
{
    private readonly ITicketRepository _ticketRepository;
 
    
    private readonly IEmployeeRepository _employeeRepository;
    private readonly TicketStateMachine _stateMachine;

    private readonly IHubContext<TicketHub> _hub;

    
    public TicketService(
        ITicketRepository ticketRepository,
        IEmployeeRepository employeeRepository,
        TicketStateMachine stateMachine,
        IHubContext<TicketHub> hub)
    {
        _ticketRepository = ticketRepository;
        _employeeRepository = employeeRepository;
        _stateMachine = stateMachine;
        _hub = hub;
      
    }


    public async Task<Result<Guid>> CreateAsync(
        CreateTicketRequest request,
        CancellationToken cancellationToken)
    {
        var author =
            await _employeeRepository.GetByIdAsync(
                request.AuthorId,
                cancellationToken);


        if (author is null)
        {
            return Result<Guid>.Failure(
                "Author not found");
        }


        var executor =
                await _employeeRepository.GetByIdAsync(
                    request.ExecutorId,
                    cancellationToken);


    



        var ticket = Ticket.Create(
                request.Number,
                author,
                executor,
                request.Description,
                request.Deadline);


        await _ticketRepository.AddAsync(
            ticket,
            cancellationToken);


        await _ticketRepository.SaveChangesAsync(
            cancellationToken);


        return Result<Guid>.Success(
            ticket.Id);
    }



   public async Task<Result<bool>> ChangeStatusAsync(
    Guid ticketId,
    TicketStatus newStatus,
    CancellationToken cancellationToken)
{
    var ticket =
        await _ticketRepository.GetByIdAsync(
            ticketId,
            cancellationToken);


    if (ticket is null)
    {
        return Result<bool>.Failure(
            "Ticket not found");
    }


    try
    {
        ticket.MoveTo(
            newStatus,
            _stateMachine);
    }
    catch (InvalidOperationException ex)
    {
        return Result<bool>.Failure(
            ex.Message);
    }


    await _ticketRepository.SaveChangesAsync(
        cancellationToken);
        
    await _hub.Clients.All.SendAsync(
        "TicketUpdated",
        ticket.Id
    );

    return Result<bool>.Success(true);
}



    public async Task<Result<bool>> AssignExecutorAsync(
        Guid ticketId,
        Guid executorId,
        CancellationToken cancellationToken)
    {
        var ticket =
            await _ticketRepository.GetByIdAsync(
                ticketId,
                cancellationToken);


        if (ticket is null)
        {
            return Result<bool>.Failure(
                "Ticket not found");
        }


        var executor =
            await _employeeRepository.GetByIdAsync(
                executorId,
                cancellationToken);


        if (executor is null)
        {
            return Result<bool>.Failure(
                "Employee not found");
        }


        ticket.AssignExecutor(executor);


        await _ticketRepository.SaveChangesAsync(
            cancellationToken);


        return Result<bool>.Success(true);
    }



  

  
}
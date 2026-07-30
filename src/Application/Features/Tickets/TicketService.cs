using Application.Abstractions.Persistence;
using Application.Common;
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
    private readonly TicketStateMachine _stateMachine; 

    public TicketService(
        ITicketRepository ticketRepository,
        IEmployeeRepository employeeRepository, TicketStateMachine stateMachine)
    {
        _ticketRepository = ticketRepository;
        _employeeRepository = employeeRepository;
        _stateMachine = stateMachine;
    }



    public async Task<Result<Guid>> CreateAsync(
        CreateTicketRequest request,
        CancellationToken cancellationToken)
    {
        var author = await _employeeRepository
            .GetByIdAsync(
                request.AuthorId,
                cancellationToken);


        if (author is null)
        {
            return Result<Guid>.Failure(
                "Author not found");
        }


        Employee? executor = null;


        if (request.ExecutorId.HasValue)
        {
            executor = await _employeeRepository
                .GetByIdAsync(
                    request.ExecutorId.Value,
                    cancellationToken);


            if (executor is null)
            {
                return Result<Guid>.Failure(
                    "Executor not found");
            }
        }


        var ticket = Ticket.Create(
            request.Number,
            author,
            executor,
            request.Description,
            request.Deadline);


        await _ticketRepository
            .AddAsync(
                ticket,
                cancellationToken);


        return Result<Guid>.Success(
            ticket.Id);
    }



    public async Task<Result> ChangeStatusAsync(
        Guid ticketId,
        TicketStatus newStatus,
        CancellationToken cancellationToken)
    {
        var ticket = await _ticketRepository
            .GetByIdAsync(
                ticketId,
                cancellationToken);


        if (ticket is null)
        {
            return Result.Failure(
                "Ticket not found");
        }


        ticket.MoveTo(newStatus, _stateMachine);


        await _ticketRepository
            .SaveChangesAsync(cancellationToken);


        return Result.Success();
    }



    public async Task<Result> AssignExecutorAsync(
        Guid ticketId,
        Guid executorId,
        CancellationToken cancellationToken)
    {
        var ticket = await _ticketRepository
            .GetByIdAsync(
                ticketId,
                cancellationToken);


        if (ticket is null)
        {
            return Result.Failure(
                "Ticket not found");
        }


        var executor = await _employeeRepository
            .GetByIdAsync(
                executorId,
                cancellationToken);


        if (executor is null)
        {
            return Result.Failure(
                "Employee not found");
        }


        ticket.AssignExecutor(executor);


        await _ticketRepository
            .SaveChangesAsync(cancellationToken);


        return Result.Success();
    }



    public async Task<Result<TicketResponse>> GetByIdAsync(
        Guid ticketId,
        CancellationToken cancellationToken)
    {
        var ticket = await _ticketRepository
            .GetByIdAsync(
                ticketId,
                cancellationToken);


        if (ticket is null)
        {
            return Result<TicketResponse>.Failure(
                "Ticket not found");
        }


        return Result<TicketResponse>.Success(
            ticket.ToResponse());
    }



    public async Task<Result<IReadOnlyCollection<TicketResponse>>> GetAsync(
        TicketFilterRequest filter,
        CancellationToken cancellationToken)
    {
        var tickets = await _ticketRepository
            .GetAsync(
                filter,
                cancellationToken);


        var response = tickets
            .Select(x => x.ToResponse())
            .ToArray();


        return Result<IReadOnlyCollection<TicketResponse>>
            .Success(response);
    }


}
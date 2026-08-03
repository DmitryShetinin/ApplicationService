using Application.Abstractions.Persistence;
using Application.Common;
using Application.Features.Tickets.Requests;
using Core.Enums;
using Core.Models;
using Application.Features.Notifications.Responses;
using Application.Features.Notifications;
using Application.Abstractions.Notifications;
using Mapster;
using Application.Features.Tickets.Responses;
using Application.Queries;

namespace Application.Features.Tickets;

public sealed class TicketService : ITicketService
{
    private readonly ITicketRepository _ticketRepository;
    private readonly IEmployeeRepository _employeeRepository;
    private readonly TicketStateMachine _stateMachine;
    private readonly INotificationPublisher _notificationPublisher;
    private readonly ITicketNotifier _ticketNotifier;
    private readonly IUnitOfWork _unitOfWork;
   

    public TicketService(
        ITicketRepository ticketRepository,
        IEmployeeRepository employeeRepository,
        TicketStateMachine stateMachine,
        INotificationPublisher notificationPublisher,
        ITicketNotifier ticketNotifier,
        IUnitOfWork unitOfWork, 
        ITicketQueries ticketQueries)
    {
        _ticketRepository = ticketRepository;
        _employeeRepository = employeeRepository;
        _stateMachine = stateMachine;
        _notificationPublisher = notificationPublisher;
        _ticketNotifier = ticketNotifier;
        _unitOfWork = unitOfWork;
     
    }


    public async Task<Result<bool>> UpdateAsync(
        Guid ticketId,
        UpdateTicketRequest request,
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


        _ticketRepository.SetOriginalVersion(
            ticket,
            request.Version);


        Employee? executor = null;


        if (request.ExecutorId.HasValue)
        {
            executor =
                await _employeeRepository.GetByIdAsync(
                    request.ExecutorId.Value,
                    cancellationToken);


            if (executor is null)
            {
                return Result<bool>.Failure(
                    "Employee not found");
            }
        }


        ticket.Edit(
            executor,
            request.Description,
            request.Deadline);


        if (ticket.Status != request.Status)
        {
            ticket.MoveTo(
                request.Status,
                _stateMachine);
        }


        ticket.IncrementVersion();


        await _unitOfWork.SaveChangesAsync(
            cancellationToken);


        await _ticketNotifier.TicketUpdated(
                ticket.ToResponse(_stateMachine),
                cancellationToken);


        await Notify(
            ticket,
            "Тикет обновлен",
            cancellationToken);


        return Result<bool>.Success(true);
    }


public async Task<Result<TicketResponse>> CreateAsync(
    CreateTicketRequest request,
    CancellationToken cancellationToken)
{
    var author =
        await _employeeRepository.GetByIdAsync(
            request.AuthorId,
            cancellationToken);


    if (author is null)
    {
        return Result<TicketResponse>.Failure(
            "Author not found");
    }


    Employee? executor = null;


    if (request.ExecutorId.HasValue)
    {
        executor =
            await _employeeRepository.GetByIdAsync(
                request.ExecutorId.Value,
                cancellationToken);


        if (executor is null)
        {
            return Result<TicketResponse>.Failure(
                "Executor not found");
        }
    }


    var number =
        await _ticketRepository.GetNextNumberAsync(
            cancellationToken);


    var ticket =
        Ticket.Create(
            number,
            author,
            executor,
            request.Description,
            request.Deadline,
            request.ClientRequestId);


    await _ticketRepository.AddAsync(
        ticket,
        cancellationToken);


    await _unitOfWork.SaveChangesAsync(
        cancellationToken);


    await _ticketNotifier.TicketCreated(
        ticket.ToResponse(_stateMachine),
        cancellationToken);


    await Notify(
        ticket,
        "Создан новый тикет",
        cancellationToken);


    var response =
        ticket.ToResponse(_stateMachine);


    return Result<TicketResponse>.Success(
        response);
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


        ticket.IncrementVersion();


        await _unitOfWork.SaveChangesAsync(
            cancellationToken);


        await _ticketNotifier.TicketUpdated(
                ticket.ToResponse(_stateMachine),
                cancellationToken);


        await Notify(
            ticket,
            "Статус тикета изменён",
            cancellationToken);


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

        ticket.IncrementVersion();


        await _unitOfWork.SaveChangesAsync(
            cancellationToken);


     await _ticketNotifier.TicketUpdated(
        ticket.ToResponse(_stateMachine),
        cancellationToken);


        await Notify(
            ticket,
            "Исполнитель тикета изменён",
            cancellationToken);


        return Result<bool>.Success(true);
    }


    public async Task<Result<bool>> DeleteAsync(
        Guid ticketId,
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


        _ticketRepository.Remove(ticket);


        await _unitOfWork.SaveChangesAsync(
            cancellationToken);


        await _ticketNotifier.TicketDeleted(
            ticketId,
            cancellationToken);


        await Notify(
            ticket,
            "Тикет удален",
            cancellationToken);


        return Result<bool>.Success(true);
    }


    private Task Notify(
        Ticket ticket,
        string message,
        CancellationToken cancellationToken)
    {
        return _notificationPublisher.PublishAsync(
            new TicketNotification(
                $"Тикет #{ticket.Number}",
                message,
                "info",
                ticket.Id),
            cancellationToken);
    }
}
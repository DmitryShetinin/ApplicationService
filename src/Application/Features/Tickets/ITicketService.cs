using Application.Common;
using Application.Features.Application.Requests;
using Application.Features.Application.Responses;
using Application.Features.Ticket.Requests;
 
using Core.Enums;




namespace Application.Features.Application;

public interface ITicketService
{
    Task<Result<Guid>> CreateAsync(
        CreateTicketRequest request,
        CancellationToken cancellationToken);


    Task<Result> ChangeStatusAsync(
        Guid ticketId,
        TicketStatus newStatus,
        CancellationToken cancellationToken);


    Task<Result> AssignExecutorAsync(
        Guid ticketId,
        Guid executorId,
        CancellationToken cancellationToken);


    Task<Result<TicketResponse>> GetByIdAsync(
        Guid ticketId,
        CancellationToken cancellationToken);


    Task<Result<IReadOnlyCollection<TicketResponse>>> GetAsync(
        TicketFilterRequest filter,
        CancellationToken cancellationToken);
}
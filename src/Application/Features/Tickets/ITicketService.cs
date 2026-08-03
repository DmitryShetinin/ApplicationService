using Application.Common;
using Application.Features.Tickets.Requests;
using Application.Features.Tickets.Responses;
using Core.Enums;

namespace Application.Features.Tickets;

public interface ITicketService
{
    Task<Result<TicketResponse>> CreateAsync(
        CreateTicketRequest request,
        CancellationToken cancellationToken);

    Task<Result<bool>> DeleteAsync(
    Guid ticketId,
    CancellationToken cancellationToken);


    Task<Result<bool>> ChangeStatusAsync(
        Guid ticketId,
        TicketStatus newStatus,
        CancellationToken cancellationToken);


    Task<Result<bool>> AssignExecutorAsync(
        Guid ticketId,
        Guid executorId,
        CancellationToken cancellationToken);

Task<Result<bool>> UpdateAsync(
    Guid ticketId,
    UpdateTicketRequest request,
    CancellationToken cancellationToken);
     


 
        
}
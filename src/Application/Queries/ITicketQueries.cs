

using Application.Common;
using Application.Features.Tickets.Requests;
using Application.Features.Tickets.Responses;
using Core.Models;

namespace Application.Queries;
public interface ITicketQueries
{
   Task<Result<TicketResponse>>  GetByIdAsync(
        Guid ticketId,
        CancellationToken cancellationToken);


     Task<Result<PagedResult<TicketResponse>>>  GetAsync(
        TicketFilterRequest filter,
        CancellationToken cancellationToken);

  
   
    Task<Result<KanbanResponse>> GetKanbanAsync(CancellationToken cancellationToken); 
        
}

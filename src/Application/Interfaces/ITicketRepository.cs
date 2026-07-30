using Application.Features.Application.Requests;
using Core.Models;

namespace Application.Interfaces
{
public interface ITicketRepository
{
    Task<Ticket?> GetByIdAsync(
        Guid ticketId,
        CancellationToken cancellationToken);


    Task<IReadOnlyCollection<Ticket>> GetAsync(
        TicketFilterRequest filter,
        CancellationToken cancellationToken);


    Task AddAsync(
        Ticket ticket,
        CancellationToken cancellationToken);


    Task SaveChangesAsync(
        CancellationToken cancellationToken);
}
}

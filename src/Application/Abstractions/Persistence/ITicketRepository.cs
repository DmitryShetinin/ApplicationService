using Application.Features.Tickets.Requests;
using Application.Features.Tickets.Responses;
using Core.Models;

namespace Application.Abstractions.Persistence;

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


    Task<bool> ExistsAsync(
        Guid id,
        CancellationToken cancellationToken);

    void SetOriginalVersion(
        Ticket ticket,
        int version);
    Task<int> GetNextNumberAsync(
        CancellationToken cancellationToken);

    void Remove(
    Ticket ticket);

}



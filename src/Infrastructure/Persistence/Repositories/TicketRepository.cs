using Application.Abstractions.Persistence;
using Application.Features.Tickets.Requests;
using Application.Features.Tickets.Responses;
using Core.Models;
using Mapster;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Repositories;

public sealed class TicketRepository : ITicketRepository
{
    private readonly AppDbContext _context;
    private readonly TicketStateMachine _stateMachine;

    public TicketRepository(
        AppDbContext context, TicketStateMachine stateMachine)
    {
        _context = context;
        _stateMachine = stateMachine;
    }


    public async Task<Ticket?> GetByIdAsync(
    Guid ticketId,
    CancellationToken cancellationToken)
    {
        return await _context.Tickets
            .Include(x => x.Author)
                .ThenInclude(x => x.Department)
            .Include(x => x.Author)
                .ThenInclude(x => x.Position)
            .Include(x => x.Executor)
                .ThenInclude(x => x.Department)
            .Include(x => x.Executor)
                .ThenInclude(x => x.Position)
            .FirstOrDefaultAsync(
                x => x.Id == ticketId,
                cancellationToken);
    }


    public async Task<IReadOnlyCollection<Ticket>> GetAsync(
    TicketFilterRequest filter,
    CancellationToken cancellationToken)
    {   
        var query = new TicketQueryBuilder(
            _context.Tickets,
            filter);

        return await query
            .Build()
            .ToListAsync(cancellationToken);
    }

        public async Task AddAsync(
            Ticket ticket,
            CancellationToken cancellationToken)
        {
            await _context.Tickets.AddAsync(
                ticket,
                cancellationToken);
        }


    public async Task SaveChangesAsync(
        CancellationToken cancellationToken)
    {
        await _context.SaveChangesAsync(
            cancellationToken);
    }

    public async Task<bool> ExistsAsync(
    Guid id,
    CancellationToken cancellationToken)
    {
        return await _context.Tickets
            .AnyAsync(
                x => x.Id == id,
                cancellationToken);
    }

    
}
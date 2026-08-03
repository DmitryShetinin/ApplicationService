
using Application.Common;
using Application.Features.Tickets.Requests;
using Application.Features.Tickets.Responses;
using Application.Queries;
using Core.Enums;
using Core.Models;
using Infrastructure.Persistence;

using Mapster;

using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Queries;

public sealed class TicketQueries : ITicketQueries
{
    private readonly AppDbContext _context;
    private readonly TicketStateMachine _stateMachine;
    public TicketQueries(
        AppDbContext context, TicketStateMachine stateMachine)
    {
        _context = context;
        _stateMachine = stateMachine;
    }

    public async Task<Result<TicketResponse>> GetByIdAsync(
    Guid ticketId,
    CancellationToken cancellationToken)
    {
        var ticket = await _context.Tickets
            .AsNoTracking()
            .Where(x => x.Id == ticketId)
            .ProjectToType<TicketResponse>()
            .FirstOrDefaultAsync(cancellationToken);

        if (ticket is null)
        {
            return Result<TicketResponse>.Failure(
                "Ticket not found");
        }

        return Result<TicketResponse>.Success(ticket);
    }

    public async Task<Result<PagedResult<TicketResponse>>> GetAsync(
    TicketFilterRequest filter,
    CancellationToken cancellationToken)
    {
        var query = new TicketQueryBuilder(
            _context.Tickets,
            filter)
            .Build();


        var totalCount = await query
            .CountAsync(cancellationToken);



        var page = filter.Page ?? 1;
        var pageSize = filter.PageSize ?? 10;



        var tickets = await query
            .OrderByDescending(x => x.CreatedAt)
            .Skip(
                (page - 1) * pageSize
            )
            .Take(pageSize)
            .ProjectToType<TicketResponse>()
            .ToListAsync(cancellationToken);



        var result = tickets
            .Select(ticket => ticket with
            {
                AllowedTransitions =
                    _stateMachine.GetAllowedTransitions(
                        ticket.Status)
            })
            .ToArray();



        return Result<PagedResult<TicketResponse>>
            .Success(
                new PagedResult<TicketResponse>(
                    result,
                    page,
                    pageSize, true 
                )
            );
    }


    public async Task<Result<KanbanResponse>> GetKanbanAsync(
      CancellationToken cancellationToken)
    {
        const int pageSize = 20;


        var newTickets = await _context.Tickets
                        .AsNoTracking()
                        .IncludeEmployees()
                        .Where(x => x.Status == TicketStatus.New)
                        .OrderByDescending(x => x.CreatedAt)
                        .Take(pageSize)
                        .ToListAsync(cancellationToken);


        var processingTickets = await _context.Tickets
                                .AsNoTracking()
                                .IncludeEmployees()
                                .Where(x => x.Status == TicketStatus.Processing)
                                .OrderByDescending(x => x.CreatedAt)
                                .Take(pageSize)
                                .ToListAsync(cancellationToken);

       
        var completedTickets = await _context.Tickets
                                .AsNoTracking()
                                .IncludeEmployees()
                                .Where(x => x.Status == TicketStatus.Completed)
                                .OrderByDescending(x => x.CreatedAt)
                                .Take(pageSize)
                                .ToListAsync(cancellationToken);

  

        var newCount = await _context.Tickets
            .CountAsync(
                x => x.Status == TicketStatus.New,
                cancellationToken);


        var processingCount = await _context.Tickets
            .CountAsync(
                x => x.Status == TicketStatus.Processing,
                cancellationToken);


        var completedCount = await _context.Tickets
            .CountAsync(
                x => x.Status == TicketStatus.Completed,
                cancellationToken);



        return Result<KanbanResponse>.Success(
            new KanbanResponse
            {
                New = new KanbanColumnResponse
                {
                    Items = newTickets.ToResponse(),

                    Page = 1,

                    TotalCount = newCount,

                    TotalPages = (int)Math.Ceiling(
                        newCount / (double)pageSize)
                },


                InProgress = new KanbanColumnResponse
                {
                    Items = processingTickets.ToResponse(),

                    Page = 1,

                    TotalCount = processingCount,

                    TotalPages = (int)Math.Ceiling(
                        processingCount / (double)pageSize)
                },


                Completed = new KanbanColumnResponse
                {
                    Items = completedTickets.ToResponse(),

                    Page = 1,

                    TotalCount = completedCount,

                    TotalPages = (int)Math.Ceiling(
                        completedCount / (double)pageSize)
                }
            });
    }

}
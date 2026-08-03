
using System.Diagnostics;
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

     


    var newColumn =
        await GetColumnAsync(
            TicketStatus.New,
            pageSize,
            cancellationToken);


    var processingColumn =
        await GetColumnAsync(
            TicketStatus.Processing,
            pageSize,
            cancellationToken);


    var completedColumn =
        await GetColumnAsync(
            TicketStatus.Completed,
            pageSize,
            cancellationToken);


 


    return Result<KanbanResponse>.Success(
        new KanbanResponse
        {
            New = newColumn,

            InProgress = processingColumn,

            Completed = completedColumn
        });
}


private async Task<KanbanColumnResponse> GetColumnAsync(
    TicketStatus status,
    int pageSize,
    CancellationToken cancellationToken)
{
    var tickets =
        await _context.Tickets

            .AsNoTracking()

            .Where(x =>
                x.Status == status)

            .OrderByDescending(x =>
                x.CreatedAt)

            .Take(pageSize + 1)

            .ProjectToType<TicketResponse>()

            .ToListAsync(cancellationToken);



    var hasNextPage =
        tickets.Count > pageSize;



    if (hasNextPage)
    {
        tickets.RemoveAt(
            tickets.Count - 1);
    }



    var result =
        tickets
            .Select(AddTransitions)
            .ToList();



    return new KanbanColumnResponse
    {
        Items = result,

        Page = 1,

        HasNextPage = hasNextPage
    };
}
private TicketResponse AddTransitions(
    TicketResponse ticket)
{
    return ticket with
    {
        AllowedTransitions =
            _stateMachine.GetAllowedTransitions(
                ticket.Status)
    };
}
}
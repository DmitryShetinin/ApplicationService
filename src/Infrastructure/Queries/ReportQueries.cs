using Application.Common;
using Application.Features.Reports.Interfaces;
using Application.Features.Reports.Responses;
using Core.Enums;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;


namespace Infrastructure.Queries;

public sealed class ReportQueries
    : IReportQueries
{
    private readonly AppDbContext _context;

    public ReportQueries(
        AppDbContext context)
    {
        _context = context;
    }

    public async Task<Result<ReportResponse>> GetAsync(
        CancellationToken cancellationToken)
    {
        var total =
            await _context.Tickets.AsNoTracking()
                .CountAsync(cancellationToken);

        var @new =
            await _context.Tickets.AsNoTracking()
                .CountAsync(
                    x => x.Status == TicketStatus.New,
                    cancellationToken);

        var processing =
            await _context.Tickets.AsNoTracking()
                .CountAsync(
                    x => x.Status == TicketStatus.Processing,
                    cancellationToken);

        var completed =
            await _context.Tickets.AsNoTracking()
                .CountAsync(
                    x => x.Status == TicketStatus.Completed,
                    cancellationToken);

        var overdue =
            await _context.Tickets.AsNoTracking()
                .CountAsync(
                    x =>
                        x.Status != TicketStatus.Completed &&
                        x.Deadline < DateTime.UtcNow,
                    cancellationToken);

        var completedTickets =
            await _context.Tickets.AsNoTracking()
                .Where(x =>
                    x.Status == TicketStatus.Completed)
                .ToListAsync(cancellationToken);



        var departmentData = await _context.Tickets.AsNoTracking()

        .GroupBy(x => x.Executor.Department.Name)

        .Select(x => new
        {
            Department = x.Key,
            Tickets = x.Count()
        })

        .OrderByDescending(x => x.Tickets)

        .ToListAsync(cancellationToken);

        var departments =
            departmentData

                .Select(x =>
                    new DepartmentStatResponse(
                        x.Department,
                        x.Tickets))

                .ToList();

        var executorData = await _context.Tickets
                                         .AsNoTracking()
                                         .GroupBy(x => new
                                         {
                                            x.Executor.Id,
                                            x.Executor.FullName
                                         })

        .Select(x => new
        {
            x.Key.Id,
            x.Key.FullName,
            Tickets = x.Count()
        }).OrderByDescending(x => x.Tickets)
          .Take(10)
          .ToListAsync(cancellationToken);

        var executors =
            executorData
                .Select(x =>
                    new ExecutorStatResponse(

                        x.Id,

                        x.FullName.ToString(),

                        x.Tickets

                    ))

                .ToList();

        return Result<ReportResponse>.Success(

            new ReportResponse(

                total,

                @new,

                processing,

                completed,

                overdue,



                departments,

                executors

            )

        );
    }
}
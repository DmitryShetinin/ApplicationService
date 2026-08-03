using Application.Common;
using Application.Features.Reports.Interfaces;
using Application.Features.Reports.Responses;
using Core.Enums;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Queries;

public sealed class ReportQueries : IReportQueries
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
        var now = DateTime.UtcNow;


        var statistics =
            await _context.Tickets
                .AsNoTracking()
                .GroupBy(x => 1)
                .Select(x => new
                {
                    Total = x.Count(),

                    New =
                        x.Count(t =>
                            t.Status == TicketStatus.New),

                    Processing =
                        x.Count(t =>
                            t.Status == TicketStatus.Processing),

                    Completed =
                        x.Count(t =>
                            t.Status == TicketStatus.Completed),

                    Overdue =
                        x.Count(t =>
                            t.Status != TicketStatus.Completed &&
                            t.Deadline < now)
                })
                .FirstAsync(cancellationToken);



        var departmentData =
            await _context.Tickets
                .AsNoTracking()

                .Where(x =>
                    x.Executor != null)

                .GroupBy(x =>
                    x.Executor!.Department.Name)

                .Select(x => new
                {
                    Department = x.Key,
                    Tickets = x.Count()
                })

                .OrderByDescending(x =>
                    x.Tickets)

                .ToListAsync(cancellationToken);



        var departments =
            departmentData
                .Select(x =>
                    new DepartmentStatResponse(
                        x.Department,
                        x.Tickets))
                .ToList();



        var executorData =
            await _context.Tickets
                .AsNoTracking()

                .Where(x =>
                    x.Executor != null)

                .GroupBy(x => new
                {
                    Id = x.Executor!.Id,
                    FullName = x.Executor.FullName
                })

                .Select(x => new
                {
                    Id = x.Key.Id,
                    FullName = x.Key.FullName,
                    Tickets = x.Count()
                })

                .OrderByDescending(x =>
                    x.Tickets)

                .Take(10)

                .ToListAsync(cancellationToken);



        var executors =
            executorData
                .Select(x =>
                    new ExecutorStatResponse(
                        x.Id,
                        x.FullName.ToString(),
                        x.Tickets))
                .ToList();



        return Result<ReportResponse>.Success(
            new ReportResponse(
                statistics.Total,
                statistics.New,
                statistics.Processing,
                statistics.Completed,
                statistics.Overdue,
                departments,
                executors
            )
        );
    }
}
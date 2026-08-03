using System.Diagnostics;
using Application.Common;
using Application.Features.Reports.Interfaces;
using Application.Features.Reports.Responses;
using Core.Enums;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Queries;

public sealed class ReportQueries : IReportQueries
{
    private readonly IDbContextFactory<AppDbContext> _factory;


    public ReportQueries(
        IDbContextFactory<AppDbContext> factory)
    {
        _factory = factory;
    }



    public async Task<Result<ReportResponse>> GetAsync(
        CancellationToken cancellationToken)
    {
        var now = DateTime.UtcNow;

       


        var statisticsTask =
            GetStatisticsAsync(
                now,
                cancellationToken);


        var departmentsTask =
            GetDepartmentsAsync(
                cancellationToken);


        var executorsTask =
            GetExecutorsAsync(
                cancellationToken);



        await Task.WhenAll(
            statisticsTask,
            departmentsTask,
            executorsTask);



       



        var statistics =
            await statisticsTask;


        var departments =
            await departmentsTask;


        var executors =
            await executorsTask;



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





    private async Task<ReportStatistics> GetStatisticsAsync(
        DateTime now,
        CancellationToken cancellationToken)
    {
         


        await using var context =
            await _factory.CreateDbContextAsync(
                cancellationToken);



        var result =
            await context.Tickets

                .AsNoTracking()

                .GroupBy(x => 1)

                .Select(x => new ReportStatistics
                {
                    Total =
                        x.Count(),

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



      


        return result;
    }





    private async Task<List<DepartmentStatResponse>> GetDepartmentsAsync(
        CancellationToken cancellationToken)
    {
   


        await using var context =
            await _factory.CreateDbContextAsync(
                cancellationToken);



        var data =
            await context.Tickets

                .AsNoTracking()

                .Where(x =>
                    x.Executor != null)

                .Select(x => new
                {
                    Department =
                        x.Executor!.Department.Name
                })

                .GroupBy(x =>
                    x.Department)

                .Select(x => new
                {
                    Department = x.Key,

                    Tickets = x.Count()
                })

                .OrderByDescending(x =>
                    x.Tickets)

                .ToListAsync(cancellationToken);


 



        return data

            .Select(x =>
                new DepartmentStatResponse(
                    x.Department,
                    x.Tickets))

            .ToList();
    }





  private async Task<List<ExecutorStatResponse>> GetExecutorsAsync(
    CancellationToken cancellationToken)
{
    await using var context =
        await _factory.CreateDbContextAsync(
            cancellationToken);


    var data =
        await context.Tickets
            .AsNoTracking()
            .Where(x => x.Executor != null)
            .GroupBy(x => new
            {
                Id = x.Executor!.Id,
                FirstName = x.Executor.FirstName,
                LastName = x.Executor.LastName,
                MiddleName = x.Executor.MiddleName
            })
            .Select(x => new
            {
                x.Key.Id,
                x.Key.FirstName,
                x.Key.LastName,
                x.Key.MiddleName,
                Tickets = x.Count()
            })
            .OrderByDescending(x => x.Tickets)
            .Take(10)
            .ToListAsync(cancellationToken);


    return data
        .Select(x =>
            new ExecutorStatResponse(
                x.Id,
                $"{x.LastName} {x.FirstName} {x.MiddleName}",
                x.Tickets))
        .ToList();
}





    private sealed class ReportStatistics
    {
        public int Total { get; set; }

        public int New { get; set; }

        public int Processing { get; set; }

        public int Completed { get; set; }

        public int Overdue { get; set; }
    }
}
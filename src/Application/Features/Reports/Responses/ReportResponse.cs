using Application.Features.Reports.Responses;

namespace Application.Features.Reports.Responses;

public sealed record ReportResponse(

    int TotalTickets,

    int NewTickets,

    int ProcessingTickets,

    int CompletedTickets,

    int OverdueTickets,


    IReadOnlyCollection<DepartmentStatResponse> Departments,

    IReadOnlyCollection<ExecutorStatResponse> Executors

);
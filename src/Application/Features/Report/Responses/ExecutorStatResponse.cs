namespace Application.Features.Reports.Responses;

public sealed record ExecutorStatResponse(

    Guid Id,

    string FullName,

    int Tickets

);
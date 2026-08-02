namespace Application.Features.Tickets.Responses;


public sealed class KanbanColumnResponse
{
    public List<TicketResponse> Items { get; init; } = [];

    public int Page { get; init; }

    public int TotalPages { get; init; }

    public int TotalCount { get; init; }
}
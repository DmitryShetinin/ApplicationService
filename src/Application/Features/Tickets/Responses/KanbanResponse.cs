namespace Application.Features.Tickets.Responses;


public sealed class KanbanResponse
{
    public KanbanColumnResponse New { get; init; } = new();

    public KanbanColumnResponse InProgress { get; init; } = new();

    public KanbanColumnResponse Completed { get; init; } = new();
}
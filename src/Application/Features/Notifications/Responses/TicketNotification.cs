namespace Application.Features.Notifications.Responses;

public sealed record TicketNotification(
    string Title,
    string Message,
    string Type,
    Guid? TicketId
);
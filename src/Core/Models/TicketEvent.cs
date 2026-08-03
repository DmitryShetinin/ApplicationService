using Core.Enums;

namespace Core.Models;
public sealed class TicketEvent
{
    private TicketEvent()
    {
    }


    private TicketEvent(
        Guid ticketId,
        TicketStatus previousStatus,
        TicketStatus currentStatus,
        string description)
    {
        Id = Guid.NewGuid();
        TicketId = ticketId;
        PreviousStatus = previousStatus;
        CurrentStatus = currentStatus;
        Description = description;
        OccurredAt = DateTime.UtcNow;
    }


    public Guid Id {get;private set;}

    public Guid TicketId {get;private set;}

    public TicketStatus PreviousStatus {get;private set;}

    public TicketStatus CurrentStatus {get;private set;}

    public string Description {get;private set;}

    public DateTime OccurredAt {get;private set;}


    public static TicketEvent Create(
        Guid ticketId,
        TicketStatus previousStatus,
        TicketStatus currentStatus,
        string description)
    {
        return new TicketEvent(
            ticketId,
            previousStatus,
            currentStatus,
            description);
    }
}
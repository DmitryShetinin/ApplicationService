using Core.Enums;

namespace Core.Models;

public sealed class TicketEvent(
    Guid TicketId,
    Guid Id, 
    TicketStatus PreviousStatus,
    TicketStatus CurrentStatus,
    string Description,
    DateTime OccurredAt)
{


    public Guid TicketId { get; private set; }

    public Guid Id { get; private set; }
    public TicketStatus PreviousStatus { get; private set; }
    public TicketStatus CurrentStatus { get; private set; }
    public string Description { get; private set; }
    public DateTime OccurredAt { get; private set; }
    

    public static TicketEvent Create(
        Guid TicketId,
        TicketStatus previousStatus,
        TicketStatus currentStatus,
        string description)
    {
        return new TicketEvent(
            TicketId,
            Guid.NewGuid(),  
            previousStatus,
            currentStatus,
            description,
            DateTime.UtcNow);
    }
}
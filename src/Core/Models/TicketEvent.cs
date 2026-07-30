using Core.Enums;

namespace Core.Models;

public sealed record TicketEvent(
    Guid EmployeeRequestId,
    TicketStatus PreviousStatus,
    TicketStatus CurrentStatus,
    string Description,
    DateTime OccurredAt)
{
    public static TicketEvent Create(
        Guid employeeRequestId,
        TicketStatus previousStatus,
        TicketStatus currentStatus,
        string description)
    {
        return new TicketEvent(
            employeeRequestId,
            previousStatus,
            currentStatus,
            description,
            DateTime.UtcNow);
    }
}
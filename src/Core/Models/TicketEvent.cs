using Core.Enums;

namespace Core.Models;

public sealed record EmployeeApplicationEvent(
    Guid EmployeeRequestId,
    TicketStatus PreviousStatus,
    TicketStatus CurrentStatus,
    string Description,
    DateTime OccurredAt)
{
    public static EmployeeApplicationEvent Create(
        Guid employeeRequestId,
        TicketStatus previousStatus,
        TicketStatus currentStatus,
        string description)
    {
        return new EmployeeApplicationEvent(
            employeeRequestId,
            previousStatus,
            currentStatus,
            description,
            DateTime.UtcNow);
    }
}
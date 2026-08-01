using Core.Enums;

namespace Core.ValueObjects;



public sealed record TicketTransition(
    TicketStatus Status,
    string DisplayName);
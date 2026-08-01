using Core.Enums;
using Core.ValueObjects;

namespace Core.Models;

public sealed class TicketStateMachine
{
    private static readonly IReadOnlyDictionary<
        TicketStatus,
        IReadOnlyCollection<TicketTransition>>
        Transitions =
            new Dictionary<TicketStatus,IReadOnlyCollection<TicketTransition>>
            {
                {
                    TicketStatus.New,
                    [
                        new(
                            TicketStatus.Processing,
                            "Начать работу")
                    ]
                },

                {
                    TicketStatus.Processing,
                    [
                        new(
                            TicketStatus.Completed,
                            "Завершить")
                    ]
                },

                {
                    TicketStatus.Completed,
                    []
                }
            };


    public void Validate(
        TicketStatus from,
        TicketStatus to)
    {
        if (!CanTransition(from, to))
        {
            throw new InvalidOperationException(
                $"Transition {from} -> {to} is forbidden");
        }
    }


    public bool CanTransition(
        TicketStatus from,
        TicketStatus to)
    {
        return GetAllowedTransitions(from)
            .Any(x => x.Status == to);
    }


    public IReadOnlyCollection<TicketTransition> GetAllowedTransitions(
        TicketStatus status)
    {
        return Transitions.TryGetValue(
            status,
            out var transitions)
                ? transitions
                : [];
    }
}
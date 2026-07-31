using Core.Enums;

namespace Core.Models
{
  public class TicketStateMachine
  {
    private static readonly Dictionary<
        TicketStatus,
        HashSet<TicketStatus>>
        Transitions =
    new()
    {
        {
            TicketStatus.New,
            [
                TicketStatus.Processing
            ]
        },

        {
            TicketStatus.Processing,
            [
                TicketStatus.Completed,
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
      if (!Transitions[from]
          .Contains(to))
      {
        throw new InvalidOperationException(
            $"Transition {from} -> {to} is forbidden");
      }
    }
  }
}

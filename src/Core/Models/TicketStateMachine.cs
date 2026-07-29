using Core.Enums;

namespace Core.Models
{
  public class OperationStateMachine
  {
    private static readonly Dictionary<
        ApplicationStatus,
        HashSet<ApplicationStatus>>
        Transitions =
    new()
    {
        {
            ApplicationStatus.Created,
            [
                ApplicationStatus.Processing
            ]
        },

        {
            ApplicationStatus.Processing,
            [
                ApplicationStatus.Completed,
            ]
        },

        {
            ApplicationStatus.Completed,
            []
        }
    };


    public void Validate(
        ApplicationStatus from,
        ApplicationStatus to)
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

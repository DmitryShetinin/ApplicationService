using Core.Enums;
using Core.ValueObjects;

namespace Core.Models;

public sealed class Ticket
{
  private Ticket()
  {
  }

  private Ticket(
      Guid id,
      int number,
      Employee author,
      Employee executor,
      string description,
      DateTime deadline)
  {
    Id = id;
    Number = number;
    Author = author;
    Executor = executor;
    Description = description;
    Deadline = deadline;

    CreatedAt = DateTime.UtcNow;
    Status = TicketStatus.New;
  }

  public Guid Id { get; private set; }

  public IReadOnlyCollection<TicketTransition> AllowedTransitions; 
  public int Number { get; private set; }

  public DateTime CreatedAt { get; private set; }

  public Guid AuthorId { get; private set; }
  public Employee Author { get; private set; } = null!;

  public Guid? ExecutorId { get; private set; }
  public Employee? Executor { get; private set; }

  public string Description { get; private set; }

  public DateTime Deadline { get; private set; }

  public TicketStatus Status { get; private set; }

  public void AssignExecutor(Employee employee)
  {
    Executor = employee;
  }

  internal void SetStatus(TicketStatus status)
  {
    Status = status;
  }

  public static Ticket Create(
          int number,
          Employee author,
          Employee executor,
          string description,
          DateTime deadline)
  {
    ArgumentNullException.ThrowIfNull(author);
    ArgumentNullException.ThrowIfNull(executor);

    if (string.IsNullOrWhiteSpace(description))
      throw new ArgumentException(
          "Description cannot be empty",
          nameof(description));

    if (deadline <= DateTime.UtcNow)
      throw new ArgumentException(
          "Deadline must be in the future",
          nameof(deadline));


    return new Ticket(
        Guid.NewGuid(),
        number,
        author,
        executor,
        description,
        deadline);
  }


  public TicketEvent Complete(
      TicketStateMachine stateMachine)
  {
    return MoveTo(
        TicketStatus.Completed,
        stateMachine);
  }

  public TicketEvent Processing(
       TicketStateMachine stateMachine)
  {
    return MoveTo(
        TicketStatus.Processing,
        stateMachine);
  }




  public TicketEvent MoveTo(
  TicketStatus next,
  TicketStateMachine stateMachine)
  {
    stateMachine.Validate(Status, next);

    var previous = Status;

    Status = next;

    return TicketEvent.Create(
        Id,
        previous,
        next,
        $"Operation moved {previous} -> {next}");
  }



}


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
      DateTime deadline,
      Guid clientRequestId)
  {
    Id = id;
    Number = number;
    Author = author;
    Executor = executor;
    Description = description;
    Deadline = deadline;

    CreatedAt = DateTime.UtcNow;
    Status = TicketStatus.New;
    ClientRequestId = clientRequestId;
  }

  public Guid Id { get; private set; }

  public IReadOnlyCollection<TicketTransition> AllowedTransitions;
  public int Number { get; private set; }

  public int Version { get; private set; } = 1;

  public Guid? ClientRequestId { get; private set; }
  public DateTime CreatedAt { get; private set; }

  public Guid AuthorId { get; private set; }
  public Employee Author { get; private set; } = null!;

  public Guid? ExecutorId { get; private set; }
  public Employee? Executor { get; private set; }

  

  public string Description { get; private set; }

  public DateTime Deadline { get; private set; }

  public TicketStatus Status { get; private set; }


  public void IncrementVersion()
  {
    Version++;
  }
  public void Edit(
      Employee? executor,
      string description,
      DateTime deadline)
  {
    Executor = executor;
    ExecutorId = executor.Id; 
    Description = description;
    Deadline = deadline;
  }
  public void AssignExecutor(Employee employee)
  {
        ArgumentNullException.ThrowIfNull(employee);
      Executor = employee;
    ExecutorId = employee.Id;
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
          DateTime deadline,
          Guid clientRequestId)
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
        deadline,
        clientRequestId);
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


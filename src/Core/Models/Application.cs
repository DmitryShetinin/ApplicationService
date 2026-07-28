using Core.Enums;

namespace Core.Models;

public sealed class Application
{
  private Application()
  {
  }

  public Application(
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
    Status = ApplicationStatus.New;
  }

  public Guid Id { get; private set; }

  public int Number { get; private set; }

  public DateTime CreatedAt { get; private set; }

  public Employee Author { get; private set; }

  public Employee Executor { get; private set; }

  public string Description { get; private set; }

  public DateTime Deadline { get; private set; }

  public ApplicationStatus Status { get; private set; }

  public void AssignExecutor(Employee employee)
  {
    Executor = employee;
  }

  internal void SetStatus(ApplicationStatus status)
  {
    Status = status;
  }


  public OperationEvent Complete(
      OperationStateMachine stateMachine)
  {
    return MoveTo(
        ApplicationStatus.Completed,
        stateMachine);
  }

  public OperationEvent Processing(
       OperationStateMachine stateMachine)
  {
    return MoveTo(
        ApplicationStatus.Processing,
        stateMachine);
  }




  public OperationEvent MoveTo(
  ApplicationStatus next,
  OperationStateMachine stateMachine)
  {
    stateMachine.Validate(Status, next);

    var previous = Status;

    Status = next;

    return OperationEvent.Create(
        Id,
        previous,
        next,
        $"Operation moved {previous} -> {next}");
  }



}


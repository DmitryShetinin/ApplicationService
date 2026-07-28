using Core.ValueObjects;

namespace Core.Models;


public sealed class Employee
{
  private Employee()
  {
  }

  public Employee(
      Guid id,
      FullName fullName,
      Department department,
      Position position)
  {
    Id = id;
    FullName = fullName;
    Department = department;
    Position = position;
  }

  public Guid Id { get; private set; }

  public FullName FullName { get; private set; }

  public Guid DepartmentId { get; private set; }
  public Department Department { get; private set; } = null!;

  public Guid PositionId { get; private set; }
  public Position Position { get; private set; } = null!;

  public void ChangeDepartment(string department)
  {
    Department.Name = department;
  }

  public void ChangePosition(string position)
  {
    Position.Name = position;
  }
}


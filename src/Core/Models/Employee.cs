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

  public void ChangeDepartment(Department department)
{
    Department = department;
    DepartmentId = department.Id;
}

  public static Employee Create(
    FullName fullName,
    Department department,
    Position position)
{
    ArgumentNullException.ThrowIfNull(fullName);
    ArgumentNullException.ThrowIfNull(department);
    ArgumentNullException.ThrowIfNull(position);

    return new Employee(
        Guid.NewGuid(),
        fullName,
        department,
        position);
}



  public void ChangePosition(Position position)
  {
    Position = position;
    PositionId = position.Id; 

  }
}


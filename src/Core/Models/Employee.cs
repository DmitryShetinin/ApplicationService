using Core.ValueObjects;

namespace Core.Models;


public sealed class Employee
{
  private Employee()
  {
  }

  private Employee(
      string firstName,
      string lastName,
      string middleName,
      Department department,
      Position position)
  {
    Id = Guid.NewGuid();
    FirstName = firstName;
    LastName = lastName;
    MiddleName = middleName;
    Department = department;
    Position = position;
  }

  public Guid Id { get; private set; }

  public string FirstName { get; private set; }
  public string LastName { get; private set; }
  public string MiddleName { get; private set; }
  public Guid DepartmentId { get; private set; }
  public Department Department { get; private set; } = null!;

  public Guid PositionId { get; private set; }
  public Position Position { get; private set; } = null!;

  public void ChangeDepartment(Department department)
  {
    ArgumentNullException.ThrowIfNull(department);
    Department = department;
    DepartmentId = department.Id;
  }

  public static Employee Create(
    string firstName,
    string lastName,
    string? middleName,
    Department department,
    Position position)
  {
  
    ArgumentNullException.ThrowIfNull(lastName);
 
    ArgumentNullException.ThrowIfNull(department);
    ArgumentNullException.ThrowIfNull(position);

    return new Employee(
 
        firstName,
        lastName,
        middleName,
        department,
        position);
  }



  public void ChangePosition(Position position)
  {
    Position = position;
    PositionId = position.Id;

  }
}


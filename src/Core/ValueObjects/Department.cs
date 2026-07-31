namespace Core.ValueObjects;

public sealed class Department
{

  private Department() { }

  public Department(Guid id, string name)
  {
    Id = id;
    Name = name;
  }

  public Guid Id { get; set; }
  public string Name { get; set; }
}

namespace Core.ValueObjects;

public class Department
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

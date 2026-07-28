namespace Core.ValueObjects;

public class Position
{


  private Position() { }

  public Position(Guid id, string name)
  {
    Id = id;
    Name = name;
  }


  public Guid Id { get; set; }
  public string Name { get; set; }
}

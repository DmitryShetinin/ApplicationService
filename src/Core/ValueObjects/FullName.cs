namespace Core.ValueObjects;



public sealed record FullName(
  string FirstName,
  string LastName,
  string Patronymic)
{
  public string ShortName =>
      $"{LastName} {FirstName[0]}. {Patronymic[0]}.";

  public override string ToString() =>
      $"{LastName} {FirstName} {Patronymic}";
}


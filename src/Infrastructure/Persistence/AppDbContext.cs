// Infrastructure/Persistence/AppDbContext.cs






using Core.Models;
using Core.ValueObjects;
using Infrastructure.Configurations;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence;

public class AppDbContext : DbContext
{


  public DbSet<Ticket> Tickets => Set<Ticket>();

  public DbSet<TicketEvent> TicketEvents => Set<TicketEvent>();

  public DbSet<Employee> Employees => Set<Employee>();

  public DbSet<Department> Departments => Set<Department>();
  public DbSet<Position> Positions => Set<Position>();

  public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {

    modelBuilder.ApplyConfiguration(new DepartmentConfiguration());
    modelBuilder.ApplyConfiguration(new PositionConfiguration());
    modelBuilder.ApplyConfiguration(new EmployeeConfiguration());
    modelBuilder.ApplyConfiguration(new TicketConfiguration());
    modelBuilder.ApplyConfiguration(new TicketEventConfiguration());



  }
}

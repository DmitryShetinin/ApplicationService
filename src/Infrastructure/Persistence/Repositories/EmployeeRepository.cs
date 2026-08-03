using Application.Abstractions.Persistence;
using Core.Models;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Repositories;

public sealed class EmployeeRepository : IEmployeeRepository
{
    private readonly AppDbContext _context;

    public EmployeeRepository(
        AppDbContext context)
    {
        _context = context;
    }


    public async Task<Employee?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken)
    {
        return await _context.Employees
            .Include(x => x.Department)
            .Include(x => x.Position)
            .FirstOrDefaultAsync(
                x => x.Id == id,
                cancellationToken);
    }


    public async Task<IReadOnlyCollection<Employee>> GetAllAsync(
        CancellationToken cancellationToken)
    {
        return await _context.Employees
            .Include(x => x.Department)
            .Include(x => x.Position)
            .AsNoTracking()
            .ToListAsync(cancellationToken);
    }


   public async Task AddAsync(
    Employee employee,
    CancellationToken cancellationToken)
    {
        await _context.Employees.AddAsync(
            employee,
            cancellationToken);
    }


    public async Task SaveChangesAsync(CancellationToken cancellationToken)
    {
      

        await _context.SaveChangesAsync(
            cancellationToken);
    }



    public async Task<bool> ExistsAsync(
     Guid id,
     CancellationToken cancellationToken)
    {
        return await _context.Employees
            .AnyAsync(
                x => x.Id == id,
                cancellationToken);
    }

    
}
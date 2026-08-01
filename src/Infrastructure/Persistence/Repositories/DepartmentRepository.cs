

using Application.Abstractions.Persistence;
using Core.ValueObjects;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Repositories;


public sealed class DepartmentRepository : IDepartmentRepository
{
    private readonly AppDbContext _context;


    public DepartmentRepository(
        AppDbContext context)
    {
        _context = context;
    }


    public async Task<Department?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken)
    {
        return await _context.Departments.FirstOrDefaultAsync( x => x.Id == id,
                cancellationToken); 


    }
}

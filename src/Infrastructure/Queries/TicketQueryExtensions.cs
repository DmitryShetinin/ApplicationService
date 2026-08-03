
using Core.Models;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Queries;

public static class TicketQueryExtensions
{
    public static IQueryable<Ticket> IncludeEmployees(
        this IQueryable<Ticket> query)
    {
        return query
            .Include(x => x.Author)
                .ThenInclude(x => x.Department)
            .Include(x => x.Author)
                .ThenInclude(x => x.Position)
            .Include(x => x.Executor)
                .ThenInclude(x => x.Department)
            .Include(x => x.Executor)
                .ThenInclude(x => x.Position);
    }
}

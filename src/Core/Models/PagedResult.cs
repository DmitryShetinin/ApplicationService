

namespace Core.Models;

public sealed record PagedResult<T>(
    IReadOnlyCollection<T> Items,
    int Page,
    int PageSize,
    bool HasNextPage)
{
    
}


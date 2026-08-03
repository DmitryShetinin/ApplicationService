using Application.Features.Tickets.Requests;
using Core.Enums;
using Core.Models;
using Microsoft.EntityFrameworkCore;

public sealed class TicketQueryBuilder
{
    private IQueryable<Ticket> _query;

    private readonly TicketFilterRequest _filter;

    public TicketQueryBuilder(
        DbSet<Ticket> tickets,
        TicketFilterRequest filter)
    {
        _filter = filter;

        _query = tickets.AsNoTracking();
    }


    public IQueryable<Ticket> Build()
    {
        
        ApplyExecutorFilter();
        ApplyStatusFilter();
        ApplyDepartmentFilter();
        ApplyOnlyOverdueFilter();

        return _query;
    }

    private void ApplyStatusFilter()
    {
        if (_filter.Status is null)
            return;

        _query = _query.Where(
            x => x.Status == _filter.Status);
    }

    private void ApplyExecutorFilter()
    {
        if (_filter.ExecutorId is null)
            return;

        _query = _query.Where(
            x => x.ExecutorId == _filter.ExecutorId);
    }

    private void ApplyDepartmentFilter()
    {
        if (_filter.DepartmentId is null)
            return;

        _query = _query.Where(
            x => x.Executor != null &&
                 x.Executor.DepartmentId == _filter.DepartmentId);
    }


    private void ApplyOnlyOverdueFilter()
    {
        if (_filter.OnlyOverdue != true)
            return;

        _query = _query.Where(
            x => x.Status != TicketStatus.Completed &&
                 x.Deadline < DateTime.UtcNow);
    }

}
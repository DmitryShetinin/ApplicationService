
using Application.Common.Extensions;
using Application.Features.Employees.Responses;
using Application.Features.Tickets.Responses;
using Core.Models;

public static class TicketMapping
{
    public static TicketResponse ToResponse(
        this Ticket ticket)
    {
    
    

  

    return new TicketResponse(
        ticket.Id,
        ticket.Number,
        ticket.Author.ToResponse(),
        ticket.Executor.ToResponse(),
        ticket.Description,
        ticket.CreatedAt,
        ticket.Deadline,
        ticket.Status
    );
    }
}
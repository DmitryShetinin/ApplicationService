using Application.Features.Employees.Responses;
using Application.Features.Tickets.Responses;
using Core.Models;
using Mapster;


public static class TicketMapper
{
    private static readonly TicketStateMachine StateMachine = new();


    public static TicketResponse ToResponse(this Ticket ticket)
    {
        return new TicketResponse(
            ticket.Id,
            ticket.Number,

            ticket.Author.Adapt<EmployeeShortResponse>(),

            ticket.Executor == null
                ? null
                : ticket.Executor.Adapt<EmployeeShortResponse>(),

            ticket.Description,

            ticket.CreatedAt,

            ticket.Deadline,

            ticket.Status,

            StateMachine.GetAllowedTransitions(ticket.Status)
        );
    }


    public static List<TicketResponse> ToResponse(
        this IEnumerable<Ticket> tickets)
    {
        return tickets
            .Select(x => x.ToResponse())
            .ToList();
    }
}

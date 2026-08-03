 
using Application.Features.Tickets.Responses;
using Core.Models;
using Mapster;


public static class TicketMapper
{
    public static TicketResponse ToResponse(
        this Ticket ticket,
        TicketStateMachine stateMachine)
    {
        return new TicketResponse(
            ticket.Id,
            ticket.Number,
            ticket.ClientRequestId,
            ticket.Author.Adapt<EmployeeShortResponse>(),
            ticket.Executor?.Adapt<EmployeeShortResponse>(),
            ticket.Description,
            ticket.CreatedAt,
            ticket.Deadline,
            ticket.Version,
            ticket.Status,
            stateMachine.GetAllowedTransitions(ticket.Status)
        );
    }


    public static List<TicketResponse> ToResponse(
        this IEnumerable<Ticket> tickets,
        TicketStateMachine stateMachine)
    {
        return tickets
            .Select(ticket => ticket.ToResponse(stateMachine))
            .ToList();
    }
}
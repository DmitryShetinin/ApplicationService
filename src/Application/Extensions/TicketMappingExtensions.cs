public static class TicketMapping
{
    public static TicketResponse ToResponse(
        this Ticket ticket)
    {
        return new TicketResponse(
            ticket.Id,
            ticket.Number,
            ticket.CreatedAt,
            new EmployeeResponse(
                ticket.Author.Id,
                ticket.Author.FullName.ToString(),
                ticket.Author.Department.Name,
                ticket.Author.Position.Name),
            new EmployeeResponse(
                ticket.Executor.Id,
                ticket.Executor.FullName.ToString(),
                ticket.Executor.Department.Name,
                ticket.Executor.Position.Name),
            ticket.Description,
            ticket.Deadline,
            ticket.Status);
    }
}
export function mapTicketViewModel(ticket, employees){
    return {
        ...ticket,
        author: employees.find(e => e.id === ticket.authorId),
        executor: employees.find(e => e.id === ticket.executorId)
    };
}
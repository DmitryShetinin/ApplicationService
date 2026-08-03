using Application.Abstractions.Notifications;
using Application.Features.Notifications.Responses;
using Application.Features.Tickets.Responses;
using Core.Models;
using Mapster;


namespace Application.Mapping;


public sealed class TicketMappingConfig : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<Ticket, TicketResponse>()
            .Map(dest => dest.Author,
                src => src.Author)
            .Map(dest => dest.Executor,
                src => src.Executor);


      
    }
}
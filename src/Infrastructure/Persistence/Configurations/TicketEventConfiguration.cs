using Core.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations;

public sealed class TicketEventConfiguration
    : IEntityTypeConfiguration<TicketEvent>
{
    public void Configure(EntityTypeBuilder<TicketEvent> builder)
    {
        builder.ToTable("TicketEvents");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.TicketId)
            .IsRequired();

        builder.Property(x => x.CurrentStatus)
            .IsRequired();

        builder.Property(x => x.Description)
            .HasMaxLength(500)
            .IsRequired();

        builder.Property(x => x.OccurredAt)
            .IsRequired();

        builder.HasOne<Ticket>()
            .WithMany()
            .HasForeignKey(x => x.TicketId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
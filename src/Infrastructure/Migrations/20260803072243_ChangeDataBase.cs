using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
  /// <inheritdoc />
  public partial class ChangeDataBase : Migration
  {
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {


      migrationBuilder.AddColumn<Guid>(
          name: "ClientRequestId",
          table: "Tickets",
          type: "uuid",
          nullable: true);



      migrationBuilder.AddColumn<uint>(
          name: "xmin",
          table: "Tickets",
          type: "xid",
          rowVersion: true,
          nullable: false,
          defaultValue: 0u);

 
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
      migrationBuilder.DropIndex(
          name: "IX_Tickets_ExecutorId_Status_Deadline",
          table: "Tickets");

      migrationBuilder.DropIndex(
          name: "IX_Tickets_Status_CreatedAt",
          table: "Tickets");

      migrationBuilder.DropColumn(
          name: "ClientRequestId",
          table: "Tickets");

      migrationBuilder.DropColumn(
          name: "Version",
          table: "Tickets");

      migrationBuilder.DropColumn(
          name: "xmin",
          table: "Tickets");

      migrationBuilder.CreateIndex(
          name: "IX_Tickets_ExecutorId",
          table: "Tickets",
          column: "ExecutorId");
    }
  }
}

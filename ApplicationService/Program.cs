using Application.DependencyInjection;
using ApplicationService.Extensions;
using Infrastructure.DependencyInjection;
using WebApi.Hubs;

var builder = WebApplication.CreateBuilder(args);


builder.Services
    .AddApplication()
    .AddInfrastructure(builder.Configuration)
    .AddWebApi();
    
 

builder.Services.AddControllers();
 
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


var app = builder.Build();

await app.ApplyMigrationsAsync();
 

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
} 
app.UseDefaultFiles();
app.UseStaticFiles();



app.UseAuthorization();


app.MapControllers();
app.MapHub<TicketHub>("/hubs/tickets");


app.Run();
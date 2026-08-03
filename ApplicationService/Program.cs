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
builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy
            .SetIsOriginAllowed(origin =>
            {
                var uri = new Uri(origin);

                return uri.Host == "localhost";
            })
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});
 


var app = builder.Build();

await app.ApplyMigrationsAsync();
 

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
} 
app.UseCors("Frontend");

app.UseAuthorization();


app.MapControllers();
app.MapHub<TicketHub>("/hubs/tickets");


app.Run();
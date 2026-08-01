using Application.Features.Tickets;
using Application.Features.Tickets.Requests;
using Application.Queries;
using Core.Enums;
using Microsoft.AspNetCore.Mvc;

namespace ApplicationService.Controllers;

public sealed record AssignExecutorRequest(
    Guid ExecutorId);


public sealed record ChangeTicketStatusRequest(
    TicketStatus Status);

[ApiController]
[Route("api/tickets")]
public sealed class TicketsController : ControllerBase
{
    private readonly ITicketService _ticketService;
    private readonly ITicketQueries _ticketQueries; 

    public TicketsController(
        ITicketService ticketService, ITicketQueries ticketQueries)
    {
        _ticketService = ticketService;
        _ticketQueries = ticketQueries;
    }



    [HttpPost]
    public async Task<IActionResult> Create(
        CreateTicketRequest request,
        CancellationToken cancellationToken)
    {
        var result =
            await _ticketService.CreateAsync(
                request,
                cancellationToken);


        if (result.IsFailure)
        {
            return BadRequest(result.Error);
        }


        return CreatedAtAction(
            nameof(GetById),
            new
            {
                id = result.Value
            },
            new
            {
                id = result.Value
            });
    }




    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(
        Guid id,
        CancellationToken cancellationToken)
    {
        var result =
            await _ticketQueries.GetByIdAsync(
                id,
                cancellationToken);


        if (result.IsFailure)
        {
            return NotFound(result.Error);
        }


        return Ok(result.Value);
    }





    [HttpGet]
    public async Task<IActionResult> Get(
        [FromQuery] TicketFilterRequest filter,
        CancellationToken cancellationToken)
    {
        var result =
            await _ticketQueries.GetAsync(
                filter,
                cancellationToken);


        if (result.IsFailure)
        {
            return BadRequest(result.Error);
        }


        return Ok(result.Value);
    }





    [HttpPatch("{id:guid}/status")]
    public async Task<IActionResult> ChangeStatus(
        Guid id,
        [FromBody] ChangeTicketStatusRequest request,
        CancellationToken cancellationToken)
    {
        var result =
            await _ticketService.ChangeStatusAsync(
                id,
                request.Status,
                cancellationToken);


        if (result.IsFailure)
        {
            return BadRequest(result.Error);
        }


        return NoContent();
    }





    [HttpPatch("{id:guid}/executor")]
    public async Task<IActionResult> AssignExecutor(
        Guid id,
        [FromBody] AssignExecutorRequest request,
        CancellationToken cancellationToken)
    {
        var result =
            await _ticketService.AssignExecutorAsync(
                id,
                request.ExecutorId,
                cancellationToken);


        if (result.IsFailure)
        {
            return BadRequest(result.Error);
        }


        return NoContent();
    }
}
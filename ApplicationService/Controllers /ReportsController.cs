using Application.Features.Reports.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Presentation.Controllers;

[ApiController]
[Route("api/report")]
public sealed class ReportsController : ControllerBase
{
    private readonly IReportQueries _queries;

    public ReportsController(
        IReportQueries queries)
    {
        _queries = queries;
    }

    [HttpGet]
    public async Task<IActionResult> Get(
        CancellationToken cancellationToken)
    {
        var result =
            await _queries.GetAsync(
                cancellationToken);

        if(result.IsFailure)
            return BadRequest(result.Error);

        return Ok(result.Value);
    }
}
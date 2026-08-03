using Application.Common;
using Application.Features.Reports.Responses;
 

namespace Application.Features.Reports.Interfaces;

public interface IReportQueries
{
    Task<Result<ReportResponse>> GetAsync(
        CancellationToken cancellationToken);
}
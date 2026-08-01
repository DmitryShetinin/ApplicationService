
using Application.Features.Employees.Responses;
using Application.Features.Tickets.Responses;
using Core.Models;
using Mapster;

namespace Application.Mapping; 


public sealed class EmployeeMappingConfig : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<Employee, EmployeeResponse>()
            .Map(dest => dest.FullName,
                src => src.FullName.ToString())
            .Map(dest => dest.Department,
                src => src.Department.Name)
            .Map(dest => dest.Position,
                src => src.Position.Name);

        config.NewConfig<Employee, EmployeeShortResponse>()
            .Map(dest => dest.FullName,
                src => src.FullName.ToString())
            .Map(dest => dest.Department,
                src => src.Department.Name)
            .Map(dest => dest.Position,
                src => src.Position.Name);
    }
}
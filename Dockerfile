FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
RUN apt-get update \
    && apt-get install -y libkrb5-3 \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
EXPOSE 5353

ENV ASPNETCORE_URLS=http://+:5353

USER app
FROM --platform=$BUILDPLATFORM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG configuration=Release
WORKDIR /src
COPY ["ApplicationService/ApplicationService.csproj", "ApplicationService/"]
RUN dotnet restore "ApplicationService/ApplicationService.csproj"
COPY . .
WORKDIR "/src/ApplicationService"
RUN dotnet build "ApplicationService.csproj" -c $configuration -o /app/build

FROM build AS publish
ARG configuration=Release
RUN dotnet publish "ApplicationService.csproj" -c $configuration -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ApplicationService.dll"]

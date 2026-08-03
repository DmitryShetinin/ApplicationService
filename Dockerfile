# =========================
# FRONTEND BUILD
# =========================
FROM node:22-alpine AS frontend

WORKDIR /frontend

COPY ticket-manager/package*.json ./

RUN npm install

COPY ticket-manager .

RUN npm run build


# =========================
# BACKEND BUILD
# =========================

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build

WORKDIR /src

COPY ["ApplicationService/ApplicationService.csproj", "ApplicationService/"]

RUN dotnet restore "ApplicationService/ApplicationService.csproj"

COPY . .

WORKDIR "/src/ApplicationService"

RUN dotnet publish "ApplicationService.csproj" \
    -c Release \
    -o /app/publish \
    /p:UseAppHost=false


# =========================
# RUNTIME
# =========================

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final


RUN apt-get update \
    && apt-get install -y libkrb5-3 \
    && rm -rf /var/lib/apt/lists/*


WORKDIR /app

EXPOSE 5353

ENV ASPNETCORE_URLS=http://+:5353


COPY --from=build /app/publish .

 
COPY --from=frontend /frontend/dist ./wwwroot


ENTRYPOINT ["dotnet", "ApplicationService.dll"]
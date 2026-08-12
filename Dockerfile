# Build stage: needs both the .NET SDK and node, since the Angular client
# compiles into API/wwwroot and ships inside the published API.
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && rm -rf /var/lib/apt/lists/*

# restore dependencies first so these layers stay cached across code changes
COPY client/package.json client/package-lock.json client/
RUN cd client && npm ci

COPY API/API.csproj API/
RUN dotnet restore API/API.csproj

COPY . .

RUN cd client && npm run build
RUN dotnet publish API/API.csproj -c Release -o /app/publish

# Runtime stage: no SDK, no node - just what is needed to run the app
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

# Render routes traffic to $PORT and terminates TLS itself
ENV ASPNETCORE_URLS=http://+:${PORT:-8080}
EXPOSE 8080

ENTRYPOINT ["dotnet", "API.dll"]

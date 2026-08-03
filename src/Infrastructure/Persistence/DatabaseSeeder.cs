using Core.Models;
using Core.ValueObjects;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

public static class DatabaseSeeder
{
    private const int EmployeeCount = 1000;
    private const int TicketCount = 1_000_000;
    private const int BatchSize = 5000;


    public static async Task SeedAsync(
        AppDbContext db)
    {
        Console.WriteLine("🔥 SEED START");


        db.ChangeTracker.AutoDetectChangesEnabled = false;


        await SeedDepartmentsAsync(db);

        await SeedPositionsAsync(db);

        await SeedEmployeesAsync(db);

        await SeedTicketsAsync(db);


        db.ChangeTracker.AutoDetectChangesEnabled = true;


        Console.WriteLine("🔥 SEED END");
    }



    private static async Task SeedDepartmentsAsync(
        AppDbContext db)
    {
        if (await db.Departments.AnyAsync())
        {
            return;
        }


        Console.WriteLine("🏢 Creating departments");


        var departments = new[]
        {
            new Department(
                Guid.NewGuid(),
                "IT"),

            new Department(
                Guid.NewGuid(),
                "Support"),

            new Department(
                Guid.NewGuid(),
                "Sales"),

            new Department(
                Guid.NewGuid(),
                "HR"),

            new Department(
                Guid.NewGuid(),
                "Finance")
        };


        await db.Departments.AddRangeAsync(
            departments);


        await db.SaveChangesAsync();
    }




    private static async Task SeedPositionsAsync(
        AppDbContext db)
    {
        if (await db.Positions.AnyAsync())
        {
            return;
        }


        Console.WriteLine("💼 Creating positions");


        var positions = new[]
        {
            new Position(
                Guid.NewGuid(),
                "Developer"),

            new Position(
                Guid.NewGuid(),
                "Team Lead"),

            new Position(
                Guid.NewGuid(),
                "QA Engineer"),

            new Position(
                Guid.NewGuid(),
                "Analyst"),

            new Position(
                Guid.NewGuid(),
                "Administrator")
        };


        await db.Positions.AddRangeAsync(
            positions);


        await db.SaveChangesAsync();
    }





    private static async Task SeedEmployeesAsync(
        AppDbContext db)
    {
        if (await db.Employees.AnyAsync())
        {
            return;
        }


        Console.WriteLine("👥 Creating employees");


        var departments =
            await db.Departments.ToListAsync();


        var positions =
            await db.Positions.ToListAsync();



        var employees =
            new List<Employee>(EmployeeCount);


        var random =
            new Random();



        for (var i = 0; i < EmployeeCount; i++)
        {
            var employee =
                Employee.Create(
                    $"Name{i}",
                    $"Surname{i}",
                    $"Middle{i}",
                    departments[
                        random.Next(departments.Count)
                    ],
                    positions[
                        random.Next(positions.Count)
                    ]);


            employees.Add(employee);
        }



        await db.Employees.AddRangeAsync(
            employees);


        await db.SaveChangesAsync();


        Console.WriteLine(
            $"👥 Created {EmployeeCount} employees");
    }





    private static async Task SeedTicketsAsync(
        AppDbContext db)
    {
        if (await db.Tickets.AnyAsync())
        {
            return;
        }


        Console.WriteLine("🎫 Creating tickets");


        var employees =
            await db.Employees.ToListAsync();



        var random =
            new Random();



        var tickets =
            new List<Ticket>(BatchSize);



        for (var i = 0; i < TicketCount; i++)
        {
            var author =
                employees[
                    random.Next(employees.Count)
                ];


            var executor =
                employees[
                    random.Next(employees.Count)
                ];



            var ticket =
                Ticket.Create(
                    1_000_000 + i,
                    author,
                    executor,
                    $"Generated ticket #{i}",
                    DateTime.UtcNow.AddDays(
                        random.Next(1,365)),
                    Guid.NewGuid());



            tickets.Add(ticket);



            if (tickets.Count >= BatchSize)
            {
                await db.Tickets.AddRangeAsync(
                    tickets);


                await db.SaveChangesAsync();


                tickets.Clear();


                Console.WriteLine(
                    $"🎫 Created {i + 1} tickets");
            }
        }



        if (tickets.Count > 0)
        {
            await db.Tickets.AddRangeAsync(
                tickets);


            await db.SaveChangesAsync();
        }


        Console.WriteLine(
            $"🎫 Created {TicketCount} tickets");
    }
}
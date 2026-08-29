using AutoMapper;

namespace DriftDemo;

public class Source { public string Name { get; set; } = ""; }
public class Destination { public string Name { get; set; } = ""; }

public static class Program
{
    /// <summary>Configure the application's object mappings.</summary>
    public static void ConfigureMapping()
    {
        // AutoMapper 8 exposes a static Mapper.Initialize entry point.
        Mapper.Initialize(cfg => cfg.CreateMap<Source, Destination>());
    }

    public static void Main()
    {
        ConfigureMapping();
        System.Console.WriteLine("mapper configured");
    }
}

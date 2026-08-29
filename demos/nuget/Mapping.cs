using System;
using AutoMapper;

namespace DriftDemo;

public class UserEntity { public string Name { get; set; } = ""; }
public class UserDto { public string Name { get; set; } = ""; }

/// <summary>
/// Object-mapping setup.
///
/// This file is written against AutoMapper 8.1. The Codespace upgraded the
/// dependency to AutoMapper 9.0 without touching this code — AutoMapper 9
/// deleted the entire static API in favour of an injected IMapper, so every
/// marked call below stopped compiling.
/// </summary>
public static class Mapping
{
    // ── BREAKING 1 ────────────────────────────────────────────────────────
    // The static Mapper.Initialize was removed in AutoMapper 9. You build a
    // MapperConfiguration and inject IMapper instead.
    public static void Configure()
    {
        Mapper.Initialize(cfg =>
        {
            cfg.CreateMap<UserEntity, UserDto>();

            // ── BREAKING 2 ────────────────────────────────────────────────
            // IMapperConfigurationExpression.CreateMissingTypeMaps was removed
            // in AutoMapper 9; every mapping must be declared explicitly.
            cfg.CreateMissingTypeMaps = true;

            // ── BREAKING 3 ────────────────────────────────────────────────
            // The AddProfiles(params Assembly[]) family of overloads was
            // removed in AutoMapper 9, leaving AddMaps(..).
            cfg.AddProfiles(typeof(Mapping).Assembly);
        });
    }

    // ── BREAKING 4 ────────────────────────────────────────────────────────
    // The static Mapper.Map entry point went with the rest of the static API.
    public static UserDto ToDto(UserEntity entity) => Mapper.Map<UserDto>(entity);

    // ── BREAKING 5 ────────────────────────────────────────────────────────
    // Mapper.AssertConfigurationIsValid was removed too — it lives on the
    // MapperConfiguration instance now.
    public static void Validate() => Mapper.AssertConfigurationIsValid();

    public static void Main()
    {
        Configure();
        Validate();
        Console.WriteLine(ToDto(new UserEntity { Name = "Ada" }).Name);
    }
}

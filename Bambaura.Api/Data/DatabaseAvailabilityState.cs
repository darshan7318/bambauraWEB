namespace Bambaura.Api.Data;

public class DatabaseAvailabilityState
{
    public bool IsAvailable { get; private set; }
    public string Status { get; private set; } = "Initializing";
    public DateTime LastCheckedAtUtc { get; private set; } = DateTime.UtcNow;

    public void MarkAvailable()
    {
        IsAvailable = true;
        Status = "Connected (PostgreSQL)";
        LastCheckedAtUtc = DateTime.UtcNow;
    }

    public void MarkUnavailable(string reason = "Offline")
    {
        IsAvailable = false;
        Status = $"Offline ({reason})";
        LastCheckedAtUtc = DateTime.UtcNow;
    }
}


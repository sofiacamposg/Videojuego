async function loadPlayerStats() {
    const res = await fetch("http://localhost:3000/players");
    const data = await res.json();

    const player = data[0];

    document.getElementById("runs").textContent = player.total_runs;
    document.getElementById("wins").textContent = player.total_wins;
    document.getElementById("defeats").textContent = player.total_losses;

    // placeholders (porque no existen aún en backend)
    document.getElementById("archetype").textContent = "N/A";
    document.getElementById("card").textContent = "N/A";
    document.getElementById("avgTime").textContent = "N/A";
}

export { loadPlayerStats };
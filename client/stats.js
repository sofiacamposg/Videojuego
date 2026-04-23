async function loadPlayerStats() {
    const res = await fetch("http://localhost:3000/players");
    const data = await res.json();

    const player = data[0];

    document.getElementById("username").textContent = player.username;
    document.getElementById("runs").textContent = player.total_runs;
    document.getElementById("bestScore").textContent = player.total_wins; // ejemplo
    document.getElementById("fame").textContent = player.total_losses; // ejemplo
}
export {loadPlayerStats};
function updateClock() {
    const options = {
        timeZone: 'Europe/Paris',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    };
    const now = new Date().toLocaleTimeString('fr-FR', options);
    document.getElementById('clock').textContent = now;
}

setInterval(updateClock, 1000);
updateClock(); // Appel immédiat
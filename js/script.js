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
updateClock();

async function checkStatus(dot) {
    const ip = dot.getAttribute('data-ip');
    const port = dot.getAttribute('data-port') || '80';
    const url = `http://${ip}:${port}/?nocache=${Date.now()}`;

    // On crée un contrôleur pour annuler la requête si elle est trop longue
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 secondes max

    try {
        await fetch(url, { 
            mode: 'no-cors', 
            signal: controller.signal,
            cache: 'no-store'
        });
        
        // Si on arrive ici, le serveur a répondu
        dot.classList.remove('offline');
        dot.classList.add('online');
    } catch (error) {
        // Si erreur ou timeout
        dot.classList.remove('online');
        dot.classList.add('offline');
    } finally {
        clearTimeout(timeoutId);
    }
}

function updateAll() {
    console.log("--- Scan des services : " + new Date().toLocaleTimeString() + " ---");
    const allDots = document.querySelectorAll('.status-dot');
    allDots.forEach(dot => checkStatus(dot));
}

// Lancement propre
document.addEventListener('DOMContentLoaded', () => {
    updateAll(); // Direct au chargement
    setInterval(updateAll, 10000); // Puis toutes les 10 secondes
});
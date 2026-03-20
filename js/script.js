// --- GESTION DE L'HORLOGE (inchangé) ---
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


// --- GESTION DES PINGS ET DU STATUT ---
async function checkStatus(dot) {
    const ip = dot.getAttribute('data-ip');
    const port = dot.getAttribute('data-port') || '80';
    const url = `http://${ip}:${port}/?nocache=${Date.now()}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); 

    try {
        await fetch(url, { 
            mode: 'no-cors', 
            signal: controller.signal,
            cache: 'no-store'
        });
        
        dot.classList.remove('offline');
        dot.classList.add('online');
        return true; // Le ping est réussi
    } catch (error) {
        dot.classList.remove('online');
        dot.classList.add('offline');
        return false; // Le ping a échoué
    } finally {
        clearTimeout(timeoutId);
    }
}

async function updateAll() {
    console.log("--- Scan des services : " + new Date().toLocaleTimeString() + " ---");
    const allDots = document.querySelectorAll('.status-dot');
    
    // On lance tous les pings et on attend leurs résultats
    const promises = Array.from(allDots).map(dot => checkStatus(dot));
    const results = await Promise.all(promises);
    
    // On compte les succès et on calcule le pourcentage
    const onlineCount = results.filter(status => status === true).length;
    const totalServices = allDots.length;
    const percentage = Math.round((onlineCount / totalServices) * 100);
    
    // Mise à jour de l'affichage du texte
    const statusTextElement = document.getElementById('system-status-text');
    if (statusTextElement) { // Sécurité pour éviter les erreurs si le texte n'est pas trouvé
        if (percentage === 100) {
            statusTextElement.textContent = "SYSTÈME 100% OPÉRATIONNEL";
            statusTextElement.style.color = "#2ecc71"; // Vert
        } else if (percentage === 0) {
            statusTextElement.textContent = "ERREUR SYSTÈME CRITIQUE (0%)";
            statusTextElement.style.color = "#e74c3c"; // Rouge
        } else {
            statusTextElement.textContent = `SYSTÈME OPÉRATIONNEL À ${percentage}%`;
            statusTextElement.style.color = "#f39c12"; // Orange
        }
    }
}

// --- LANCEMENT AUTOMATIQUE (inchangé) ---
document.addEventListener('DOMContentLoaded', () => {
    updateAll(); // Direct au chargement
    setInterval(updateAll, 10000); // Puis toutes les 10 secondes
});
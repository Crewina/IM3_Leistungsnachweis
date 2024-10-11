// Funktion, um SRF-Daten von der API zu fetchen
async function fetchSrfData() {
    try {
        // Hier die URL der PHP-Datei einfügen, die die Daten als JSON bereitstellt
        const response = await fetch('https://etl.mmp.li/Radio_SRF_1/etl/unload.php');
        
        // Prüfen, ob der Fetch erfolgreich war
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // JSON-Daten von der API abrufen
        const data = await response.json();

        // SRF-Daten verarbeiten und anzeigen (Beispiel in der Konsole)
        console.log("SRF-Daten:", data);

        // Hier kann weiteres DOM-Manipulation oder UI-Updates basierend auf den Daten stattfinden

    } catch (error) {
        // Fehlerbehandlung
        console.error('Fehler beim Abrufen der SRF-Daten:', error);
    }
}

// Diese Funktion wird beim Laden der Seite ausgeführt, um die Daten zu fetchen
window.addEventListener('DOMContentLoaded', () => {
    fetchSrfData();
});

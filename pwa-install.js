// PWA Installation Handler - Deutsche Version
let deferredPrompt;
let installPromptShown = false;

// Service Worker registrieren
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('Service Worker erfolgreich registriert:', registration.scope);
            })
            .catch(error => {
                console.log('Service Worker Registrierung fehlgeschlagen:', error);
            });
    });
}

// Prüfen ob bereits installiert
function isAppInstalled() {
    // Prüfe ob als PWA läuft
    if (window.matchMedia('(display-mode: standalone)').matches) {
        return true;
    }
    // Prüfe iOS standalone
    if (window.navigator.standalone === true) {
        return true;
    }
    return false;
}

// Prüfen ob Popup bereits abgelehnt wurde
function wasPromptDismissed() {
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    const dismissedTime = localStorage.getItem('pwa-install-dismissed-time');

    if (!dismissed) return false;

    // Nach 7 Tagen erneut fragen
    if (dismissedTime) {
        const daysSinceDismissed = (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60 * 24);
        if (daysSinceDismissed > 7) {
            localStorage.removeItem('pwa-install-dismissed');
            localStorage.removeItem('pwa-install-dismissed-time');
            return false;
        }
    }

    return true;
}

// Install Popup erstellen
function createInstallPrompt() {
    // Prüfen ob Bedingungen erfüllt sind
    if (isAppInstalled() || wasPromptDismissed() || installPromptShown) {
        return;
    }

    const promptHTML = `
        <div id="pwaInstallPrompt" class="pwa-install-prompt">
            <button class="pwa-close-btn" id="pwaCloseBtn">×</button>
            <div class="pwa-install-content">
                <div class="pwa-install-icon">🧮📱</div>
                <div class="pwa-install-title">App installieren?</div>
                <div class="pwa-install-text">
                    Installieren Sie Anzan Meister auf Ihrem Gerät für schnellen Zugriff und Offline-Nutzung!
                </div>
                <div class="pwa-install-buttons">
                    <button class="pwa-install-button" id="pwaInstallBtn">
                        ✓ Installieren
                    </button>
                    <button class="pwa-dismiss-button" id="pwaDismissBtn">
                        Später
                    </button>
                </div>
            </div>
        </div>
    `;

    // Popup zum Body hinzufügen
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = promptHTML;
    document.body.appendChild(tempDiv.firstElementChild);

    // Event Listeners hinzufügen
    setupInstallListeners();

    // Popup nach 3 Sekunden anzeigen
    setTimeout(() => {
        const prompt = document.getElementById('pwaInstallPrompt');
        if (prompt) {
            prompt.classList.add('show');
            installPromptShown = true;
        }
    }, 3000);
}

// Event Listeners für Install Buttons
function setupInstallListeners() {
    const installBtn = document.getElementById('pwaInstallBtn');
    const dismissBtn = document.getElementById('pwaDismissBtn');
    const closeBtn = document.getElementById('pwaCloseBtn');
    const prompt = document.getElementById('pwaInstallPrompt');

    // Installieren Button
    if (installBtn) {
        installBtn.addEventListener('click', async () => {
            if (!deferredPrompt) {
                // Fallback für iOS und andere Browser
                alert('Bitte verwenden Sie das Browser-Menü, um die App zu installieren:\n\n' +
                      'Safari (iOS): Teilen → Zum Home-Bildschirm\n' +
                      'Chrome: Menü → App installieren\n' +
                      'Firefox: Menü → Zur Startseite hinzufügen');
                return;
            }

            // Browser Installation Dialog anzeigen
            deferredPrompt.prompt();

            // Auf User-Antwort warten
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`Installation ${outcome === 'accepted' ? 'akzeptiert' : 'abgelehnt'}`);

            // Prompt zurücksetzen
            deferredPrompt = null;

            // Popup schließen
            if (prompt) {
                prompt.classList.remove('show');
                setTimeout(() => prompt.remove(), 300);
            }
        });
    }

    // Später Button
    if (dismissBtn) {
        dismissBtn.addEventListener('click', () => {
            localStorage.setItem('pwa-install-dismissed', 'true');
            localStorage.setItem('pwa-install-dismissed-time', Date.now().toString());
            if (prompt) {
                prompt.classList.remove('show');
                setTimeout(() => prompt.remove(), 300);
            }
        });
    }

    // Schließen Button (X)
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            localStorage.setItem('pwa-install-dismissed', 'true');
            localStorage.setItem('pwa-install-dismissed-time', Date.now().toString());
            if (prompt) {
                prompt.classList.remove('show');
                setTimeout(() => prompt.remove(), 300);
            }
        });
    }
}

// beforeinstallprompt Event abfangen
window.addEventListener('beforeinstallprompt', (e) => {
    console.log('beforeinstallprompt Event gefeuert');

    // Verhindere automatisches Browser Popup
    e.preventDefault();

    // Event für späteren Gebrauch speichern
    deferredPrompt = e;

    // Eigenes Popup anzeigen
    createInstallPrompt();
});

// App wurde installiert
window.addEventListener('appinstalled', () => {
    console.log('PWA erfolgreich installiert');
    deferredPrompt = null;

    // Gespeicherte Einstellungen löschen
    localStorage.removeItem('pwa-install-dismissed');
    localStorage.removeItem('pwa-install-dismissed-time');
});

// iOS Hinweis für Safari
if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
    // iOS Device erkannt
    if (!isAppInstalled() && !wasPromptDismissed()) {
        // Zeige iOS-spezifische Anleitung nach 5 Sekunden
        setTimeout(() => {
            if (!installPromptShown) {
                createInstallPrompt();
            }
        }, 5000);
    }
}

// Exportiere für globalen Zugriff
window.PWAInstaller = {
    showPrompt: createInstallPrompt,
    isInstalled: isAppInstalled,
    reset: () => {
        localStorage.removeItem('pwa-install-dismissed');
        localStorage.removeItem('pwa-install-dismissed-time');
        installPromptShown = false;
    }
};

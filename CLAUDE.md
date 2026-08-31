# PaceCoach

PWA de coaching d'allure de course a pied. Site statique sans etape de
build : `index.html` (markup + CSS + JS inline) + `sw.js` (service
worker) + `version.js` (version partagee) + `manifest.json`.

## Versioning — regle a appliquer systematiquement

La version de l'app vit dans un seul endroit : `version.js`
(`self.APP_VERSION`). `index.html` l'affiche dynamiquement (titre,
entete, bandeau diagnostic) et `sw.js` s'en sert pour nommer son cache
(`pacecoach-v<APP_VERSION>`).

**Incrementer `APP_VERSION` dans `version.js` a chaque iteration de
changement** (algorithme, UI, comportement, correctif) — meme mineur.
C'est ce qui force Safari/iOS a invalider le cache du service worker et
a livrer la mise a jour aux utilisateurs ayant deja installe l'app en
PWA sur leur iPhone. Sans ce bump, une modification peut rester
invisible pour un utilisateur qui a deja l'app installee, car `sw.js`
sert la version mise en cache tant que `CACHE_NAME` ne change pas.

Ne pas re-hardcoder de numero de version ailleurs dans `index.html` ou
`sw.js` : toujours referencer `APP_VERSION`.

**A chaque reponse impliquant un changement de code, annoncer clairement
le nouveau numero de version (`APP_VERSION`) dans la reponse a
l'utilisateur**, pour qu'il puisse verifier facilement que la version
installee correspond bien au dernier changement.

## Workflow git

Pousser directement sur `main` une fois le travail termine et valide,
sans passer par une pull request, sauf demande explicite contraire de
l'utilisateur dans la conversation en cours.

// Source unique de verite pour la version de l'app.
// index.html l'affiche (titre, entete, bandeau diagnostic) et sw.js s'en
// sert pour nommer son cache. A incrementer a CHAQUE iteration de
// changement (algorithme, UI, comportement, correctif) : c'est ce qui
// force le service worker a invalider son cache et a livrer la mise a
// jour aux PWA deja installees sur iPhone.
self.APP_VERSION = "2.3";

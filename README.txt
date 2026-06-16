ZAHNARZTPRAXIS-WEBSITE – Mehrseitige Website (HTML / CSS / JS)
=============================================================

Moderne, responsive Website für eine Zahnarztpraxis. Vollständig statisch
(kein Build-Schritt nötig) – einfach per Doppelklick öffnen oder bei einem
beliebigen Webhoster hochladen.


ORDNERSTRUKTUR
--------------
zahnarztpraxis-website/
├─ index.html          Startseite (mit Gooey-Morphing-Headline)
├─ ueber-uns.html      Über uns / Team
├─ leistungen.html     Leistungen (Karten)
├─ galerie.html        Bildergalerie
├─ kontakt.html        Kontakt + Terminformular (Formspree) + Öffnungszeiten
├─ impressum.html      Impressum
├─ datenschutz.html    Datenschutz
├─ css/
│  └─ styles.css        Gesamtes Styling + Animationen + Gooey-Effekt
├─ js/
│  └─ script.js         Navigation, Scroll-Animationen, Formspree, Gooey
├─ assets/
│  └─ images/           Hier deine Bilder ablegen (siehe PLATZHALTER.txt)
└─ README.txt


ALLE SEITEN FUNKTIONIEREN
-------------------------
Header-Navigation und Footer sind auf jeder Seite identisch und verlinken
untereinander. Die aktive Seite ist in der Navigation hervorgehoben
(aria-current="page"). Das mobile Menü (Hamburger) funktioniert auf allen Seiten.


TERMINANFRAGEN ÜBER FORMSPREE EINRICHTEN  (WICHTIG)
---------------------------------------------------
Die Anfragen aus dem Kontaktformular kommen per E-Mail bei dir an – ohne
eigenen Server. Dazu Formspree (kostenloses Kontingent vorhanden) verbinden:

1. Auf https://formspree.io ein kostenloses Konto anlegen.
2. Neues Formular ("New form") erstellen und die Ziel-E-Mail-Adresse angeben.
3. Du erhältst eine Endpoint-URL der Form:  https://formspree.io/f/abcdwxyz
4. In  kontakt.html  im <form>-Tag den Platzhalter ersetzen:

   VORHER:  action="https://formspree.io/f/DEINE_FORMSPREE_ID"
   NACHHER: action="https://formspree.io/f/abcdwxyz"   (deine echte ID)

5. Seite hochladen, Testanfrage senden. Beim ersten Mal bestätigt Formspree
   die E-Mail-Adresse einmalig.

Hinweis: Das Formular sendet per JavaScript (AJAX) und zeigt eine
Erfolgs-/Fehlermeldung direkt auf der Seite. Solange die ID nicht ersetzt
ist, erscheint ein Hinweis statt eines echten Versands.


INHALTE / PLATZHALTER AUSFÜLLEN
-------------------------------
Mit der Suchfunktion des Editors nach eckigen Klammern suchen und ersetzen:
  [PRAXISNAME]        Name der Praxis
  [STADT] / [PLZ]     Ort
  [Straße und Hausnummer], [Telefonnummer], [E-MAIL-ADRESSE]
  [JAHR], [X]         Gründungsjahr / Jahre Erfahrung
  Team-Namen in ueber-uns.html
  Öffnungszeiten in kontakt.html
  Impressum & Datenschutz vollständig & rechtssicher ergänzen!

Logo: Platzhalter ist das Zeichen ✦ + Textname im Header. Zum Austauschen
in allen HTML-Dateien den .logo-Bereich durch ein <img src="assets/images/
logo.svg" ...> ersetzen.

Bilder: Platzhalterboxen ("Bild 1", "Team-/Praxisfoto" ...) durch echte
<img src="assets/images/..." alt="..."> ersetzen. Empfohlene Bilder z. B. von
Unsplash (Stichworte: "dentist office", "dental clinic", "smile").


ANIMATIONEN BEIM SCROLLEN
-------------------------
- Fortschrittsbalken oben (.scroll-progress).
- Elemente mit data-animate erscheinen beim Scrollen sanft (fade-up,
  fade-left, fade-right, zoom-in, blur-in). Verzögerung via data-delay="1..6".
- Container mit data-stagger lassen ihre Kinder nacheinander erscheinen.
- Respektiert die Systemeinstellung "Bewegung reduzieren".


GOOEY-TEXT (21st.dev-Komponente)
--------------------------------
Die Startseite nutzt einen "Gooey"-Morphing-Schriftzug in der Hero-Sektion.
Ursprünglich ist das eine React/shadcn-Komponente (gooey-text-morphing.tsx).
Da diese Website reines HTML/CSS/JS ist (kein React), wurde der Effekt
1:1 nach Vanilla-JS portiert – gleicher SVG-#threshold-Filter, gleiche
blur/opacity-Animation.

Wörter ändern: in index.html das Attribut data-gooey anpassen, z. B.
  data-gooey='["Vertrauen.","Gesundheit.","Ästhetik.","Ihr Lächeln."]'
Geschwindigkeit: data-morph-time (Morph-Dauer) und data-cooldown-time
(Standzeit pro Wort) anpassen.

WENN DU STATTDESSEN EIN ECHTES REACT-PROJEKT BAUST:
Die Original-React-Variante liegt unter  react-component/ . Dann:
  1. Projekt mit Vite + React + TypeScript anlegen
  2. Tailwind CSS einrichten und shadcn-ui initialisieren (npx shadcn@latest init)
     -> Komponenten landen standardmäßig unter  components/ui
  3. lib/utils.ts mit der cn()-Hilfsfunktion anlegen (clsx + tailwind-merge)
  4. gooey-text-morphing.tsx nach  components/ui/  kopieren und importieren.

/*
        Website ...: EinkaufsListe
        Autor .....: Constantin Nshuti
        Datum .....: 2023 - 01 - 01

        Website für eine Liste offener Punkte (EinkaufsListe) mit Wiedervorlage

        Version:
        0.001 ......: 2023 - 01 - 01
        - Client-Server mit Version mit einfacher Funktionalität
           (vgl. einkauf_server.ts)

 */

// Globale Variable --------------------------------------------------------------------
let serviceName: string;
let statusCreate: number = 0; // Status des Eingabemodus: 0 = offen, 1 = eingehen, 2 = ändern
let username: string; //aktuelle Bearbeiterperson

// Debug Information über coonsole.log ausgeben
let logEvent: boolean = true; // Ausgabe der Event-Starts in console.log
let logEventFull: boolean = false; // Ausgabe der vollständigen Events in console.log

// Funktionen --------------------------------------------------------------------
function start(){
    /*Start der Website */

    // Programmversion vom server beziehen
    // XMLHttpRequest aufsetzen und absenden
    const request = new XMLHttpRequest();

    // Request starten
    request.open('GET', 'version');
    request.send();

    request.onload = (event) => {
        // Eventhandler das Lesen der aktuellen Tabelle vom Server
        if (request.status === 200){ // Erfolgreiche Rückgabe

            serviceName = request.response;
            // Version eintragen
            document.getElementById("version-title-id ").innerText = serviceName;
            document.getElementById("version-id").innerText = serviceName;
            console.log(serviceName);

        } else { // Fehlermeldung vom Server
            console.log("Fehler bei der Übertragung", request.status);
            if (logEvent)
                console.log("Fehler bei der Übertragung", request.status, "\n", event);

        }
    };
}


function basisdaten(event) {
    /* Aufbau der Tabelle nach der Eingabe des Bearbeiters
     */
    event.preventDefault();
    username = (document.getElementById("user-name") as HTMLInputElement).value;
    if (logEvent) console.log("Basisdaten: ", username); // Debug

    // Freigabe der LoP-Ausgabe im HTML-Dokument
    const lop_liste = document.getElementById("einkaufsliste-liste") as HTMLElement;
    lop_liste.classList.remove("as-unsichtbar");
    lop_liste.classList.add("as-sichtbar");

    // Lesen der aktuellen Tabelle vom Server und Ausgabe in einkaufsliste-tbody
    renderEinkaufsListe();
}


function aufgabe(event) {
    /*
    * Abfragefenster für das Erzeugen (Create) eines neuen Eintrags in der Einkaufsliste
    * */
    event.preventDefault();

    const command = event.submitter.value;
    if (command === "neu") {
        if (logEvent) console.log("function aufgabe -> new"); // Debug
        if (statusCreate === 0) {
            statusCreate = 1; // Der Status 1 sperrt die Bearbeitung anderer Events, die nicht zur
                              // Eingabe des neuen Einkaufsliste-Eintrags gehören

            const tbody = document.getElementById("einkaufsliste-tbody") as HTMLElement;
            const html = tbody.innerHTML;  // aktuellen Tabelleninhalt sichern
            const datumNew = (new Date()).toISOString().slice(0, 10); //aktuelles Datum bestimmen

            // Aufbau und Ausgabe der Eingabefelder für ein neues Element der Einkaufsliste
            // Die Eingabefelder werden in der ersten Zeile der Tabelle angelegt
            const get_waren: string =
                "<tr class='b-dot-line' data-lop-id='" + undefined + "'> " +
                "<td data-purpose='who' data-lop-id='" + undefined + "'>" +
                "<input name='who' type='text' data-lop-id='" + undefined +
                "' value = " + username + ">" +
                "</td>" +
                "<td data-purpose='aufgabe' data-lop-id='" + undefined + "'>" +
                " <form>" +
                "<input name = 'Aufgabe' type = 'text'  " +
                "placeholder = 'Waren'  class= 'as-width-100pc' data-input ='aufgabe'>" +
                "<br>" +
                "<input type = 'submit' value = 'speichern' class='as-button-0 button-shadow' " +
                "data-purpose = 'speichern' data-lop-id = 'undefinded'>" +
                "<input type = 'submit' value = 'zurück' class='as-button button-shadow' " +
                "data-purpose = 'zurück' data-lop-id = 'undefinded'>" +
                "</form>" +
                "</td>" +
                "<td data-purpose='wo' data-lop-id='" + undefined + "'>" +
                "<input name = 'wo' type = 'text'  " +
                "placeholder = 'wo'  class= 'as-width-100pc' data-input ='wo'>" +
                "</td>" +
                "<td data-purpose='datum' data-lop-id='" + undefined + "'>" +
                "<input  name='Datum' type='text' " +
                "data-lop-id='" + undefined + "' data-purpose='datum'" +
                "' value = " + datumNew + ">" +
                "</td>" +
                "</tr>";
            tbody.innerHTML = get_waren + html
        }

    } else if (command === "sichern") {
        /* Die Funktion "sichern" ist noch nicht implementiert.
           Es erfolgt in der vorliegenden Version nur eine Ausgabe der vollständigen Liste
           als JSON in die console.log.
         */
        if (logEvent) console.log("function aufgabe -> sichern"); // Debug

        // XMLHttpRequest aufsetzen und absenden
        const request = new XMLHttpRequest();

        // Request starten
        request.open('GET', 'save');
        request.send()

        request.onload = (event) => {
            // Eventhandler für das Lesen der aktuellen Tabellenzeile zum Ändern oder Löschen
            // vom Server
            if (request.status === 200) { // Erfolgreiche Rückgabe
                if (logEventFull) console.log("Daten gesichert",);
                renderEinkaufsListe();

            } else { // Fehlermeldung vom Server
                console.log("Fehler bei der Übertragung", request.status);
                if (logEvent) console.log("Fehler bei der Übertragung", request.status,
                    "\n", event);
            }
        };

    } else {
        // Click ins Nirgendwo
        if (logEvent) console.log("function aufgabe -> ?"); // Debug

    }
}




function createUpdateDelete(event) {
    /*
    * Create, Update und Delete von Einträgen in der EinkaufsListe
    */
    event.preventDefault();
    if (logEvent) console.log("createUpdateDelete -> lop-tbody; click"); // Debug
    if (logEventFull) console.log("\"createUpdateDelete -> lop-tbody; click", event); // Debug

    const command = event.target.getAttribute("data-purpose");
    const idSelect = event.target.getAttribute("data-lop-id")

    if (logEvent) console.log("command: ", command, "id: ", idSelect); // Debug

    if (command === "zurück") {
        // zurück -------------------------------------------------------------------------------------
        // Rückkehr aus dem aktuellen Abfragefenster ohne Änderung
        if (logEvent) console.log("function  createUpdateDelete -> zurück"); // Debug
        renderEinkaufsListe();

    } else if (command === "speichern") {
        // speichern ------------------------------------------------------------------------------
        // Erzeugen (Create) eines neuen Eintrags in der LoP

        if (logEvent) console.log("function  createUpdateDelete -> speichern"); // Debug

        if (statusCreate === 1) {

            const what_aktuell = event.target.parentElement[0].value;
            if (what_aktuell === "") {
                // Wenn keine Waren angegeben wurde, wird die Erzeugung des Eintrags abgebrochen.
                renderEinkaufsListe();

            } else {
                // Entnehmen der Daten für den neuen Eintrag aus dem HTML-Dokument
                const td_actual = event.target.parentElement.parentElement;
                const where_aktuell = td_actual.nextSibling.childNodes[0].value;
                const who_aktuell = td_actual.previousSibling.childNodes[0].value;
                const date_aktuell = td_actual.nextSibling.nextSibling.childNodes[0].value;

                if (logEvent) console.log("eingabe_aktuell: ", who_aktuell, what_aktuell,where_aktuell,
                    date_aktuell); // Debug

                // Übertragen der neuen Aufgabe an den Server ---------------------------

                // XMLHttpRequest aufsetzen und absenden
                const request = new XMLHttpRequest();

                // Request starten
                request.open('POST', 'create');
                request.setRequestHeader('Content-Type', 'application/json');
                const json_datei = JSON.stringify((
                    {
                        "who": who_aktuell,
                        "what": what_aktuell,
                        "where": where_aktuell,
                        "date": date_aktuell,
                        "status": 1
                    }));
                request.send(json_datei);

                request.onload = (event) => {
                    // Eventhandler das Lesen der aktuellen Tabelle vom Server
                    if (request.status === 200) { // Erfolgreiche Rückgabe
                        renderEinkaufsListe();

                    } else { // Fehlermeldung vom Server
                        console.log("Fehler bei der Übertragung", request.status);
                        if (logEvent) console.log("Fehler bei der Übertragung", request.status,
                            "\n", event);
                    }
                };

                renderEinkaufsListe();
            }
        }
    } else if (command === "who" || command === "what" || command === "where" || command === "date") {
        // Ändern aktivieren ----------------------------------------------------------------------
        // Ausgabe der Eingabefelder für die Änderung (Update) eines LoP-Eintrags
        if (logEvent) console.log("function  createUpdateDelete -> who, what,where, date"); // Debug
        if (logEventFull) console.log("update: ", event.target.parentElement); // Debug

        if (statusCreate === 0) {
            statusCreate = 2; // Der Status 2 sperrt die Bearbeitung anderer Events, die nicht zur
                              // Bearbeitung der Änderung des LoP-Eintrags gehören

            const tr_act = event.target.parentElement;
            const id_act = Number(tr_act.getAttribute('data-lop-id'));

            if (logEventFull) console.log("id_act: ", id_act); // Debug

            // XMLHttpRequest aufsetzen und absenden
            const request = new XMLHttpRequest();

            // Request starten
            request.open('POST', 'read');
            request.setRequestHeader('Content-Type', 'application/json');

            const json_datei = JSON.stringify((
                {
                    "id_act": id_act

                }));
            request.send(json_datei);

            request.onload = (event) => {
                // Eventhandler für das Lesen der aktuellen Tabellenzeile zum Ändern oder Löschen
                // vom Server
                if (request.status === 200) { // Erfolgreiche Rückgabe

                    const html_Change = request.response;
                    if (logEventFull) console.log("Ergebnis vom Server: ", html_Change);

                    tr_act.innerHTML = html_Change;

                } else { // Fehlermeldung vom Server
                    console.log("Fehler bei der Übertragung", request.status);
                    if (logEvent) console.log("Fehler bei der Übertragung", request.status,
                        "\n", event);
                }
            };
        }
    } else if (command === "loeschen") {
        // löschen --------------------------------------------------------------------------------
        if (statusCreate === 2) {
            /* Ein Element der LoP wird durch das Löschen an dieser Stelle nur deaktiviert
               (Status = 2) und nicht endgültig gelöscht (Status = 3).
            */
            if (logEvent) console.log("function  createUpdateDelete -> löschen"); // Debug
            if (logEventFull) console.log("löschen: ", event.target); // Debug

            // aktuelles Element ermitteln
            const id_act = Number(event.target.getAttribute('data-lop-id'));

            // XMLHttpRequest aufsetzen und absenden
            const request = new XMLHttpRequest();

            // Request starten
            request.open('POST', 'delete');
            request.setRequestHeader('Content-Type', 'application/json');
            const json_datei = JSON.stringify((
                {
                    "id_act": id_act

                }));
            request.send(json_datei);

            request.onload = (event) => {
                // Eventhandler für das Lesen der aktuellen Tabellenzeile zum Ändern oder Löschen
                // vom Server
                if (request.status === 200) { // Erfolgreiche Rückgabe

                    if (logEventFull) console.log("Gelöscht: ",);
                    renderEinkaufsListe();

                } else { // Fehlermeldung vom Server
                    console.log("Fehler bei der Übertragung", request.status);
                    if (logEvent) console.log("Fehler bei der Übertragung", request.status,
                        "\n", event);
                }
            };
        }
    } else if (command === "aendern") {
        // ändern ---------------------------------------------------------------------------------
        if (statusCreate === 2) {
            // Das aktuelle Element der LoP wird entsprechend der Nutzereingabe geändert

            if (logEvent) console.log("function  createUpdateDelete -> ändern"); // Debug
            if (logEventFull) console.log("ändern: ", event.target); // Debug

            // Geänderte Daten aus HTML-Dokument übernehmen
            const td_actual = event.target.parentElement.parentElement;
            const what_aktuell = td_actual.childNodes[0].value;
            const where_aktuell = td_actual.nextSibling.childNodes[0].value;
            const who_aktuell = td_actual.previousSibling.childNodes[0].value;
            const date_aktuell = td_actual.nextSibling.nextSibling.childNodes[0].value;

            if (logEvent) console.log("ändern: ", who_aktuell, what_aktuell,where_aktuell, date_aktuell); // Debug

            // aktuelles Element ermitteln
            const id_act = Number(event.target.getAttribute('data-lop-id'));

            // XMLHttpRequest aufsetzen und absenden
            const request = new XMLHttpRequest();

            // Request starten
            request.open('POST', 'update');
            request.setRequestHeader('Content-Type', 'application/json');
            const json_datei = JSON.stringify((
                {
                    "who": who_aktuell,
                    "what": what_aktuell,
                    "where": where_aktuell,
                    "date": date_aktuell,
                    "status": 1
                }));
            request.send(json_datei);

            request.onload = (event) => {
                // Eventhandler das Lesen der aktuellen Tabelle vom Server
                if (request.status === 200) { // Erfolgreiche Rückgabe
                    renderEinkaufsListe();

                } else { // Fehlermeldung vom Server
                    console.log("Fehler bei der Übertragung", request.status);
                    if (logEvent) console.log("Fehler bei der Übertragung", request.status,
                        "\n", event);
                }
            };
        }
    } else {
        // Clicks ins Nirgendwo -------------------------------------------------------------------
        if (logEvent) console.log("function  createUpdateDelete -> ?"); // Debug
    }
}


function renderEinkaufsListe () {
    /*
    * Ausgabe der aktuellen LoP und Abschluss ausstehender Nutzer-Interaktionen.
    * Alle Eingabefelder in der LoP-Tabelle werden gelöscht.
    */
    const table_body = document.getElementById("einkaufsliste-tbody") as HTMLElement;
    let html_LoP: string = "";

    // XMLHttpRequest aufsetzen und absenden ----------------------------------
    const request = new XMLHttpRequest();

    // Request starten
    request.open('GET', 'read');
    request.send();

    request.onload = (event) => {
        // Eventhandler für das Lesen der aktuellen Tabelle vom Server
        if (request.status === 200) { // Erfolgreiche Rückgabe
            html_LoP = request.response;
            if (logEventFull) console.log("Ergebnis vom Server: ", html_LoP);

            table_body.innerHTML = html_LoP;

            const einkaufslisteCreateSave = document.getElementById("einkaufsliste-create-save") as HTMLElement;
            einkaufslisteCreateSave.classList.remove("as-unsichtbar");
            einkaufslisteCreateSave.classList.add("as-sichtbar");

            statusCreate = 0;  // Der Status 0 gibt die Bearbeitung aller Events frei.
                               // Die ausgegebene Tabelle im Browser entspricht jetzt dem aktuellen
                               // Stand.

        } else { // Fehlermeldung vom Server
            console.log("Fehler bei der Übertragung", request.status);
            if (logEvent) console.log("Fehler bei der Übertragung", request.status,
                "\n", event);
        }
    };
}


document.addEventListener("DOMContentLoaded", () =>{

    start();

    document.getElementById("eingabe-basisdaten").addEventListener("submit", (event) => {
        /* Nach der Eingabe des Bearbeiternamens wird die Tabelle aufgebaut
         */
        if (logEvent) console.log("eingabe-basisdaten; submit"); // Debug
        basisdaten(event);
    })


    document.getElementById("einkaufsliste-create-save").addEventListener("submit", (event) => {
        /* Callback für die Buttons
           - "neu" -> neuen Eintrag für die LoP abfragen
           - "sichern" -> aktuelle LoP auf dem Server sichern
         */
        if (logEvent) console.log("einkaufsliste-create-save; submit"); // Debug
        if (logEventFull) console.log("einkaufsliste-create-save; submit", event); // Debug
        aufgabe(event);
    })


    document.getElementById("einkaufsliste-tbody").addEventListener("click", (event) => {
        /* Callback für die Buttons
           - "speichern" -> Erzeugen eines neuen Eintrags in der LoP anhand der Eingabedaten (CREATE)
           - "zurück" -> abbrechen der aktiven Aktion
           - "ändern" -> ändern eines ausgewählten Eintrags in der LoP anhand der Eingabedaten (UPDATE)
           - "löschen" -> löschen eines ausgewählten Eintrags (DELETE)
         */
        event.preventDefault();
        if (logEvent) console.log("einkaufsliste-list-render; click"); // Debug
        if (logEventFull) console.log("einkaufsliste-list-render; click", event); // Debug
        createUpdateDelete(event);
    })


});

/*
        Website ...: EinkaufsListe
        Autor .....: Constantin Nshuti
        Datum .....: 2022 - 12 - 07

        Website für eine Liste offener Punkte (EinkaufsListe) mit Wiedervorlage

        Version:
        0.001 ......: 2022 - 12 - 07
        - Client-Server mit Version mit einfacher Funktionalität
           (vgl. einkauf_server.ts)

 */

// Globale Variablen ----------------------------------------------------------
let serviceName: string;
let statusCreate: number = 0; // Status des Eingabemodus: 0 = offen, 1 = eingeben, 2 = ändern
let username: string; // aktuelle Bearbeiterperson

// Debug Informationen über console.log ausgeben
let logEvent: boolean = true;  // Ausgabe der Event-Starts in console.log
let logEventFull: boolean = false;  // Ausgabe der vollständigen Events in console.log

// Funktionen -----------------------------------------------------------------
function start() {
    /* Start der Website */

    // Programmversion vom Server beziehen
    // XMLHttpRequest aufsetzen und absenden
    const request = new XMLHttpRequest();

    // Request starten
    request.open('GET', 'version');
    request.send();

    request.onload = (event) => {
        // Eventhandler das Lesen der aktuellen Tabelle vom Server
        if (request.status === 200) { // Erfolgreiche Rückgabe

            serviceName = request.response;
            // Version eintragen
            document.getElementById("version-title-id").innerText = serviceName;
            document.getElementById("version-id").innerText = serviceName;
            console.log(serviceName);

        } else { // Fehlermeldung vom Server
            console.log("Fehler bei der Übertragung", request.status);
            if (logEvent) console.log("Fehler bei der Übertragung", request.status,
                "\n", event);
        }
    };


}

function basisdaten(event) {
    /* Aufbau der Tabelle nach der Eingabe des Bearbeiters
     */
    event.preventDefault();
    username = (document.getElementById("user-name") as HTMLInputElement).value;
    if (logEvent) console.log("Basisdaten: ", username); // Debug

    // Freigabe der EinkaufsListe-Ausgabe im HTML-Dokument
    const EinkaufsListe_liste = document.getElementById("einkaufsliste-liste") as HTMLElement;
    EinkaufsListe_liste.classList.remove("as-unsichtbar");
    EinkaufsListe_liste.classList.add("as-sichtbar");

    // Lesen der aktuellen Tabelle vom Server und Ausgabe in einkaufsliste-tbody
    renderEinkaufsListe();
}

function disable(event){
    let input = document.getElementById("eingabe-basisdaten");
    input.innerHTML = "<label for='user-name'>Wer: </label> <input id='user-name' name='user-name' type='text' class='button-shadow' value='"+ username +"' disabled >";

}

function newEinkauft(event) {
    /*
    * Abfragefenster für das Erzeugen (Create) eines neuen Eintrags in der EinkaufsListe
    * */
    event.preventDefault();

    const command = event.submitter.value;
    if (command === "neu") {

       // disable(event);


        if (logEvent) console.log("function what -> new"); // Debug
        if (statusCreate === 0) {
            statusCreate = 1; // Der Status 1 sperrt die Bearbeitung anderer Events, die nicht zur
                              // Eingabe des neuen EinkaufsListe-Eintrags gehören

            const tbody = document.getElementById("einkaufsliste-tbody") as HTMLElement;
            const html = tbody.innerHTML;  // aktuellen Tabelleninhalt sichern
            const datumNew = (new Date()).toISOString().slice(0, 10); //aktuelles Datum bestimmen

            // Aufbau und Ausgabe der Eingabefelder für ein neues Element der EinkaufsListe
            // Die Eingabefelder werden in der ersten Zeile der Tabelle angelegt
            const get_what: string =
                "<tr class='b-dot-line' data-EinkaufsListe-id='" + undefined + "'> " +
                "<td data-purpose='who' data-EinkaufsListe-id='" + undefined + "'>" +
                "<input name='who' type='text' data-EinkaufsListe-id='" + undefined +
                "' value = " + username + ">" +
                "</td>" +
                "<td data-purpose='what' data-EinkaufsListe-id='" + undefined + "'>" +
                " <form>" +
                "<input name = 'what' type = 'text'  " +
                "placeholder = 'what'  class= 'as-width-100pc' data-input ='what'>" +
                "<br>" +

                "<input type = 'submit' value = 'speichern' class='as-button-0 as-button' " +
                "data-purpose = 'speichern' data-EinkaufsListe-id = 'undefinded'>" +
                "<input type = 'submit' value = 'zurück' class='as-button' " +
                "data-purpose = 'zurück' data-EinkaufsListe-id = 'undefinded'>" +
                "</form>" +
                "</td>" +

                "<td data-purpose='where' data-EinkaufsListe-id='" + undefined + "'>" +
                "<input name = 'where' type = 'text'  " +
                "placeholder = 'where'  class= 'as-width-100pc' data-input ='where'>" +
                "</td>" +
                "<td data-purpose='datum' data-EinkaufsListe-id='" + undefined + "'>" +
                "<input  name='Datum' type='text' " +
                "data-EinkaufsListe-id='" + undefined + "' data-purpose='datum'" +
                "' value = " + datumNew + ">" +
                "</td>" +
                "</tr>";
            tbody.innerHTML = get_what + html
        }

    } else if (command === "sichern") {
        /* Die Funktion "sichern" ist noch nicht implementiert.
           Es erfolgt in der vorliegenden Version nur eine Ausgabe der vollständigen Liste
           als JSON in die console.log.
         */
        if (logEvent) console.log("function what -> sichern"); // Debug

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
        // Click ins Nirgendwhere
        if (logEvent) console.log("function what -> ?"); // Debug

    }
}

function createUpdateDelete(event) {
    /*
    * Create, Update und Delete von Einträgen in der EinkaufsListe
    */
    event.preventDefault();
    if (logEvent) console.log("createUpdateDelete -> einkaufsliste-tbody; click"); // Debug
    if (logEventFull) console.log("\"createUpdateDelete -> einkaufsliste-tbody; click", event); // Debug

    const command = event.target.getAttribute("data-purpose");
    const idSelect = event.target.getAttribute("data-EinkaufsListe-id")

    if (logEvent) console.log("command: ", command, "id: ", idSelect); // Debug

    if (command === "zurück") {
        // zurück -------------------------------------------------------------------------------------
        // Rückkehr aus dem aktuellen Abfragefenster ohne Änderung
        if (logEvent) console.log("function  createUpdateDelete -> zurück"); // Debug
        renderEinkaufsListe();

    } else if (command === "speichern") {
        // speichern ------------------------------------------------------------------------------
        // Erzeugen (Create) eines neuen Eintrags in der EinkaufsListe

        if (logEvent) console.log("function  createUpdateDelete -> speichern"); // Debug

        if (statusCreate === 1) {

            const what_aktuell = event.target.parentElement[0].value;
            if (what_aktuell === "") {
                // Wenn keine what angegeben wurde, wird die Erzeugung des Eintrags abgebrochen.
                renderEinkaufsListe();

            } else {
                // Entnehmen der Daten für den neuen Eintrag aus dem HTML-Dokument
                const td_actual = event.target.parentElement.parentElement;
                const where_aktuell = td_actual.nextSibling.childNodes[0].value;
                const who_aktuell = td_actual.previousSibling.childNodes[0].value;
                const datum_aktuell = td_actual.nextSibling.nextSibling.childNodes[0].value;

                if (logEvent) console.log("eingabe_aktuell: ", who_aktuell, what_aktuell,where_aktuell,
                    datum_aktuell); // Debug

                // Übertragen der neuen what an den Server ---------------------------

                // XMLHttpRequest aufsetzen und absenden
                const request = new XMLHttpRequest();

                // Request starten
                request.open('POST', 'create');
                request.setRequestHeader('Content-Type', 'application/json');

               const json_datei = JSON.stringify(
                   {
                       "who": who_aktuell,
                       "what": what_aktuell,
                       "where": where_aktuell,
                       "datum": datum_aktuell,
                       "status": 1
                   })
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
    } else if (command === "who" || command === "what" || command === "where" || command === "datum" || command ==="edit") {
        // Ändern aktivieren ----------------------------------------------------------------------
        // Ausgabe der Eingabefelder für die Änderung (Update) eines EinkaufsListe-Eintrags
        if (logEvent) console.log("function  createUpdateDelete -> who, what,where, datum,aedern,aendern2"); // Debug
        if (logEventFull) console.log("update: ", event.target.parentElement); // Debug

        if (statusCreate === 0) {
            statusCreate = 2; // Der Status 2 sperrt die Bearbeitung anderer Events, die nicht zur
                              // Bearbeitung der Änderung des EinkaufsListe-Eintrags gehören

            const tr_act = event.target.parentElement;
            const tr_act_ed = event.target.parentElement.parentElement;
            const id_act = Number(tr_act.getAttribute('data-EinkaufsListe-id'));

            if (logEventFull) console.log("id_act: ", id_act); // Debug

            // XMLHttpRequest aufsetzen und absenden
            const request = new XMLHttpRequest();

            // Request starten
            request.open('POST', 'read');
            request.setRequestHeader('Content-Type', 'application/json');
            const json_datei =JSON.stringify(
                {
                    "id_act": id_act
                })
            request.send(json_datei);

            request.onload = (event) => {
                // Eventhandler für das Lesen der aktuellen Tabellenzeile zum Ändern oder Löschen
                // vom Server
                if (request.status === 200) { // Erfolgreiche Rückgabe

                    const html_Change = request.response;
                    if (logEventFull) console.log("Ergebnis vom Server: ", html_Change);
                    if(command ==="edit" ){
                        tr_act_ed.innerHTML = html_Change;
                    }else{
                        tr_act.innerHTML = html_Change;
                    }

                    

                } else { // Fehlermeldung vom Server
                    console.log("Fehler bei der Übertragung", request.status);
                    if (logEvent) console.log("Fehler bei der Übertragung", request.status,
                        "\n", event);
                }
            };
        }
    } else if (command === "loeschen" || command ==="entfernen") {
        statusCreate = 2;
        // löschen --------------------------------------------------------------------------------
        if (statusCreate === 2) {
            /* Ein Element der EinkaufsListe wird durch das Löschen an dieser Stelle nur deaktiviert
               (Status = 2) und nicht endgültig gelöscht (Status = 3).
            */
            if (logEvent) console.log("function  createUpdateDelete -> löschen"); // Debug
            if (logEventFull) console.log("löschen: ", event.target); // Debug

            // aktuelles Element ermitteln
            const id_act = Number(event.target.getAttribute('data-EinkaufsListe-id'));

            // XMLHttpRequest aufsetzen und absenden
            const request = new XMLHttpRequest();

            // Request starten
            request.open('POST', 'delete');
            request.setRequestHeader('Content-Type', 'application/json');
            const json_datei =JSON.stringify(
                {
                    "id_act": id_act
                     })
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
            //status zürucksetzen
            if(command == "delete") statusCreate = 0;
        }
    } else if (command === "aendern" ) {
        // ändern ---------------------------------------------------------------------------------
        if (statusCreate === 2) {
            // Das aktuelle Element der EinkaufsListe wird entsprechend der Nutzereingabe geändert

            if (logEvent) console.log("function  createUpdateDelete -> ändern"); // Debug
            if (logEventFull) console.log("ändern: ", event.target); // Debug

            // Geänderte Daten aus HTML-Dokument übernehmen
            const td_actual = event.target.parentElement.parentElement;
            const what_aktuell = td_actual.childNodes[0].value;
            const where_aktuell = td_actual.nextSibling.childNodes[0].value;
            const who_aktuell = td_actual.previousSibling.childNodes[0].value;
            const datum_aktuell = td_actual.nextSibling.nextSibling.childNodes[0].value;

            if (logEvent) console.log("ändern: ", who_aktuell, what_aktuell,where_aktuell, datum_aktuell); // Debug

            // aktuelles Element ermitteln
            const id_act = Number(event.target.getAttribute('data-EinkaufsListe-id'));

            // XMLHttpRequest aufsetzen und absenden
            const request = new XMLHttpRequest();

            // Request starten
            request.open('POST', 'update');
            request.setRequestHeader('Content-Type', 'application/json');
            const json_datei = JSON.stringify(
                {
                    "id_act": id_act,
                    "who": who_aktuell,
                    "what": what_aktuell,
                    "where": where_aktuell,
                    "datum": datum_aktuell
                })

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
        // Clicks ins Nirgendwhere -------------------------------------------------------------------
        if (logEvent) console.log("function  createUpdateDelete -> ?"); // Debug
    }
}

function renderEinkaufsListe() {
    /*
    * Ausgabe der aktuellen EinkaufsListe und Abschluss ausstehender Nutzer-Interaktionen.
    * Alle Eingabefelder in der EinkaufsListe-Tabelle werden gelöscht.
    */
    const table_body = document.getElementById("einkaufsliste-tbody") as HTMLElement;
    let html_EinkaufsListe: string = "";

    // XMLHttpRequest aufsetzen und absenden ----------------------------------
    const request = new XMLHttpRequest();

    // Request starten
    request.open('GET', 'read');
    request.send();

    request.onload = (event) => {
        // Eventhandler für das Lesen der aktuellen Tabelle vom Server
        if (request.status === 200) { // Erfolgreiche Rückgabe
            html_EinkaufsListe = request.response;
            if (logEventFull) console.log("Ergebnis vom Server: ", html_EinkaufsListe);

            table_body.innerHTML = html_EinkaufsListe;

            const EinkaufsListeCreateSave = document.getElementById("einkaufsliste-create-save") as HTMLElement;
            EinkaufsListeCreateSave.classList.remove("as-unsichtbar");
            EinkaufsListeCreateSave.classList.add("as-sichtbar");

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

// Callbacks - Eventlistener ---------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
    /* Warten bis der DOM des HTML-Dokuments aufgebaut ist. Danach wird die
       Funktionalität der Website gestartet und  die "Callbacks" initialisiert.
    */
    start();

    document.getElementById("eingabe-basisdaten").addEventListener("submit", (event) => {
        /* Nach der Eingabe des Bearbeiternamens wird die Tabelle aufgebaut
         */
        if (logEvent) console.log("eingabe-basisdaten; submit"); // Debug
        basisdaten(event);
    })

    document.getElementById("einkaufsliste-create-save").addEventListener("submit", (event) => {
        /* Callback für die Buttons
           - "neu" -> neuen Eintrag für die EinkaufsListe abfragen
           - "sichern" -> aktuelle EinkaufsListe auf dem Server sichern
         */
        if (logEvent) console.log("einkaufsliste-create-save; submit"); // Debug
        if (logEventFull) console.log("einkaufsliste-create-save; submit", event); // Debug
        newEinkauft(event);
    })

    

    document.getElementById("einkaufsliste-tbody").addEventListener("click", (event) => {
        /* Callback für die Buttons
           - "speichern" -> Erzeugen eines neuen Eintrags in der EinkaufsListe anhand der Eingabedaten (CREATE)
           - "zurück" -> abbrechen der aktiven Aktion
           - "ändern" -> ändern eines ausgewählten Eintrags in der EinkaufsListe anhand der Eingabedaten (UPDATE)
           - "löschen" -> löschen eines ausgewählten Eintrags (DELETE)
         */
        event.preventDefault();
        if (logEvent) console.log("EinkaufsListe-list-render; click"); // Debug
        if (logEventFull) console.log("lEinkaufsListe-list-render; click", event); // Debug
        createUpdateDelete(event);
    })
});



"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express"); // express bereitstellen
var fs = require('fs');
//-----------------------------------------------------------------------------------------
//Klassen
var EinkaufsListeEintrag = /** @class */ (function () {
    function EinkaufsListeEintrag(who, what, where, date, status) {
        this.id = ++EinkaufsListeEintrag.id_max; // Vergabe einer eindeutigen id
        this.status = status;
        this.who = who;
        this.what = what;
        this.where = where;
        this.date = new Date(date);
        EinkaufsListeEintrag.stack.push(this); //Der aktuelle Eintrag wird zur Sicherung auf den Stack gelegt
    }
    EinkaufsListeEintrag.prototype.getID = function () {
        // Ermittlung der id des rufenden Eintrag
        return this.id;
    };
    EinkaufsListeEintrag.prototype.getStatus = function () {
        // Ermittlung des Status des rufenden Eintrags
        return this.status;
    };
    EinkaufsListeEintrag.prototype.setStatus = function (status) {
        //Setzen des Status des rufenden Eintrags
        this.status = status;
        return this.status;
    };
    EinkaufsListeEintrag.getEinkaufsEintragStack = function () {
        //Rückgabe des vollständige Stacks mit allen Einträgen
        return EinkaufsListeEintrag.stack;
    };
    EinkaufsListeEintrag.id_max = 0; // größte bisher vergebene id
    EinkaufsListeEintrag.stack = []; // Stack für alle erzeugten Einträge
    return EinkaufsListeEintrag;
}());
var EinkaufsListe = /** @class */ (function () {
    // ein Element in diesem Stack enthalten)
    function EinkaufsListe() {
        this.liste = [];
        EinkaufsListe.stack.push(this);
    }
    EinkaufsListe.prototype.getEinkaufsListeEintrag = function (id) {
        var einkaufsliste_act = undefined;
        for (var _i = 0, _a = this.liste; _i < _a.length; _i++) { // Durch die Liste Eintrag Anhand seinem id durchsuchen
            var i = _a[_i];
            if (id === i.getID()) {
                einkaufsliste_act = i;
            }
        }
        return einkaufsliste_act; // Wenn die Suche nicht erfolgreich ist, return undefined
    };
    EinkaufsListe.stack = []; // Stack aller EinkaufsListe( im vorliegenden Fall ist nur
    return EinkaufsListe;
}());
var LogEinkaufsListe = /** @class */ (function () {
    function LogEinkaufsListe(who, what, where, date, status) {
        this.who = who;
        this.what = what;
        this.where = where;
        this.date = date;
        this.status = status;
    }
    return LogEinkaufsListe;
}());
//-----------------------------------------------------------------------------------------
// Funktion
function EinkaufsListeSave(einkaufsListe, file) {
    //Sichern der übergebenen Einkaufsliste in die Datei mit dem Pfad file
    //Der gespeicherte JSON-String wird von der Function zurückgegeben
    var logEinkaufsListe = [];
    for (var _i = 0, _a = einkaufsListe_aktuell.liste; _i < _a.length; _i++) {
        var i = _a[_i];
        logEinkaufsListe.push(new LogEinkaufsListe(i.who, i.what, i.where, i.date, i.getStatus()));
    }
    // Umwandeln des Objekts in einen JSON-String
    var logEinkaufsListeJSON = JSON.stringify(logEinkaufsListe);
    // Schreiben des JSON-String der EinkaufsListe in die Datei mit dem Pfadenamen "file"
    fs.writeFile(file, logEinkaufsListeJSON, function (err) {
        if (err)
            throw err;
        if (logRequest)
            console.log("Einkauf-Liste gesichert in der Datei: ", file);
    });
    return logEinkaufsListeJSON;
}
function renderEinkaufsListe(EinkaufsListe) {
    // Aufbereitung der aktuellen EinkaufsListe als HTML-tbody
    var html_EinkaufsListe = "";
    for (var i in EinkaufsListe.liste) {
        // Ein Element der EinkaufsListe wird nur ausgegeben, wenn sein Status auf aktiv (1) steht
        if (EinkaufsListe.liste[i].getStatus() === 1) {
            var id = EinkaufsListe.liste[i].getID();
            var who = EinkaufsListe.liste[i].who;
            var what = EinkaufsListe.liste[i].what;
            var where = EinkaufsListe.liste[i].where;
            var date = EinkaufsListe.liste[i].date;
            var date_string = date.toISOString().slice(0, 10);
            html_EinkaufsListe += "<tr class='b-dot-line' date-lop-id='" + id + "'>";
            html_EinkaufsListe += "<td class='click-value' date-purpose='who' " +
                "data-lop-id='" + id + "'>" + who + "</td>";
            html_EinkaufsListe += "<td class='click-value as-width-100pc' data-purpose='what' " +
                "data-lop-id='" + id + "'>" + what + "</td>";
            html_EinkaufsListe += "<td class='click-value' data-purpose='wo' " +
                "data-lop-id='" + id + "'>" + where + "</td>";
            html_EinkaufsListe += "<td class='click-value' data-purpose='date'" +
                " data-lop-id='" + id + "'>" + date_string + "</td>";
            html_EinkaufsListe += "<td >" +
                "<input  type = 'submit' value = 'E' class='as-button-1' " +
                "data-purpose = 'aendern' data-lop-id = '" + id + "'>" +
                "<input  type = 'submit' value = 'X' class='as-button-1' " +
                "data-purpose = 'loeschen' data-lop-id = '" + id + "'>" +
                "</td>";
            html_EinkaufsListe += "</tr>";
        }
    }
    return html_EinkaufsListe;
}
function change(einkaufChange) {
    var id_act = einkaufChange.getID();
    var who = einkaufChange.who;
    var what = einkaufChange.what;
    var where = einkaufChange.where;
    var date = einkaufChange.date;
    var html_Change = "";
    html_Change += "<td><input type='text' value='" + who + "'></td>" +
        "<td><input class='as-width-100pc' type='text' value='" +
        what + "'>" +
        " <form>" +
        "<input type = 'submit' value = 'speichern' class='as-button-0' " +
        "data-purpose = 'speichern2' data-lop-id = '" + id_act + "'>" +
        "<input type = 'submit' value = 'zurück' class='as-button' " +
        "data-purpose = 'zurück' data-lop-id = '" + id_act + "'>" +
        "</form>" +
        "<td><input type='text' value='" + where + "'></td>" +
        "<br>" +
        "</td>" +
        "<td><input type='text' value='" + date.toISOString().slice(0, 10) + "'>" +
        "</td>";
    return html_Change;
}
function renderEinkaufsListeChange(einkaufslisteChange) {
    // Aufbereitung des aktuellen Eintrags für die Änderung-/Löschausgabe in
    // der zugehörigen Tabellenzeile
    var id_act = einkaufslisteChange.getID();
    var who = einkaufslisteChange.who;
    var what = einkaufslisteChange.what;
    var date = einkaufslisteChange.date;
    var where = einkaufslisteChange.where;
    var html_Change = "";
    html_Change += "<td><input type='text' value='" + who + "'></td>" +
        "<td><input class='as-width-100pc' type='text' value='" +
        what + "'>" +
        "<br>" +
        "<input type='submit' value='ändern' class='as-button-0' " +
        " data-purpose = 'aendern' data-lop-id = '" + id_act + "'>" +
        "<input type = 'submit' value = 'zurück' class='as-button' " +
        "data-purpose = 'zurück' data-lop-id = '" + id_act + "'>" +
        "<input type = 'submit' value = 'löschen' class='as-button' " +
        "data-purpose = 'loeschen' data-lop-id = '" + id_act + "'>" +
        "</form>" +
        "<td><input type='text' value='" + where + "'></td>" +
        "<br>" +
        "</td>" +
        "<td><input type='text' value='" + date.toISOString().slice(0, 10) + "'>" +
        "</td>";
    return html_Change;
}
// Globale Variable -----------------------------------------------------------------------
var programmname = "Einkauf-Liste";
var version = 'V.1.001';
var username; // aktuelle Bearbeiterperson
var einkaufsListe_aktuell = new EinkaufsListe(); // Einkaufsliste anlegen
var einkaufsListeRunCounter = 0; // Anzahl der Serveraufrufe vom Client
// Debug Informationen über console.log ausgeben
var logRequest = true;
//-----------------------------------------------------------------------------------------
// Die aktuelle EinkaufsListe wird bei jeder Änderung zur Sicherung und Wiederverwendung in
// einer Datei mit eindeutigem Dateinamen gespeichert
var logRunDate = (new Date()).toISOString();
var logEinkaufsListeFile_work = "log/logEinkaufsListe.json";
var logEinkaufsListe_save_pre = "log/logEinkaufsListe_";
fs.readFile(logEinkaufsListeFile_work, "utf-8", function (err, einkaufslisteData) {
    // Einlesen der letzten aktuellen EinkaufsListe ----------------------------------------
    if (err) {
        // Wenn die Datei nicht existiert, wird eine neue Liste angelegt
        einkaufsListe_aktuell.liste = [];
    }
    else {
        // Wenn die Datei existiert, wird eine neue Liste angelegt und es wird
        // die letze aktuelle EinkaufsListe rekonstruiert.
        var einkaufslisteDataJSON = JSON.parse(einkaufslisteData);
        for (var _i = 0, einkaufslisteDataJSON_1 = einkaufslisteDataJSON; _i < einkaufslisteDataJSON_1.length; _i++) {
            var i = einkaufslisteDataJSON_1[_i];
            // Aus dem JSON die EinkaufsListe aufbauen
            einkaufsListe_aktuell.liste.push(new EinkaufsListeEintrag(i.who, i.what, i.where, new Date(i.date), i.status));
        }
    }
    if (logRequest)
        console.log("EinkaufsListe eingelesen. Anzahl der Einträge: ", einkaufsListe_aktuell.liste.length);
});
//-----------------------------------------------------------------------------------------
// Aktivierung des Servers
var myServer = express();
var serverPort = 3000;
var serverName = programmname + " " + version;
myServer.listen(serverPort);
console.log("Der Server \"" + serverName + "\" steht auf Port ", serverPort, "bereit", "\nServerstart: ", logRunDate);
myServer.use(express.urlencoded({ extended: false })); // URLeinconded Auswertung ermöglichen
myServer.use(express.json()); // JSON Auswertung ermöglichen
//-----------------------------------------------------------------------------------------
// Mapping von Aliases auf reale Verzeichnisname im Dateisystem des Servers
// Basisverzeichnis des Webservers im Dateisystem
var rootDirectory = __dirname;
myServer.use("/styles", express.static(rootDirectory + "/styles"));
myServer.use("/script", express.static(rootDirectory + "/script"));
console.log("root directory: ", rootDirectory);
//-----------------------------------------------------------------------------------------
// Start der Website auf dem Client durch Übergabe der index.html (in meinem Fall einkaufslist.html )
myServer.get("/", function (request, response) {
    if (logRequest)
        console.log("GET /");
    response.status(200);
    response.sendFile(rootDirectory + "/html/einkaufslist.html");
});
myServer.get("/favicon.ico", function (request, response) {
    // Hier wird das Icon für die Website ausgeliefert
    if (logRequest)
        console.log("GET favicon.png");
    response.status(200);
    response.sendFile(rootDirectory + "/images/cart.png");
});
myServer.get("/version", function (request, response) {
    // Hier wird das Icon für die Website ausgeliefert
    if (logRequest)
        console.log("GET version");
    response.status(200);
    response.send(serverName);
});
//-----------------------------------------------------------------------------------------
// CREATE - Neuer Eintrag in die Einkauf
myServer.post("/create", function (request, response) {
    ++einkaufsListeRunCounter;
    //Wert vom Client aus dem JSON entnehmen
    var who_str = request.body.who;
    var who = who_str;
    var what_str = request.body.what;
    var what = what_str;
    var where_str = request.body.where;
    var where = where_str;
    var date = new Date(request.body.date);
    username = who;
    if (logRequest)
        console.log("Post /create: ", einkaufsListeRunCounter);
    einkaufsListe_aktuell.liste.push(new EinkaufsListeEintrag(who, what, where, date, 1));
    // Die aktuelle EinkaufsListe wird gesichert und in einer
    // Datei (logEinkaufsListeFile_work) gespeichert. Die Datei wird bei jeder Berechnung wieder
    // mit dem aktuellen Stand der EinkaufsListe überschrieben
    EinkaufsListeSave(einkaufsListe_aktuell, logEinkaufsListeFile_work);
    // Rendern der aktuellen EinkaufsListe und Rückgabe des gerenderten Tabellenteils(tbody)
    var html_tbody = renderEinkaufsListe(einkaufsListe_aktuell);
    response.status(200);
    response.send(html_tbody);
});
//-----------------------------------------------------------------------------------------
// READ
myServer.get("/read", function (request, response) {
    // READ - Rückgabe der vollständigen EinkaufsListe als HTML-tbody
    ++einkaufsListeRunCounter;
    var einkaufsListe_aktuellLength = einkaufsListe_aktuell.liste.length;
    if (logRequest)
        console.log("GET /read: ", einkaufsListeRunCounter, einkaufsListe_aktuellLength);
    if (einkaufsListe_aktuell == undefined) {
        response.status(404);
        response.send("Einkauf-Liste does not exist");
    }
    else {
        // Rendern der aktuellen EinkaufsListe
        var html_tbody = renderEinkaufsListe(einkaufsListe_aktuell);
        response.status(200);
        response.send(html_tbody);
    }
});
myServer.post("/read", function (request, response) {
    // READ -Rückgabe der Tabellenzeile für ändern und löschen
    ++einkaufsListeRunCounter;
    // Wert vom Client aus dem JSON entnehmen
    var id_act = Number(request.body.id_act);
    var einkaufslisteChange = einkaufsListe_aktuell.getEinkaufsListeEintrag(id_act);
    if (logRequest)
        console.log("Post /read: ", einkaufsListeRunCounter, id_act, einkaufslisteChange);
    if (einkaufsListe_aktuell === undefined || einkaufslisteChange.getStatus() !== 1) {
        response.status(404);
        response.send("Item " + id_act + " does not exist");
    }
    else {
        // Rendern der aktuellen LoP
        var html_change = renderEinkaufsListeChange(einkaufslisteChange);
        response.status(200);
        response.send(html_change);
    }
});
// change - Einkauf-Eintrag ändern
myServer.post("/change", function (request, response) {
    ++einkaufsListeRunCounter;
    var id_act = Number(request.body.id_act);
    var einkaufslisteChange = einkaufsListe_aktuell.getEinkaufsListeEintrag(id_act);
    if (logRequest)
        console.log("Post /read: ", einkaufsListe_aktuell, id_act, einkaufslisteChange);
    if (einkaufsListe_aktuell === undefined || einkaufslisteChange.getStatus() !== 1) {
        response.status(404);
        response.send("Item " + id_act + " does not exist");
    }
    else {
        // Rendern der aktuellen LoP
        var html_change = change(einkaufslisteChange);
        response.status(200);
        response.send(html_change);
    }
});
//-----------------------------------------------------------------------------------------
// UPDATE - EinkaufsListe-Eintrag ändern
myServer.post("/update", function (request, response) {
    // Werte vom Client aus dem JSON entnehmen
    ++einkaufsListeRunCounter;
    var id_act = Number(request.body.id_act);
    var who_str = request.body.who;
    var who = who_str;
    var what_str = request.body.what;
    var what = what_str;
    var where_str = request.body.where;
    var where = where_str;
    var date = new Date(request.body.date);
    if (logRequest)
        console.log("GET /update: ", einkaufsListeRunCounter, id_act);
    var einkaufslisteUpdate = einkaufsListe_aktuell.getEinkaufsListeEintrag(id_act);
    if (einkaufslisteUpdate === undefined || einkaufslisteUpdate.getStatus() !== 1) {
        response.status(404);
        response.send("Item " + id_act + " does not exist");
    }
    else {
        einkaufslisteUpdate.who = who;
        einkaufslisteUpdate.what = what;
        einkaufslisteUpdate.where = where;
        einkaufslisteUpdate.date = date;
        // Sichern der aktuellen EinkaufsListe in die Datei logEinkaufsListeFile_work
        EinkaufsListeSave(einkaufsListe_aktuell, logEinkaufsListeFile_work);
        // Rendern der aktuellen EinkaufsListe
        renderEinkaufsListe(einkaufsListe_aktuell);
        response.status(200);
        response.send("Item " + id_act + "changed");
    }
    // Rückgabe der Werte an den Client
});
//-----------------------------------------------------------------------------------------
// DELETE - LoP-Eintrag aus der Liste löschen
myServer.post("/delete", function (request, response) {
    // Wert vom Client aus dem JSON entnehmen
    ++einkaufsListeRunCounter;
    var id_act = Number(request.body.id_act);
    var einkaufslisteDelete = einkaufsListe_aktuell.getEinkaufsListeEintrag(id_act);
    if (logRequest)
        console.log("Post /delete: ", einkaufsListeRunCounter, id_act, einkaufslisteDelete);
    if (einkaufslisteDelete == undefined || einkaufslisteDelete.getStatus() !== 1) {
        response.status(404);
        response.send("Item " + id_act + " does not exist");
    }
    else {
        einkaufslisteDelete.setStatus(2);
        // Sichern der aktuellen EinkaufsListe in die Datei logEinkaufsListeFile_work
        EinkaufsListeSave(einkaufsListe_aktuell, logEinkaufsListeFile_work);
        // Rendern der aktuellen EinkaufsListe und Rückgabe des gerenderten Tabellenteils (tbody)
        // const html_tbody = renderEinkaufsListe(einkaufsListe_aktuell)
        response.status(200);
        response.send("Item " + id_act + " deleted");
    }
});
//-----------------------------------------------------------------------------------------
// SAVE - EinkaufsListe in Datei mit Datumstempel sichern
myServer.get("/save", function (request, response) {
    /* Die aktuelle EinkaufsListe wird zur Sicherung und Wiederverwendung in einer Datei
       mit eindeutigem Dateinamen mit dem aktuellen Datumsstempel gespeichert.
     */
    ++einkaufsListeRunCounter;
    if (logRequest)
        console.log("Get /save: ", einkaufsListeRunCounter);
    var logRunDate = (new Date()).toISOString();
    var logEinkaufsListe_save = logEinkaufsListe_save_pre + logRunDate + ".json";
    // Sichern der aktuellen LoP in die Datei logLoPFile_save
    EinkaufsListeSave(einkaufsListe_aktuell, logEinkaufsListe_save);
    response.status(200);
    response.send("LoP saved");
});
//-----------------------------------------------------------------------------------------
myServer.use(function (request, response) {
    // Es gibt keine reguläre Methode im Server für die Beantwortung des Requests
    ++einkaufsListeRunCounter;
    if (logRequest)
        console.log("Fehler 404", request.url);
    response.status(404);
    response.set('content-type', 'text/plain; charset=utf-8');
    var urlAnfrage = request.url;
    response.send(urlAnfrage +
        "\n\nDie gewünschte Anfrage kann vom Webserver \"" + serverName +
        "\" nicht bearbeitet werden!");
});

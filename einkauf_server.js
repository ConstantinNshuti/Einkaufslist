"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
var fs = require("fs"); // zugriff auf Dateisystem
//-----------------------------------------------------------------------------------------
//Klassen
Class;
EinkaufsEintrag;
{
    besitzer: string;
    aufgabe: string;
    datum: Date;
    ort: string;
    status: number; // 0 = nicht definiert, 1 = aktiv, 2 = deaktiviert, 3 = gelöscht
    id: number; // eindeutige und unveränderlichr id eines Eintrags
    id_max: number = 0; // größte bisher vergebene id
    statiuc;
    stack: EinkaufsEintrag[] = []; // Stack für alle erzeugten Einträge
    constructor(besitzer, string, aufgabe, string, ort, string, datum, Date, status, number);
    {
        this.id = ++EinkaufsEintrag.id_max; // Vergabe einer eindeutigen id
        this.status = status;
        this.besitzer = besitzer;
        this.aufgabe = aufgabe;
        this.datum = new Date(datum);
        EinkaufsEintrag.stack.push(this); //Der aktuelle Eintrag wird zur Sicherung auf den Stack gelegt
    }
    getID();
    number;
    {
        // Ermittlung der id des rufenden Eintrag
        return this.id;
    }
    getStatus();
    number;
    {
        // Ermittlung des Status des rufenden Eintrags
        return this.status;
    }
    setStatus(status, number);
    number;
    {
        //Stzen des Status des rufenden Eintrags
        this.status = status;
        return this.status;
    }
    getEinkaufsEintragStack();
    EinkaufsEintrag[];
    {
        //Rückgabe des vollständige Stacks mit allen Einträgen
        return EinkaufsEintrag.stack;
    }
}
var Einkaufsliste = /** @class */ (function () {
    // ein Element in diesem Stack enthalten
    function Einkaufsliste() {
        this.liste = [];
        this.stack.push(this);
    }
    Einkaufsliste.prototype.getEinkaufsEintrag = function (id) {
        var einkauf_act, undefined;
        for (var _i = 0, _a = this.liste; _i < _a.length; _i++) { // Durch die Liste Eintrag Anhand seinem id durchsuchen
            var i = _a[_i];
            if (id === i.getID()) {
                einkauf_act = i;
            }
        }
        return einkauf_act; // Wenn die Suche nicht erfolgreich ist, return undefined
    };
    Einkaufsliste.stack = []; // Stack aller EinkaufsListe( im vorliegenden Fall ist nur
    return Einkaufsliste;
}());
var LogEinkaufsListe = /** @class */ (function () {
    function LogEinkaufsListe(besitzer, aufgabe, ort, datum, status) {
        this.besitzer = besitzer;
        this.aufgabe = aufgabe;
        this.ort = ort;
        this.datum = datum;
        this.status = status;
    }
    return LogEinkaufsListe;
}());
//-----------------------------------------------------------------------------------------
// Funktion
function EinkaufsEintragSave(einkaufsliste, file) {
    //Sichern der übergebenen Einkaufsliste in die Datei mit dem Pfad file
    // Der gespeicherte JSON-String wird von der Funktion zurückgegeben
    //Aufbau des JSONs mit der Einkaufsliste als Objekt der Klasse LogEinkaufsListe
    var logEinkaufsListe;
    for (lei; i; of)
        einkaufsListe_aktuell.liste;
    {
        logEinkaufsListe.push(new LogEinkaufsListe(i.besitzer, i.aufgabe, i.datum, i.getStatus()));
    }
    // Umwandeln des Objekts ineinen JSON-String
    var logEinkaufsEintragJSON = JSON.stringify(logEinkaufsListe);
    // Schreiben des JSON-String der Daten in die Datei mit mit dem Pfadnamen "file"
    fs.writeFile(file, logEinkaufsEintragJSON, function (err) {
        if (err)
            throw err;
        if (logRequest)
            console.log("EinkaufsListe gesichert in der Datei: ", file);
    });
    return logEinkaufsEintragJSON;
}
// Globale Variable -----------------------------------------------------------------------
var programmname = "Einkaufsliste";
var version = 'V.1.001';
var username; // aktuelle Bearbeiterperson
var einkaufsListe_aktuell = new Einkaufsliste(); // Einkaufsliste anlegen
var einkaufsListeRunCounter = 0; // Anzahl der Serveraufrufe vom Client
// Debug Informationen über console.log ausgeben
var logRequest = true;
//-----------------------------------------------------------------------------------------
// Die aktuelle EinkaufsListe wird bei jeder Änderung zur Sicherung und Wiederverwendung in
// einer Datei mit eindeutigem Dateinamen gespeichert
var logRunDate = (new Date()).toISOString();
var logEinkaufsListeFile_work = "log/logEinkaufsListe.json";
var logEinkaufsListe_save_pre = "log/logEinkaufsListe_";
fs.readFile(logEinkaufsListeFile_work, "utf-8", function (err, einkaufsListeData) {
    // Einlesen der letzten aktuellen EinkaufsListe ----------------------------------------
    if (err) {
        // Wenn die Datei nicht existiert, wird eine neue Liste angelegt
        einkaufsListe_aktuell.liste = [];
    }
    else {
        // Wenn die Datei existiert, wird eine neue Liste angelegt und es wird
        // die letze aktuelle EinkaufsListe rekonstruiert.
        var lopDataJSON = JSON.parse(einkaufsListeData);
        for (var _i = 0, lopDataJSON_1 = lopDataJSON; _i < lopDataJSON_1.length; _i++) {
            var i = lopDataJSON_1[_i];
            // Aus dem JSON die EinkaufsListe aufbauen
            einkaufsListe_aktuell.liste.push(new EinkaufsEintrag(i.besitzer, i.aufgabe, new Date(i.datum), i.status));
        }
    }
    if (logRequest)
        console.log("EinkaufsListe eingelesen. Anzahl der Einträge: ", einkaufsListe_aktuell.liste.length);
});
//-----------------------------------------------------------------------------------------
// Aktivierung des Servers
var myServer = express();
var serverPort = 8080;
var serverName = programmname + " " + version;
myServer.listen(serverPort);
console.log("Der Server \"" + serverName + "\" steht auf Port ", serverPort, "bereit", "\nServerstart: ", logRunDate);
//-----------------------------------------------------------------------------------------
var express = require("express"); // require express Library wich we dawnloaded
var myServer = express(); // a Variable wich call Express function
myServer.listen(3000, function () {
    console.log("Server läuft auf 3000 Port");
});
myServer.get("/", function (request, response) {
    console.log("hallo everyoneddcd ");
    response.send("HIhi everyone sdddsdsd");
});


import * as express from "express"; // express bereitstellen

const fs = require('fs');
//-----------------------------------------------------------------------------------------

//Klassen
class EinkaufsListeEintrag {
    /* Klasse zur Abbildung eines Eintrags in der Einkaufsliste. Jeder Eintrag in der
        Einkaufsliste wird durch ein Objekt (Instanz) dieser Klasse gebildet
    */

    public who: string;
    public what: string;
    public where: string; // orte
    public date: Date;

    private status: number; // 0 = nicht definiert, 1 = aktiv, 2 = deaktiviert, 3 = gelöscht
    private readonly id: number; // eindeutige und unveränderlichr id eines Eintrags
    private static id_max: number = 0; // größte bisher vergebene id
    private static stack: EinkaufsListeEintrag[] = []; // Stack für alle erzeugten Einträge

    constructor(who: string, what: string, where: string, date: Date, status: number){
        this.id = ++ EinkaufsListeEintrag.id_max; // Vergabe einer eindeutigen id
        this.status = status;
        this.who = who;
        this.what = what;
        this.where = where;
        this.date = new Date(date);
        EinkaufsListeEintrag.stack.push(this); //Der aktuelle Eintrag wird zur Sicherung auf den Stack gelegt

    }
 getID(): number{
        // Ermittlung der id des rufenden Eintrag
        return this.id;
    }

 getStatus(): number {
        // Ermittlung des Status des rufenden Eintrags
        return this.status;
    }

 setStatus(status: number): number {
        //Setzen des Status des rufenden Eintrags
        this.status = status;
        return this.status;
    }

    static getEinkaufsEintragStack(): EinkaufsListeEintrag[] {
        //Rückgabe des vollständige Stacks mit allen Einträgen
        return EinkaufsListeEintrag.stack;

    }

}

class EinkaufsListe {
    /* Klasse zur Abbildung einer Einkaufsliste für alle Einträge.
    Die Einkaufsliste enthält eine Liste mit Einträgen von Objekten der Klasse EinkaufsEintrag.
     */
    public liste: EinkaufsListeEintrag[]; // Liste der eingetragenen Elemente
    private static stack: EinkaufsListe [] = []; // Stack aller EinkaufsListe( im vorliegenden Fall ist nur
                                                 // ein Element in diesem Stack enthalten)
    constructor() {
        this.liste = [];
        EinkaufsListe.stack.push(this);
    }

    public getEinkaufsListeEintrag(id: number): EinkaufsListeEintrag {

        let einkaufsliste_act: EinkaufsListeEintrag = undefined;
        for (let i of this.liste){ // Durch die Liste Eintrag Anhand seinem id durchsuchen
            if (id === i.getID()){
                einkaufsliste_act = i;
            }

        }
        return einkaufsliste_act; // Wenn die Suche nicht erfolgreich ist, return undefined
    }

}

class LogEinkaufsListe {
    /* Hilfsklasse für die Erzeugung eines JSONS mit den Daten eines Listeneintrags
    */
    public who: string; // who
    public what: string; // what
    public date: Date; // date
    public where: string; // ort
    public status: number;

    constructor(who: string, what: string, where: string, date: Date, status: number) {
        this.who = who;
        this.what = what;
        this.where = where;
        this.date = date;
        this.status = status;
    }

}

//-----------------------------------------------------------------------------------------
// Funktion

function EinkaufsListeSave(einkaufsListe: EinkaufsListe, file: string): string {
    //Sichern der übergebenen Einkaufsliste in die Datei mit dem Pfad file
    //Der gespeicherte JSON-String wird von der Function zurückgegeben

    const logEinkaufsListe: LogEinkaufsListe[] = [];
    for (let i of einkaufsListe_aktuell.liste){
        logEinkaufsListe.push(new LogEinkaufsListe(i.who, i.what, i.where, i.date, i.getStatus()));

    }

    // Umwandeln des Objekts in einen JSON-String
    const logEinkaufsListeJSON = JSON.stringify(logEinkaufsListe);

    // Schreiben des JSON-String der EinkaufsListe in die Datei mit dem Pfadenamen "file"

    fs.writeFile(file, logEinkaufsListeJSON, (err) =>{
        if(err) throw err;
        if (logRequest)
            console.log("Einkauf-Liste gesichert in der Datei: ", file);
    });

    return logEinkaufsListeJSON;
}

function renderEinkaufsListe(EinkaufsListe: EinkaufsListe): string{
    // Aufbereitung der aktuellen EinkaufsListe als HTML-tbody

    let html_EinkaufsListe: string = "";
    for (let i in EinkaufsListe.liste){

        // Ein Element der EinkaufsListe wird nur ausgegeben, wenn sein Status auf aktiv (1) steht
        if (EinkaufsListe.liste[i].getStatus() === 1){
            let id = EinkaufsListe.liste[i].getID();
            let who = EinkaufsListe.liste[i].who;
            let what = EinkaufsListe.liste[i].what;
            let where = EinkaufsListe.liste[i].where;
            let date = EinkaufsListe.liste[i].date;

            let date_string = date.toISOString().slice(0, 10);
            html_EinkaufsListe += "<tr class='b-dot-line' date-lop-id='" + id + "'>"

            html_EinkaufsListe += "<td class='click-value' date-purpose='who' " +
                 "data-lop-id='" + id + "'>" + who + "</td>";

            html_EinkaufsListe += "<td class='click-value as-width-100pc' data-purpose='what' " +
                "data-lop-id='" + id + "'>" + what + "</td>";

            html_EinkaufsListe += "<td class='click-value' data-purpose='wo' " +
                "data-lop-id='" + id + "'>" + where + "</td>";

            html_EinkaufsListe += "<td class='click-value' data-purpose='date'" +
                " data-lop-id='" + id + "'>" + date_string + "</td>";

            html_EinkaufsListe += "</tr>"
        }
    }
    return html_EinkaufsListe;
}

function renderEinkaufsListeChange(einkaufslisteChange: EinkaufsListeEintrag): string {
    // Aufbereitung des aktuellen Eintrags für die Änderung-/Löschausgabe in
    // der zugehörigen Tabellenzeile

    let id_act = einkaufslisteChange.getID();
    let who = einkaufslisteChange.who;
    let what = einkaufslisteChange.what;
    let date = einkaufslisteChange.date;
    let where = einkaufslisteChange.where;

    let html_Change: string = "";

    html_Change += "<td><input type='text' value='"+ who +"'></td>" +
        "<td><input class='as-width-100pc' type='text' value='" +
        what + "'>" +
        "<br>" +
        "<input type='submit' value='ändern' class='as-button-0' "+
        " data-purpose = 'aendern' data-lop-id = '"+ id_act +"'>" +
        "<input type = 'submit' value = 'zurück' class='as-button' " +
        "data-purpose = 'zurück' data-lop-id = '" + id_act + "'>" +
        "<input type = 'submit' value = 'löschen' class='as-button' " +
        "data-purpose = 'loeschen' data-lop-id = '" + id_act + "'>" +
        "</form>" +
        "</td>" +
        "<td><input type='text' value='" + where + "'></td>" +
        "<td><input type='text' value='" + date.toISOString().slice(0, 10) + "'>" +
        "</td>";

    return html_Change;
}

// Globale Variable -----------------------------------------------------------------------
let programmname: string = "Einkauf-Liste";
let version: string = 'V.1.001';
let username: string; // aktuelle Bearbeiterperson
let einkaufsListe_aktuell: EinkaufsListe = new EinkaufsListe(); // Einkaufsliste anlegen
let einkaufsListeRunCounter: number = 0; // Anzahl der Serveraufrufe vom Client

// Debug Informationen über console.log ausgeben
const logRequest: boolean = true;

//-----------------------------------------------------------------------------------------
// Die aktuelle EinkaufsListe wird bei jeder Änderung zur Sicherung und Wiederverwendung in
// einer Datei mit eindeutigem Dateinamen gespeichert
const logRunDate: string = (new Date()).toISOString();
const logEinkaufsListeFile_work: string = "log/logEinkaufsListe.json";
const logEinkaufsListe_save_pre: string = "log/logEinkaufsListe_";

fs.readFile(logEinkaufsListeFile_work, "utf-8", (err, einkaufslisteData) => {
    // Einlesen der letzten aktuellen EinkaufsListe ----------------------------------------
    if (err){
        // Wenn die Datei nicht existiert, wird eine neue Liste angelegt
        einkaufsListe_aktuell.liste = [];
    } else {
        // Wenn die Datei existiert, wird eine neue Liste angelegt und es wird
        // die letze aktuelle EinkaufsListe rekonstruiert.
        const einkaufslisteDataJSON = JSON.parse(einkaufslisteData);
        for (let i of einkaufslisteDataJSON) {
            // Aus dem JSON die EinkaufsListe aufbauen

            einkaufsListe_aktuell.liste.push(
                new EinkaufsListeEintrag(i.who, i.what, i.where, new Date(i.date), i.status));
        }

    }
    if (logRequest)
        console.log("EinkaufsListe eingelesen. Anzahl der Einträge: ", einkaufsListe_aktuell.liste.length);
});

//-----------------------------------------------------------------------------------------
// Aktivierung des Servers
const myServer = express();
const serverPort: number = 3000;
const serverName: string = programmname + " " + version;
myServer.listen(serverPort);
console.log("Der Server \"" + serverName + "\" steht auf Port ", serverPort, "bereit",
    "\nServerstart: ", logRunDate);

myServer.use(express.urlencoded({extended: false})); // URLeinconded Auswertung ermöglichen
myServer.use(express.json()); // JSON Auswertung ermöglichen

//-----------------------------------------------------------------------------------------
// Mapping von Aliases auf reale Verzeichnisname im Dateisystem des Servers

// Basisverzeichnis des Webservers im Dateisystem
let rootDirectory = __dirname;
myServer.use("/styles", express.static(rootDirectory + "/styles"));
myServer.use("/script", express.static(rootDirectory + "/script"));
console.log("root directory: ", rootDirectory);

//-----------------------------------------------------------------------------------------
// Start der Website auf dem Client durch Übergabe der index.html (in meinem Fall einkaufslist.html )

myServer.get("/", (request:express.Request, response: express.Response) =>{
   if (logRequest)
       console.log("GET /");
   response.status(200);
   response.sendFile(rootDirectory + "/html/einkaufslist.html");

});

myServer.get("/favicon.ico", (request: express.Request, response: express.Response) => {
    // Hier wird das Icon für die Website ausgeliefert
    if (logRequest)
        console.log("GET favicon.png");
    response.status(200);
    response.sendFile(rootDirectory + "/images/cart.png");
});

myServer.get("/version", (request: express.Request, response: express.Response) => {
    // Hier wird das Icon für die Website ausgeliefert
    if (logRequest)
        console.log("GET version");
    response.status(200);
    response.send(serverName);
});

//-----------------------------------------------------------------------------------------
// CREATE - Neuer Eintrag in die Einkauf
myServer.post("/create", (request: express.Request, response: express.Response) => {
   ++einkaufsListeRunCounter;

   //Wert vom Client aus dem JSON entnehmen

    const who_str: string = request.body.who;
    const who: string = who_str;

    const what_str: string = request.body.what;
    const what: string = what_str;

    const where_str: string = request.body.where;
    const where: string = where_str;
    const date: Date = new Date(request.body.date);

    username = who;

    if (logRequest)
        console.log("Post /create: ", einkaufsListeRunCounter);

    einkaufsListe_aktuell.liste.push(new EinkaufsListeEintrag(who, what,where, date, 1));

    // Die aktuelle EinkaufsListe wird gesichert und in einer
    // Datei (logEinkaufsListeFile_work) gespeichert. Die Datei wird bei jeder Berechnung wieder
    // mit dem aktuellen Stand der EinkaufsListe überschrieben

    EinkaufsListeSave(einkaufsListe_aktuell, logEinkaufsListeFile_work);

    // Rendern der aktuellen EinkaufsListe und Rückgabe des gerenderten Tabellenteils(tbody)
    const html_tbody = renderEinkaufsListe(einkaufsListe_aktuell)
    response.status(200);
    response.send(html_tbody);

});

//-----------------------------------------------------------------------------------------
// READ

myServer.get("/read", (request: express.Request, response: express.Response) => {
    // READ - Rückgabe der vollständigen EinkaufsListe als HTML-tbody
    ++einkaufsListeRunCounter;

    const einkaufsListe_aktuellLength = einkaufsListe_aktuell.liste.length;
    if (logRequest)
        console.log("GET /read: ", einkaufsListeRunCounter, einkaufsListe_aktuellLength);

    if (einkaufsListe_aktuell == undefined){
        response.status(404)
        response.send("Einkauf-Liste does not exist");
    } else {
        // Rendern der aktuellen EinkaufsListe
        const html_tbody = renderEinkaufsListe(einkaufsListe_aktuell)
        response.status(200);
        response.send(html_tbody);
    }
});

myServer.post("/read",(request: express.Request, response: express.Response) => {
    // READ -Rückgabe der Tabellenzeile für ändern und löschen
    ++einkaufsListeRunCounter;


    // Wert vom Client aus dem JSON entnehmen
    const id_act: number = Number(request.body.id_act);

    const einkaufslisteChange = einkaufsListe_aktuell.getEinkaufsListeEintrag(id_act);

    if (logRequest) console.log("Post /read: ", einkaufsListeRunCounter, id_act, einkaufslisteChange);

    if (einkaufsListe_aktuell === undefined || einkaufslisteChange.getStatus() !== 1) {
        response.status(404)
        response.send("Item " + id_act + " does not exist");

    } else {
        // Rendern der aktuellen LoP
        const html_change = renderEinkaufsListeChange(einkaufslisteChange);
        response.status(200);
        response.send(html_change);
    }

});

//-----------------------------------------------------------------------------------------
// UPDATE - EinkaufsListe-Eintrag ändern
myServer.post("/update",(request: express.Request, response: express.Response) => {
    // Werte vom Client aus dem JSON entnehmen
    ++einkaufsListeRunCounter;

    const id_act: number = Number(request.body.id_act);

    const who_str: string = request.body.who;
    const who: string = who_str;

    const what_str: string = request.body.what;
    const what: string = what_str;

    const where_str: string = request.body.where;
    const where: string = where_str;
    const date: Date = new Date(request.body.date);

    if (logRequest) console.log("GET /update: ", einkaufsListeRunCounter, id_act);

    const einkaufslisteUpdate = einkaufsListe_aktuell.getEinkaufsListeEintrag(id_act);

    if (einkaufslisteUpdate === undefined || einkaufslisteUpdate.getStatus() !== 1) {
        response.status(404)
        response.send("Item " + id_act + " does not exist");
    } else {
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
myServer.post("/delete",(request: express.Request, response: express.Response) => {
    // Wert vom Client aus dem JSON entnehmen
    ++einkaufsListeRunCounter;
    const id_act: number = Number(request.body.id_act);

    const einkaufslisteDelete =einkaufsListe_aktuell.getEinkaufsListeEintrag(id_act);

    if (logRequest) console.log("Post /delete: ", einkaufsListeRunCounter,
        id_act, einkaufslisteDelete);

    if ( einkaufslisteDelete == undefined || einkaufslisteDelete.getStatus() !== 1){
        response.status(404)
        response.send("Item " + id_act + " does not exist");
    }else {
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
myServer.get("/save", (request: express.Request, response: express.Response) => {
    /* Die aktuelle EinkaufsListe wird zur Sicherung und Wiederverwendung in einer Datei
       mit eindeutigem Dateinamen mit dem aktuellen Datumsstempel gespeichert.
     */
    ++einkaufsListeRunCounter;

    if (logRequest) console.log("Get /save: ", einkaufsListeRunCounter);

    const logRunDate: string = (new Date()).toISOString();
    const logEinkaufsListe_save: string = logEinkaufsListe_save_pre + logRunDate + ".json";

    // Sichern der aktuellen LoP in die Datei logLoPFile_save
    EinkaufsListeSave(einkaufsListe_aktuell, logEinkaufsListe_save);

    response.status(200);
    response.send("LoP saved");

});

//-----------------------------------------------------------------------------------------

myServer.use((request, response) => {
    // Es gibt keine reguläre Methode im Server für die Beantwortung des Requests
    ++einkaufsListeRunCounter;
    if (logRequest) console.log("Fehler 404", request.url);
    response.status(404);
    response.set('content-type', 'text/plain; charset=utf-8')
    const urlAnfrage: string = request.url;
    response.send(urlAnfrage +
        "\n\nDie gewünschte Anfrage kann vom Webserver \"" + serverName +
        "\" nicht bearbeitet werden!");
});


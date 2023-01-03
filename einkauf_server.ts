
import * as express from "express"; // express bereitstellen

// @ts-ignore
import * as fs from "fs"; // zugriff auf Dateisystem


//-----------------------------------------------------------------------------------------

//Klassen
Class EinkaufsEintrag {
    /* Klasse zur Abbildung eines Eintrags in der Einkaufsliste. Jeder Eintrag in der
        Einkaufsliste wird durch ein Objekt (Instanz) dieser Klasse gebildet
    */

    public besitzer: string;
    public aufgabe: string;
    public datum: Date;
    public ort: string;
    private status: number; // 0 = nicht definiert, 1 = aktiv, 2 = deaktiviert, 3 = gelöscht
    private readonly id: number; // eindeutige und unveränderlichr id eines Eintrags
    private static id_max: number = 0; // größte bisher vergebene id
    private statiuc stack: EinkaufsEintrag[] = []; // Stack für alle erzeugten Einträge

    constructor(besitzer: string, aufgabe: string, ort: string, datum: Date, status: number){
        this.id = ++ EinkaufsEintrag.id_max; // Vergabe einer eindeutigen id
        this.status = status;
        this.besitzer = besitzer;
        this.aufgabe = aufgabe;
        this.datum = new Date(datum);
        EinkaufsEintrag.stack.push(this); //Der aktuelle Eintrag wird zur Sicherung auf den Stack gelegt

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
        //Stzen des Status des rufenden Eintrags
        this.status = status;
        return this.status;
    }

    static getEinkaufsEintragStack(): EinkaufsEintrag[] {
        //Rückgabe des vollständige Stacks mit allen Einträgen
        return EinkaufsEintrag.stack;

    }

}

class Einkaufsliste {
    /* Klasse zur Abbildung einer Einkaufsliste für alle Einträge.
    Die Einkaufsliste enthält eine Liste mit Einträgen von Objekten der Klasse EinkaufsEintrag.
     */
    public liste: EinkaufsEintrag[]; // Liste der eingetragenen Elemente
    private static stack: Einkaufsliste [] = []; // Stack aller EinkaufsListe( im vorliegenden Fall ist nur
                                                 // ein Element in diesem Stack enthalten
    constructor() {
        this.liste = [];
        this.stack.push(this);
    }

    public getEinkaufsEintrag(id: number): EinkaufsEintrag {

        let einkauf_act: EinkaufsEintrag: undefined;
        for (let i of this.liste){ // Durch die Liste Eintrag Anhand seinem id durchsuchen
            if (id === i.getID()){
                einkauf_act = i;
            }

        }
        return einkauf_act; // Wenn die Suche nicht erfolgreich ist, return undefined
    }

}

class LogEinkaufsListe {
    /* Hilfsklasse für die Erzeugung eines JSONS mit den Daten eines Listeneintrags
    */
    public besitzer: string;
    public aufgabe: string;
    public datum: Date;
    public ort: string;
    public status: number;

    constructor(besitzer: string, aufgabe: string, ort: string, datum: Date, status: number) {
        this.besitzer = besitzer;
        this.aufgabe = aufgabe;
        this.ort = ort;
        this.datum = datum;
        this.status = status;
    }

}

//-----------------------------------------------------------------------------------------
// Funktion

function EinkaufsEintragSave(einkaufsliste: Einkaufsliste, file: string): string{
    //Sichern der übergebenen Einkaufsliste in die Datei mit dem Pfad file
    // Der gespeicherte JSON-String wird von der Funktion zurückgegeben

    //Aufbau des JSONs mit der Einkaufsliste als Objekt der Klasse LogEinkaufsListe
     const logEinkaufsListe: LogEinkaufsListe[];
     for (lei i of einkaufsListe_aktuell.liste){
         logEinkaufsListe.push(new LogEinkaufsListe(i.besitzer, i.aufgabe, i.datum, i.getStatus()));
    }

     // Umwandeln des Objekts ineinen JSON-String
    const logEinkaufsEintragJSON = JSON.stringify(logEinkaufsListe);

     // Schreiben des JSON-String der Daten in die Datei mit mit dem Pfadnamen "file"
    fs.writeFile(file, logEinkaufsEintragJSON, (err) =>{
        if (err) throw err;
        if (logRequest)
            console.log("EinkaufsListe gesichert in der Datei: ", file);
    });
    return logEinkaufsEintragJSON;
}

// Globale Variable -----------------------------------------------------------------------
let programmname: string = "Einkaufsliste";
let version: string = 'V.1.001';
let username: string; // aktuelle Bearbeiterperson
let einkaufsListe_aktuell: Einkaufsliste = new Einkaufsliste(); // Einkaufsliste anlegen
let einkaufsListeRunCounter: number = 0; // Anzahl der Serveraufrufe vom Client

// Debug Informationen über console.log ausgeben
const logRequest: boolean = true;

//-----------------------------------------------------------------------------------------
// Die aktuelle EinkaufsListe wird bei jeder Änderung zur Sicherung und Wiederverwendung in
// einer Datei mit eindeutigem Dateinamen gespeichert
const logRunDate: string = (new Date()).toISOString();
const logEinkaufsListeFile_work: string = "log/logEinkaufsListe.json";
const logEinkaufsListe_save_pre: string = "log/logEinkaufsListe_";

fs.readFile(logEinkaufsListeFile_work, "utf-8", (err, einkaufsListeData) => {
    // Einlesen der letzten aktuellen EinkaufsListe ----------------------------------------
    if (err){
        // Wenn die Datei nicht existiert, wird eine neue Liste angelegt
        einkaufsListe_aktuell.liste = [];
    } else {
        // Wenn die Datei existiert, wird eine neue Liste angelegt und es wird
        // die letze aktuelle EinkaufsListe rekonstruiert.
        const lopDataJSON = JSON.parse(einkaufsListeData);
        for (let i of lopDataJSON) {
            // Aus dem JSON die EinkaufsListe aufbauen

            einkaufsListe_aktuell.liste.push(
                new EinkaufsEintrag(i.besitzer, i.aufgabe, new Date(i.datum), i.status));
        }

    }
    if (logRequest)
        console.log("EinkaufsListe eingelesen. Anzahl der Einträge: ", einkaufsListe_aktuell.liste.length);
});

//-----------------------------------------------------------------------------------------
// Aktivierung des Servers
const myServer = express();
const serverPort: number = 8080;
const serverName: string = programmname + " " + version;
myServer.listen(serverPort);
console.log("Der Server \"" + serverName + "\" steht auf Port ", serverPort, "bereit",
    "\nServerstart: ", logRunDate);


//-----------------------------------------------------------------------------------------


const express = require("express");// require express Library wich we dawnloaded

const myServer = express();// a Variable wich call Express function


myServer.listen(3000, function()  { // to make our server run on the port 3000
    console.log("Server läuft auf 3000 Port");
});

myServer.get("/", (request: express.Request, response: express.Response) =>  {
    console.log("hallo everyoneddcd ")
    response.send("HIhi everyone sdddsdsd")
})
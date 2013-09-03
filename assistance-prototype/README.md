# TODO


* Datenannotationen, geht halt erst mit API
* Backend: Alle Methoden (außer POST an /comment) brauchen jetzt HTTP Auth!
* Voten: CommentBackend muss alle Votes für ein Kommentar raussuchen, CommentConverter muss alles ordentlich konvertieren können. Format:

{
	comment_id: <id>,
	...
	voted: 1/0/-1
}

* Annotationen mit SVG? Warum eigentlich nicht? --> weils die templates zerschiesst, aber die vorteile sind immens: clipPaths und masks!
* Kann ich die ganzen show()s und hide()s Funktionen irgendwo zusammenfassen? Sieht nisch so dolle aus, nor.
* Kommunikationsview
* in-text referenzierung von anderen kommentaren
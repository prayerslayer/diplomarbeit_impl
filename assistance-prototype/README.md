# TODO

* URLs von Collections und Models einfügen, sodass ich einfach sync()en kann
* aufpassen mit PanelCollection, die muss nämlich SOAP nachrichten rumschicken.

* Annotationen mit SVG? Warum eigentlich nicht? --> weils die templates zerschiesst, aber die vorteile sind immens: clipPaths und masks!
* Kann ich die ganzen show()s und hide()s Funktionen irgendwo zusammenfassen? Sieht nisch so dolle aus, nor.
* Annotationen in Kommentaren
	* CommentView als CollectionView umschreiben
	* Collection = Annotationen
	* Für jede Annotation einen AnnotationView
	* Dann bei Bedarf die Collection rendern
	* ReadCommentsView muss auf event von Kommentaren hören, sodass er koordinieren/Badges verstecken kann
* (Reply)
* Kommunikationsview
* Kommentar Badges sind immer links oben in der Bounding Box des Elements (weil position() nicht gut klappt). Das ist besonders bei Rotationen oder so blöd.
* Show annotations ausgrauen wenn keine annotationen vorhanden (gibts ja auch)
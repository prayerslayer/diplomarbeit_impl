# TODO

* Bounding Box für Hit Test nehmen, width und height sind nicht überall definiert!
* Im WriteCommentView eine Liste bauen, die vorhandene Annotationen zeigt. Mit der kann dann auch gelöscht werden.
* Annotationen mit SVG? Warum eigentlich nicht? --> weils die templates zerschiesst, aber die vorteile sind immens: clipPaths und masks!
* Kann ich die ganzen show()s und hide()s Funktionen irgendwo zusammenfassen? Sieht nisch so dolle aus, nor.
* Annotationen in Kommentaren
	* CommentView als CollectionView umschreiben
	* Collection = Annotationen
	* Für jede Annotation einen AnnotationView
	* Dann bei Bedarf die Collection rendern
	* ReadCommentsView muss auf event von Kommentaren hören, sodass er koordinieren/Badges verstecken kann
* (Reply)
* Kommentar schreiben
	* --> Kommentar ändern in Backend!
* Kommunikationsview
* Kommentar Badges sind immer links oben in der Bounding Box des Elements (weil position() nicht gut klappt). Das ist besonders bei Rotationen oder so blöd.
* Show annotations ausgrauen wenn keine annotationen vorhanden (gibts ja auch)
# TODO


* Die ganzen Annotations müssen sich in den Visualization Root rendern und nicht in die Komponente. Wobei bei Area Based Dingern nix dagegen sprechen würde, an sich. Außerdem: Maße!!
* Annotationen mit SVG? Warum eigentlich nicht? --> weils die templates zerschiesst, aber die vorteile sind immens: clipPaths!
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
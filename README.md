# IM3_Leistungsnachweis
 
 Kurzbeschreibung des Projekts

Auf unserer Webseite ermöglichen wir es den Nutzern, spielerisch durch die Datenbank der zuletzt gespielten Lieder auf SRF 3 zu navigieren. Dabei beantwortet der User drei aufeinander aufbauende Multiple-Choice-Fragen. Die Antwortmöglichkeiten setzen sich jeweils aus den Top 4 der Datenbank zusammen. Die Antworten werden direkt im Anschluss mit einem dynamischen Balkendiagramm visualisiert. Am Ende erhält der User ein Gesamtergebnis, das in Form von erreichten CDs präsentiert wird. Der Start der Datenerfassung beginnt am 8. Oktober 2024. Stündlich werden die neuesten Daten aus der SRF 3 API abgerufen und in unserer Datenbank gespeichert. Dadurch können sich die Antwortmöglichkeiten kontinuierlich ändern.
 

 Learnings 

Wir haben gelernt, wie einfach es ist, APIs von öffentlich zugänglichen Webseiten zu generieren. Dies lässt sich über das "Untersuchen"-Tool und den Reiter "Netzwerk" im Browser ermitteln. Dort wird nach der passenden Datei gesucht. Ob es sich um die richtige Datei handelt, lässt sich überprüfen, indem die URL aus dem Header kopiert und überprüft wird, ob sie die gewünschten Daten enthält. Ist dies der Fall, kann die API verwendet werden.
 
Erst spät bemerkten wir, dass unsere gesammelten Daten nicht ausreichten, um alle vorgesehenen Fragen zu beantworten. Dies zwang uns dazu, die Fragen entsprechend anzupassen. Beim nächsten Mal werden wir daher zunächst alle Szenarien durchgehen und die Machbarkeit mit der API überprüfen. Sollte es zu einem Missmatch kommen, würden wir entweder auf eine andere API ausweichen oder unsere Fragen erneut an die verfügbaren Daten anpassen.
    
Ursprünglich hatten wir die Idee, für jede Frage eine separate Unterseite im HTML zu erstellen. Als wir diese Idee mit Lea besprachen, gab sie uns den Tipp, die Inhalte generisch mit JavaScript im HTML erstellen zu lassen. Dadurch entfiel die aufwendige Arbeit mit mehreren HTML-Dateien. Dieses Vorgehen war zwar sehr nützlich, machte jedoch auf der anderen Seite den Code zunächst etwas schwerer verständlich und unübersichtlicher, da HTML und JavaScript enger miteinander verschmolzen.
    
 
 Schwierigkeiten
 
Zu Beginn hatten wir die Idee, die drei Radiosender der SRG – SRF 3, Couleur 3 und RSI 3 – miteinander zu vergleichen. Wir wollten beispielsweise herausfinden, ob auf Couleur 3 im Durchschnitt mehr französische Künstler gespielt werden als auf den beiden anderen Sendern. Dabei stiessen wir jedoch auf zwei Probleme. Zum einen konnten wir, trotz intensiver Internetrecherche, keine API für die Playlist von Couleur 3 finden. Zum anderen stellten wir beim Vergleich der Daten von SRF und RSI fest, dass diese unterschiedliche Informationen liefern und somit nur schwer vergleichbar sind. Da uns die deutsche Sprache am vertrautesten ist, haben wir uns entschieden, mit der API von SRF 3 zu arbeiten.
    
Da wir über die API auf die Daten des gesamten Tages zugriffen und diese stündlich neu speicherten, entstanden unzählige Duplikate in unserer Datenbank. Mithilfe einer Funktion im ETL-File konnten wir die Daten auf Duplikate prüfen und nur die neuen Datensätze in unsere Datenbank übernehmen.
 
Nachrichten konnten keinem Künstler zugeordnet werden und standen daher immer auf Platz 1 der Künstlerliste. Dieses Problem konnten wir lösen, indem wir den SQL-Code für die erste Frage mit WHERE artist <> "" ergänzten. Dadurch stellten wir sicher, dass nur die Datensätze ausgelesen werden, bei denen das Feld „artist“ nicht leer ist.
    
Um die Top 4 Antworten aus der Datenbank auszulesen und als Antwortmöglichkeiten anzubieten, haben wir die Daten gruppiert und absteigend sortiert. Das führte jedoch dazu, dass die erste Antwortmöglichkeit immer die richtige war. Dieses Problem konnten wir mit der Funktion Math.random() im JavaScript lösen. Dadurch werden die Antwortmöglichkeiten bei jedem Spielstart zufällig neu angeordnet.
    
Die Künstlernamen in der API waren nicht einheitlich formatiert, was dazu führte, dass auch in unserem Spiel die Künstlernamen uneinheitlich dargestellt wurden. So gab es zum Beispiel Künstler, deren Namen ausschliesslich in Grossbuchstaben angezeigt wurden. Dies empfanden wir nicht nur optisch als unschön, sondern es erweckte auch den Eindruck, dass unser eigenes Spiel uns anschreit. Zudem schien es, als würden diese Antwortmöglichkeiten anders gewichtet. Deshalb suchten wir nach einer Lösung und fanden sie in folgendem Code: ucwords(strtolower($name)). Diesen Code verpackten wir noch schön in eine Funktion.
    
Obwohl das Hintergrundbild korrekt im CSS eingebunden war, wurde es auf dem Server nicht angezeigt. Nachdem wir den Code mehrmals überprüft hatten und schon an unseren eigenen Fähigkeiten zweifelten, erhielten wir den Tipp, die Bilder direkt über einen Rechtsklick im Visual Studio Code auf den Server hochzuladen.
    
Manchmal kam es vor (leider häufiger als gewünscht), dass unsere Daten nicht korrekt auf den Server geladen wurden. Um zu überprüfen, ob das Problem an der Verknüpfung lag oder unsere Code-Änderungen tatsächlich nicht funktionierten, haben wir testweise ein Element im CSS auffällig eingefärbt. Wenn diese Änderung nicht übernommen wurde, wussten wir, dass das Problem woanders lag. In 90 % der Fälle konnten wir das Problem lösen, indem wir die Cookies in unserem Browser löschten.
    
Um dem Nutzer zu zeigen, was ihn bei unserem Spiel erwartet, wollten wir ursprünglich eine Progress-Bar einfügen. Diese sollte jedoch nur der Information und Orientierung dienen und nicht wirklich funktional sein. Der Grund dafür war, dass es nicht vorgesehen ist, dass der User die gleiche Frage erneut beantworten kann, um sein Endergebnis zu verbessern. Eine funktionelle Progress-Bar wäre erst dann sinnvoll gewesen, wenn die Fragen erst am Ende ausgewertet würden. In diesem Fall hätte der User die Möglichkeit gehabt, seine Antworten vor der finalen Auswertung zu überdenken. Da unsere Fragen jedoch aufeinander aufbauen, ergab dies in unserem Fall keinen Sinn. Zunächst hatten wir das Problem, dass nach jeder Frage eine weitere Progress-Bar hinzugefügt wurde, sodass wir am Ende bei der letzten Frage drei Progress-Bars hatten. Ausserdem wurde die Progress-Bar erst bei der Auswertung angezeigt und nicht bereits während der jeweiligen Frage. Dies hing damit zusammen, dass wir die Progress-Bar ausserhalb des Fragecontainers darstellen wollten. Leider konnten wir nur das Problem der mehrfachen Progress-Bars lösen, nicht jedoch das Problem der verzögerten Anzeige. Aus diesem Grund haben wir uns, abweichend vom ursprünglichen Figma-Design, dazu entschieden, auf die Progress-Bar ganz zu verzichten.
 

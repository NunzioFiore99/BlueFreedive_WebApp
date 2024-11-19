# BlueFreedive_WebApp
WebApp (frontend) scritta in React per il progetto "BlueFreedive"

Come avviare applicativo frontend in locale:

1) Aprire terminale
2) Entrare nella cartella "app"
3) Eseguire il seguente comando per installare i node modules necessari "npm install"
4) Eseguire il seguente comando per avviare il server in locale "npm run start-server"
5) Il server è disponibile al seguente indirizzo "http://localhost:3000"

Il server utilizza valori inseriti nel file ".env".

DOCKER

Il server è possibile anche avviarlo utilizzando Docker ed avviando un container.
Per sfruttare Docker bisogna seguire i seguenti passaggi:

1) Aprire terminale
2) Entrare nella cartella "app"
3) Eseguire il comando per la build dell'immagine Docker "docker build -t blue-freedive-webapp ."
4) Eseguire il comanda per avviare il container con l'immagine Docker appena creata "docker run -p 3000:3000 blue-freedive-webapp"
5) Il server è raggiungibile all'indirizzo "http://localhost:3000"
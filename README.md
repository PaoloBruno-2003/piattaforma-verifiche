# Piattaforma per verifiche e registro voti

Piattaforma web per verifiche a risposta multipla: lo studente accede, svolge la verifica, riceve il voto per email e lo ritrova nel registro.

Progetto scolastico · I.I.S. G. Vallauri, Fossano · 2023 · individuale

## Funzionalità
- Accesso con token JWT
- Verifiche a risposta multipla per materia, con correzione e voto automatici
- Invio del voto allo studente via email
- Registro con lo storico dei voti

## Tecnologie
Node.js · Express · MongoDB · Nodemailer · Bootstrap · jQuery

## Come avviarlo
1. Avvia MongoDB in locale e importa i file della cartella `DB` nel database `test`.
2. Genera chiave e certificato per HTTPS nella cartella `keys`:
   ```
   mkdir keys
   openssl req -x509 -newkey rsa:2048 -nodes -keyout keys/privateKey.pem -out keys/certificate.crt -days 365 -subj "/CN=localhost"
   cp keys/privateKey.pem keys/private.key
   ```
3. Imposta l'account Gmail che invia i voti nelle variabili d'ambiente `MAIL_USER` e `MAIL_PASSWORD`.
4. Esegui `npm install` e poi `node server.js`.
5. Apri `https://localhost:8888`.

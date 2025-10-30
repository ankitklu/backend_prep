## Agenda
* Golden principles of Security
* Backend Security
    * How to store Password
    * How to limit access to users (rate limiting)
    * DB Attacks
    * revealing least amount of info
* Frontend Security
    * cross side scripting
* Common problem : saving sensitive info leak

### Priniciples
* `Zero Trust Model`: 
    * assume that no one (neither inside not outside the network) is trustworthy. This means always verifying the authenticity of users, serices, and systems before granting access to resources.
    * Example: 
        * sanitzie input
        * Authentication : protectRoute Middleware
        * Sanitize input -> express-mongo-sanitize -> Backend Part
        * password hashing
        * hide sensitive data




* `Principle of least privilege`: "Minimal Access for Maximum Security"
Ex: `authorization` (Role based access control)


* `Reduce Attack Surface` : 
    * Rate Limiting -> Limit the access coming from same IP : regulate amounf od access by user/ip address
    * Network limiting : DB


Ex: setting headers ot minimize amount of info about your server to be leaked


## Backend
* Your own service -> data compromise
* protect route like middleware for preventing unauthorized access
* sanitize your incoming request that may contain malicious queries
* Hiding all the sensitive info
    * token should not be revealed -> .env
    * hiding data 



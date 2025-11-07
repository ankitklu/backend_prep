Urban Company - simple Java in-memory demo

Files added under `src/com/urbancompany`:

- model: POJOs (Service, Payment, Order, User, Company) and enums
- service: ServiceManager, OrderManager, PaymentService
- Main.java: small demo that creates services, places an order, processes payment, and lists orders

To compile and run (if you have Java installed):

# Compile (PowerShell)
$files = (Get-ChildItem -Path . -Recurse -Filter *.java | ForEach-Object { $_.FullName }) ; javac -d out $files

# Run
java -cp out com.urbancompany.Main

# Strategy Design Pattern
- Strategy pattern allows you to define a family of algorithms (behaviors), encapsulate each one, and make them interchangeable at runtime.

## Why is it called Strategy Design Patterm ?
- The name "Strategy" comes from the idea of using different strategies to solve the same problem.
- Each strategy encapuslates a different way to process data
- We can switch between strategies dynamically based on:
    - User input
    - System Requirement
- This makes the system more flexible & easier to extend

## Real Life Scenario: Payment Processing in E-Commerce
Imagine youre builfin an e-commerce platform where usrs can pay uisng multiple methids:
- credit card
- PayPal
- Crypto

# Problem
Why is Strategy Pattern used?
1. Avoids if-else or switch

Without Strategy, you end up writing:

```java
if(method.equals("credit")){
   // credit payment logic
} else if(method.equals("upi")) {
   // upi logic
} else if(method.equals("paypal")) {
   // paypal logic
}
```

This becomes worse as methods increase → violates Open–Closed Principle (OCP).
Strategy moves each logic into a separate class.


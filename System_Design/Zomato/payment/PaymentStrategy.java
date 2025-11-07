package Zomato.payment;

public interface PaymentStrategy {
    boolean pay(double amount);
}

package Zomato.payment;

public class UPIPayment implements PaymentStrategy {
    private String vpa;

    public UPIPayment(String vpa) {
        this.vpa = vpa;
    }

    @Override
    public boolean pay(double amount) {
        // In real life, we'd integrate with a payments SDK. Here we simulate success.
        System.out.println("Charging " + amount + " using UPI (" + vpa + ")");
        return true;
    }
}

package urbancompany.src.com.urbancompany.model;

import java.util.UUID;

public class Payment {
    private final String id;
    private final String userId;
    private final double amount;
    private final PaymentMethod method;
    private final String reason;
    private final double discount;

    public Payment(String userId, double amount, PaymentMethod method, String reason, double discount) {
        this.id = UUID.randomUUID().toString();
        this.userId = userId;
        this.amount = amount;
        this.method = method;
        this.reason = reason;
        this.discount = discount;
    }

    public String getId() {
        return id;
    }

    public String getUserId() {
        return userId;
    }

    public double getAmount() {
        return amount;
    }

    public PaymentMethod getMethod() {
        return method;
    }

    public String getReason() {
        return reason;
    }

    public double getDiscount() {
        return discount;
    }

    @Override
    public String toString() {
        return "Payment{" +
                "id='" + id + '\'' +
                ", userId='" + userId + '\'' +
                ", amount=" + amount +
                ", method=" + method +
                ", discount=" + discount +
                '}';
    }
}

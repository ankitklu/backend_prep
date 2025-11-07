package urbancompany.src.com.urbancompany.service;

import com.urbancompany.model.Payment;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class PaymentService {
    private final Map<String, Payment> payments = new ConcurrentHashMap<>();

    // Simulate payment processing and store the payment record
    public boolean processPayment(Payment payment) {
        // In a real system we'd call gateway APIs and handle errors.
        payments.put(payment.getId(), payment);
        return true; // simulate success
    }

    public Payment getPayment(String id) {
        return payments.get(id);
    }
}

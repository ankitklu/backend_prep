package urbancompany.src.com.urbancompany;

import com.urbancompany.model.*;
import com.urbancompany.service.*;

import java.time.LocalDateTime;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        ServiceManager serviceManager = new ServiceManager();
        OrderManager orderManager = new OrderManager();
        PaymentService paymentService = new PaymentService();

        // Create sample company and user
        Company company = new Company("comp-1", "Urban Cleaners");
        User user = new User("user-1", "Alice");

        // Company adds services
        Service s1 = new Service("svc-1", "AC Service", "Complete AC service", 1200.0, 2);
        Service s2 = new Service("svc-2", "House Cleaning", "Regular home cleaning", 800.0, 3);
        serviceManager.addService(s1);
        serviceManager.addService(s2);

        System.out.println("Available services:");
        for (Service s : serviceManager.listAllServices()) {
            System.out.println("  " + s);
        }

        // User creates an order
        Order order = new Order(user.getId(), company.getId(), s1.getId(), LocalDateTime.now().plusDays(2));
        orderManager.createOrder(order);
        System.out.println("Created order: " + order);

        // Process payment
        Payment payment = new Payment(user.getId(), s1.getPrice(), PaymentMethod.UPI, "Service payment", 0.0);
        boolean paid = paymentService.processPayment(payment);
        if (paid) {
            order.setPaymentId(payment.getId());
            orderManager.scheduleOrder(order.getId());
            System.out.println("Payment processed and order scheduled: " + order);
        }

        // List user's orders
        List<Order> myOrders = orderManager.getOrdersByUser(user.getId());
        System.out.println("Orders for user " + user.getName() + ":");
        for (Order o : myOrders) {
            System.out.println("  " + o);
        }
    }
}

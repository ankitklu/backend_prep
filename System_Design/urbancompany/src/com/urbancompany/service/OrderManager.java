package urbancompany.src.com.urbancompany.service;

import com.urbancompany.model.Order;
import com.urbancompany.model.OrderStatus;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

public class OrderManager {
    private final Map<String, Order> orders = new ConcurrentHashMap<>();

    public Order createOrder(Order order) {
        orders.put(order.getId(), order);
        return order;
    }

    public Optional<Order> getOrderById(String id) {
        return Optional.ofNullable(orders.get(id));
    }

    public List<Order> getOrdersByUser(String userId) {
        List<Order> result = new ArrayList<>();
        for (Order o : orders.values()) {
            if (o.getUserId().equals(userId)) {
                result.add(o);
            }
        }
        return result;
    }

    public boolean scheduleOrder(String orderId) {
        Order o = orders.get(orderId);
        if (o == null)
            return false;
        o.setStatus(OrderStatus.SCHEDULED);
        return true;
    }

    public boolean completeOrder(String orderId) {
        Order o = orders.get(orderId);
        if (o == null)
            return false;
        o.setStatus(OrderStatus.COMPLETED);
        return true;
    }
}

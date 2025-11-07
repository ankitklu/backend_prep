package Zomato.managers;

import Zomato.models.Order;

import java.util.ArrayList;
import java.util.List;

public class OrderManager {
    private List<Order> orders;
    private static volatile OrderManager instance;

    private OrderManager() {
        this.orders = new ArrayList<>();
    }

    public static OrderManager getInstance() {
        if (instance == null) {
            synchronized (OrderManager.class) {
                if (instance == null) {
                    instance = new OrderManager();
                }
            }
        }
        return instance;
    }

    public void addOrder(Order order) {
        orders.add(order);
    }

    public List<Order> getAllOrders() {
        return orders;
    }

    public List<Order> getOrdersByUserId(int userId) {
        List<Order> result = new ArrayList<>();
        for (Order o : orders) {
            if (o.getUser() != null && o.getUser().getId() == userId) {
                result.add(o);
            }
        }
        return result;
    }
}

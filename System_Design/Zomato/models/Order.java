package Zomato.models;

import java.util.ArrayList;
import java.util.List;
import Zomato.payment.PaymentStrategy;

public abstract class Order {
    protected static int nextOrderId;
    protected int orderId;
    protected User user;
    protected Restaurant restaurant;
    protected List<MenuItem> items;
    protected PaymentStrategy paymentStrategy;
    protected double total;
    protected String scheduledAt; 

    public Order() {
        this.orderId = ++nextOrderId;
        this.items = new ArrayList<>();
        this.total = 0.0;
    }

    public Order(User user, Restaurant restaurant, List<MenuItem> items, PaymentStrategy paymentStrategy,
            String scheduledAt) {
        this.orderId = ++nextOrderId;
        this.user = user;
        this.restaurant = restaurant;
        this.items = items != null ? items : new ArrayList<>();
        this.paymentStrategy = paymentStrategy;
        this.scheduledAt = scheduledAt;
        this.total = calculateTotal();
    }

    public abstract String getType();

    public double calculateTotal() {
        double sum = 0.0;
        for (MenuItem item : items) {
            sum += item.getPrice();
        }
        return sum;
    }

    public int getOrderId() {
        return orderId;
    }

    public User getUser() {
        return user;
    }

    public Restaurant getRestaurant() {
        return restaurant;
    }

    public List<MenuItem> getItems() {
        return items;
    }

    public PaymentStrategy getPaymentStrategy() {
        return paymentStrategy;
    }

    public double getTotal() {
        return total;
    }

    @Override
    public String toString() {
        return "Order{" +
                "orderId=" + orderId +
                ", type=" + getType() +
                ", user=" + user +
                ", restaurant=" + restaurant +
                ", items=" + items +
                ", total=" + total +
                '}';
    }
}

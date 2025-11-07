package Zomato.models;

import java.util.List;
import Zomato.payment.PaymentStrategy;

public class DeliveryOrder extends Order {
    private String deliveryAddress;

    public DeliveryOrder(User user, Restaurant restaurant, List<MenuItem> items, PaymentStrategy ps,
            String deliveryAddress, String scheduledAt) {
        super(user, restaurant, items, ps, scheduledAt);
        this.deliveryAddress = deliveryAddress;
    }

    public String getDeliveryAddress() {
        return deliveryAddress;
    }

    public void setDeliveryAddress(String deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }

    @Override
    public String getType() {
        return "DELIVERY";
    }
}

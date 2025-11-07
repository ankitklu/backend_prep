package Zomato.models;

import java.util.List;
import Zomato.payment.PaymentStrategy;

public class PickupOrder extends Order {
    private String pickupTime; // optional

    public PickupOrder(User user, Restaurant restaurant, List<MenuItem> items, PaymentStrategy ps, String pickupTime,
            String scheduledAt) {
        super(user, restaurant, items, ps, scheduledAt);
        this.pickupTime = pickupTime;
    }

    public String getPickupTime() {
        return pickupTime;
    }

    public void setPickupTime(String pickupTime) {
        this.pickupTime = pickupTime;
    }

    @Override
    public String getType() {
        return "PICKUP";
    }
}

package Zomato.factories;

import Zomato.models.*;
import Zomato.payment.PaymentStrategy;

import java.util.List;

public class NowOrderFactory implements OrderFactory {
    @Override
    public Order createOrder(OrderType type, Object... params) {
        // params expected: User user, Restaurant restaurant, List<MenuItem> items,
        // PaymentStrategy ps, String addressOrTime
        User user = (User) params[0];
        Restaurant restaurant = (Restaurant) params[1];
        @SuppressWarnings("unchecked")
        List<MenuItem> items = (List<MenuItem>) params[2];
        PaymentStrategy ps = (PaymentStrategy) params[3];
        String extra = params.length > 4 && params[4] != null ? params[4].toString() : null;

        switch (type) {
            case DELIVERY:
                return new DeliveryOrder(user, restaurant, items, ps, extra, null);
            case PICKUP:
                return new PickupOrder(user, restaurant, items, ps, extra, null);
            default:
                throw new IllegalArgumentException("Unknown order type: " + type);
        }
    }
}

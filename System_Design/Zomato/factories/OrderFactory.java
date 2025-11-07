package Zomato.factories;

import Zomato.models.Order;

public interface OrderFactory {
    Order createOrder(OrderType type, Object... params);
}

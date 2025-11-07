package Zomato.models;

import java.util.ArrayList;
import java.util.List;

public class Cart {
    private List<MenuItem> items;
    private Restaurant restaurant;

    public Cart() {
        this.items = new ArrayList<>();
        this.restaurant = null;
    }

    public void setRestaurant(Restaurant restaurant) {
        this.restaurant = restaurant;
    }

    public Restaurant getRestaurant() {
        return restaurant;
    }

    public void addItem(MenuItem item) {
        if (restaurant == null) {
            System.out.println("Set a restaurant before adding items.");
            return;
        }
        items.add(item);
    }

    public void removeItem(MenuItem item) {
        items.remove(item);
    }

    public List<MenuItem> getItems() {
        return items;
    }

    public int getTotalPrice() {
        int total = 0;
        for (MenuItem item : items) {
            total += item.getPrice();
        }
        return total;
    }

    public void clearCart() {
        items.clear();
        restaurant = null;
    }

    public boolean isEmpty() {
        return items.isEmpty();
    }
}

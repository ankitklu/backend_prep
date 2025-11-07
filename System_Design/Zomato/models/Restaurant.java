package Zomato.models;

import java.util.List;

public class Restaurant {
    private static int nextRestaurantId;
    private int restaurantId;
    private String name;
    private String location;
    private List<MenuItem> menu;

    public Restaurant(String name, String location) {
        this.name = name;
        this.location = location;
        this.restaurantId = ++nextRestaurantId;
    }

    // getter and setter methods
    public int getRestaurantId() {
        return restaurantId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public List<MenuItem> getMenu() {
        return menu;
    }

    public void setMenu(List<MenuItem> menu) {
        this.menu = menu;
    }

    @Override
    public String toString() {
        return "Restaurant{" +
                "restaurantId=" + restaurantId +
                ", name='" + name + '\'' +
                ", location='" + location + '\'' +
                ", menu=" + menu +
                '}';
    }

}

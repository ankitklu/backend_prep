package Zomato.managers;

import java.util.List;

import Zomato.models.Restaurant;

import java.util.ArrayList;

public class RestaurantManager {
    private List<Restaurant> restaurants;
    private static volatile RestaurantManager instance;

    private RestaurantManager() {
        this.restaurants = new ArrayList<>();
    }

    public static RestaurantManager getInstance() {
        if (instance == null) {
            synchronized (RestaurantManager.class) {
                if (instance == null) {
                    instance = new RestaurantManager();
                }
            }
        }
        return instance;
    }

    public void addRestaurant(Restaurant restaurant) {
        restaurants.add(restaurant);
    }
    public List<Restaurant> getAllRestaurants() {
        return restaurants;
    }
    public List<Restaurant> findRestaurantsByLocation(String location) {
        List<Restaurant> result = new ArrayList<>();
        for (Restaurant restaurant : restaurants) {
            if (restaurant.getLocation().equalsIgnoreCase(location)) {
                result.add(restaurant);
            }
        }
        return result;
    }
}

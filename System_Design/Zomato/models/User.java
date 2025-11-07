package Zomato.models;

public class User {
    private static int nextUserId = 0;
    private int id;
    private String name;
    private String address;
    private Cart cart;

    public User(String name, String address) {
        this.id = ++nextUserId;
        this.name = name;
        this.address = address;
        this.cart = new Cart();
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Cart getCart() {
        return cart;
    }

    public void setCart(Cart cart) {
        this.cart = cart;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", address='" + address + '\'' +
                '}';
    }
}

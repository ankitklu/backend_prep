package urbancompany.src.com.urbancompany.model;

public class Service {
    private final String id;
    private final String title;
    private final String description;
    private final double price;
    private final int expectedHours;

    public Service(String id, String title, String description, double price, int expectedHours) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.expectedHours = expectedHours;
    }

    public String getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public double getPrice() {
        return price;
    }

    public int getExpectedHours() {
        return expectedHours;
    }

    @Override
    public String toString() {
        return "Service{" +
                "id='" + id + '\'' +
                ", title='" + title + '\'' +
                ", price=" + price +
                ", expectedHours=" + expectedHours +
                '}';
    }
}

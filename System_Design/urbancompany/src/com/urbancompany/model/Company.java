package urbancompany.src.com.urbancompany.model;

public class Company {
    private final String id;
    private final String name;

    public Company(String id, String name) {
        this.id = id;
        this.name = name;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    @Override
    public String toString() {
        return "Company{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                '}';
    }
}

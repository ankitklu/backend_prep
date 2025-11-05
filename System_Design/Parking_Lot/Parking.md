# Parking Lot

# Functional Requirements
- The system manages different vehicle types.
- Vehicle enter and exit after making payments
- The vehicle is allocated a slot
- Payment must be completed before leaving
- The system must handle different vehicle sizes and slot allocations efficiently.

# Is this the expected flow?
## Clarification
- Will there be multiple slot types based on the vehicle size?
- Are we supporting multiple payment methods ?
- Should the system track the parking duration?
- Can there be multiple floors on the parking lot ?

# Summary of the key requirements
- Ap parking lot with mulitple slots
- Supports bikes, cars, trucks
- Dynamic slot allocation based on vehicle size
- Entry ticket, issuance and exit validation

# 1. Vehicle class
```java
public abstract class Vehicle{
    protected String licensePlate;
    protected VehicleType type;
}
```

# 2. Parking Lot
- class ParkingLot
- Descnription: Manges , parking slots and vehicle allocations.
- Responsible for:
    - Allocating and realeasing parking slots
    - Tracking occupied and free slots

```java
public class ParkingLot{
    private List<ParkingSlot> slots;
}
```

# 3. Parking Slot

```java
public class ParkingSlot{
    private VehicleType slotType;
    private boolean isOccupied;
}
```

# 4. Payment Strategy

```java
public interface PaymentStrategy{
    boolean processPayment(double amount);
}
```

# Patterns to follow
- Factory Pattern for Vehicle Creation
    * I tallows easy extension for new vehicle types
    * ENsures consistent object creation
- Strategy Pattern for Payments and Parking Fares
    * Enables flexible payment methods and dynamic fare calculations
    * Easily extendable for future payment integrations.
- Singleton Pattern for Parking Lot Management since we want one parking lot
- Observer Pattern for Exit Notifications

# ParkingStrategy Interface
 
```java
public interface ParkingFeeStrategy{
    double calculateFee(String vehicleType, int duration, DurationType durationType){

    }
}

public enum DurationType{
    HOURS,
    DAYS
}

```

# Basic Hourly Rate Strategy 
```java
public class BasicHourlyRateStrategy implements ParkingFeeStrategy{
    @Override
    public double calculateFee(String vehicleType, int duration, DurationType durationType){
        switch(vehicleType.toLowerCase()){
            // cases ->
        }
    }
}
```

# Factory Implementation of Vehicle Class
```java
public abstract class Vehicle{
    private String licensePlate;
    private String vehicleType;
    private ParkingFeeStrategy feeStrategy;

    public Vehicle(String licensePlate, String vehicleType, ParkingFeeStrategy feeStrategy){
        this.licensePlate=licensePlate;
        this.vehicleType=vehicleType;
        this.feeStrategy=feeStrategy;
    }

    //getter and setters
}
```

# Vehicle Factory

```java
public class VehicleFactory{
    public static Vehicle createVehiccle(String vehicleType, String licensePlate, ParkingFeeStrategy feeStrategy){
        if(vehicleType.equalsIgnoreCase("Car")){
            return new CarVehicle(licensePlate, feeStrategy);
        }
        else if(vehicleType.equalsIgnoreCase("Bike")){
            return new BikeVehicle(licensePlate, feeStrategy);
        }
        return new OtherVehicle(licensePlate, feeStrategy);
    }
}
```

# Strategy Pattern for Payments
- Supports multiple payment methods like case and Credit Card
- Enables flexibility to add neww payment methods without modifying existing code
- Follows Open/Closed Principle, making it scalable for future enhancements.

PaymentStrategy.java -> Common Interface
```java
public interface paymentStrategy{
    void processPayment(double amount);
}
```

# Concrete Payment Strategies
CashPayment.java
```java
public class CashPayment implements PaymentStrategy{
    @Override
    public void processPayment(double amount){
        System.out.println("Processing cash payment of Rs. "+amount);
    }
}

```
# Payment class for Client
```java
public class Amount{
    private double amount;
    private PaymentStrategy paymentStrategy;

    public Payment(double amount, PaymentStrategy paymentStrategy){
        this.amount = amount;
        this.paymentStrategy= paymentStrategy;
    }

    public void processPayement(){
        if(amount >0){
            paymentStartegy.processPayment(amount);
        }
        else{
            System.out.println("Invalid payment amount!!");
        }
    }
}
```

# ParkingSpot
```java
public abstract class ParkingSpot{
    private int spotNumber;
    private boolean isOccupied;
    private Vehicle vehicle;
    private String spotType;

    public ParkingSpot(int spotNumber, String spotType){
        this.spotNumber = spotNumber;
        this.isOccupied= false;
        this.spotType = spotType
    }

    public boolean isOccupied(){
        return isOccupied;
    }

    // to check if there a spot for specific vehicles
    public abstract boolean carParkVehicle(Vehicle vehicle);

    public void parkVehicle(Vehicle vehicle){
        if(isOccupied){
            throw new IllegalStateException("Spot is already occupied");
        }
        if(!canParkVehicle(vehicle)){
            throw new IllegalArgumentException("This spot is not suitable for "+ vehicle.getVehicleType());
        }
        this.vehicle = vehicle;
        this.isOccupied = isOccupied;
    }

    public vacate(){
        if(!isOccupied){
            //throw exception
        }
    }
}
```

```java

public class CarParkingSpot extends ParkingSpot{
    public CarParkingSpot(int spotNumber){
        super(spotNumber, "Car");
    }

    @Override
    public boolean canParkVehicle(Vehicle vehicle){
        return "Car".equalsIgnoreCase(vehicle.getVehicleType());
    }
}

```

# Parking Lot
```java
public class ParkingLot{
    private List<ParkingLot> parkingSpots;

    public ParkingLot(List<ParkingSpot> parkingSpots){
        this.parkingSpots=parkingSpots;
    }
    public ParkingSpot findAvailableSpot(String vehicleType){
        for(ParkingSPor spot: parkingSpots){
            if(!spot.isOccupied() && spot.getSpotType().equals(vehicleType)){
                return spot;
            }
        }
        return null;
    }

    public ParkingSpot parkVehicle(Vehicle vehicle){
        ParkingSpot spot = findAvailable(vehicle.getVehicleType());
        if(spot!=null){
            spot.parkVehicle(vehicle);
            System.out.println("Vehicle parked successfully " + spot.getSpotNumber());
            return spot;
        }
        // print no parking spots available
    }

}

```

# Main function

```java

public class ParkingLotMain{
    public static void main(String args[]){
        List<ParkingSpot> parkingSpots  = new ArrayList<>();
        parkingSpots.add(new CarParkingSpot(1));
        parkingSpots.add(new CarParkingSpot(2));
        parkingSpots.add(new CarParkingSpot(3));
        parkingSpots.add(new CarParkingSpot(4));

        ParkingLot parkingLot = new ParkingLot(parkingSpots);

        ParkingFeeStrategy basicHourlyRateStrategy  = new basicHourlyRateStrategy();

        ParkingFeeStartegy premiumRateStrategy = new PremiumRateStartegy();

        Vehicle car1 = VehicleFactory.createVehicle("Car","CAR1234", basicHourlyRateStrategy);
        
    }
}

```








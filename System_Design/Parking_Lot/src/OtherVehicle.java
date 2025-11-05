package src;

public class OtherVehicle extends Vehicle {
    public OtherVehicle(String licensePlate, ParkingFeeStrategy feeStrategy) {
        super(licensePlate, "Other", feeStrategy);
    }
}
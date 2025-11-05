package src;

import java.util.ArrayList;
import java.util.List;

public class ParkingLotMain {
    public static void main(String[] args) {
        // Create parking spots
        List<ParkingSpot> parkingSpots = new ArrayList<>();
        parkingSpots.add(new CarParkingSpot(1));
        parkingSpots.add(new CarParkingSpot(2));
        parkingSpots.add(new CarParkingSpot(3));
        parkingSpots.add(new CarParkingSpot(4));

        // Create parking lot
        ParkingLot parkingLot = new ParkingLot(parkingSpots);

        // Create fee strategies
        ParkingFeeStrategy basicHourlyRateStrategy = new BasicHourlyRateStrategy();
        ParkingFeeStrategy premiumRateStrategy = new PremiumRateStrategy();

        // Create and park vehicles
        Vehicle car1 = VehicleFactory.createVehicle("Car", "CAR1234", basicHourlyRateStrategy);
        Vehicle car2 = VehicleFactory.createVehicle("Car", "CAR5678", premiumRateStrategy);

        // Park vehicles
        ParkingSpot spot1 = parkingLot.parkVehicle(car1);
        ParkingSpot spot2 = parkingLot.parkVehicle(car2);

        // Calculate and process payments
        if (spot1 != null) {
            double fee1 = car1.getFeeStrategy().calculateFee(car1.getVehicleType(), 2, DurationType.HOURS);
            Payment payment1 = new Payment(fee1, new CashPayment());
            payment1.processPayment();
            spot1.vacate();
            System.out.println("Car1 has left the parking spot");
        }

        if (spot2 != null) {
            double fee2 = car2.getFeeStrategy().calculateFee(car2.getVehicleType(), 3, DurationType.HOURS);
            Payment payment2 = new Payment(fee2, new CashPayment());
            payment2.processPayment();
            spot2.vacate();
            System.out.println("Car2 has left the parking spot");
        }
    }
}
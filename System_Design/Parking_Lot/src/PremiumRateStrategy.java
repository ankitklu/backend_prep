package src;

public class PremiumRateStrategy implements ParkingFeeStrategy {
    @Override
    public double calculateFee(String vehicleType, int duration, DurationType durationType) {
        // Premium rates are 1.5 times the basic rates
        BasicHourlyRateStrategy basicStrategy = new BasicHourlyRateStrategy();
        return basicStrategy.calculateFee(vehicleType, duration, durationType) * 1.5;
    }
}
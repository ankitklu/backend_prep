package src;

public class BasicHourlyRateStrategy implements ParkingFeeStrategy {
    @Override
    public double calculateFee(String vehicleType, int duration, DurationType durationType) {
        double hourlyRate;
        switch (vehicleType.toLowerCase()) {
            case "car":
                hourlyRate = 20.0;
                break;
            case "bike":
                hourlyRate = 10.0;
                break;
            default:
                hourlyRate = 30.0;
        }

        if (durationType == DurationType.DAYS) {
            return hourlyRate * duration * 24;
        }
        return hourlyRate * duration;
    }
}
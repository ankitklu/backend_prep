const rideModel = require('../models/ride.model');
const { subscribeToQueue, publishToQueue } = require('../service/rabbit')

module.exports.createRide = async (req, res, next) => {


    const { pickup, destination } = req.body;


    const newRide = new rideModel({
        user: req.user._id,
        pickup,
        destination
    })



    await newRide.save();
    publishToQueue("new-ride", JSON.stringify(newRide))
    res.send(newRide);




}

module.exports.acceptRide = async (req, res, next) => {
    const { rideId } = req.query;
    const ride = await rideModel.findById(rideId);
    if (!ride) {
        return res.status(404).json({ message: 'Ride not found' });
    }

    ride.status = 'accepted';
    await ride.save();
    publishToQueue("ride-accepted", JSON.stringify(ride))
    res.send(ride);
}
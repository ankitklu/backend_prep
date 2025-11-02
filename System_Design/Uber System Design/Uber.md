# Uber System Design

# Functional Requirements
- Users should be able to input a start location and a destination and get an estimate fair.
- user should be able to request a drive based on an estimate.
- Drivers should be able to accept/deny a request and navigate to puclup/drop-off.

# Out of scope
- multiple car types
- ratings for drivers and riders
- schecule a ride in advance

# Non-functional Requirements
- low latency matching < 1min to match or failure
- consistency of matching over availability and partitioning
- highly available outside the matching 
- handle high throughout, surges for peak hous or special evens. 100s of thousands of requests within a given region.

# Out of Scope
- GPDR user privacy 
- Resilence and handling system failures
- CI/CD Pipelines

# Entities and APIs
- Ride
- Driver
- Rider
- Location

# API
- POST /ride/fare-estimate 
    {
        source, 
        destination
    }

- PATCH /ride/request
    {
        rideId, 
    }

- POST /location/update
    {
        lat, 
        long
    }

- PATCH /ride/driver/accept
    {
        rideId,
        true/false
    }

- PATCH /ride/driver/update
    {
        rideId, 
        status: 'pickup' | 'droppedoff'
    }

# Back of the envelope Calcualtions
- 6M drivers
- 3M active drivers
- 3M drivers updates location every 5 sec = 3M/5 = 600k TPS


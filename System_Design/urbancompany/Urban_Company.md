# design classes for system which can provide different tpy e fo services

1) createService (String serviceid, string userid)
2) getMyPreviousServices(string userid)

CRUD - Create, Read

## Payment
- Amount
- Payment Method
- ID
- UserId
- Reason
- Discount

## Service
- id string
- description string
- title string
- price double
- expected_no_of_hours datatime
- add_on
- metadata

## Order
- userId string
- scheduled_for_datetime string
- companyId string
- serviceId string
- status enum

## 
# TeleBikesBooking
These App is Simple Single Page Applications about booking motobike by phone. It includes: 
* [x] Telephonist App: Get information about new booking-deal from guest via phone then create new booking-deal. Besides, guest can request for history and book again the booking deal that was booked success.
* [x] Location App: Get new booking-deal from Telephonist to locate and save lat, long. Then, request driver for this booking deal from the nearest driver in 1000 meter radius.
* [x] PointManagement App: Show information about all booking deal realtime.
* [x] Driver App: Get request from Location App then Accept or Ignore the booking deal. If Accept, update the status of the trip and the address realtime.

Time spent: **36** hours spent in total

## User Stories

The basic **required** functionality:

* [x] Book new booking-deal.
* [x] Search history of quest's phone number.
* [x] Request driver for booking-deal in history that was booked success before.
* [x] Show detail of the booking-deal.
* [x] Locate to get lat, long for the new booking-deal and request driver.
* [x] Show 10 nearest driver of the booking-deal.
* [x] Reuqest driver: from the nearest driver, 5s for respond from driver.
* [x] Revese the location of quest and driver when click on Map.
* [x] Driver can accept or ignore the request. If accept, update the status of the trip and the address realtime.
* [x] Show the shortest way from the driver to guest location.
* [x] Show information realtime of all booking-deal.
* [x] Show the shortest way of the booking-deal that is on the trip. 


The **extended** features are implemented:

* [x] Push notification for new booking-deal to Location app and request to driver. 

## Video Walkthrough

Here's a walkthrough of implemented user stories:

Create new booking-deal
[![IMAGE ALT TEXT HERE](https://i.imgur.com/HTm6M3F.png)]

Push notfication new booking-deal for location app
[![IMAGE ALT TEXT HERE](https://i.imgur.com/2RcZI9q.png)]

Show 10 nearest Driver of booking-deal
[![IMAGE ALT TEXT HERE](https://i.imgur.com/p2gsm6w.png)]

Push notification new request from Driver app
[![IMAGE ALT TEXT HERE](https://i.imgur.com/BC7r2iC.png)]

## Open-source libraries used

- [Vuejs](https://vuejs.org/) - The Progressive JavaScript Framework
- [Firebase](https://firebase.google.com/) - Firebase helps you build better mobile apps and grow your business.
- [Google Map Api](https://developers.google.com/maps/?hl=vi) - Build the next generation of location experiences


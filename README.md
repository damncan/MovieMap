


## Movie Map

Have you ever experienced problems such as you have no idea about what movie you should go to watch even if you exactly know what hours you are available? Perhaps you just get tired of searching movie showtime of each cinema one by one, and finally find out your credit card does not provide any offer when you are going to pay the money.
The purpose of this project is to solve the above problems. It provides a web-based tool to assist people visualizationally search for information of movie showtime and credit card offers.



## Development Environment
- Node.js v4.6.0
- Sails.js v0.12



## System Architecture
**Database Schema**

Each cinema group contains several cinemas and credit card offers provided from banks in Taiwan such as CTBC, TSBank, Citibank, etc.; each cinema would play several movies and each movie would be played in several cinemas at the same time, I use a table called "Showtime" to catch information of each show and the many-to-many relationship between cinemas and movies.

<img alt="Database Schema" src="/assets/images/ERD.png" title="Database Schema" width="600"/>



## Demo
**Filter**

<img alt="Filter" src="/assets/images/Filter.gif" title="Filter" width="300"/>

**Showtimes**

<img alt="Showtimes" src="/assets/images/Showtimes.gif" title="Showtimes" width="600"/>

**Credit Card Offers**

<img alt="Credit Card Offers" src="/assets/images/CredieCardOffers.gif" title="Credit Card Offers" width="600"/>
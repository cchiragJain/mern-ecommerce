# The Everything Store

<!-- add image -->

- The Everything Store is a fully featured user-friendly E commerce website where users can order,pay,manage and track their orders.
- Also features a seperate admin screen for admin controls of the store(**CRUD orders,products & users)**.
- Built using **ReactJS** for frontend, **React-BootStrap** for styling, **Redux** for state management , **PayPal** as a payment gateway, **NodeJS & Express** for the **REST API** , **MongoDB Atlas** for data storage, **JWT tokens and bcryptjs** for user authentication and authorization & deployed on **Heroku**.
- [Live Link](https://theeverythingstoreapp.herokuapp.com/)

## Demo

### User

<!-- Add user video here -->

### Admin

<!-- Add admin video here -->

## Known Issues

- Heroku file system is readonly so newly uploaded images by the admin will not be persistent across dynos restarts and it's better to use Amazon S3.
- Paypal API dropped support for INR transactions so the sandbox uses usd as a currency for now. (Might have to implement razorpay)
- Users JWT token should be stored in cookies to prevent CSRF attacks.

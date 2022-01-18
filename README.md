# The Everything Store

- **[Live Link](https://theeverythingstoreapp.herokuapp.com/)**
- The Everything Store is a fully featured user-friendly E commerce website where users can order,pay,manage and track their orders.
- Also features a seperate admin screen for admin controls of the store(**CRUD orders,products & users)**.
- Built using **ReactJS** for frontend, **React-BootStrap** for styling, **Redux** for state management , **PayPal** as a payment gateway, **NodeJS & Express** for the **REST API** , **MongoDB Atlas** for data storage, **JWT tokens and bcryptjs** for user authentication and authorization & deployed on **Heroku**.

![homscreen](https://user-images.githubusercontent.com/59828850/149936956-6157e449-d055-45c9-a82e-e82ed92b99fe.png)

## Demo

### User
https://user-images.githubusercontent.com/59828850/149942875-cd5e2df7-23eb-4e6a-a3c9-f1b1a4f24efb.mp4

### Admin
https://user-images.githubusercontent.com/59828850/149942957-164f0669-ac50-4241-ba26-3e6cfc641881.mp4


## Known Issues

- Heroku file system is readonly so newly uploaded images by the admin will not be persistent across dynos restarts and it would be better to use something like Amazon S3.
- Paypal API dropped support for INR transactions so the sandbox gateway uses usd as a currency for now. (Might have to implement razorpay)
- Users JWT token should be stored in cookies to prevent CSRF attacks.

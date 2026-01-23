# E‑commerce API

A scalable, modular, and secure RESTful API for an e-commerce platform,
built using **NestJS** and **TypeScript**. This API handles core
business logic for products, users, orders, and authentication, making
it suitable for powering web, mobile, or third-party clients.

## 📋 Table of Contents

-   [Features](#features)
-   [Architecture](#architecture)
-   [Tech Stack](#tech-stack)
-   [Getting Started](#getting-started)
-   [Configuration](#configuration)
-   [Usage](#usage)
-   [Testing](#testing)
-   [API Documentation](#api-documentation)
-   [Contributing](#contributing)
-   [License](#license)
-   [Maintainer](#maintainer)
-   [Acknowledgements](#acknowledgements)

## ✅ Features

-   **Authentication & Authorization**
    -   User registration and login
    -   JWT-based authentication
    -   Role-Based Access Control (RBAC)
    -   Password hashing
-   **User Management**
    -   CRUD operations for users
    -   Admin/user permissions
-   **Product Management**
    -   CRUD operations
    -   Categories, images, stock, price
    -   Search & filtering
-   **Shopping Cart**
    -   Add/remove items
    -   Update quantities
    -   Cart total calculation
    -   Convert cart to order (checkout)
-   **Order Management**
    -   Create orders
    -   Order status update
    -   Order history
-   **Validation & Error Handling**
    -   class-validator DTOs
    -   Global exception filters
-   **Database Integration**
    -   ORM-based models
    -   Relationships support

## 🏗 Architecture

-   Controllers
-   Services
-   Repositories
-   Guards
-   Interceptors
-   DTO Validation Layer
-   Modular folder structure

## 💻 Tech Stack

-   NestJS
-   TypeScript
-   Mongoose / MongoDB (adjust if needed)
-   JWT / Passport
-   class-validator / class-transformer
-   Swagger

## 🚀 Getting Started

### Prerequisites

-   Node.js
-   npm / yarn
-   MongoDB running locally or cloud

### Installation

``` bash
git clone https://github.com/alyKhalid3/E-commerce
cd E-commerce
npm install
```

### Run Project

``` bash
npm run start:dev
```

## ⚙️ Configuration

Create a `.env` file:

    PORT=3000
    MONGODB_URI=your_mongodb_uri
    JWT_SECRET=your_secret

## 💡 Usage

After running:

    http://localhost:3000/api

Use Swagger to explore all endpoints.

## 🧪 Testing

``` bash
npm run test
```

## 📚 API Documentation

Swagger UI available at:

    /api

## 🤝 Contributing

1.  Fork project
2.  Create branch
3.  Commit changes
4.  Push
5.  Open PR

## 📜 License

MIT License.

## 👤 Maintainer

-   **Aly Khalid**
-   GitHub: https://github.com/alyKhalid3

## 🙏 Acknowledgements

Thanks to NestJS documentation and community.

# NodeMyAdmin

**NodeMyAdmin** is a lightweight, web-based database management tool for **Node.js** applications. Designed for simplicity and efficiency, it allows developers to interact with their MySQL databases via an intuitive web interface.

## Features

- **User-friendly Interface**: Modern, responsive design with dynamic table views.
- **Database Diagram Visualization**: Automatically generate and view your database schema using **Mermaid.js**.
- **Table Browsing**: Easily browse and filter table data with support for pagination, sorting, and searching.
- **Column Details**: Inspect the structure of each table, including primary keys, foreign keys, and data types.
- **Secure**: Utilizes environment variables for sensitive configuration.

## Installation

Follow these steps to install and run NodeMyAdmin:

1. Clone the repository:
   ```bash
   git clone https://github.com/gusmartinuk/nodemyadmin.git
   ```

2. Navigate to the project directory:
   ```bash
   cd nodemyadmin
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file based on the provided `.env-sample` file:
   ```plaintext
   MYSQL_HOST=localhost
   MYSQL_USER=root
   MYSQL_PASSWORD=yourpassword
   MYSQL_DATABASE=yourdatabase
   ```

5. Start the application:
   ```bash
   npm start
   ```

6. Open your browser and go to:
   ```
   http://localhost:3000
   ```

## Usage

- Navigate through tables from the sidebar.
- Use the **Diagram** button to view your database schema graphically.
- Browse table data dynamically with search, pagination, and sorting features.

## Technologies Used

- **Node.js**: Backend runtime environment.
- **Express.js**: Web application framework.
- **EJS**: Template engine for dynamic HTML rendering.
- **DataTables**: Interactive table support for sorting, filtering, and pagination.
- **Mermaid.js**: Database schema visualization.

## Screenshots

Add screenshots of your tool in action, such as:

1. Database Diagram View
2. Table Browsing Interface


## Contributing

Contributions are welcome! To get started:

1. Fork the repository.
2. Create a new branch for your feature:
   ```bash
   git checkout -b feature-name
   ```
3. Make your changes and commit:
   ```bash
   git commit -m "Add feature-name"
   ```
4. Push your branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

## Roadmap

Future improvements and features include:
- **Authentication**: Secure login and user management.
- **Database Selection**: Easily switch between different databases within the same MySQL server.
- **Theme Selection for Diagrams**: Customize the appearance of your database diagrams using Mermaid's built-in themes.
- **Documentation**: Comprehensive user guide and API documentation. 
- **Support for Multiple Databases**: Add PostgreSQL and SQLite compatibility.
- **Query Builder**: Custom SQL queries with execution in the browser.
- **Data Export**: CSV and JSON export options.
- **CRUD Model**: Develop a robust Create, Read, Update, Delete (CRUD) model for managing database records efficiently.
- **Source Generator**: Automatically generate source code for database interactions.
- **Customizable Forms Generator**: Create dynamic forms based on database schema for data entry and updates.
- **Automatic Master-Client Structure**: Support for master-client database structures in CRUD operations.

## License
This project is licensed under the **MIT License**. See the `LICENSE` file for more details.

## Author

**Gus Martin**  
[GitHub Profile](https://github.com/gusmartinuk)

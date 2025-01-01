const mysql = require('mysql2/promise');

async function connect() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });    
    return connection;
  } catch (err) {
    console.error('Error during database connection:', err);
    throw err;
  }
}

async function disconnect(connection) {
  try {
    await connection.end();
  } catch (err) {
    // Error during disconnection
    console.error('Error during disconnection:', err);
    throw err;
  }
}

async function listTables(connection) {
  try {
    const [rows] = await connection.execute('SHOW TABLES');
    const tableNames = rows.map(row => Object.values(row)[0]);
    return tableNames;
  } catch (err) {
    // Error during table listing
    console.error('Error during table listing:', err);
    throw err;
  }
}

async function listViews(connection) {
  try {
    const [rows] = await connection.execute("SHOW FULL TABLES WHERE TABLE_TYPE LIKE 'VIEW'");
    const viewNames = rows.map(row => row[`Tables_in_${process.env.MYSQL_DATABASE || 'your_database_name'}`]);
    return viewNames;
  } catch (err) {
    console.error('Error during view listing:', err);
    throw err;
  }
}

async function listTableStructure(connection, tableName) {
  try {
    const [columns] = await connection.execute(`DESCRIBE ${tableName}`);
    const [constraints] = await connection.execute(`SELECT * FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE TABLE_NAME = '${tableName}' AND CONSTRAINT_SCHEMA = '${process.env.MYSQL_DATABASE || 'your_database_name'}'`);

    const foreignKeys = constraints.filter(constraint => constraint.REFERENCED_TABLE_NAME !== null);

    const tableStructure = {
      columns: columns.map(column => ({
        name: column.Field,
        type: column.Type,
        nullable: column.Null === 'YES',
        key: column.Key,
        default: column.Default,
        extra: column.Extra,
      })),
      foreignKeys: foreignKeys.map(foreignKey => ({
        column: foreignKey.COLUMN_NAME,
        referencedTable: foreignKey.REFERENCED_TABLE_NAME,
        referencedColumn: foreignKey.REFERENCED_COLUMN_NAME,
        constraintName: foreignKey.CONSTRAINT_NAME,
      })),
    };

    return tableStructure;
  } catch (err) {    
    console.error('Error during get the table structure:', err);
    throw err;
  }
}

module.exports = {
  connect,
  disconnect,
  listTables,
  listViews,
  listTableStructure,
};
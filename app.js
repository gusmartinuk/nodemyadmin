require('dotenv').config();
const express = require('express');
const { connect, disconnect, listTables, listTableStructure } = require('./dblib');
const bodyParser = require('body-parser');

const app = express();
app.use(express.json()); // For JSON requests
app.use(express.urlencoded({ extended: true })); // For URL-encoded requests

app.locals.databaseName = process.env.MYSQL_DATABASE;

const port = 3000;  // Port number

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', async (req, res) => {
  try {
    const connection = await connect();
    const tables = await listTables(connection);
    await disconnect(connection);

    res.render('index', { body: 'index', tables });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Error occurred while fetching tables.');
  }
});

app.get('/table/:tableName', async (req, res) => {
  try {
    const tableName = req.params.tableName;
    const connection = await connect();
    const tableStructure = await listTableStructure(connection, tableName);
    await disconnect(connection);

    res.render('table', { tableName, tableStructure });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('An error occurred while fetching table details.');
  }
});


app.get('/tables-data', async (req, res) => {
  try {
    const connection = await connect();
    const tables = await listTables(connection);
    await disconnect(connection);

    const data = {
      "draw": parseInt(req.query.draw),
      "recordsTotal": tables.length,
      "recordsFiltered": tables.length,
      "data": tables.map(table => ({ name: table }))
    };
    res.json(data);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Error occurred while fetching data.');
  }
});

app.get('/browse/:tableName', async (req, res) => {
  try {
    const tableName = req.params.tableName;
    const connection = await connect();

    // Get the table structure
    const tableStructure = await listTableStructure(connection, tableName);
    const columnNames = tableStructure.columns.map(column => column.name);

    // Get all rows from the table and the total row count
    const [rows] = await connection.execute(`SELECT * FROM ${tableName}`);
    const [totalRows] = await connection.execute(`SELECT COUNT(*) FROM ${tableName}`);
    await disconnect(connection);

    res.render('browse', { 
      tableName, 
      rows, 
      totalRows: totalRows[0]['COUNT(*)'], 
      columnNames // Send column names to the template
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Error occurred while rendering view.');
  }
});


app.post('/browse-data/:tableName', async (req, res) => {
  try {
    const tableName = req.params.tableName;
    const { start, length, search, order } = req.body;

    const connection = await connect();

    // Count of total records
    const [totalRows] = await connection.execute(`SELECT COUNT(*) AS count FROM ${tableName}`);
    const totalRecords = totalRows[0].count;

    // Filtrered rows
    let whereClause = '';
    if (search && search.value) {
      const [columns] = await connection.execute(`DESCRIBE ${tableName}`);
      const searchColumns = columns.map(col => `${col.Field} LIKE '%${search.value}%'`).join(' OR ');
      whereClause = `WHERE ${searchColumns}`;
    }

    // Sorting
    const orderClause = order && order.length > 0
      ? `ORDER BY ${order[0].column + 1} ${order[0].dir}`
      : '';

    // Query to get the rows
    const query = `
      SELECT * FROM ${tableName}
      ${whereClause}
      ${orderClause}
      LIMIT ${start || 0}, ${length || 10}
    `;
    const [filteredRows] = await connection.execute(query);

    // Filtered count
    const [filteredCount] = await connection.execute(`
      SELECT COUNT(*) AS count FROM ${tableName} ${whereClause}
    `);
    const recordsFiltered = filteredCount[0].count;

    await disconnect(connection);

    res.json({
      draw: req.body.draw || 1,
      recordsTotal: totalRecords,
      recordsFiltered: recordsFiltered,
      data: filteredRows,
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Server error occurred.' });
  }
});


app.get('/diagram', async (req, res) => {
  try {
    const connection = await connect();
    const tables = await listTables(connection);

    const tableDetails = [];
    for (const table of tables) {
      const structure = await listTableStructure(connection, table);
      tableDetails.push({
        table: table,
        structure: structure,
      });
    }
    await disconnect(connection);
    // Render the diagram view, passing the table details
    res.render('diagram', { tables: tableDetails });
  } catch (err) {
    console.error('Error generating diagram:', err);
    res.status(500).send('Error generating diagram.');
  }
});


app.listen(port, () => {
  console.log(`Application working on ${port} port.`);
});
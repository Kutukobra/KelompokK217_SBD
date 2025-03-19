const express = require('express');
require('dotenv').config();
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
    connectionString: process.env.PG_CONNECTION_STRING
});

app.use(express.json());

app.post('/customers', async (req, res) => {
    const { customer_name, contact_name, address, city, postal_code, country } = req.body;
    try {
        const result = await pool.query(
        'INSERT INTO customers (customer_name, contact_name, address, city, postal_code, country) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [customer_name, contact_name, address, city, postal_code, country]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json(err);
    }
});

app.get('/customers', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM customers');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json(err);
    }
});

app.get('/customers/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM customers WHERE customer_id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Customer not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json(err);
    }
});

app.put('/customers/:id', async (req, res) => {
    const { id } = req.params;
    const { customer_name, contact_name, address, city, postal_code, country } = req.body;
    try {
        const result = await pool.query(
        'UPDATE customers SET customer_name=$1, contact_name=$2, address=$3, city=$4, postal_code=$5, country=$6 WHERE customer_id=$7 RETURNING *',
        [customer_name, contact_name, address, city, postal_code, country, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ message: 'Customer not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json(err);
    }
});

app.delete('/customers/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM customers WHERE customer_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Customer not found' });
        res.json({ message: 'Customer deleted successfully' });
    } catch (err) {
        res.status(500).json(err);
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

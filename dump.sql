SELECT
    c.customer_name,
    p.product_name
FROM
    customers as c
JOIN
    orders as o ON c.customer_id = o.customer_id
JOIN
    order_details as od ON o.order_id = od.order_id
JOIN
    products as p ON od.product_id = p.product_id
WHERE
    EXISTS (
        SELECT 1
        FROM orders as o2
        WHERE o2.customer_id = c.customer_id
        HAVING COUNT(o2.order_id) > 1
    )
LIMIT 20;

SELECT customer_name AS "Customer",
        product_name AS "Product",
        category_name AS "Product Category",
        quantity AS "Quantity",
        order_date AS "Date of Order"
FROM orders
INNER JOIN customers
    ON orders.customer_id = customers.customer_id
INNER JOIN order_details
    ON orders.order_id = order_details.order_id
INNER JOIN products
    ON products.product_id = order_details.product_id
INNER JOIN categories
    ON products.category_id = categories.category_id
ORDER BY order_date ASC;

SELECT country, Count(customer_id) FROM customers
GROUP BY country
ORDER BY Count(customer_id) DESC;

SELECT city, COUNT(*) AS customer_count
    FROM customers
    GROUP BY city
    HAVING COUNT(*) > 2;
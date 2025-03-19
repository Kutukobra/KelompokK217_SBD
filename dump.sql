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

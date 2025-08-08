export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { SHOPIFY_ADMIN_TOKEN, SHOPIFY_API_SECRET } = process.env;
  if (!SHOPIFY_ADMIN_TOKEN || !SHOPIFY_API_SECRET) {
    return res.status(500).json({ error: 'Missing server configuration' });
  }

  const { title, price, email } = req.body;
  if (!title || !price) {
    return res.status(400).json({ error: 'Missing title or price' });
  }

  try {
    const response = await fetch(`https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2023-10/draft_orders.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ADMIN_TOKEN,
      },
      body: JSON.stringify({
        draft_order: {
          line_items: [
            {
              title: title,
              price: price,
              quantity: 1
            }
          ],
          email: email || undefined,
          use_customer_default_address: true
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(data));
    }

    const invoiceUrl = data.draft_order?.invoice_url;
    return res.status(200).json({ invoiceUrl });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to create draft order' });
  }
}

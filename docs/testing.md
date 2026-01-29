# Testing & Sandbox Guide

Micropay provides a complete Sandbox environment that mimics production behavior without simulating real money.

## Sandbox Mode

When you create your account, you are in **Test Mode** by default.
- **Provider**: M-Pesa (Daraja Sandbox)
- **Currency**: KES (Virtual)

You can toggle between Test and Live data in the Dashboard header.

## Test Credentials

### Magic Phone Numbers (M-Pesa)

Use these phone numbers to simulate specific scenarios in Sandbox:

| Phone Number | Scenario | Result |
| :--- | :--- | :--- |
| `254700000000` | **Success** | Returns `ResponseCode: 0` (Success) instantly. |
| `254700000001` | **Insufficient Funds** | Returns error `1`. |
| `254700000002` | **User Cancelled** | Returns error `1032`. |
| `254700000003` | **Timeout** | Returns error `1037` (Simulates user ignoring the prompt). |

## Developer Workbench

The easiest way to test your integration is using the **Developer Workbench** in your Dashboard.

1. Go to **Dashboard > Developer Workbench**.
2. Select **Create Payment Intent**.
3. enter a test amount and one of the magic phone numbers above.
4. Click **Run**.
5. Result: You will see the raw API response and the updated status in real-time.

You can also use the Workbench to **Simulate Webhooks** to test your local server integration (requires using a tunneling tool like ngrok).

# BAMBAURA STOREFRONT: FRONTEND-BACKEND INTEGRATION CONTRACT

**Document Version:** 1.0.0  
**Specification Date:** October 26, 2026  
**Target Architecture:** Vite React 18 SPA + ASP.NET Core / .NET 10 / Node Microservices API  
**Security & Protocol:** HTTPS / JSON / JWT Authentication / Idempotent Payments  

---

## 1. Architectural Overview & Operating Modes

The Bambaura storefront is built as a responsive Single Page Application (SPA). It is architected to operate safely in two distinct environments:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        BAMBAURA STOREFRONT (SPA)                      │
│                                                                        │
│  [ Safe Client Demo Mode ]                    [ Live Production Mode ]  │
│  - No backend required                        - Connected via HTTPS    │
│  - Simulated session receipts marked [DEMO]   - Live Razorpay Gateway  │
│  - Inquiries routed to care@bambaura.com      - PostgreSQL persistence │
└──────────────────┬─────────────────────────────────┬───────────────────┘
                   │                                 │
                   ▼ (Fallback / Offline)            ▼ (Production)
┌──────────────────────────────────┐   ┌─────────────────────────────────┐
│     In-Memory / Session State    │   │      Live Backend REST API      │
│  - Local Cart & Variant Math     │   │  - Order Creation & Webhooks    │
│  - Session Test Review Storage   │   │  - Razorpay Signature Check     │
│  - Safe Demo Modal Disclaimers   │   │  - Dispatch & Courier Tracking  │
└──────────────────────────────────┘   └─────────────────────────────────┘
```

### Mode Determination
* **Live Production Mode:** Triggered when `VITE_API_BASE_URL` and `VITE_RAZORPAY_KEY_ID` are configured. All transactions route through verified payment endpoints and backend validation.
* **Client Demo Mode:** Automatically active when backend endpoints return `404`, `503`, or network failures, or when credentials are intentionally unconfigured for client preview. The UI cleanly isolates all actions with explicit `[DEMO PREVIEW — NO REAL CHARGE OCCURRED]` warnings.

---

## 2. API Endpoints Specification

### 2.1 Checkout & Payment Endpoints

#### `POST /api/checkout/create-order`
Initiates a payment order with the payment processor (Razorpay).
* **Request Headers:**
  * `Content-Type: application/json`
  * `Idempotency-Key: <UUID-v4>`
* **Request Body:**
```json
{
  "currency": "INR",
  "amountSubunits": 145000,
  "countryCode": "IN",
  "items": [
    {
      "productId": "bambaura-9x-salt",
      "grams": "100g",
      "grind": "Fine Granules",
      "quantity": 1,
      "priceUSD": 24
    }
  ],
  "customer": {
    "name": "Aarav Sharma",
    "email": "aarav@example.com",
    "phone": "+919876543210",
    "address": {
      "line1": "Flat 402, Lotus Residency, Indiranagar",
      "city": "Bangalore",
      "state": "Karnataka",
      "postalCode": "560038",
      "country": "India"
    }
  }
}
```
* **Success Response (200 OK):**
```json
{
  "orderId": "order_Kz91048bamb",
  "amountSubunits": 145000,
  "currency": "INR",
  "razorpayKeyId": "rzp_live_xxxxxxxxxxxx",
  "status": "created"
}
```
* **Error Response (400 Bad Request / 502 Bad Gateway):**
```json
{
  "error": "PAYMENT_GATEWAY_UNAVAILABLE",
  "message": "Payment provider is currently unreachable. Demo fallback active."
}
```

---

#### `POST /api/checkout/verify-payment`
Validates the cryptographic HMAC-SHA256 signature returned by Razorpay.
* **Request Headers:** `Content-Type: application/json`
* **Request Body:**
```json
{
  "razorpayOrderId": "order_Kz91048bamb",
  "razorpayPaymentId": "pay_Kz92847bamb",
  "razorpaySignature": "3b29c8e104f98124b89d81726a...",
  "cartTotalUSD": 24
}
```
* **Success Response (200 OK):**
```json
{
  "verified": true,
  "orderNumber": "BAMB-2026-90412",
  "estimatedDelivery": "2026-10-30T00:00:00Z",
  "trackingCarrier": "Bluedart Express"
}
```
* **Demo Mode Behavior:** When live signature verification is unconfigured, the storefront generates a client demonstration receipt marked with `[DEMO RECEIPT — NO REAL CHARGE OCCURRED]`.

---

### 2.2 Customer & Inquiries Endpoints

#### `POST /api/concierge/inquire`
Submits customer inquiries, gifting requests, or wholesale allocations.
* **Request Body:**
```json
{
  "name": "Priya Nair",
  "email": "priya.nair@example.com",
  "subject": "Corporate & Wedding Gifting",
  "message": "Inquiring about 50 custom gift canisters for our upcoming festive dinner."
}
```
* **Success Response (200 OK):**
```json
{
  "success": true,
  "ticketId": "INQ-2026-7841",
  "message": "Inquiry recorded. Concierge team will respond within 4 business hours."
}
```
* **Offline / Demo Response:** If unconfigured, the UI notifies the user: *"Inquiry recorded (Demo Preview). For live assistance, contact care@bambaura.com"*.

---

### 2.3 Authentication Endpoints

#### `POST /api/auth/google`
Authenticates a user via Google OAuth 2.0 Identity Token.
* **Request Body:**
```json
{
  "credential": "eyJhbGciOiJSUzI1NiIsImtpZCI6...",
  "clientId": "your-google-client-id.apps.googleusercontent.com"
}
```
* **Success Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "usr_90184",
    "name": "Julian Thorne",
    "email": "julian.thorne@example.com",
    "avatar": "https://lh3.googleusercontent.com/..."
  }
}
```
* **Demo Mode Behavior:** Uses isolated local state and displays a demo user indicator.

---

### 2.4 Master Cellar / Admin Endpoints

All admin endpoints require the Bearer token header:
`Authorization: Bearer <admin_token>`

| Method | Endpoint | Description | Demo Fallback |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/admin/auth/login` | Passcode authentication | Fallback passcode `bambaura2026` |
| `GET` | `/api/admin/stats` | System gross sales, order counts, DB health | Shows `$0.00 (Demo Mode)` if unpopulated |
| `GET` | `/api/admin/products` | Live variant inventory and pricing | Loads `product.json` default variants |
| `PUT` | `/api/admin/products/variants/:grams` | Live update variant price, MRP, inStock | Saves to local React state |
| `GET` | `/api/admin/orders` | Dispatched and pending customer orders | Returns empty demo array `[]` |
| `GET` | `/api/admin/inquiries` | Customer concierge tickets | Returns demo submissions |

---

## 3. Environment Variables Reference (`.env.example`)

To connect the storefront to a live commercial backend, configure the following variables:

```bash
# ==============================================================================
# BAMBAURA STOREFRONT ENVIRONMENT CONFIGURATION
# ==============================================================================

# Backend API Base URL (leave empty for Client Demo Mode)
VITE_API_BASE_URL=https://api.bambaura.com

# Razorpay Payment Gateway (Test key for staging; Live key for production)
VITE_RAZORPAY_KEY_ID=rzp_test_YourRazorpayKeyHere

# Meta / WhatsApp Cloud Business Number (optional, e.g. 919876543210)
VITE_WHATSAPP_NUMBER=

# Google OAuth 2.0 Web Client ID (optional for live Google SSO)
VITE_GOOGLE_CLIENT_ID=

# Environment Identifier: "development" | "staging" | "production"
VITE_APP_ENV=development
```


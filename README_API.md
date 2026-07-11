# API Documentation

## Admin

### Login

```
POST /api/admin/login
```

### Get Admin

```
GET /api/admin
```

### Create Admin

```
POST /api/admin
```

### Update Admin

```
PUT /api/admin/{id}
```

### Delete Admin

```
DELETE /api/admin/{id}
```

---

## User

```
GET /api/users
POST /api/users
PUT /api/users/{id}
DELETE /api/users/{id}
```

---

## Event

```
GET /api/events
POST /api/events
PUT /api/events/{id}
DELETE /api/events/{id}
```

---

## Order

```
GET /api/orders
POST /api/orders
PUT /api/orders/{id}
DELETE /api/orders/{id}
```

---

## Authentication

### Send OTP

```
POST /api/auth/forgot-password
```

### Verify OTP

```
POST /api/auth/verify-otp
```

### Reset Password

```
POST /api/auth/reset-password
```

---

# Response Example

```json
{
    "success": true,
    "message": "Login success",
    "token": "eventsphere-admin-token"
}
```
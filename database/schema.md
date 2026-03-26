# Database Schema Documentation

## Collections

### 1. Users Collection
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['farmer', 'owner', 'admin']),
  phone: String (required),
  address: String,
  createdAt: Date (default: now)
}
```

### 2. Tools Collection
```javascript
{
  _id: ObjectId,
  name: String (required),
  description: String (required),
  category: String (enum: ['Tractor', 'Harvester', 'Plough', 'Seeder', 'Sprayer', 'Other']),
  pricePerDay: Number (required),
  deposit: Number (required),
  images: [String],
  owner: ObjectId (ref: 'User'),
  location: String (required),
  available: Boolean (default: true),
  rating: Number (default: 0),
  reviewCount: Number (default: 0),
  specifications: {
    brand: String,
    model: String,
    year: Number,
    condition: String
  },
  createdAt: Date (default: now)
}
```

### 3. Bookings Collection
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User'),
  tool: ObjectId (ref: 'Tool'),
  startDate: Date (required),
  endDate: Date (required),
  totalDays: Number (required),
  totalAmount: Number (required),
  deposit: Number (required),
  status: String (enum: ['pending', 'confirmed', 'ongoing', 'completed', 'cancelled']),
  paymentStatus: String (enum: ['pending', 'paid', 'refunded']),
  createdAt: Date (default: now)
}
```

### 4. Reviews Collection
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User'),
  tool: ObjectId (ref: 'Tool'),
  rating: Number (required, min: 1, max: 5),
  comment: String (required),
  createdAt: Date (default: now)
}
```

## Relationships

- **User → Tools**: One-to-Many (One owner can have multiple tools)
- **User → Bookings**: One-to-Many (One user can have multiple bookings)
- **Tool → Bookings**: One-to-Many (One tool can have multiple bookings)
- **User → Reviews**: One-to-Many (One user can write multiple reviews)
- **Tool → Reviews**: One-to-Many (One tool can have multiple reviews)

## Indexes

Recommended indexes for better performance:
- Users: `email` (unique)
- Tools: `category`, `pricePerDay`, `owner`
- Bookings: `user`, `tool`, `status`, `startDate`, `endDate`
- Reviews: `tool`, `user`

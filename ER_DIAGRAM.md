# CUET Bookworld ER Diagram

This diagram is based on the Mongoose schemas in `server/models`. MongoDB stores an implicit `_id` on every document; reference fields are shown as foreign keys even though MongoDB does not enforce relational constraints by default.

```mermaid
erDiagram
    USERS {
        ObjectId _id PK
        string firebaseUid UK
        string name
        string email UK
        string studentId
        string department
        string year
        string role "student|librarian|admin"
        string status "active|pending|suspended"
        date memberSince
        string avatar
        number borrowLimit
        boolean notificationsEnabled
        string theme "light|dark"
        date createdAt
        date updatedAt
    }

    BOOKS {
        ObjectId _id PK
        string title
        string_array authors
        string publisher
        number year
        string isbn
        string edition
        string_array subject
        string_array department
        number_array yearLevel
        number totalCopies
        number availableCopies
        string description
        string coverImage
        string ebookLink
        number rating
        number reviewCount
        boolean isEbook
        number viewCount
        date createdAt
        date updatedAt
    }

    BORROW_RECORDS {
        ObjectId _id PK
        ObjectId userId FK
        ObjectId bookId FK
        date borrowDate
        date dueDate
        date returnDate
        date renewalDate
        string status "pending|active|returned|overdue|rejected"
        number fine
        date createdAt
        date updatedAt
    }

    RENEWAL_REQUESTS {
        ObjectId _id PK
        ObjectId userId FK
        ObjectId borrowId FK
        string year
        date preferredDate
        string preferredTime
        date scheduledDate
        string scheduledTime
        string notes
        string status "pending|approved|completed|rejected"
        string meetingLink
        ObjectId approvedBy FK
        date completedAt
        date createdAt
        date updatedAt
    }

    REVIEWS {
        ObjectId _id PK
        ObjectId bookId FK
        ObjectId userId FK
        string userName
        number rating
        string comment
        date createdAt
        date updatedAt
    }

    NOTIFICATIONS {
        ObjectId _id PK
        ObjectId userId FK
        string message
        string type "info|warning|success|error"
        boolean read
        string link
        date createdAt
        date updatedAt
    }

    ANNOUNCEMENTS {
        ObjectId _id PK
        string title
        string message
        boolean active
        boolean showOnHome
        ObjectId createdBy FK
        date createdAt
        date updatedAt
    }

    VIDEO_SESSIONS {
        ObjectId _id PK
        ObjectId userId FK
        string topic
        date preferredDate
        string preferredTime
        string type "one-on-one|group"
        string status "pending|approved|rejected|completed"
        string meetingLink
        string hostName
        date createdAt
        date updatedAt
    }

    USERS ||--o{ BORROW_RECORDS : borrows
    BOOKS ||--o{ BORROW_RECORDS : is_borrowed_in
    USERS ||--o{ RENEWAL_REQUESTS : requests
    BORROW_RECORDS ||--o{ RENEWAL_REQUESTS : has
    USERS ||--o{ RENEWAL_REQUESTS : approves
    USERS ||--o{ REVIEWS : writes
    BOOKS ||--o{ REVIEWS : receives
    USERS ||--o{ NOTIFICATIONS : receives
    USERS ||--o{ ANNOUNCEMENTS : creates
    USERS ||--o{ VIDEO_SESSIONS : schedules
```

## Relationship Notes

- `USERS.firebaseUid` links each MongoDB user profile to the Firebase Auth user.
- `BORROW_RECORDS` is the join collection between `USERS` and `BOOKS` for book borrowing.
- `REVIEWS` is also a join-style collection between `USERS` and `BOOKS`; the route logic allows one review per user per book, but the schema does not define a compound unique index.
- `RENEWAL_REQUESTS.borrowId` points to the borrow record being renewed, while `approvedBy` points to the librarian/admin user who approved the request.
- `BOOKS.rating` and `BOOKS.reviewCount` are denormalized summary fields calculated from `REVIEWS`.

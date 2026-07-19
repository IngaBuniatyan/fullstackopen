# Part 0

## Exercise 0.4 — New note

```mermaid
sequenceDiagram
    participant browser
    participant server

    Note over browser: User submits a new note
    browser->>server: POST /exampleapp/new_note
    server-->>browser: 302 Redirect to /exampleapp/notes
    browser->>server: GET /exampleapp/notes
    server-->>browser: HTML document
    browser->>server: GET /exampleapp/main.css
    server-->>browser: CSS file
    browser->>server: GET /exampleapp/main.js
    server-->>browser: JavaScript file
    browser->>server: GET /exampleapp/data.json
    server-->>browser: Notes as JSON
```

## Exercise 0.5 — Single-page app

```mermaid
sequenceDiagram
    participant browser
    participant server

    browser->>server: GET /exampleapp/spa
    server-->>browser: HTML document
    browser->>server: GET /exampleapp/main.css
    server-->>browser: CSS file
    browser->>server: GET /exampleapp/spa.js
    server-->>browser: JavaScript file
    Note over browser: JavaScript fetches the notes
    browser->>server: GET /exampleapp/data.json
    server-->>browser: Notes as JSON
    Note over browser: Browser renders the notes
```

## Exercise 0.6 — New note in the single-page app

```mermaid
sequenceDiagram
    participant browser
    participant server

    Note over browser: User submits a new note
    Note over browser: JavaScript prevents the default form submission
    Note over browser: JavaScript adds the note locally and redraws the notes
    browser->>server: POST /exampleapp/new_note_spa (JSON)
    server-->>browser: 201 Created
    Note over browser: No page reload
```

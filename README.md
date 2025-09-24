# Ajackus — User Management Dashboard

**Project:** User Management Dashboard  
**Author:** shiva kumar  
**Date:** 24 September 2025

---

## Project Overview

This is a simple **User Management Dashboard** built using **React** and the browser **Fetch API**.  
It demonstrates basic CRUD operations (View, Add, Edit, Delete) against a mock backend (JSONPlaceholder). The UI supports search, column sorting, pagination, and client-side validation for the user form.

**Important note:** JSONPlaceholder simulates POST/PUT/DELETE responses but does **not** persist changes. The app updates the UI optimistically (client-side) so the app behaves as if the backend accepted changes.

---

## Features Implemented

- Fetch and display users from `https://jsonplaceholder.typicode.com/users`
- View user list with columns: **ID, First Name, Last Name, Email, Department**
- Add new user (POST request, optimistic UI update)
- Edit existing user (PUT request, optimistic UI update)
- Delete user (DELETE request, optimistic UI update)
- Client-side input validation (required fields and basic email validation)
- Search across name, email, and department
- Sort by first name, last name, email, department (click column header)
- Pagination with page-size options: 10, 25, 50, 100
- Responsive layout (simple, responsive container)

---

## Tech Stack

- Frontend: **React** (created with `create-react-app`)
- HTTP: **Fetch API**
- Mock backend: **JSONPlaceholder** (`/users` endpoint)
- Styling: Plain CSS (in `src/index.css`)

---

## Project Structure


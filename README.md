***

# Patient Booking & AI Clinical Consultation Platform

![Project Banner](https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1920&q=80)

A modern, full-stack web application designed to streamline patient-doctor interactions. This platform features a robust appointment booking system with doctors available near you and as a second application feature there is an innovative AI-powered pre-consultation tool that transcribes patient conversations and generates preliminary clinical documentation, such as SOAP notes and differential diagnoses which patients can refer just to get an overview, an idea of what can be the possible problem before meeting real doctors whose appointment they have booked.



---

## ✨ Key Features

This platform is divided into two main user roles, each with a dedicated portal, alongside a powerful AI-driven consultation module.

### 🤖 AI-Powered Clinical Consultation
- **Voice-to-Text Transcription**: Real-time audio recording and transcription of the patient's description of their condition using the Deepgram API.
- **Dynamic Conversational AI**: An AI assistant (Dr. Steve) asks clarifying follow-up questions to gather more detailed information, powered by the Groq API.
- **Automated SOAP Note Generation**: Upon finalizing the conversation, a structured SOAP (Subjective, Objective, Assessment, Plan) note is automatically generated.
- **Differential Diagnosis Suggestions**: The system provides a list of potential differential diagnoses with rationales to assist the clinician.

### 👨‍⚕️ Doctor Portal
- **Secure Authentication**: Secure registration and JWT-based login for doctors.
- **Availability Management**: Doctors can set their location (city, state) and manage their weekly schedule with specific time slots.
- **Appointment Dashboard**: View upcoming and past appointments, including patient details.
- **Performance Optimized**: Doctor search results are cached using Redis to ensure fast query responses.

### 🤕 Patient Portal
- **Secure Authentication**: Secure registration and JWT-based login for patients.
- **Advanced Doctor Search**: Find doctors by name, speciality, city, or state.
- **Effortless Booking**: View a doctor's available slots and book an appointment in just a few clicks.
- **Appointment Management**: View upcoming and past appointments and cancel upcoming ones if needed.
- **Email Notifications**: Receive automatic email confirmations for booked and cancelled appointments.

---

## 🛠️ Tech Stack & Architecture

This project is a monorepo containing a React frontend and a Node.js/Express backend.

| Category          | Technology                                                                                                |
| ----------------- | --------------------------------------------------------------------------------------------------------- |
| **Frontend**      | React, React Router, Material-UI (MUI), Axios, Moment.js                                                  |
| **Backend**       | Node.js, Express.js, Mongoose                                                                             |
| **Database**      | MongoDB                                                                                                   |
| **Caching**       | Redis                                                                                                     |
| **Authentication**| JSON Web Tokens (JWT), bcryptjs                                                                           |
| **AI Services**   | [Groq](https://groq.com/) (LLM for NLP), [Deepgram](https://deepgram.com/) (Audio Transcription)            |
| **Notifications** | Nodemailer (for SMTP-based email)                                                                         |

### System Architecture

```
+----------------+      +---------------------+      +-------------------+
|   React App    |      |    Node.js/Express  |      |     MongoDB       |
|  (Frontend)    |<---->|       (Backend)     |<---->|    (Database)     |
+----------------+      +---------+-----------+      +-------------------+
       ^                  |         ^                        ^
       |                  |         |                        |
       |                  |    +----+-----+             +----+-----+
       |                  +--->|  Redis   |<------------+ (Caching)  |
       |                       +----------+             +----------+
       |
       |                  +---------------------+      +-------------------+
       +----------------->|    External APIs    |<---->|   Groq / Deepgram |
                          +---------------------+      +-------------------+```
```
---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or later)
- `npm` or `yarn`
- A running instance of MongoDB
- A running instance of Redis
- API keys from [Groq](https://console.groq.com/keys) and [Deepgram](https://console.deepgram.com/signup).

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/swap-githubb-patient-booking-and-ai-consulting-application.git
    cd swap-githubb-patient-booking-and-ai-consulting-application
    ```

2.  **Set up Backend:**
    - Navigate to the backend directory:
      ```sh
      cd backend
      ```
    - Install NPM packages:
      ```sh
      npm install
      ```
    - Create a `.env` file in the `backend` directory and add the following environment variables:
      ```env
      # Server Configuration
      PORT=5000

      # MongoDB Connection
      MONGO_URI=mongodb://localhost:27017/your_db_name

      # Redis Connection
      REDIS_URI=redis://localhost:6379

      # JWT Secret
      JWT_SECRET=your_super_secret_jwt_key

      # External APIs
      DEEPGRAM_API_KEY=your_deepgram_api_key
      GROQ_API_KEY=your_groq_api_key

      # Nodemailer (e.g., using a service like Brevo/SendGrid or a Gmail account)
      SMTP_HOST=your_smtp_host
      SMTP_PORT=587
      SMTP_SECURE=false # (true for port 465, false for other ports)
      SMTP_USER=your_smtp_username
      SMTP_PASS=your_smtp_password
      SMTP_FROM="Your App Name <no-reply@yourapp.com>"
      ```
    - Start the backend server:
      ```sh
      npm start
      ```
      The server will be running on `http://localhost:5000`.

3.  **Set up Frontend:**
    - Open a new terminal and navigate to the frontend directory:
      ```sh
      cd frontend
      ```
    - Install NPM packages:
      ```sh
      npm install
      ```
    - Create build:
      ```sh
      npm run build
      ```
      

---

## 📂 Project Structure

The repository is organized into a `backend` and a `frontend` directory, maintaining a clean separation of concerns.

```
└── swap-githubb-patient-booking-and-ai-consulting-application/
    ├── backend/
    │   ├── config/             # Database (MongoDB) and Redis configuration
    │   ├── middleware/         # Custom middleware (e.g., auth)
    │   ├── models/             # Mongoose schemas
    │   ├── routes/             # API route definitions
    │   └── services/           # Business logic for external APIs (Groq, Deepgram)
    └── frontend/
        └── src/
            ├── components/     # Reusable React components
            │   ├── ClinicalConsultation/ # AI consultation UI
            │   ├── Doctor/     # Doctor-specific components and views
            │   └── Patient/    # Patient-specific components and views
            └── utils/          # Utility functions (e.g., api connector)

```
---

## 📜 API Endpoints

A brief overview of the core API endpoints available.

| Method | Endpoint                    | Protected | Role      | Description                                     |
| :----- | :-------------------------- | :-------- | :-------- | :---------------------------------------------- |
| POST   | `/api/doctors/register`       | No        | -         | Register a new doctor.                          |
| POST   | `/api/doctors/login`          | No        | -         | Login a doctor.                                 |
| GET    | `/api/doctors/profile`        | Yes       | Doctor    | Get the profile of the logged-in doctor.        |
| POST   | `/api/doctors/availability`   | Yes       | Doctor    | Update doctor's location and schedule.          |
| GET    | `/api/doctors/appointments`   | Yes       | Doctor    | Get all appointments for the logged-in doctor.  |
| GET    | `/api/doctors/search`         | No        | -         | Search for doctors by various filters.          |
| POST   | `/api/patients/register`      | No        | -         | Register a new patient.                         |
| POST   | `/api/patients/login`         | No        | -         | Login a patient.                                |
| GET    | `/api/patients/appointments`  | Yes       | Patient   | Get all appointments for the logged-in patient. |
| POST   | `/api/appointments/book`      | Yes       | Patient   | Book an appointment with a doctor.              |
| DELETE | `/api/appointments/:id`       | Yes       | Patient   | Cancel an appointment.                          |
| POST   | `/api/conversation/*`       | No        | -         | Handles the AI conversation flow.               |

---

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

## Acknowledgements

-   Icons and design inspiration from [Material-UI](https://mui.com/).
-   Background image from [Unsplash](https://unsplash.com/).
-   README structure inspired by [Best-README-Template](https://github.com/othneildrew/Best-README-Template).

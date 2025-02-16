# 🌍 Wanderlust  

## 📌 Overview  
Wanderlust is a **full-stack web application**, allowing users to **sign up, log in, search for rooms, add rooms, leave reviews, and view maps**. This project follows the **MVC architecture** and integrates **Cloudinary** for image storage and **Mapbox** for interactive maps.  

## ✨ Features  
- 🏠 **User Authentication:** Sign up and log in securely  
- 🔍 **Room Listings:** View all available rooms with images and details  
- 🏕️ **Add & Manage Rooms:** Users can post their own rooms for rent  
- ⭐ **Leave Reviews:** Users can add ratings and comments for rooms  
- 🗺️ **Map Integration:** View room locations using Mapbox  
- ☁️ **Cloud Storage:** Images are uploaded to **Cloudinary**  

## 🛠️ Tech Stack  
- **Backend:** Node.js, Express.js, MongoDB Atlas  
- **Frontend:** HTML, CSS, JavaScript  
- **Authentication:** Passport.js  
- **Image Hosting:** Cloudinary  
- **Maps Integration:** Mapbox  
- **Other:** Mongoose, EJS, Express-Session  

## 🚀 Installation & Setup  

### **1️⃣ Clone the Repository**  
```bash
git clone https://github.com/idris10215/Wanderlust.git
cd Wanderlust
```

### **2️⃣ Install Dependencies**  
```bash
npm install --legacy-peer-deps
```

### **3️⃣ Configure Environment Variables**  
Create a `.env` file in the project root and add your **Cloudinary, Mapbox, and MongoDB Atlas credentials**:  
```ini
CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_cloud_api_key
CLOUD_API_SECRET=your_cloud_api_secret

MAP_TOKEN=your_mapbox_token
ATLASDB_URL=your_mongodb_connection_url

SECRET=your_secret_key
```

### **4️⃣ Start the Application**  
```bash
nodemon app.js
```
Your application will now be running on `http://localhost:8080/listings`.

---

## 🤝 Contributing  
Pull requests are welcome! If you'd like to contribute, please fork the repo and submit a pull request.  

## 📬 Contact  
For any questions, feel free to reach out via [GitHub Issues](https://github.com/idris10215/Wanderlust/issues).


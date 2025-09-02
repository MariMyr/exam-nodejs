# ☕ Airbean Admin – Individuell uppgift

## 📖 Beskrivning  
Detta projekt är en **vidareutveckling av ett grupprojekt [Airbean API]**.  
Fokus i den individuella delen ligger på att bygga ett **admin-gränssnitt i backend** för att hantera kaffemenyn.  
Ingen frontend ingår.  

---

## ✨ Funktioner (Admin-endpoints)  
- ➕ **Lägga till ny produkt** (med `prodId` & `createdAt`)  
- ✏️ **Uppdatera befintlig produkt** (med `modifiedAt`)  
- ❌ **Ta bort produkt från menyn**  
- 🔐 **Skyddade endpoints** med autentisering & admin-roll  
- ⚠️ **Felhantering** för ogiltiga fält, obehörig användare eller icke-existerande produkt  

---

## 🌟 Extra (VG-nivå)  
- 🔒 Säkerhet med bcrypt (lösenordskryptering)  
- 🔑 JWT-baserad autentisering  
- 📘 Swagger-dokumentation för alla auth- och admin-endpoints  

---

## 🛠️ Tekniker  
- **Node.js** + **Express**  
- **MongoDB** (egen databas för menyn)  
- **Mongoose** för datamodellering  
- **JWT** för autentisering  
- **bcrypt** för lösenordskryptering  
- **Swagger** för API-dokumentation  

---
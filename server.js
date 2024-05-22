import app from "./app.js";
import "./db/contactsDB.js";

app.listen(3000, () => {
  console.log("Server is running. Use our API on port: 3000");
});

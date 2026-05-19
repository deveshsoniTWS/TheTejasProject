import { app } from "./app.js";
import { config } from "./config/config.js";

const PORT = config.PORT;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
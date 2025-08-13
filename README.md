### ABOUT ME

**Name**: `Sagor deployers`  
**Age**: `18`  
**Contact**: [Facebook](https://www.facebook.com/SAGOR.DJK.FORYOU)  

---

### GETTING STARTED

To set up the project, follow these steps:

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run the Application**:
   ```bash
   node index.js
   ```

---

### SOURCES

- **Original File**: [BotPack](https://replit.com/@YanMaglinte/BotPack?v=1) by `Yan Maglinte`  
- **FCA Library**: [ws3-fca](https://www.npmjs.com/package/ws3-fca) by `Kenneth Aceberos`  
- **Latest Version**: [Sagor-bot](https://www.github.com/ryukodeveloper/Ryuko-V5)

---

### UPDATES

- **Configuration**: You can now edit the prefix, bot name, and admins for each bot in the `bots.json` file.
- **Admin Access Panel**: Configure your admin password in `Sagor.json`.
- **App State Creation**: Create your app state files in the `states` folder, with filenames ending in `.json`. You can create multiple app states.
- **Email Functionality**: Added email notifications for approval requests. Enter your email address in `Sagor.json`.
- **Spam Fix**: Resolved issues with spam in the ban system.
- **Premium Command Feature**: Enable premium features by adding a `premium` variable with a boolean value.

#### Premium Usage Example

```javascript
module.exports.config = {
  name: "example",
  version: "1.0.0",
  credits: "Sagor",
  permission: 0,
  description: "An example command",
  category: "Example",
  usages: "example",
  prefix: true,
  premium: true, // Enable premium feature
  cooldown: 0
}
```

#### Upcoming Update

- **Command Aliases**: Adding aliases for each command.

---

### BOX APPROVAL

The `box approval` feature is enabled by default. To disable it, set the `approval` value to `false` in `Sagor.json`.

#### Approving Boxes

You can approve boxes using the `approve` command without a prefix. The syntax is:
```
approve (box/remove) (uid/tid)
```

#### Examples:

- **View Approved List**:
  ```bash
  approve list
  ```

- **Add Box from Approved List**:
  ```bash
  approve box 4834812366643016
  ```

- **Remove Box from Approved List**:
  ```bash
  approve remove 4834812366643016
  ```

---

### HOW TO ADD COMMANDS

To add a new command, use the following structure:

```javascript
module.exports.config = {
  name: "example", // Command name
  version: "1.0.0", // Command version
  permission: 0, // Permission level (0: all, 1: group admins, 2: bot admins, 3: bot operators)
  credits: "Sagor", // Creator of the code
  description: "An example command", // Command description
  prefix: false, // Use prefix (true/false)
  premium: false, // Enable premium feature (true/false)
  category: "Example", // Command category
  usages: "example", // Command usage
  cooldowns: 5 // Cooldown in seconds
};

module.exports.run = async ({ api, event, args, Threads, Users, getText }) => {
  // Send a simple message when the command is executed
  api.sendMessage('Hello, world!', event.threadID, event.messageID);
}
```

---

#### CONCLUSION

This documentation provides a comprehensive overview of the Sagor Developer project, including setup instructions, updates, and command usage. If you have any questions or need further assistance, feel free to reach out!

---

## BOT RUNNING WORKFLOWS 
```bash
name: Sagor-Bot

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'

      - name: Install dependencies
        run: npm install

      - name: Sagor-Bot
        run: npm start
```

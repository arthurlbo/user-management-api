import { execSync } from "child_process";

module.exports = async () => {
    try {
        // Ensure that all the processes associated with testing are fully completed before running the scripts.
        await new Promise((resolve) => setTimeout(resolve, 3000));

        // Set the database to the test environment and clears it
        execSync("dotenv -e .env.test -- pnpm clear:db");
        // Set the database to the test environment and run the migrations
        execSync("dotenv -e .env.test -- pnpm migrate:up");
        // Set the database to the test environment and seed it
        execSync("dotenv -e .env.test -- pnpm seed");
    } catch (error) {
        console.error("Error during the scripts execution before tests", error);
        process.exit(1);
    }
};

import { execSync } from "child_process";

module.exports = async () => {
    try {
        // Ensure that all the processes associated with testing are fully completed before running the scripts.
        await new Promise((resolve) => setTimeout(resolve, 5000));

        // Set the database to the test environment and clears it
        execSync("pnpm p-mg-reset:test");
        // Set the database to the test environment and run the migrations
        execSync("pnpm p-mg:test");
        // Set the database to the test environment and seed it
        execSync("pnpm p-seed:test");
    } catch (error) {
        console.error("Error during the scripts execution before tests", error);
        process.exit(1);
    }
};

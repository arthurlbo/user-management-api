import { execSync } from "child_process";

module.exports = async () => {
    try {
        // Ensure that all the processes associated with testing are fully completed before running the scripts.
        await new Promise((resolve) => setTimeout(resolve, 5000));

        // Set the database to the test environment and clears it after running the tests
        execSync("pnpm test-p-mg-reset");
    } catch (error) {
        console.error("Error during the scripts execution after tests", error);
        process.exit(1);
    }
};

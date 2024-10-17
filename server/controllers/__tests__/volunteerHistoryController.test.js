// volunteerHistoryController.test.js
const volunteerHistory = require("../../data/volunteerHistory"); // The mock data
const volunteerHistoryController = require("../../controllers/volunteerHistoryController");

describe("volunteerHistoryController", () => {
    let req, res;

    beforeEach(() => {
        req = {}; // No specific request object needed for this test
        res = {
            status: jest.fn().mockReturnThis(), // Mocking status method
            json: jest.fn() // Mocking json method
        };
    });

    it("should return the volunteer history with status 200", () => {
        volunteerHistoryController.retrieveHistory(req, res);

        // Expect that the status 200 is set
        expect(res.status).toHaveBeenCalledWith(200);
        
        // Expect that the json method was called with the volunteer history data
        expect(res.json).toHaveBeenCalledWith(volunteerHistory);
    });
});

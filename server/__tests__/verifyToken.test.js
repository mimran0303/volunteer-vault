const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/verifyToken");

jest.mock("jsonwebtoken");

describe("verifyToken middleware", () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            headers: {},
            cookies: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("should return 401 if no token is provided", () => {
        verifyToken(req, res, next);
        
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ Error: "You are not authenticated" });
        expect(next).not.toHaveBeenCalled();
    });

    test("should return 403 if token is invalid", () => {
        req.headers.authorization = "Bearer invalidToken";

        jwt.verify.mockImplementation((token, secret, callback) => {
            callback(new Error("Token is not valid"), null);
        });

        verifyToken(req, res, next);
        
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ Error: "Token is not valid" });
        expect(next).not.toHaveBeenCalled();
    });

    test("should call next if token is valid", () => {
        req.headers.authorization = "Bearer validToken";
        
        const mockDecoded = { id: 1, username: "testUser" };
        jwt.verify.mockImplementation((token, secret, callback) => {
            callback(null, mockDecoded);
        });

        verifyToken(req, res, next);
        
        expect(jwt.verify).toHaveBeenCalledWith("validToken", process.env.JWT_SECRET_KEY, expect.any(Function));
        expect(req.user).toEqual(mockDecoded);
        expect(next).toHaveBeenCalled();
    });

    test("should check token from cookies if not present in headers", () => {
        req.cookies.token = "cookieToken";
        
        const mockDecoded = { id: 2, username: "cookieUser" };
        jwt.verify.mockImplementation((token, secret, callback) => {
            callback(null, mockDecoded);
        });

        verifyToken(req, res, next);
        
        expect(jwt.verify).toHaveBeenCalledWith("cookieToken", process.env.JWT_SECRET_KEY, expect.any(Function));
        expect(req.user).toEqual(mockDecoded);
        expect(next).toHaveBeenCalled();
    });
});

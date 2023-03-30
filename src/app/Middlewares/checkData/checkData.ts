import type { Request, Response, NextFunction } from "express";
import validator from "validator";

type full = string | number | boolean | object;

// Checking Data
function checkData(req: Request, res: Response, next: NextFunction) {
    console.log("Check Data");

    // Parse req.body for checking data.
    const isValidData = parseBody(req.body, req);

    // Continue processing request if data are valid
    if (isValidData) next();
    // If not send error
    else res.status(400).send("Error: Data are not valid.");
}

// Parsing body
function parseBody(body: object, req: Request, parentObjectKey = ""): boolean {
    let isValidData = true;
    // Parsing body
    for (const [key, value] of Object.entries(body)) {
    // If sub object
        if (typeof value === "object") {
            // Parsing sub object
            isValidData &&= parseBody(value, req, key);
        }
        // Checking each data
        else isValidData &&= validData(key, value, req, parentObjectKey);
    }

    return isValidData;
}

function validData(data: string, value: full, req: Request, parentObjectKey: string): boolean {
    let isValidData = true;
    let regExCheck: RegExpMatchArray | null;
    // Checking data field
    switch (data) {
    case "email":
        // Checking mail
        if (!validator.isEmail(String(value))) isValidData = false;
        break;
    case "password":
        // Checking password regex
        // 8 char min
        // one upper case
        // three digits
        // one special caracter
        regExCheck = String(value).match(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9].*[0-9].*[0-9])(?=.*[@[\]^_!"#$%&'()*+,-./:;{}<>=|~?]).{8,}$/g
        );
        if (!regExCheck) isValidData = false;
        break;
    case "phone":
        // Phone number french format begon 0 or (+33) + 9 digits
        regExCheck = String(value).match(/^(0|\(\+33\))[0-9]{9}/g);
        if (!regExCheck) isValidData = false;
        break;
    case "postalCode":
        // Check Postal Code french format with digits
        if (!validator.isNumeric(String(value)) || String(value).length !== 5) isValidData = false;
        break;
    // Data fields that have to be a non void string
    case "firstname":
    case "lastname":
    case "name":
    case "address":
    case "city":
        // Is string and non void string
        if (typeof value !== "string" || validator.isEmpty(String(value))) isValidData = false;
        break;
    // All other fields are not allowed
    default:
        console.log("Other data: ", data, typeof value);
        isValidData = false;
        break;
    }

    // Sanitize data
    if (parentObjectKey) req.body[parentObjectKey][data] = validator.escape(String(value));
    else req.body[data] = validator.escape(String(value));

    return isValidData;
}

export default checkData;

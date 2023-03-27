import type { Request, Response, NextFunction } from "express";

// Checking Data
function checkData(req: Request, res: Response, next: NextFunction) {
    console.log("Check Data");
    // Parse req.body for checking data.
    const isValidData = parseBody(req.body, req);
    // Conitnue processing request if data are valid
    // console.log(req.body);
    if (isValidData) next();
    // If not send error
    else res.status(400).send("Error: Data are not valid.");
}

// Parsing body
function parseBody(body: object, req: Request): boolean {
    let isValidData = true;
    // Parsing body
    for (const [key, value] of Object.entries(body)) {
    // Parsing sub object
        if (typeof value === "object") isValidData &&= parseBody(value, req);
        // Checking each data
        else isValidData &&= validData(key, value, req);
    }
    return isValidData;
}

function validData(data: string, value: any, req: Request): boolean {
    let isValidData = true;
    let regExCheck: RegExpMatchArray | null;

    // Checking data field
    switch (data) {
    case "email":
        // Checking mail regex
        regExCheck = value.match(/^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/g);
        if (!regExCheck) isValidData = false;
        break;
    case "password":
        // Checking password regex
        // 8 char min
        // one upper case
        // three digits
        // one special caracter
        regExCheck = value.match(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9].*[0-9].*[0-9])(?=.*[@[\]^_!"#$%&'()*+,-./:;{}<>=|~?]).{8,}$/g
        );
        if (!regExCheck) isValidData = false;
        break;
    case "phone":
        // Phone number french format begon 0 or (+33) + 9 digits
        regExCheck = value.match(/^(0|\(\+33\))[0-9]{9}/g);
        if (!regExCheck) isValidData = false;
        break;
    case "postalCode":
        // Check Postal Code french format with digits
        regExCheck = value.match(/^[0-9]{5}/g);
        if (!regExCheck) isValidData = false;
        break;
    // Data fields that have to be a non void string
    case "firstname":
    case "lastname":
    case "name":
    case "address":
    case "city":
        // Is string and non void string
        if (typeof value !== "string" || value.length === 0) isValidData = false;
        req.body[data] = value + "check";
        break;
    // All other fields are not allowed
    default:
        console.log("Other data: ", data, typeof value);
        isValidData = false;
        break;
    }

    return isValidData;
}

export default checkData;

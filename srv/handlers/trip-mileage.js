function validateTripMileage(req) {
    const validate = (row, target) => {
        const mileage = row.mileage;
        if (mileage != null && (!Number.isInteger(mileage) || mileage < 0 || mileage > 2147483647)) {
            req.error(400, "TripMileageInvalid", target);
        }
    };
    validate(req.data, "mileage");
    // Draft activation saves the parent together with its trip rows.
    for (const [index, row] of (req.data.departures_arrivals || []).entries()) {
        const key = row.ID ? `ID=${row.ID}` : index;
        validate(row, `departures_arrivals(${key})/mileage`);
    }
}

module.exports = { validateTripMileage };

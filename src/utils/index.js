exports.isTimeBetween = (start, end, check) => {
    if (check.length === 4) {
        check = `0${check}`;
    }

    // Parse the input strings into Date objects
    const startDate = new Date(`2000-01-01T${start}:00`);
    const endDate = new Date(`2000-01-01T${end}:00`);
    const checkDate = new Date(`2000-01-01T${check}:00`);

    // Check if the end time is earlier than the start time, indicating that the time range spans two days
    if (endDate < startDate) {
        // Add 1 day to the end time
        endDate.setDate(endDate.getDate() + 1);
    }

    // Compare the times
    return checkDate >= startDate && checkDate <= endDate;
};

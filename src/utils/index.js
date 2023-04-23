exports.timeToInt = (time) => {
    const timeSplit = time.split(":");
    const timeInt = parseInt(timeSplit[0]) * 60 + parseInt(timeSplit[1]);
    return timeInt;
};
exports.isTimeBetween = (start, end, checkstart, checkend) => {
    // Parse the input strings into Date objects
    const startTime = this.timeToInt(start);
    const endTime = this.timeToInt(end);
    const checkStartTime = this.timeToInt(checkstart);
    const checkEndTime = this.timeToInt(checkend);

    if (startTime <= checkStartTime && endTime >= checkEndTime) {
        return true;
    }
    return false;
};
exports.isOverlap = (start, end, checkstart, checkend) => {
    // Parse the input strings into Date objects
    const startTime = this.timeToInt(start);
    const endTime = this.timeToInt(end);
    const checkStartTime = this.timeToInt(checkstart);
    const checkEndTime = this.timeToInt(checkend);
    if (endTime <= checkStartTime) return false;
    if (checkEndTime <= startTime) return false;
    return true;
};

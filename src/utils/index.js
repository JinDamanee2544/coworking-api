exports.isTimeBetween = (start, end, checkstart, checkend) => {

    // Parse the input strings into Date objects
    const startDate = new Date(`2000-01-01T${start}:00`);
    const endDate = new Date(`2000-01-01T${end}:00`);
    const checkStartDate = new Date(`2000-01-01T${checkstart}:00`);
    const checkEndDate = new Date(`2000-01-01T${checkend}:00`);
    return checkStartDate>=startDate && checkEndDate<=endDate;
};
exports.isOverlap=(start, end, checkstart, checkend) => {

    // Parse the input strings into Date objects
    const startDate = new Date(`2000-01-01T${start}:00`);
    const endDate = new Date(`2000-01-01T${end}:00`);
    const checkStartDate = new Date(`2000-01-01T${checkstart}:00`);
    const checkEndDate = new Date(`2000-01-01T${checkend}:00`);
    if(startDate<=checkStartDate&&checkStartDate<endDate)return false;
    if(startDate<checkEndDate&&checkEndDate<=endDate)return false;
    if(checkStartDate<=startDate&&startDate<checkEndDate)return false;
    if(checkEndDate<endDate&&endDate<=checkEndDate)return false;
    return true;
};
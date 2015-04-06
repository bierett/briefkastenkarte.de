var WeekDays = Object.freeze({
    "monday" : 1,
    "tuesday" : 2,
    "wednesday" : 3,
    "thursday" : 4,
    "friday" : 5,
    "saturday" : 6,
    "sunday" : 7
});

function MailBox() {
    this.operator = "";
    this.brand = "";
    this.ref = "";
    // Holds an of WeekDayCollectionTimes objects OR []
    this.weekCollectionTimes = [];
}

function CollectionTime(hourMinutes) {
    this.hourMinutes = hourMinutes;
    this.date = undefined;

    this.setDate = function(datePart) {
        var str = datePart + " " + this.hourMinutes + ":00";
        this.date = new Date(str);
    };

    // Use this artifical date to create a comparable date object
    // Only hours and minutes are actually used!
    this.setDate("2000/01/01");
}

function WeekDayCollectionTimes(weekDay, collectionTimeArray) {
    this.weekDay = weekDay;
    // Holds an array of CollectionTime objects
    this.collectionTimeArray = collectionTimeArray;
}

// startDate and endDate must be of type CollectionTime
function DateRange(startCollectionTime, endCollectionTime) {
    this.startCollectionTime = startCollectionTime;
    this.endCollectionTime = endCollectionTime;

    this.isValid = function() {
        return (startCollectionTime.date < endCollectionTime.date);
    }

    // date must be of type Date
    this.contains = function(date) {
        return (this.startCollectionTime.date <= date && date <= this.endCollectionTime.date);
    },

    this.toString = function() {
        return "[" + this.startCollectionTime.hourMinutes + "; " + this.endCollectionTime.hourMinutes + "]";
    }
}

function WeekDayDateRange(weekDay, dateRange) {
    this.weekDay = weekDay;
    this.dateRange = dateRange;

    // Expects an array of WeekDayCollectionTimes objects
    this.contains = function(weekCollectionTimes) {

        if (weekCollectionTimes === undefined || weekCollectionTimes.length == 0) {
            throw "The weekCollectionTimes passed is undefined or an empty array."
        }

        // This is an array of WeekDayCollectionTimes
        for (var arrayIndex = 0; arrayIndex < weekCollectionTimes.length; ++arrayIndex) {
            // This is a WeekDayCollectionTimes object
            var currentWeekDaysCollectionTimes = weekCollectionTimes[arrayIndex];

            if (currentWeekDaysCollectionTimes.weekDay !== this.weekDay) {
                continue;
            }

            var collectionTimeArray = currentWeekDaysCollectionTimes.collectionTimeArray;
            for (var collectionTimeIndex = 0; collectionTimeIndex < collectionTimeArray.length; ++collectionTimeIndex) {
                // This is a CollectionTime object
                var collectionTime = collectionTimeArray[collectionTimeIndex];
                if (this.dateRange.contains(collectionTime.date)) {
                    return true;
                }
            }
        }
        return false;
    }
}

// Returns an array of CollectionTime objects OR undefinded
// Parse collection times from "hh:mm, hh:mm, ..."
function parseCollectionTimes(hourMinutesString) {
    if (hourMinutesString === undefined) {
        throw "The hourMinutesString passed is undefined."
    }

    // Remove trailing spaces
    hourMinutesString = hourMinutesString.trim();
    // Remove all white space
    hourMinutesString = hourMinutesString.replace(/\s+/g, "");

    if (hourMinutesString.length == 0) {
        console.log("hourMinutesString is empty");
        return undefined;
    }

    // Convert into array as in ["hh:mm", "hh:mm", ...]
    var hourMinutesArray = hourMinutesString.split(",");

    var collectionTimesArray = [];
    for (var hourMinuteIndex = 0; hourMinuteIndex < hourMinutesArray.length; ++hourMinuteIndex) {
        var hourMinute = hourMinutesArray[hourMinuteIndex];
        var collectionTime = new CollectionTime(hourMinute);
        collectionTimesArray.push(collectionTime);
    }
    if (collectionTimesArray.length == 0) {
        console.log("collectionTimesArray is empty");
        return undefined;
    }
    return collectionTimesArray;
}

// Returns an array of week day strings in lowercase OR undefined
// Example: Expands "Mo-Fr" to ["mo", "tu", "we", "th", "fr"]
function expandWeekDays(weekDaysString) {
    if (weekDaysString === undefined) {
        throw "The weekDaysString passed is undefined."
    }

    weekDaysString = weekDaysString.trim();
    weekDaysString = weekDaysString.replace(/\s+/g, "");

    if (weekDaysString.length == 0) {
        console.log("weekDaysString is empty");
        return undefined;
    }

    weekDaysString = weekDaysString.toLowerCase();
    weekDaysString = weekDaysString.replace("so", "su");
    if (weekDaysString.indexOf("-") > -1) {
        if (weekDaysString.indexOf("mo-fr") > -1) {
            return ["mo", "tu", "we", "th", "fr"];
        }
        else {
            // You might wanna add other cases similar
            // to the one above if this exception is thrown.
            throw "Unknown week day " + weekDaysString;
        }
    }
    // In this case weekDaysString should contain a single week day
    return [weekDaysString];
}

// Retuns an array of WeekDayCollectionTimes objects OR an empty array
function parseWeekCollectionTimes(collectionTimesChunks) {
    var weekCollectionTimes = [];
    for (var chunkIndex = 0; chunkIndex < collectionTimesChunks.length; ++chunkIndex) {
        // A chunk can be "Mo-Fr 14:00" or "Su 17:30"
        var collectionTimesChunk = collectionTimesChunks[chunkIndex];
        // Trim white space
        collectionTimesChunk = collectionTimesChunk.trim();

        // No collection time information available.
        if (collectionTimesChunk.length == 0) {
            continue;
        }

        // Split into weekday(s) and times: "Mo-Fr 14:00, 16:30" -> ["Mo-Fr", "14:00, 16:30"]
        var separatedWeekDaysAndCollectionTimes = collectionTimesChunk.split(" ");
        // Parse week days and collection times

        // This is an array of WeekDayCollectionTimes objects
        var weekDaysAndCollectionTimes = parseWeekDaysAndCollectionTimes(separatedWeekDaysAndCollectionTimes);
        if (weekDaysAndCollectionTimes !== undefined) {
            weekCollectionTimes = weekCollectionTimes.concat(weekDaysAndCollectionTimes);
        }
    }
    return weekCollectionTimes;
}

// Returns an array of WeekDayCollectionTimes objects OR undefined
function parseWeekDaysAndCollectionTimes(weekDaysCollectionTimesArray) {
    var collectionTimesArray = parseCollectionTimes(weekDaysCollectionTimesArray[1]);
    if (collectionTimesArray === undefined) {
        console.log("collectionTimesArray is undefined");
        return undefined;
    }

    var weekDaysArray = expandWeekDays(weekDaysCollectionTimesArray[0]);
    if (weekDaysArray === undefined) {
        console.log("weekDaysArray is undefined");
        return undefined;
    }

    // Store week day with collection times
    var weekDayCollectionTimes = [];


    if (weekDaysArray.indexOf("mo") > -1) {
        var weekDayCollectionTime = new WeekDayCollectionTimes(WeekDays.monday, collectionTimesArray);
        weekDayCollectionTimes.push(weekDayCollectionTime);
    }
    if (weekDaysArray.indexOf("tu") > -1) {
        var weekDayCollectionTime = new WeekDayCollectionTimes(WeekDays.tuesday, collectionTimesArray);
        weekDayCollectionTimes.push(weekDayCollectionTime);
    }
    if (weekDaysArray.indexOf("we") > -1) {
        var weekDayCollectionTime = new WeekDayCollectionTimes(WeekDays.wednesday, collectionTimesArray);
        weekDayCollectionTimes.push(weekDayCollectionTime);
    }
    if (weekDaysArray.indexOf("th") > -1) {
        var weekDayCollectionTime = new WeekDayCollectionTimes(WeekDays.thursday, collectionTimesArray);
        weekDayCollectionTimes.push(weekDayCollectionTime);
    }
    if (weekDaysArray.indexOf("fr") > -1) {
        var weekDayCollectionTime = new WeekDayCollectionTimes(WeekDays.friday, collectionTimesArray);
        weekDayCollectionTimes.push(weekDayCollectionTime);
    }
    if (weekDaysArray.indexOf("sa") > -1) {
        var weekDayCollectionTime = new WeekDayCollectionTimes(WeekDays.saturday, collectionTimesArray);
        weekDayCollectionTimes.push(weekDayCollectionTime);
    }
    if (weekDaysArray.indexOf("su") > -1) {
        var weekDayCollectionTime = new WeekDayCollectionTimes(WeekDays.sunday, collectionTimesArray);
        weekDayCollectionTimes.push(weekDayCollectionTime);
    }

    if (weekDayCollectionTimes.length == 0) {
        console.log("weekDayCollectionTimes is empty");
        return undefined;
    }
    return weekDayCollectionTimes;
}

// takes date in this format - 'Date Fri Oct 08 2021 22:26:42 GMT-0400 (Eastern Daylight Time)'
// and returns day number in the year
const getDayNumberOfYear = (date) => {
  return Math.floor(
    (date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24
  );
};

//converts military time to standard time and adds AM/PM to end
const toStandardTime = (militaryTime) => {
  var time = militaryTime.split(":"); // convert to array

  // fetch
  var hours = Number(time[0]);
  var minutes = Number(time[1]);

  // calculate
  var timeValue;

  if (hours > 0 && hours <= 12) {
    timeValue = "" + hours;
  } else if (hours > 12) {
    timeValue = "" + (hours - 12);
  } else if (hours == 0) {
    timeValue = "12";
  }

  timeValue += minutes < 10 ? ":0" + minutes : ":" + minutes; // get minutes
  timeValue += hours >= 12 ? " PM" : " AM"; // get AM/PM

  return timeValue;
};

const renderDailyOrRamadanPrayerTimes = (singleDay) => {
  // slice removes 'a1/p1' at the end - output from google sheets for some reason
  document.getElementById("Fajr").innerHTML = toStandardTime(
    singleDay.Fajr.slice(0, 5)
  );
  document.getElementById("Fajr-Iqamah").innerHTML = toStandardTime(
    singleDay.FajrIqamah.slice(0, 5)
  );

  document.getElementById("Zuhr").innerHTML = toStandardTime(
    singleDay.Zuhr.slice(0, 5)
  );
  document.getElementById("Zuhr-Iqamah").innerHTML = toStandardTime(
    singleDay.ZuhrIqamah.slice(0, 5)
  );

  document.getElementById("AsrShafi").innerHTML = toStandardTime(
    singleDay.AsrShafi.slice(0, 5)
  );
  document.getElementById("Asr-Shafi-Iqamah").innerHTML = toStandardTime(
    singleDay.AsrShafiIqamah.slice(0, 5)
  );

  document.getElementById("AsrHanafi").innerHTML = toStandardTime(
    singleDay.AsrHanafi.slice(0, 5)
  );
  document.getElementById("Asr-Hanafi-Iqamah").innerHTML = toStandardTime(
    singleDay.AsrHanafiIqamah.slice(0, 5)
  );

  document.getElementById("Maghrib").innerHTML = toStandardTime(
    singleDay.Maghrib.slice(0, 5)
  );
  document.getElementById("Maghrib-Iqamah").innerHTML = toStandardTime(
    singleDay.MaghribIqamah.slice(0, 5)
  );

  document.getElementById("Isha").innerHTML = toStandardTime(
    singleDay.Isha.slice(0, 5)
  );
  document.getElementById("Isha-Iqamah").innerHTML = toStandardTime(
    singleDay.IshaIqamah.slice(0, 5)
  );
};

// before the map - we are fetching the JSON from api.npoint.io
// as we unable to save JSON with all this code in joomla modules (too big)

// TO DO: refactor
const mapThroughDailyOrRamadanJSON = (prayerTimesJSON) => {
  var url = "https://api.npoint.io/720124b5d958ba5df8b8";
  if (prayerTimesJSON === "DailyPrayerTimes") {
    var Http = new XMLHttpRequest();
    Http.open("GET", url);
    Http.send();

    Http.onreadystatechange = () => {
      var parsedJSON = JSON.parse(Http.responseText);
      // NOTE - if prayer times are not outputting, individually log
      // each item in if statement to make sure they are equal
      parsedJSON.Sheet1.map(function (singleDay) {
        if (getDayNumberOfYear(new Date()) == singleDay.DayNumberOfYear) {
          renderDailyOrRamadanPrayerTimes(singleDay);
        }
      });
    };
  } else if (prayerTimesJSON === "RamadanPrayerTimes") {
    var Http = new XMLHttpRequest();
    Http.open(
      "GET",
      (url = "https://api.jsonbin.io/b/61738b629548541c29c7400b")
    );
    Http.send();

    Http.onreadystatechange = () => {
      var parsedJSON = JSON.parse(Http.responseText);
      parsedJSON.Sheet1.map(function (singleDay) {
        if (getDayNumberOfYear(new Date()) == singleDay.DayNumberOfYear) {
          renderDailyOrRamadanPrayerTimes(singleDay);
        }
      });
    };
  }
};

// IMPORTANT - this variable below tells us which prayer time we want to show
var showDailyPrayerTimes = true;

// continuing from above ... just make line '!showDailyPrayerTimes' to get Ramadan times
if (showDailyPrayerTimes) {
  mapThroughDailyOrRamadanJSON("DailyPrayerTimes");
} else {
  mapThroughDailyOrRamadanJSON("RamadanPrayerTimes");
}

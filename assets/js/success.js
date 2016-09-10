function getMonthArray(date_object, year, month) {
    date_object = date_object || {};

    var year_object = date_object[year] || {};

    return (year_object[month] || []);
}

function isDatePresentIn(date_object, date) {
    var moment_date = moment(date);

    var monthArray = getMonthArray(
        date_object,
        moment_date.year(),
        moment_date.month() + 1
    );

    return monthArray.indexOf(moment_date.date()) >= 0;
}

function callFuncOnSuccessFailure(number_days_ago, func) {
    var iDaysBefore = moment().subtract(number_days_ago, 'd');
    var wasSuccess = isDatePresentIn(success, iDaysBefore);
    var wasFailure = isDatePresentIn(failure, iDaysBefore);

    func({
        success: wasSuccess,
        failure: wasFailure
    });
}

function iterate_success(max_number_days_ago, forward, func) {
    if (max_number_days_ago < 1) {
        alert("Error");
    }
    var _range = forward ? _.range(0, max_number_days_ago) : _.range(max_number_days_ago - 1, -1, -1);
    _.each(_range, function (days_ago) {
        callFuncOnSuccessFailure(days_ago, func);
    });
}

function ratio(numerator, denominator) {
    return Math.round(numerator * 10000 / denominator) / 100;
}

function getSuccessRateForPastNDays(n) {
    var _data = {
        successes: 0,
        totals: 0
    };
    iterate_success(n, true, function (sf) {
        if (sf.success) {
            _data.successes += 1;
        }
        if (sf.success || sf.failure) {
            _data.totals += 1;
        }
    });
    if (_data.totals > 0) {
        return ratio(_data.successes, _data.totals);
    }
}

function getSuccessDataForPastNDays(n) {
    var _data = {
        result: [],
        runningTotal: 0
    };
    iterate_success(n, false, function (sf) {
        if (sf.success) {
            _data.runningTotal += 1;
        }
        if (sf.failure) {
            _data.runningTotal -= 1;
        }
        _data.result.push(_data.runningTotal);
    });
    return _data.result;
}

function doesArrayContainData(array) {
    return array && array.length;
}

function getSuccessRateFor(year, month) {
    var _success = getMonthArray(success, year, month);
    var _failure = getMonthArray(failure, year, month);

    if (doesArrayContainData(_success) || doesArrayContainData(_failure)) {
        return ratio(_success.length, _success.length + _failure.length);
    }
}
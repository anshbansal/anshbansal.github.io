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

function callFuncOnSuccessFailure(i, func) {
    var iDaysBefore = moment().subtract(i, 'd');
    var wasSuccess = isDatePresentIn(success, iDaysBefore);
    var wasFailure = isDatePresentIn(failure, iDaysBefore);

    func(i, {
        success: wasSuccess,
        failure: wasFailure
    });
}

function iterate_success(n, forward, func) {
    if (n < 1) {
        alert("Error");
    }
    var _range = forward ? _.range(0, n) : _.range(n - 1, -1, -1);
    _.each(_range, function (i) {
        callFuncOnSuccessFailure(i, func);
    });
}

function ratio(num, denom) {
    return Math.round(num * 10000 / denom) / 100;
}

function successRate(n) {
    var _data = {
        successes: 0,
        totals: 0
    };
    iterate_success(n, true, function (i, sf) {
        if (sf.success) {
            _data.successes += 1;
        }
        if (sf.success || sf.failure) {
            _data.totals += 1;
        }
    });
    if (_data.totals > 0) {
        return ratio(_data.successes, _data.totals);
    } else {
        return '-';
    }
}

function successData(n) {
    var _data = {
        result: [],
        runningTotal: 0
    };
    iterate_success(n, false, function (i, sf) {
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

function rate_for(year, month) {
    var _success = getMonthArray(success, year, month);
    var _failure = getMonthArray(failure, year, month);

    if ((_success && _success.length) || (_failure && _failure.length)) {
        return (_success.length * 100) / (_success.length + _failure.length);
    } else {
        return "";
    }

}
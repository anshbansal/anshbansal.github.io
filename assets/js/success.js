function getMonthArray(obj, year, month) {
    obj = obj || {};

    var yearObj = obj[year] || {};

    return (yearObj[month] || []);
}

function isDatePresentIn(obj, date) {
    var _momentDate = moment(date);

    var monthArray = getMonthArray(
        obj,
        _momentDate.year(),
        _momentDate.month() + 1
    );

    return monthArray.indexOf(_momentDate.date()) >= 0;
}

function customRenderer(element, datee) {
    var wasSuccess = isDatePresentIn(success, datee);
    if (wasSuccess) {
        $(element).addClass('success');
    }

    var wasFailure = isDatePresentIn(failure, datee);
    if (wasFailure) {
        $(element).addClass('failure');
    }
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

function days_from_now(date_str) {
    return moment(date_str, "YYYY-MM-DD").diff(moment(), 'd') + 1;
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

function getChartDetails(lookbackDays) {
    return {
        chart: {
            type: 'area',
            height: 300
        },
        title: {
            text: 'Success ' + successRate(lookbackDays) + "%"
        },
        plotOptions: {
            area: {
                stacking: 'normal',
                lineColor: '#666666',
                lineWidth: 1,
                marker: {
                    lineWidth: 1,
                    lineColor: '#666666'
                }
            }
        },
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: {
                day: '%e of %b'
            }
        },
        series: [{
            name: 'Success ' + lookbackDays,
            data: successData(lookbackDays),
            pointStart: moment().subtract(lookbackDays - 1, 'd').toDate().getTime(),
            pointInterval: 24 * 3600 * 1000 // one day
        }]
    };
}
var DateTimePicker = {
  dateTimeCallingElement: function(wrapper) {
    var id = wrapper.attr('id');
    id = id.replace('_picker','');
    return jQuery('#' + id);
  },

  removeWrappersAndStopPropagation: function(event) {
    jQuery('.dateTimePickerWrapper').remove();      
    event.stopPropagation();
  },

  checkAndRemoveWrapper: function(event) {
    var target = jQuery(event.target);
    if (event.target.tagName == 'INPUT') {
      if (target.data("dateTimePicker") == undefined) {
        DateTimePicker.removeWrappersAndStopPropagation(event);
      }
    } else if (!target.hasClass('.dateTimePickerWrapper') && !target.parent().hasClass('.dateTimePickerWrapper') && !target.parent().parent().hasClass('.dateTimePickerWrapper')) {
      DateTimePicker.removeWrappersAndStopPropagation(event);
    }
  }
};

jQuery(function(){

  jQuery('*').focus(function(e) {
    DateTimePicker.checkAndRemoveWrapper(e);
  }).click(function(e) {
    DateTimePicker.checkAndRemoveWrapper(e);
  });

  jQuery('.dateTimePickerWrapper .weekday, .dateTimePickerWrapper .weekend').live('click',function(){
    var wrapper = jQuery(this).parent();
    DateTimePicker.dateTimeCallingElement(wrapper).dateTimePicker('clickDay', jQuery(this));
  });
  
  jQuery('.dateTimePickerWrapper .amSelector, .dateTimePickerWrapper .pmSelector').live('click', function() {
    var wrapper = jQuery(this).parent().parent();
    DateTimePicker.dateTimeCallingElement(wrapper).dateTimePicker('clickAmPm', jQuery(this));
  });

  jQuery('.dateTimePickerWrapper .hour').live('click', function() {
    var wrapper = jQuery(this).parent().parent();
    DateTimePicker.dateTimeCallingElement(wrapper).dateTimePicker('clickHour', jQuery(this));
  });
  
  jQuery('.dateTimePickerWrapper .minute').live('click', function() {
    var wrapper = jQuery(this).parent().parent();
    DateTimePicker.dateTimeCallingElement(wrapper).dateTimePicker('clickMinute', jQuery(this));
  });

  jQuery('.dateTimePickerWrapper .prevYear').live('click',function(){
    var wrapper = jQuery(this).parent().parent();
    DateTimePicker.dateTimeCallingElement(wrapper).dateTimePicker('changeMonth', -12);
  });
  
  jQuery('.dateTimePickerWrapper .prevMonth').live('click',function(){
    var wrapper = jQuery(this).parent().parent();
    DateTimePicker.dateTimeCallingElement(wrapper).dateTimePicker('changeMonth', -1);
  });

  jQuery('.dateTimePickerWrapper .nextMonth').live('click',function(){
    var wrapper = jQuery(this).parent().parent();
    DateTimePicker.dateTimeCallingElement(wrapper).dateTimePicker('changeMonth', 1);
  });

  jQuery('.dateTimePickerWrapper .nextYear').live('click',function(){
    var wrapper = jQuery(this).parent().parent();
    DateTimePicker.dateTimeCallingElement(wrapper).dateTimePicker('changeMonth', 12);
  });
});

$.widget("ui.dateTimePicker", {
  _init: function() { 
    this._setData('todaysDate', new Date());
    this._setData('currentDate', new Date());
    this._currentValueToCurrentDate();

    var thisWidget = this;
    this.element.focus(function() {
      thisWidget._resetDefaults();
      jQuery('.dateTimePickerWrapper').remove(0);
      thisWidget.createDateTimePicker();
    });
  },
  
  _currentValueToCurrentDate: function() {
    var dateVal = this.element.val();
    if (dateVal != '') {
      if (dateVal.search("at") > 0) {
        dateVal = dateVal.replace(/at.*/, "");
      }
      var dateObj = new Date(Date.parse(dateVal));
      if (dateObj != 'Invalid Date') {
        var currentDate = this._getData('currentDate');
        currentDate.setMonth(dateObj.getMonth());
        currentDate.setFullYear(dateObj.getFullYear());
      }
    }
  },
  
  _resetDefaults: function() {
    this._setData('day', 0);
    this._setData('hour', 0);
    this._setData('minute', 0);
    this._setData('ampm', 0);
  },
  
  _setInputAndClose: function() {
    this._getData('newElement').remove();
    this.element.removeClass('watermark')

    if (this._getData('showDate') && this._getData('showTime')) {
      if (this._getData('day') && this._getData('hour') && this._getData('minute') && this._getData('ampm')) {
        this.element.val(this._buildDate() + ' at ' + this._buildTime());
      }
    } else if (this._getData('showDate')) {
      if (this._getData('day')) {
        this.element.val(this._buildDate());
      }
    } else if (this._getData('showTime')) {
      if (this._getData('hour') && this._getData('minute') && this._getData('ampm')) {
        this.element.val(this._buildTime());
      }
    }
  },
  
  _buildTime: function() {
    return this._getData('hour') + ':' + this._getData('minute') + ' ' + this._getData('ampm');
  },
  
  _buildDate: function() {
    return (this._getData('currentDate').getMonth() + 1) + '/' + this._getData('day') + '/' + this._getData('currentDate').getFullYear();
  },
  
  _checkForCompletion: function() {
    if (this._getData('showDate') && this._getData('showTime')) {
      if (this._getData('day') && this._getData('hour') && this._getData('minute') && this._getData('ampm')) {
        this._setInputAndClose();
      }
    } else if (this._getData('showDate')) {
      if (this._getData('day')) {
        this._setInputAndClose();
      }
    } else if (this._getData('showTime')) {
      if (this._getData('hour') && this._getData('minute') && this._getData('ampm')) {
        this._setInputAndClose();
      }
    }
  },
  
  clickAmPm: function(ampmElement) {
    ampmElement.parent().children('.selectedAmPm').removeClass('selectedAmPm');
    ampmElement.addClass('selectedAmPm');
    this._setData('ampm', ampmElement.html());
    this._checkForCompletion();
  },
  
  clickDay: function(dayElement) {
    dayElement.parent().children('.selectedDay').removeClass('selectedDay');
    dayElement.addClass('selectedDay');
    this._setData('day', dayElement.html());
    this._checkForCompletion();
  },
  
  clickMinute: function(minuteElement) {
    minuteElement.parent().children('.selectedMinute').removeClass('selectedMinute')
    minuteElement.addClass('selectedMinute')
    this._setData('minute', minuteElement.html());
    this._checkForCompletion();
  },
  
  clickHour: function(hourElement) {
    hourElement.parent().children('.selectedHour').removeClass('selectedHour')
    hourElement.addClass('selectedHour')
    this._setData('hour', hourElement.html());
    this._checkForCompletion();
  },
  
  createDateTimePicker: function() {
    var offset = this.element.offset();
    var topOffset = offset.top;
    var leftOffset = offset.left + this.element.outerWidth();
    var newElement = jQuery('body').createAppend(
      'div', {  id: this.element.attr('id') + '_picker', 
                className: 'dateTimePickerWrapper' 
              }, this._getPicker()
    );
    newElement.css("top", (topOffset - (newElement.outerHeight()) + (this.element.outerHeight())) + 'px');
    newElement.css("left",(leftOffset + 10) + 'px');

    this._setData('newElement',newElement);
  },

  changeMonth: function(monthChange){
    this._getData('newElement').remove();
    date = this._getCurrentDate();
    date.setMonth((date.getMonth() + monthChange),1);
    this._redrawCalendar(date);
  },
  
  _redrawCalendar: function(date) {
    this._setData('currentDate',date);
    this.createDateTimePicker();
  },

  _getPicker: function() {
    if (this._getData('showDate') && this._getData('showTime')) {
      picker = this._drawCalendar(this._getCurrentDate()).concat(this._drawTimeSelector());
    } else if (this._getData('showDate')) {
      picker = this._drawCalendar(this._getCurrentDate());
    } else if (this._getData('showTime')) {
      picker = this._drawTimeSelector();
    }
    return picker;
  },
  
  _drawTimeSelector: function() {
    return this._drawHourSelector().concat(this._drawMinuteSelector())
  },
  
  _drawCalendar: function(date) {
    return this._drawHeader(date).concat(this._drawDaysRow()).concat(this._drawCalendarBody(date))
  },

  _drawHeader: function(date) {
    return [
      'div', { className: 'headerRow'}, [
        'div', { className: 'prevYear'}, '<<',
        'div', { className: 'prevMonth'}, '<',
        'div', { className: 'monthName'}, this._getMonths()[this._getCurrentDate().getMonth()] + " " + this._getCurrentDate().getFullYear(),
        'div', { className: 'nextMonth'}, '>',
        'div', { className: 'nextYear'}, '>>'
      ]
    ]
  },

  _drawDaysRow: function() {
    var daysRow = [];
    for (day in this._getDays()) {
      daysRow.push('div');
      daysRow.push({className: 'dayHeading'});
      daysRow.push(this._getDays()[day]);
    }
    return [
      'div', { className: 'daysRow'}, daysRow
    ];
  },

  _drawCalendarBody: function(date) {
    days = []
    var todaysDate = this._getData('todaysDate');
    var currentDate = this._getData('currentDate');
    var isCurrentMonth = (todaysDate.getFullYear() == currentDate.getFullYear() && todaysDate.getMonth() == currentDate.getMonth())
    
    bufferCount = date.getDay();
    for (i = 1; i <= bufferCount; i++) {
      days.push('div');
      days.push({className: 'bufferDay'});
      days.push('&nbsp;');
    }
    for (i = 1; i <= this._daysInMonth(date.getMonth()); i++) {
      var className = ''
      days.push('div');
      if ((i + bufferCount) % 7 == 0 || (i - 1 + bufferCount) % 7 == 0) {
        className = 'weekend';
      } else {
        className = 'weekday';
      }
      if (isCurrentMonth && (todaysDate.getDate() == i)) {
        className += " today";
      }
      days.push({className: className});
      days.push(i + '');
    }

    return days
  },

  _drawHourSelector: function(){
    hours = ['div', {className: 'hourHeading'}, 'Hour'];
    for (i in this._getData('hours')) {
      hours.push('div');
      hours.push({ className: 'hour'});
      hours.push(this._getData('hours')[i]);
    }
    hours.push('div');
    hours.push({className: 'amSelector'});
    hours.push('AM');
    hours.push('div');
    hours.push({className: 'pmSelector'});
    hours.push('PM');
    return ['div', { className: 'hourSelector'}, hours];
  },
  
  _drawMinuteSelector: function(){
    minutes = ['div', {className: 'minuteHeading'}, 'Minute'];
    for (i in this._getData('minutes')) {
      minutes.push('div');
      minutes.push({ className: 'minute'});
      minutes.push(this._getData('minutes')[i]);
    }
    minutes.push('div');
    minutes.push({className: 'closeSelector'});
    minutes.push('&nbsp;');
    return ['div', { className: 'minuteSelector'}, minutes];
  },

  _getCurrentDate: function() {
    return this._getData('currentDate');
  },

  _getDays: function() {
    return this._getData('days');
  },
  _getMonths: function() {
    return this._getData('months');
  },
  _daysInMonth: function(month) {
    return this._getData('daysInMonth')[month];
  },
  _showDate: function() {
    return this._getData('showDate');
  },
  _showTime: function() {
    return this._getData('showTime');
  }
});

$.ui.dateTimePicker.defaults = { 
  months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
  daysInMonth: [31, 28, 31, 30, 31 ,30, 31, 31, 30, 31, 30, 31],
  days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  hours: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  minutes: ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'],
  showDate: true,
  showTime: true
};

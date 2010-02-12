jQuery.widget("ui.dateTimePicker", {
  options: {
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
    daysInMonth: [31, 28, 31, 30, 31 ,30, 31, 31, 30, 31, 30, 31],
    days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    // hours: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    hours: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    minutes: ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'],
    showDate: true,
    showTime: true
  }, 
  _init: function() {
    this._todaysDate = new Date();
 
    this._viewingMonth = new Date();
    this._viewingMonth.setDate(1);
 
    this._selectedDate = new Date();
    var defaultMinutes = Math.floor(this._selectedDate.getMinutes() / 5) * 5;
    this._selectedDate.setMinutes(defaultMinutes);
 
    this._selectedHour = this._selectedDate.getHours() % 12;
    
    if (this._selectedHour === 0) {
      this._selectedHour = 12;
    }
 
    var callingElement = this;
    this._callingElement = this;
 
    this.element.focus(function() {
      DateTimePicker.removeWrappers();
      // thisPicker._resetDefaults();
      // jQuery('.dateTimePickerWrapper').remove(0);
      callingElement.createDateTimePicker();
    });
    
    this._insertVal();
  },
 
  _buildDateAtTime: function(){
    return this._buildDate() + ' at ' + this._buildTime();
  },
  
  _buildDate: function() {
    return (
      this._selectedDate.getMonth() + 1) + '/' + 
      this._selectedDate.getDate() + '/' + 
      this._selectedDate.getFullYear();
  },
 
  createDateTimePicker: function() {
    // this._logger();
    var wrapper = $('<div>');
    wrapper.attr('id', this.element.attr('id') + '_picker');
    wrapper.attr('class', 'dateTimePickerWrapper');
 
    $('body').prepend(wrapper);
 
    var picker = this._getPicker();
    
    $(picker).each(function(i){
      wrapper.append(picker[i]);
    });
 
    this._pickerWrapper = wrapper;
 
    var offset = this.element.offset();
    if (this._topOffset) {
      
    } else {
      this._topOffset = offset.top - (wrapper.outerHeight() / 1.7) + this.element.outerHeight() + 'px';
    }
    var leftOffset = offset.left + this.element.outerWidth() + 10 + 'px';
    wrapper.attr('style', 'top:' + this._topOffset + ';left:' + leftOffset);    
  },
 
  _getPicker: function() {
    var picker;
    if (this.options.showDate && this.options.showTime) {
      picker = this._getCalendar().concat(this._getTimeSelector());
    } else if (this.options.showDate) {
      picker = this._getCalendar();
    } else if (this.options.showTime) {
      picker = this._getTimeSelector();
    }
    return picker;
  },
 
  _getTimeSelector: function() {
    return [this._getHourSelector(), this._getMinuteSelector()];
  },
 
  _getCalendar: function(){
    return [this._getCalendarHeader(), this._getCalendarDaysRow(), this._drawCalendarBody()];
  },
 
  _getHourSelector: function(){
    var hourSelector = $('<div>').attr('class', 'hourSelector');
    hourSelector.append($('<div>').attr('class', 'hourHeading').html('Hour'));
    
    var selectedHour = this._selectedHour;
    var hours = this.options.hours;
    $(hours).each(function(i){
 
      var className = 'hour';
      var hour = hours[i];
      
      if ((hours[i]) == selectedHour){
        className += " selectedHour";
      }
      
      hourSelector.append($('<div>').attr('class', className).html(hour));
    });
    
    var amClass = 'amSelector';
    var pmClass = 'pmSelector';
 
    if (this._selectedDate.getHours() < 12) {
      amClass += ' selectedAmPm';
    } else {
      pmClass += ' selectedAmPm';
    }
 
    hourSelector.append($('<div>').attr('class', amClass).html('AM'));
    hourSelector.append($('<div>').attr('class', pmClass).html('PM'));
    return hourSelector;
  },
  
  _getMinuteSelector: function(){
    var minuteSelector = $('<div>').attr('class', 'minuteSelector');
    minuteSelector.append($('<div>').attr('class', 'minuteHeading').html('Minute'));
 
 
    var selectedDate = this._selectedDate;
    var minutes = this.options.minutes;
    $(minutes).each(function(i){
 
      var className = 'minute';
      var minute = minutes[i];
      if (i * 5 == selectedDate.getMinutes()){
        className += " selectedMinute";
      }
      
      minuteSelector.append($('<div>').attr('class', className).html(minute));
    });
    
    minuteSelector.append($('<div>').attr('class', 'closeSelector').html('Close'));
    return minuteSelector;
  },
 
  _getCalendarHeader: function() {
    var calendarHeader = $('<div>').attr('class', 'headerRow');
    calendarHeader.append($('<div>').attr('class', 'prevYear').html('&lt;&lt;'));
    calendarHeader.append($('<div>').attr('class', 'prevMonth').html('&lt;'));
    calendarHeader.append($('<div>').attr('class', 'monthName').html(this._getMonths()[this._viewingMonth.getMonth()] + " " + this._viewingMonth.getFullYear()));
    calendarHeader.append($('<div>').attr('class', 'nextMonth').html('&gt;'));
    calendarHeader.append($('<div>').attr('class', 'nextYear').html('&gt;&gt;'));
    return calendarHeader;
  },
 
  _getCalendarDaysRow: function() {
    var daysRow = $('<div>').attr('class', 'daysRow');
    for (day in this._getDays()) {
      daysRow.append($('<div>').attr('class', 'dayHeading').html(this._getDays()[day]));
    }
    return daysRow;
  },
 
  _drawCalendarBody: function(date) {
    var calendarBody = $('<div>').attr('class', 'calendarBody');
 
    var totalCount = 0;
    var bufferCount = this._viewingMonth.getDay();
    var bufferStartNumber = this.options.daysInMonth[this._getPreviousMonth(this._viewingMonth)] - bufferCount + 1;
 
    for (i = 1; i <= bufferCount; i++) {
      calendarBody.append($('<div>').attr('class', 'bufferDay').html(bufferStartNumber + ''));
      bufferStartNumber += 1;
      totalCount += 1;      
    }

    for (i = 1; i <= this.options.daysInMonth[this._viewingMonth.getMonth()]; i++) {
      var className = '';
      if ((totalCount) % 7 === 0 || (1 + totalCount) % 7 === 0) {
        className = 'weekend';
      } else {
        className = 'weekday';
      }
 
      if (this._isViewingCurrentMonth() && this._isViewingCurrentYear() && this._todaysDate.getDate() === i ) {
        className += ' today';
      }
 
      if (this._isViewingSelectedMonth() && this._isViewingSelectedYear() && this._selectedDate.getDate() === i ) {
        className += ' selectedDay';
      }
 
      calendarBody.append($('<div>').attr('class', className).html(i + ''));
      totalCount += 1;
    }
 
    var i = 1;
    while (totalCount % 7 != 0) {
      calendarBody.append($('<div>').attr('class', 'bufferDay').html(i + ''));
      totalCount += 1;
      i += 1;
    }
 
    return calendarBody;       
  },
 
  _getPreviousMonth: function(date){
    var currentMonth = date.getMonth();
    var previousMonth;
    if(currentMonth === 0) {
      previousMonth = 11;
    } else {
      previousMonth = currentMonth - 1;
    }
    return previousMonth;
  },
 
  _isViewingCurrentMonth: function(){
    return (this._todaysDate.getMonth() === this._viewingMonth.getMonth());
  },
 
  _isViewingCurrentYear: function(){
    return (this._todaysDate.getFullYear() === this._viewingMonth.getFullYear());
  },
 
  _isViewingSelectedMonth: function(){
    return (this._selectedDate.getMonth() === this._viewingMonth.getMonth());
  },
 
  _isViewingSelectedYear: function(){
    return (this._selectedDate.getFullYear() === this._viewingMonth.getFullYear());
  },
 
  _getDays: function() {
    return this.options.days;
  },
 
  _getMonths: function() {
    return this.options.months;
  },
  _daysInMonth: function(month) {
    return this.options.daysInMonth[month];
  },
 
  clickDay: function(dayElement) {
    dayElement.parent().children('.selectedDay').removeClass('selectedDay');
    dayElement.addClass('selectedDay');
    this._selectedDate.setDate(dayElement.html());
    this._selectedDate.setMonth(this._viewingMonth.getMonth());
    this._selectedDate.setFullYear(this._viewingMonth.getFullYear());
 
    this._insertVal();
  },
 
  _insertVal: function(){
    if (!this.options.showDate){
      this.element.val(this._buildTime());
    } else if (!this.options.showTime){
      this.element.val(this._buildDate());
      DateTimePicker.removeWrappers();
    } else {
      this.element.val(this._buildDateAtTime());
    }
  },
 
  changeMonth: function(monthChange){
    this._pickerWrapper.remove();
    this._viewingMonth.setMonth(this._viewingMonth.getMonth() + monthChange);
    this._callingElement.createDateTimePicker();
  },
  
  clickMinute: function(minuteElement) {
    minuteElement.parent().children('.selectedMinute').removeClass('selectedMinute');
    minuteElement.addClass('selectedMinute');
    this._selectedDate.setMinutes(minuteElement.html());
 
    this._insertVal();
  },
  
  _buildTime: function() {
    return this._selectedHour + ':' + this.options.minutes[(this._selectedDate.getMinutes() / 5)] + ' ' + this._amOrPm();
  },
 
  _am: function(){
    // console.log(this._selectedDate.getHours());
    return this._selectedDate.getHours() >= 0 && this._selectedDate.getHours() <= 11;
  },
 
  _amOrPm: function(){
    if (this._am()) {
      return 'AM';
    } else {
      return 'PM';
    }
  },
 
  clickAmPm: function(ampmElement) {
    ampmElement.parent().children('.selectedAmPm').removeClass('selectedAmPm');
    ampmElement.addClass('selectedAmPm');
    
    if (ampmElement.html() === 'PM') {
      if (this._selectedHour == 12) {
        this._selectedDate.setHours(0);
      } else {
        this._selectedDate.setHours(this._selectedHour + 12);
      }
    } else {
      this._selectedDate.setHours(this._selectedHour);
    }
    // console.log(this._selectedHour)
    // console.log(this._selectedDate)
 
 
    this._insertVal();
 
    
    // this.element.val(this._buildTime());
  },
 
  clickHour: function(hourElement) {
    hourElement.parent().children('.selectedHour').removeClass('selectedHour');
    hourElement.addClass('selectedHour');
    this._selectedHour = parseFloat(hourElement.html());
    if (this._am()) {
      this._selectedDate.setHours(this._selectedHour);
    } else {
      if (this._selectedHour == 12) {
        this._selectedDate.setHours(0);
      } else {
        this._selectedDate.setHours(this._selectedHour + 12);
      }
    }
    // console.log(this._selectedHour)
    // console.log(this._selectedDate)
    this._insertVal();
 
  },
 
  _logger: function(){
    console.log("Today's Date:");
    console.log(this._callingElement._todaysDate);
    console.log("Viewing Month:");
    console.log(this._callingElement._viewingMonth);
    console.log("Selected Date:");
    console.log(this._callingElement._selectedDate);    
  }
});
  
jQuery(function(){
  // jQuery('body').focus(function(e) {
  //   DateTimePicker.checkAndRemoveWrapper(e);
  // }).click(function(e) {
  //   DateTimePicker.checkAndRemoveWrapper(e);
  // });
  
  jQuery('.dateTimePickerWrapper .weekday, .dateTimePickerWrapper .weekend').live('click',function(){
    var wrapper = jQuery(this).closest('.dateTimePickerWrapper');
    DateTimePicker.dateTimeCallingElement(wrapper).dateTimePicker('clickDay', jQuery(this));
  });
  
  jQuery('.dateTimePickerWrapper .closeSelector').live('click', function() {
    DateTimePicker.removeWrappers();
  });
  
  jQuery('.dateTimePickerWrapper .amSelector, .dateTimePickerWrapper .pmSelector').live('click', function() {
    var wrapper = jQuery(this).closest('.dateTimePickerWrapper');
    DateTimePicker.dateTimeCallingElement(wrapper).dateTimePicker('clickAmPm', jQuery(this));
  });
  
  jQuery('.dateTimePickerWrapper .hour').live('click', function() {
    var wrapper = jQuery(this).closest('.dateTimePickerWrapper');
    DateTimePicker.dateTimeCallingElement(wrapper).dateTimePicker('clickHour', jQuery(this));
  });
  
  jQuery('.dateTimePickerWrapper .minute').live('click', function() {
    var wrapper = jQuery(this).closest('.dateTimePickerWrapper');
    DateTimePicker.dateTimeCallingElement(wrapper).dateTimePicker('clickMinute', jQuery(this));
  });
  
  jQuery('.dateTimePickerWrapper .prevYear').live('click',function(){
    var wrapper = jQuery(this).closest('.dateTimePickerWrapper');
    DateTimePicker.dateTimeCallingElement(wrapper).dateTimePicker('changeMonth', -12);
  });
  
  jQuery('.dateTimePickerWrapper .prevMonth').live('click',function(){
    var wrapper = jQuery(this).closest('.dateTimePickerWrapper');
    DateTimePicker.dateTimeCallingElement(wrapper).dateTimePicker('changeMonth', -1);
  });
  
  jQuery('.dateTimePickerWrapper .nextMonth').live('click',function(){
    var wrapper = jQuery(this).closest('.dateTimePickerWrapper');
    DateTimePicker.dateTimeCallingElement(wrapper).dateTimePicker('changeMonth', 1);
  });
  
  jQuery('.dateTimePickerWrapper .nextYear').live('click',function(){
    var wrapper = jQuery(this).closest('.dateTimePickerWrapper');
    DateTimePicker.dateTimeCallingElement(wrapper).dateTimePicker('changeMonth', 12);
  });
});
 
var DateTimePicker = {
  dateTimeCallingElement: function(wrapper) {
    var id = wrapper.attr('id');
    id = id.replace('_picker','');
    return jQuery('#' + id);
  },
  
  removeWrappers: function(){
    jQuery('.dateTimePickerWrapper').fadeOut('fast');
  },
 
  removeWrappersAndStopPropagation: function(event) {
    this.removeWrappers();
    event.stopPropagation();
  },
 
  checkAndRemoveWrapper: function(event) {
    var target = jQuery(event.target);
    if (event.target.tagName === 'INPUT') {
      if (target.data("dateTimePicker") === undefined) {
        DateTimePicker.removeWrappersAndStopPropagation(event);
      }
    } else if (!target.hasClass('.dateTimePickerWrapper') && !target.parent().hasClass('.dateTimePickerWrapper') && !target.parent().parent().hasClass('.dateTimePickerWrapper')) {
      DateTimePicker.removeWrappersAndStopPropagation(event);
    }
  }
};
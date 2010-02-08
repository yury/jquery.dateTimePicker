jQuery.widget("ui.dateTimePicker", {
  _init: function() {
    this._setData('todaysDate', new Date());

    this._setData('viewingMonth', new Date());
    this._getData('viewingMonth').setDate(1);

    this._setData('selectedDate', new Date());

    var callingElement = this;
    this._setData('callingElement', this);

    this.element.focus(function() {
      // thisPicker._resetDefaults();
      // jQuery('.dateTimePickerWrapper').remove(0);
      callingElement.createDateTimePicker();
    });
  },

  _buildDate: function() {
    return (
      this._getData('selectedDate').getMonth() + 1) + '/' + 
      this._getData('selectedDate').getDate() + '/' + 
      this._getData('selectedDate').getFullYear();
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
    
    this._setData('pickerWrapper', wrapper);

    var offset = this.element.offset();
    var topOffset = offset.top - wrapper.outerHeight() + this.element.outerHeight() + 'px';
    var leftOffset = offset.left + this.element.outerWidth() + 10 + 'px';
    wrapper.attr('style', 'top:' + topOffset + ';left:' + leftOffset);    
  },

  _getPicker: function() {
    if (this._getData('showDate') && this._getData('showTime')) {
      var picker = this._drawCalendar().concat(this._drawTimeSelector());
    } else if (this._getData('showDate')) {
      var picker = this._getCalendar();
    } else if (this._getData('showTime')) {
      var picker = this._drawTimeSelector();
    }
    return picker;
  },

  _getCalendar: function(){
    return [this._getCalendarHeader(), this._getCalendarDaysRow(), this._drawCalendarBody()];
  },

  _getCalendarHeader: function() {
    var calendarHeader = $('<div>').attr('class', 'headerRow');
    calendarHeader.append($('<div>').attr('class', 'prevYear').html('<<'));
    calendarHeader.append($('<div>').attr('class', 'prevMonth').html('<'));
    calendarHeader.append($('<div>').attr('class', 'monthName').html(this._getMonths()[this._getData('viewingMonth').getMonth()] + " " + this._getData('viewingMonth').getFullYear()));
    calendarHeader.append($('<div>').attr('class', 'nextMonth').html('>'));
    calendarHeader.append($('<div>').attr('class', 'nextYear').html('>>'));
    return calendarHeader;
  },

  _getCalendarDaysRow: function() {
    var daysRow = $('<div>').attr('class', 'daysRow');
    for (day in this._getDays()) {
      daysRow.append($('<div>').attr('class', 'dayHeading').html(this._getDays()[day]));
    }
    return daysRow
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

  _drawCalendarBody: function(date) {
    var calendarBody = $('<div>').attr('class', 'calendarBody');

    var totalCount = 0;
    var bufferCount = this._getData('viewingMonth').getDay();
    var bufferStartNumber = this._getData('daysInMonth')[this._getPreviousMonth(this._getData('viewingMonth'))] - bufferCount + 1;

    for (i = 1; i <= bufferCount; i++) {
      calendarBody.append($('<div>').attr('class', 'bufferDay').html(bufferStartNumber + ''))
      bufferStartNumber += 1;
      totalCount += 1;      
    }

    for (i = 1; i <= this._daysInMonth(this._getData('viewingMonth').getMonth()); i++) {
      var className = '';
      if ((totalCount) % 7 === 0 || (1 + totalCount) % 7 === 0) {
        className = 'weekend';
      } else {
        className = 'weekday';
      }

      if (this._isViewingCurrentMonth() && this._isViewingCurrentYear() && this._getData('todaysDate').getDate() === i ) {
        className += ' today';
      }

      if (this._isViewingSelectedMonth() && this._isViewingSelectedYear() && this._getData('selectedDate').getDate() === i ) {
        className += ' selectedDay';
      }

      calendarBody.append($('<div>').attr('class', className).html(i + ''))
      totalCount += 1;
    }

    for (i = 1; i <= 42 - totalCount; i++) {
      calendarBody.append($('<div>').attr('class', 'bufferDay').html(i + ''))
    }

    return calendarBody;       
  },

  _isViewingCurrentMonth: function(){
    return (this._getData('todaysDate').getMonth() === this._getData('viewingMonth').getMonth());
  },

  _isViewingCurrentYear: function(){
    return (this._getData('todaysDate').getFullYear() === this._getData('viewingMonth').getFullYear());
  },

  _isViewingSelectedMonth: function(){
    return (this._getData('selectedDate').getMonth() === this._getData('viewingMonth').getMonth());
  },

  _isViewingSelectedYear: function(){
    return (this._getData('selectedDate').getFullYear() === this._getData('viewingMonth').getFullYear());
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

  clickDay: function(dayElement) {
    dayElement.parent().children('.selectedDay').removeClass('selectedDay');
    dayElement.addClass('selectedDay');
    this._getData('selectedDate').setDate(dayElement.html());
    this._getData('selectedDate').setMonth(this._getData('viewingMonth').getMonth());
    this._getData('selectedDate').setFullYear(this._getData('viewingMonth').getFullYear());

    if (!this._getData('showTime')){
      this.element.val(this._buildDate());
      DateTimePicker.removeWrappers();
    }

    // this._checkForCompletion();
    // this._logger();
  },

  changeMonth: function(monthChange){
    this._getData('pickerWrapper').remove();
    this._getData('viewingMonth').setMonth(this._getData('viewingMonth').getMonth() + monthChange);
    this._getData('callingElement').createDateTimePicker();
    // this._logger();
  },
  
  _logger: function(){
    console.log("Today's Date:");
    console.log(this._getData('callingElement')._getData('todaysDate'));
    console.log("Viewing Month:");
    console.log(this._getData('callingElement')._getData('viewingMonth'));
    console.log("Selected Date:");
    console.log(this._getData('callingElement')._getData('selectedDate'));    
  }
});

jQuery.ui.dateTimePicker.defaults = {
  months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
  daysInMonth: [31, 28, 31, 30, 31 ,30, 31, 31, 30, 31, 30, 31],
  days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  hours: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  minutes: ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'],
  showDate: true,
  showTime: true
};

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
  // jQuery('.dateTimePickerWrapper .amSelector, .dateTimePickerWrapper .pmSelector').live('click', function() {
  //   var wrapper = jQuery(this).parent().parent();
  //   DateTimePicker.dateTimeCallingElement(wrapper).dateTimePicker('clickAmPm', jQuery(this));
  // });
  // 
  // jQuery('.dateTimePickerWrapper .hour').live('click', function() {
  //   var wrapper = jQuery(this).parent().parent();
  //   DateTimePicker.dateTimeCallingElement(wrapper).dateTimePicker('clickHour', jQuery(this));
  // });
  // 
  // jQuery('.dateTimePickerWrapper .minute').live('click', function() {
  //   var wrapper = jQuery(this).parent().parent();
  //   DateTimePicker.dateTimeCallingElement(wrapper).dateTimePicker('clickMinute', jQuery(this));
  // });
  // 
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

}
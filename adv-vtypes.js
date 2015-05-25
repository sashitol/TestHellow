/*master chekin*/
Ext.require([
    'Ext.form.*',
    'Ext.tip.QuickTipManager'
]);

Ext.onReady(function() {

    // Add the additional 'advanced' VTypes
    Ext.apply(Ext.form.field.VTypes, {
        daterange: function(val, field) {
            var date = field.parseDate(val);
			console.debug(field);
			
            if (!date) {
                return false;
            }
            if (field.startDateField && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax.getTime()))) {
                var start = field.up('form').down('#' + field.startDateField);
                start.setMaxValue(date);
                start.validate();
                this.dateRangeMax = date;
            }
            else if (field.endDateField && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin.getTime()))) {
                var end = field.up('form').down('#' + field.endDateField);
                end.setMinValue(date);
                end.validate();
                this.dateRangeMin = date;
				
				// Jquery Change
				var date2 = new Date(date);
				$( "#calendar" ).datepicker("option", "minDate", date2);
            }
            /*
             * Always return true since we're only using this vtype to set the
             * min/max allowed values (these are tested for after the vtype test)
             */
            return true;
        },

        daterangeText: 'Start date must be less than end date',

        password: function(val, field) {
            if (field.initialPassField) {
                var pwd = field.up('form').down('#' + field.initialPassField);
                return (val == pwd.getValue());
            }
            return true;
        },

        passwordText: 'Passwords do not match'
    });
    
    Ext.tip.QuickTipManager.init();

    /*
     * ================  Date Range  =======================
     */

    var dr = Ext.create('Ext.form.Panel', {
        renderTo: 'dr',
        frame: true,
        title: 'Date Range',
		id:'formId',
        bodyPadding: '5 5 0',
        width: 350,
        fieldDefaults: {
            labelWidth: 125,
            msgTarget: 'side',
            autoFitErrors: false
        },
        defaults: {
            width: 300
        },
        defaultType: 'datefield',
        items: [{
            fieldLabel: 'Start Date',
            name: 'startdt',
            itemId: 'startdt',
			id: 'startDate',
            vtype: 'daterange',
            endDateField: 'enddt' // id of the end date field
        }, {
            fieldLabel: 'End Date',
            name: 'enddt',
            itemId: 'enddt',
			id: 'endDateId',
            vtype: 'daterange',
            startDateField: 'startdt' // id of the start date field
        },
		{ xtype: 'box',
			autoEl: { 
				tag: 'div',
				html: '<p>jQuery Date: <input type="text" id="calendar" /></p>'
			}
		}],
		listeners: {
			// when the window is activated
			'render': function() {
				$('#calendar').datepicker();
				$('#calendar').change(function (){
						field = Ext.getCmp('endDateId');
						var date = new Date($('#calendar').val());
						
						var start = field.up('form').down('#' + field.startDateField);
						start.setMaxValue(date);
						start.validate();
						
				});
			}
		}	
		
		
    });
		
    /*
     * ================  Password Verification =======================
     */

    var pwd = Ext.create('Ext.form.Panel', {
        renderTo: 'pw',
        frame: true,
        title: 'Password Verification',
        bodyPadding: '5 5 0',
        width: 350,
        fieldDefaults: {
            labelWidth: 125,
            msgTarget: 'side',
            autoFitErrors: false
        },
        defaults: {
            width: 300,
            inputType: 'password'
        },
        defaultType: 'textfield',
        items: [{
            fieldLabel: 'Password',
            name: 'pass',
            itemId: 'pass',
            allowBlank: false,
            listeners: {
                validitychange: function(field){
                    field.next().validate();
                },
                blur: function(field){
                    field.next().validate();
                }
            }
        }, {
            fieldLabel: 'Confirm Password',
            name: 'pass-cfrm',
            vtype: 'password',
            initialPassField: 'pass' // id of the initial password field
        }]
    });

});




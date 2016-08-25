$(document).ready(function() {
	var days = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];
	var months = [ "Jan.", "Feb.", "March", "April", "May", "June", "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec." ];
	var weeks = [ "Sept. 3", "Sept. 10", "Sept. 17", "Sept. 24", "Oct. 1", "Oct. 8", "Oct. 15", "Oct. 22", "Oct. 29", "Nov. 5" ];
	var weeks_abbr = [ "9/3", "9/10", "9/17", "9/24", "10/1", "10/8", "10/15", "10/22", "10/29", "11/5" ];

	var startDate = new Date('09/03/2012');
	var endDate = new Date('11/06/2012');
	var today = new Date(); today.setHours(0,0,0,0); // set today at midnight
	var oneDay = 86400000; // one day in milliseconds
	var timeSpan = endDate.getTime() - startDate.getTime() + oneDay;
	var numDays = Math.round((((timeSpan / 1000) / 60) / 60) / 24);
	var dayWidthPct = 100/numDays + '%';

	var sortOrder = 'date';

	$('#votingNav').hide();
	function init() {
		d3.csv('data/calendar.csv', function(data) {
			parseData(data);
		});
	}
	init();

	function parseData(data) {
		$('#earlyVoting').empty();
		$.each(data, function(x,y) {
			// figure out when early voting starts
			var content = '';
			var early = y.abs_mailed; // default to absentee date
			var early_in_person = y.early_in_person.toUpperCase();
			var noexcuse = y.no_excuse_absentee.toUpperCase();
			var eipDate = new Date(y.eip_open);
			var absDate = new Date(y.abs_mailed);

			var earlyNote = '';
			var absNote = '';

			// early voting
			if (y.eip_open && early_in_person == 'Y') {
				if (y.abs_mailed == y.eip_open && noexcuse == 'Y') {
//					earlyNote += 'Early in-person and absentee voting ("no-excuse") ';
					earlyNote += 'Early voting ';
				} else if (y.abs_mailed == y.eip_open && noexcuse == 'N') {
					earlyNote += 'Early in-person and absentee voting ';
				} else {
					earlyNote += 'Early in-person voting ';
				}
				if (today.getTime() >= eipDate.getTime() ) { // if today is after the early voting start date
					earlyNote += 'began ';
				} else {
					earlyNote += 'begins ';
				}
				earlyNote += '<strong>' + formatDate(eipDate) + '</strong>.';
			}
			if (y.abs_mailed != y.eip_open) {
				// absentee voting
				absNote += 'Absentee voting '
				if (noexcuse == 'Y') {
					absNote += '("no-excuse") ';
				}
				if (today.getTime() >= absDate.getTime() ) { // if today is after the early voting start date
					absNote += 'began ';
				} else {
					absNote += 'begins ';
				}
				absNote += '<strong>' + formatDate(absDate) + '</strong>.';
			}

			if (y.eip_open && (eipDate.getTime() < absDate.getTime())) { // check if in-person exists, is earlier
				early = y.eip_open;
			}
			var earlyDate = new Date(early);

			content += '<div class="state" id="' + y.state_postal.toLowerCase() + '" data-title="' + y.state + '" data-date="' + earlyDate.getTime() + '">';
			content += '<div class="row state0">';

			content += '<div class="span3">';
			content += '<h2>' + y.state + ' <span>' + y.state_abbr + '</span></h2>';
			content += '<ul class="earlyVotingNote"><li>';

			if (early == y.eip_open) {
				content += earlyNote + '<br />' + absNote;
			} else {
				content += absNote + '<br />' + earlyNote;
			}

			content += '</li></ul>';
			content += '</div>';

			content += '<div class="span9 calWrap">';
			content += '<div class="calendar">';

			content += '<div class="marker today" style="width: ' + dayWidthPct + '; left: ' + positionMarker("today") + '%;" rel="tooltip" data-title="Today">Today</div>';
			if (y.registration_deadline && y.registration_deadline == y.general_election) {
				content += '<div class="marker deadline voterRegistration" style="width: ' + dayWidthPct + '; left: ' + positionMarker(y.registration_deadline) + '%;" rel="tooltip" data-title="Voter reg. deadline, election: <br />' + formatDate(y.registration_deadline) + '">' + formatDate(y.registration_deadline) + '</div>';
			} else {
				if (y.registration_deadline) {
					content += '<div class="marker deadline voterRegistration" style="width: ' + dayWidthPct + '; left: ' + positionMarker(y.registration_deadline) + '%;" rel="tooltip" data-title="Voter reg. deadline: <br />' + formatDate(y.registration_deadline) + '">' + formatDate(y.registration_deadline) + '</div>';
				}
				if (y.general_election) {
					content += '<div class="marker deadline general_election" style="width: ' + dayWidthPct + '; right: .1em;" rel="tooltip" data-title="Election: <br />' + formatDate(y.general_election) + '">' + formatDate(y.general_election) + '</div>';
				}
			}
			if (y.request_deadline) {
				content += '<div class="marker deadline absenteeDeadline" style="width: ' + dayWidthPct + '; left: ' + positionMarker(y.request_deadline) + '%;" rel="tooltip" data-title="Absentee request deadline: <br />' + formatDate(y.request_deadline) + '">' + formatDate(y.request_deadline) + '</div>';
			}
			if (y.abs_mailed) {
				content += '<div class="marker absentee" style="width: ' + sizeMarker(y.abs_mailed, y.general_election) + '; left: ' + positionMarker(y.abs_mailed) + '%;" rel="tooltip" data-title="Absentee voting: <br />Begins ' + formatDate(y.abs_mailed) + '">' + formatDate(y.abs_mailed) + '</div>';
			}
			if (y.vbm_mailed) {
				content += '<div class="marker vbm" style="width: ' + sizeMarker(y.vbm_mailed, y.general_election) + '; left: ' + positionMarker(y.vbm_mailed) + '%;" rel="tooltip" data-title="Vote by mail: <br />Begins ' + formatDate(y.vbm_mailed) + '">' + formatDate(y.vbm_mailed) + '</div>';
			}
			if (y.eip_open) {
				content += '<div class="marker early_in_person" style="width: ' + sizeMarker(y.eip_open, y.eip_close) + '; left: ' + positionMarker(y.eip_open) + '%;" rel="tooltip" data-title="Early in-person voting: <br />' + formatDate(y.eip_open) + ' - ' + formatDate(y.eip_close) + '">' + formatDate(y.eip_open) + ' through ' + formatDate(y.eip_close) + '</div>';
			}

			var counter = 0;
			var wk = 0;
			for (var i = 0; i < (numDays + 1); i++) {
				if (counter == 0) {
					content += '<div class="dividerLabel" style="left: ' + positionWeek(i) + '%"><b>' + weeks[wk] + '</b><i>' + weeks_abbr[wk] + '</i></div>';
					content += '<div class="divider week" style="left: ' + positionWeek(i) + '%"></div>';
				} else {
					content += '<div class="divider" style="left: ' + positionWeek(i) + '%"></div>';
				}
				counter ++;
				if (counter == 7) {
					counter = 0;
					wk ++;
				}
			}

			content += '</div>'; // end .span9
			content += '</div>'; // end .calendar
			content += '</div>'; // end .row.state0


			content += '<div class="row state1">';

			content += '<div class="span3 voterInfo">';
			content += '<h3>' + y.state + ' Voting Information</h3>';
			content += '<ul>';
			content += '<li class="tel">' + y.sos_phone + '</li>';
			content += '<li class="web"><a href="' + y.sos_website + '">Website</a></li>';
			content += '</ul>';
			content += '<div class="btn-toolbar">';
			content += '<a class="tel btn btn-large" href="tel:' + y.sos_phone + '"><span>Call: </span>' + y.sos_phone + '</a>';
			content += '<a class="web btn btn-large" href="' + y.sos_website + '">Website</a>';
			content += '</div>';
			content += '</div>'; // end .span3

			content += '<div class="span3">';
			content += '<h3><b class="voterReg"></b>Key Dates</h3>';
			content += '<ul>';
			content += '<li><strong>Voter registration deadline:</strong> ';
			if (y.registration_deadline) {
				content += formatDate(y.registration_deadline);
			} else {
				content += 'n/a';
			}
			if (y.registration_note) {
				content += ' (' + y.registration_note + ')';
			}
			content += '</li>';

			content += '<li><strong>Deadline to request an absentee ballot:</strong> ';
			if (y.request_deadline) {
				content += formatDate(y.request_deadline);
			} else {
				content += 'n/a';
			}
			content += '</li>';

			content += '<li><strong>Election Day:</strong> Tuesday, Nov. 6</li>';

			content += '</ul>';
			content += '</div>'; // end .span3

			content += '<div class="span3">';
			content += '<h3><b class="absentee"></b>Absentee Ballots</h3>';
			content += '<ul>';
			content += '<li><strong>First mailed:</strong> ' + formatDate(y.abs_mailed) + '</li>';
			content += '<li><strong>"No-excuse" ballots:</strong> ';
			switch(y.no_excuse_absentee.toUpperCase()) {
				case 'Y':
					content += 'Available';
					break;
				case 'N':
					content += 'Not available';
					break;
				default:
					content += 'n/a';
					break;
			}
			content += '</li>';
			content += '</ul>';
			content += '</div>'; // end .span3

			content += '<div class="span3">';
			content += '<h3><b class="early_in_person"></b>Early In-Person Voting</h3>';
			content += '<ul>';
			switch(y.early_in_person.toUpperCase()) {
				case 'Y':
					if (y.eip_open) {
						content += '<li>' + formatDate(y.eip_open) + ' through ' + formatDate(y.eip_close) + '</li>';
					} else if (y.eip_note) {
						content += '<li>' + y.eip_note + '</li>';
					} else {
						content += '<li>Available. Contact local elections board for details.</li>';
					}
					break;
				case 'N':
					if (y.eip_note) {
						content += '<li>' + y.eip_note + '</li>';
					} else {
						content += '<li>Not available</li>';
					}
					break;
				default:
					content += '<li>n/a</li>';
					break;
			}
			content += '</ul>';
			if (y.vote_by_mail.toUpperCase() == 'Y') {
				content += '<h3><b class="vbm"></b>Vote By Mail</h3>';
				content += '<ul>'
				if (y.vbm_note) {
					content += '<li>' + y.vbm_note + '</li>';
				} else {
					content += '<li>Available.</li>';
				}
				content += '</ul>';
			}
			content += '</div>'; // end .span3

			content += '<a class="btn btn-small topBtn" href="#votingNav">Back To Top</a>';
			content += '</div>'; // end .row.state1
			content += '</div>'; // end .state
			$('#earlyVoting').append(content);

			$('#stateJumpList').append('<li><a href="#' + y.state_postal.toLowerCase() + '">' + y.state + '</a></li>');
			$('#stateSelectList').append('<option value="#' + y.state_postal.toLowerCase() + '">' + y.state + '</option>');
		});
	    $("div[rel=tooltip]").tooltip().click(function(e) { e.preventDefault() });

		$('#stateJumpList>li').tsort();
		$('#stateSelectList>option').tsort();
		$('#stateSelectList').prepend('<option selected="selected">Jump To A State...</option>');
		$('body').on('touchstart.dropdown', '.dropdown-menu', function (e) { e.stopPropagation(); });
	    $('#votingNav').show();
	    switch(sortOrder) {
	    	case 'date':
	    		$('#dateSortBtn').addClass('disabled');
	    		$('#stateSortBtn').removeClass('disabled');
	    		break;
	    	case 'alpha':
	    		$('#stateSortBtn').addClass('disabled');
	    		$('#dateSortBtn').removeClass('disabled');
	    		break;
	    }

	    if (window.location.hash) {
		    var hash = window.location.hash.split('?');
	    	$.each(hash, function(x,y) {
	    		if (y.substr(0,1) == '#') {
				    var hashpos = $(y).offset();
				    window.scrollTo(hashpos.left, hashpos.top);
				}
		    });
		}
	}

	$('#dateSortBtn').click(function() {
		$('div.state').tsort({attr:'data-date'});
		$('#dateSortBtn').addClass('disabled');
		$('#stateSortBtn').removeClass('disabled');
		sortOrder = 'date';
	});

	$('#stateSortBtn').click(function() {
		$('div.state').tsort({attr:'data-title'});
		$('#stateSortBtn').addClass('disabled');
		$('#dateSortBtn').removeClass('disabled');
		sortOrder = 'alpha';
	});

	function formatDate(d) {
		var dObj = new Date(d);
		var dFmt = days[dObj.getDay()] + ', ' + months[dObj.getMonth()] + ' ' + dObj.getDate();
		return dFmt;
	}

	function positionMarker(d) {
		if (d == "today") {
			var dObj = today; // set to midnight
		} else {
			var dObj = new Date(d);
		}
		var dOffset = ((dObj.getTime() - startDate.getTime()) / timeSpan) * 100;
		return dOffset;
	}

	function positionWeek(w) {
		var thisDay = w * oneDay;
		var wOffset = (thisDay / timeSpan) * 100;
		return wOffset;
	}

	function sizeMarker(d,e) {
		var dObj = new Date(d);
		var eObj = new Date(e);
		var dStartOffset = ((dObj.getTime() - startDate.getTime()) / timeSpan) * 100;
		var dSpan = ((eObj.getTime() - dObj.getTime() + oneDay) / timeSpan) * 100;
		return dSpan + '%';
	}

} );

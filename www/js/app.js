// TODO:
// What if voter reg is the same day as the general election?
// Sort buttons
// Sort state order in dropdown

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

	function init() {
		$('#votingNav').hide();
		Tabletop.init( 
			{ key: '0Ala-N4Y4VPXIdEVnYVVNUEtqbF82M210ZmlJQWo2S2c',
			  callback: parseData,
			  simpleSheet: true
			} );
	}
	init();
	
	function parseData(data) {
		$('#earlyVoting').empty();
		$.each(data, function(x,y) {
		
			// figure out when early voting starts
			var content = '';
			var early = y.absmailed; // default to absentee date
			var eipDate = new Date(y.eipopen);
			var absDate = new Date(y.absmailed);
			if (y.eipopen && (eipDate.getTime() < absDate.getTime())) { // check if in-person exists, is earlier
				early = y.eipopen;
			}
			var earlyDate = new Date(early);
			
			content += '<div class="row state" id="' + y.statepostal.toLowerCase() + '">';

			content += '<div class="span3">';
			content += '<h2>' + y.state + ' <span>' + y.stateabbr + '</span></h2>';
			content += '<ul class="earlyVotingNote"><li><strong>';
			
			if (today.getTime() >= earlyDate.getTime() ) { // if today is after the early voting start date
				content += 'Early voting began ';
			} else {
				content += 'Early voting begins ';
			}
			content += formatDate(early);
			content += '.</strong></li></ul>';
			content += '</div>';
			
			content += '<div class="span9 calWrap">';
			content += '<div class="calendar">';
			
			content += '<div class="marker today" style="width: ' + dayWidthPct + '; left: ' + positionMarker("today") + '%;" rel="tooltip" data-title="Today">Today</div>';
			if (y.registrationdeadline) {
				content += '<div class="marker deadline voterRegistration" style="width: ' + dayWidthPct + '; left: ' + positionMarker(y.registrationdeadline) + '%;" rel="tooltip" data-title="Voter registration deadline: <br />' + formatDate(y.registrationdeadline) + '">' + formatDate(y.registrationdeadline) + '</div>';
			}
			if (y.requestdeadline) {
				content += '<div class="marker deadline absenteeDeadline" style="width: ' + dayWidthPct + '; left: ' + positionMarker(y.requestdeadline) + '%;" rel="tooltip" data-title="Absentee ballot request deadline: <br />' + formatDate(y.requestdeadline) + '">' + formatDate(y.requestdeadline) + '</div>';
			}
			if (y.generalelection) {
				content += '<div class="marker deadline generalElection" style="width: ' + dayWidthPct + '; right: .1em;" rel="tooltip" data-title="General election: <br />' + formatDate(y.generalelection) + '">' + formatDate(y.generalelection) + '</div>';
			}
			if (y.absmailed) {
				content += '<div class="marker absentee" style="width: ' + sizeMarker(y.absmailed, y.generalelection) + '; left: ' + positionMarker(y.absmailed) + '%;" rel="tooltip" data-title="Absentee voting: <br />Begins ' + formatDate(y.absmailed) + '">' + formatDate(y.absmailed) + '</div>';
			}
			if (y.eipopen) {
				content += '<div class="marker earlyInPerson" style="width: ' + sizeMarker(y.eipopen, y.eipclose) + '; left: ' + positionMarker(y.eipopen) + '%;" rel="tooltip" data-title="Early in-person voting: <br />' + formatDate(y.eipopen) + ' - ' + formatDate(y.eipclose) + '">' + formatDate(y.eipopen) + ' through ' + formatDate(y.eipclose) + '</div>';
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
			content += '</div>'; // end .row.state
			

			content += '<div class="row stateInfo">';

			content += '<div class="span3">';
			content += '<h3>State Elections Board</h3>';
			content += '<ul>';
			content += '<li>' + y.sosphone + '</li>';
			content += '<li><a href="' + y.soswebsite + '">Website</a></li>';
			content += '</ul>';
			content += '</div>'; // end .span3
			
			content += '<div class="span3">';
			content += '<h3>Voter Registration<b class="voterReg"></b></h3>';
			content += '<ul>';
			content += '<li><strong>Deadline: ';
			if (y.registrationdeadline) {
				content += formatDate(y.registrationdeadline);
			} else {
				content += 'n/a';
			}
			content += '</strong></li>';
			if (y.registrationnote) {
				content += '<li><strong>Notes:</strong> ' + y.registrationnote + '</li>';
			}
			content += '</ul>';
			content += '</div>'; // end .span3
			
			content += '<div class="span3">';
			content += '<h3>Absentee Ballots (Non-Military)<b class="absentee"></b></h3>';
			content += '<ul>';
			content += '<li><strong>First mailed:</strong> ' + formatDate(y.absmailed) + '</li>';
			content += '<li><strong>Deadline to request:</strong> ';
			if (y.requestdeadline) {
				content += formatDate(y.requestdeadline);
			} else {
				content += 'n/a';
			}
			content += '</li>';
			content += '<li><strong>"No-excuse" ballots:</strong> ';
			switch(y.noexcuseabsentee.toUpperCase()) {
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
			content += '<h3>Early In-Person Voting<b class="earlyInPerson"></b></h3>';
			content += '<ul>';
			switch(y.earlyinperson.toUpperCase()) {
				case 'Y':
					if (y.eipopen) {
						content += '<li>' + formatDate(y.eipopen) + ' through ' + formatDate(y.eipclose) + '</li>';
					} else {
						content += '<li>Available. Contact local elections board for details.</li>';
					}
					break;
				case 'N':
					content += '<li>Not available</li>';
					break;
				default:
					content += '<li>n/a</li>';
					break;
			}
			content += '</ul>';
			content += '<h3>Vote By Mail</h3>';
			content += '<ul>'
			switch(y.votebymail.toUpperCase()) {
				case 'Y':
					content += '<li>Available</li>';
					break;
				case 'N':
					content += '<li>Not available</li>';
					break;
				default:
					content += '<li>n/a</li>';
					break;
			}
			content += '</ul>';
			content += '</div>'; // end .span3
			
			content += '</div>'; // end .row.stateInfo
			$('#earlyVoting').append(content);
			
			$('#stateJumpList').append('<li><a href="#' + y.statepostal.toLowerCase() + '">' + y.state + '</a></li>');
		});
	    $("div[rel=tooltip]").tooltip().click(function(e) { e.preventDefault() });
	    
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
	}
	
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
